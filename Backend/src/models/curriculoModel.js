import db from '../config/db.js'; // Tu pool con mysql2/promise

export const curriculoModel = {
async insertarDesdeExcelDetallado(info, competencias) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Asegurar Programa (Uso de ID único)
        let [prog] = await connection.query("SELECT id FROM programas WHERE nombre_programa = ?", [info.nombrePrograma]);
        let programaId = prog.length > 0 
            ? prog[0].id 
            : (await connection.query("INSERT INTO programas (nombre_programa) VALUES (?)", [info.nombrePrograma]))[0].insertId;

        for (const comp of competencias) {
            // 2. Insertar/Obtener Competencia
            await connection.query(
                "INSERT INTO competencias (programa_id, codigo_norma, prefijo_id, nombre, duracion_horas) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre)",
                [programaId, comp.codigo_norma, comp.prefijo_id, comp.nombre, comp.duracion || 0]
            );
            
            const [compRow] = await connection.query(
                "SELECT id FROM competencias WHERE codigo_norma = ? AND programa_id = ?", 
                [comp.codigo_norma, programaId]
            );
            const competenciaId = compRow[0].id;

            for (const rap of comp.resultados) {
                // 3. Insertar RAP
                await connection.query(
                    "INSERT INTO resultados_aprendizaje (competencia_id, codigo_rap, denominacion) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE denominacion=VALUES(denominacion)",
                    [competenciaId, rap.codigo_rap, rap.denominacion]
                );
                
                const [rapRow] = await connection.query(
                    "SELECT id FROM resultados_aprendizaje WHERE competencia_id = ? AND codigo_rap = ?", 
                    [competenciaId, rap.codigo_rap]
                );
                const rapId = rapRow[0].id;

                // 4. Función de Normalización y División Atómica
                const procesarYLimpiarItems = (dato, denominacionRap) => {
                    if (!dato) return [];
                    
                    let textoCompleto = Array.isArray(dato) ? dato.join("\n") : String(dato);
                    
                    // Dividimos por saltos de línea o asteriscos
                    return textoCompleto
                        .split(/\n|\*/)
                        .map(item => item.trim())
                        .filter(item => {
                            const limpio = item.toUpperCase();
                            // Filtros de calidad:
                            // 1. Que no esté vacío
                            // 2. Que tenga más de 3 caracteres
                            // 3. Que no sea exactamente igual a la denominación del RAP (basura de ffill)
                            return limpio.length > 3 && limpio !== denominacionRap.toUpperCase();
                        })
                        .map(item => item.toUpperCase());
                };

                const procesosItems = procesarYLimpiarItems(rap.procesos, rap.denominacion);
                const saberesItems = procesarYLimpiarItems(rap.saberes, rap.denominacion);
                const criteriosItems = procesarYLimpiarItems(rap.criterios, rap.denominacion);

                // --- PERSISTENCIA DE CONOCIMIENTOS DE PROCESO ---
                await connection.query("DELETE FROM conocimientos_proceso WHERE rap_id = ?", [rapId]);
                for (const item of procesosItems) {
                    await connection.query(
                        "INSERT INTO conocimientos_proceso (rap_id, descripcion) VALUES (?, ?)", 
                        [rapId, item]
                    );
                }

                // --- PERSISTENCIA DE CONOCIMIENTOS DEL SABER ---
                await connection.query("DELETE FROM conocimientos_saber WHERE rap_id = ?", [rapId]);
                for (const item of saberesItems) {
                    await connection.query(
                        "INSERT INTO conocimientos_saber (rap_id, descripcion) VALUES (?, ?)", 
                        [rapId, item]
                    );
                }

                // --- PERSISTENCIA DE CRITERIOS DE EVALUACIÓN ---
                await connection.query("DELETE FROM criterios_evaluacion WHERE rap_id = ?", [rapId]);
                for (const item of criteriosItems) {
                    await connection.query(
                        "INSERT INTO criterios_evaluacion (rap_id, descripcion) VALUES (?, ?)", 
                        [rapId, item]
                    );
                }
            }
        }

        await connection.commit();
        return { success: true };
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error crítico en carga de currículo:", error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
},

// Funcion validadora para ver si existe datos duplicados antes de guardar en la DB
async buscarPorCodigo(codigo) {
    const [rows] = await db.query('SELECT id FROM competencias WHERE codigo_norma = ?', [codigo]);
    return rows.length > 0 ? rows[0] : null;
},

async listarCompetencias(programaId) {
    const [rows] = await db.query(
        `SELECT id, codigo_norma, prefijo_id, nombre, duracion_horas, created_at 
         FROM competencias 
         WHERE programa_id = ? 
         ORDER BY created_at DESC`,
        [programaId]
    );
    return rows;
},

// En curriculoModel.js
async listarProgramas() {
    const query = `
        SELECT 
            p.id, 
            p.nombre_programa, 
            f.codigo_programa, 
            f.version_programa, 
            f.fecha_inicio, 
            f.fecha_fin,
            f.numero_ficha,
            p.created_at
        FROM programas p
        LEFT JOIN fichas f ON p.id = f.programa_id
        ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
},

// Obtener una competencia con todos sus hijos (RAPs, Saberes, Criterios)
async obtenerDetalleCompleto(id) {
    // 1. Obtener datos de la competencia
    const [competencias] = await db.query('SELECT * FROM competencias WHERE id = ?', [id]);
    if (competencias.length === 0) return null;

    // 2. Obtener los RAPs vinculados
    const [raps] = await db.query('SELECT * FROM resultados_aprendizaje WHERE competencia_id = ?', [id]);

    // 3. Mapear cada RAP con sus tablas de detalles (Trayendo ID y Descripcion)
    const resultadosConDetalles = await Promise.all(raps.map(async (rap) => {
        // Traemos el id para poder hacer el PATCH luego
        const [procesos] = await db.query('SELECT id, descripcion FROM conocimientos_proceso WHERE rap_id = ?', [rap.id]);
        const [saberes] = await db.query('SELECT id, descripcion FROM conocimientos_saber WHERE rap_id = ?', [rap.id]);
        const [criterios] = await db.query('SELECT id, descripcion FROM criterios_evaluacion WHERE rap_id = ?', [rap.id]);

        return {
            ...rap,
            procesos: procesos,
            saberes: saberes,
            criterios: criterios
        };
    }));

    return {
        ...competencias[0],
        resultados: resultadosConDetalles
    };
},

async actualizarEntidad(tabla, id, columna, valor) {
    const query = `UPDATE ${tabla} SET ${columna} = ? WHERE id = ?`;
    const [result] = await db.query(query, [valor, id]);
    return result.affectedRows > 0;
}
};