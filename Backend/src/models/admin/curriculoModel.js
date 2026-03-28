import db from '../../config/db.js'; // Tu pool con mysql2/promise

export const curriculoModel = {
async insertarDesdeExcelDetallado(info, competencias) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. GESTIÓN DEL PROGRAMA
        // Buscamos por código y versión (la verdadera identidad del diseño curricular)
        let [prog] = await connection.query(
            "SELECT id FROM programas WHERE codigo_programa = ? AND version_programa = ?", 
            [info.codigoPrograma, info.versionPrograma]
        );
        
        let programaId;
        if (prog.length > 0) {
            programaId = prog[0].id;
            // Actualizamos el nombre por si acaso cambió en el modal
            await connection.query(
                "UPDATE programas SET nombre_programa = ? WHERE id = ?",
                [info.nombrePrograma, programaId]
            );
        } else {
            const [newProg] = await connection.query(
                "INSERT INTO programas (nombre_programa, codigo_programa, version_programa) VALUES (?, ?, ?)", 
                [info.nombrePrograma, info.codigoPrograma, info.versionPrograma]
            );
            programaId = newProg.insertId;
        }

        // 2. GESTIÓN DE LA FICHA
        // Ahora la ficha solo guarda su número, fechas y el link al programa
        await connection.query(
            `INSERT INTO fichas 
                (numero_ficha, programa_id, fecha_inicio, fecha_fin) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
                fecha_inicio = VALUES(fecha_inicio),
                fecha_fin = VALUES(fecha_fin)`,
            [
                info.numeroFicha, 
                programaId, 
                info.fechaInicio,
                info.fechaFin
            ]
        );

        // 3. PROCESAR COMPETENCIAS (Vinculadas al programa_id)
        for (const comp of competencias) {
            await connection.query(
                `INSERT INTO competencias 
                    (programa_id, codigo_norma, prefijo_id, nombre, duracion_horas) 
                 VALUES (?, ?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE 
                    nombre = VALUES(nombre), 
                    duracion_horas = VALUES(duracion_horas)`,
                [programaId, comp.codigo_norma, comp.prefijo_id, comp.nombre, comp.duracion || 0]
            );
            
            const [compRow] = await connection.query(
                "SELECT id FROM competencias WHERE codigo_norma = ? AND programa_id = ?", 
                [comp.codigo_norma, programaId]
            );
            const competenciaId = compRow[0].id;

            for (const rap of comp.resultados) {
                // 4. INSERTAR RAP
                await connection.query(
                    `INSERT INTO resultados_aprendizaje 
                        (competencia_id, codigo_rap, denominacion) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE 
                        denominacion = VALUES(denominacion)`,
                    [competenciaId, rap.codigo_rap, rap.denominacion]
                );
                
                const [rapRow] = await connection.query(
                    "SELECT id FROM resultados_aprendizaje WHERE competencia_id = ? AND codigo_rap = ?", 
                    [competenciaId, rap.codigo_rap]
                );
                const rapId = rapRow[0].id;

                // 5. NORMALIZACIÓN DE ITEMS
                const procesarYLimpiarItems = (dato, denominacionRap) => {
                    if (!dato) return [];
                    let textoCompleto = Array.isArray(dato) ? dato.join("\n") : String(dato);
                    return textoCompleto
                        .split(/\n|\*/)
                        .map(item => item.trim())
                        .filter(item => {
                            const limpio = item.toUpperCase();
                            return limpio.length > 3 && limpio !== (denominacionRap || "").toUpperCase();
                        })
                        .map(item => item.toUpperCase());
                };

                const procesosItems = procesarYLimpiarItems(rap.procesos, rap.denominacion);
                const saberesItems = procesarYLimpiarItems(rap.saberes, rap.denominacion);
                const criteriosItems = procesarYLimpiarItems(rap.criterios, rap.denominacion);

                // 6. PERSISTENCIA ATÓMICA
                // Nota: Usamos DELETE/INSERT porque estos detalles no tienen una llave única natural sencilla
                await connection.query("DELETE FROM conocimientos_proceso WHERE rap_id = ?", [rapId]);
                for (const item of procesosItems) {
                    await connection.query("INSERT INTO conocimientos_proceso (rap_id, descripcion) VALUES (?, ?)", [rapId, item]);
                }

                await connection.query("DELETE FROM conocimientos_saber WHERE rap_id = ?", [rapId]);
                for (const item of saberesItems) {
                    await connection.query("INSERT INTO conocimientos_saber (rap_id, descripcion) VALUES (?, ?)", [rapId, item]);
                }

                await connection.query("DELETE FROM criterios_evaluacion WHERE rap_id = ?", [rapId]);
                for (const item of criteriosItems) {
                    await connection.query("INSERT INTO criterios_evaluacion (rap_id, descripcion) VALUES (?, ?)", [rapId, item]);
                }
            }
        }

        await connection.commit();
        return { 
            success: true, 
            message: "Carga exitosa", 
            programaId, 
            ficha: info.numeroFicha 
        };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error crítico en carga:", error);
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
    // Aseguramos que sea un número para evitar fallos de coincidencia en el WHERE
    const idLimpio = Number(programaId);

    const [rows] = await db.query(
        `SELECT 
            c.id, 
            c.codigo_norma, 
            c.prefijo_id, 
            c.nombre, 
            c.duracion_horas, 
            c.created_at 
         FROM competencias c
         INNER JOIN programas p ON c.programa_id = p.id
         WHERE p.id = ? 
         ORDER BY c.id ASC`, // Cambiado a ASC para mantener el orden del diseño original
        [idLimpio]
    );
    return rows;
},

// En curriculoModel.js
async listarProgramas() {
    const query = `
        SELECT 
            p.id as programa_id, 
            p.nombre_programa, 
            p.codigo_programa, 
            p.version_programa, 
            f.id as ficha_id,
            f.numero_ficha,
            f.fecha_inicio, 
            f.fecha_fin,
            p.created_at
        FROM programas p
        LEFT JOIN fichas f ON p.id = f.programa_id
        ORDER BY p.created_at DESC, f.numero_ficha ASC
    `;
    const [rows] = await db.query(query);
    return rows;
},

// Obtener una competencia con todos sus hijos (RAPs, Saberes, Criterios)
async obtenerDetalleCompleto(id) {
    try {
        // 1. Obtener datos básicos de la competencia
        const [competencias] = await db.query('SELECT * FROM competencias WHERE id = ?', [id]);
        
        if (competencias.length === 0) {
            return null;
        }

        // 2. Obtener los RAPs vinculados a esa competencia
        const [raps] = await db.query(
            'SELECT id, competencia_id, codigo_rap, denominacion FROM resultados_aprendizaje WHERE competencia_id = ?', 
            [id]
        );

        // 3. Mapear cada RAP para traer sus sub-detalles (Procesos, Saberes, Criterios)
        const resultadosConDetalles = await Promise.all(raps.map(async (rap) => {
            
            // Ejecutamos las 3 consultas de detalle en paralelo
            // IMPORTANTE: Guardamos la respuesta completa [rows, fields] en variables distintas
            const [resProcesos, resSaberes, resCriterios] = await Promise.all([
                db.query('SELECT id, descripcion FROM conocimientos_proceso WHERE rap_id = ?', [rap.id]),
                db.query('SELECT id, descripcion FROM conocimientos_saber WHERE rap_id = ?', [rap.id]),
                db.query('SELECT id, descripcion FROM criterios_evaluacion WHERE rap_id = ?', [rap.id])
            ]);

            // Retornamos el objeto del RAP extendido con sus listas de detalles
            return {
                ...rap,
                // resX[0] contiene los registros (rows) que Angular necesita para el .map()
                procesos: resProcesos[0], 
                saberes: resSaberes[0],
                criterios: resCriterios[0]
            };
        }));

        // 4. Retornar el objeto final que espera el Frontend
        return {
            ...competencias[0],
            raps: resultadosConDetalles 
        };

    } catch (error) {
        console.error("Error en obtenerDetalleCompleto:", error);
        throw error;
    }
},

async actualizarEntidad(tabla, id, columna, valor) {
    const query = `UPDATE ${tabla} SET ${columna} = ? WHERE id = ?`;
    const [result] = await db.query(query, [valor, id]);
    return result.affectedRows > 0;
},

async sincronizarDetallesRap(tabla, rapId, columna, textoBloque) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Limpiamos y formateamos las líneas antes de guardar
        const lineas = textoBloque.split('\n')
            .map(l => {
                // EXPLICACIÓN DE LA REGEX:
                // ^       : Desde el inicio de la línea
                // [\s\d\*\.\-]+ : Busca espacios, dígitos, asteriscos, puntos o guiones
                // +       : Uno o más de estos caracteres
                return l.replace(/^[\s\d\*\.\-]+/, '').trim();
            })
            // Filtramos líneas vacías o que solo tengan basura (mínimo 3 caracteres reales)
            .filter(l => l.length > 3);

        // 2. Borramos registros previos asociados a este RAP
        await connection.query(`DELETE FROM ${tabla} WHERE rap_id = ?`, [rapId]);

        // 3. Inserción masiva de la data "limpia"
        if (lineas.length > 0) {
            const values = lineas.map(linea => [rapId, linea]);
            await connection.query(
                `INSERT INTO ${tabla} (rap_id, ${columna}) VALUES ?`, 
                [values]
            );
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        console.error(`[SQL-ERROR] Error sincronizando ${tabla}:`, error);
        throw error;
    } finally {
        connection.release();
    }
}
};