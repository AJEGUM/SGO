import db from '../config/db.js'; // Tu pool con mysql2/promise

export const curriculoModel = {
async insertarDesdeReporte(info, competencias) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Asegurar el Programa
        let [prog] = await connection.query("SELECT id FROM programas WHERE nombre_programa = ?", [info.nombrePrograma]);
        let programaId = prog.length > 0 ? prog[0].id : null;
        
        if (!programaId) {
            const [newProg] = await connection.query("INSERT INTO programas (nombre_programa) VALUES (?)", [info.nombrePrograma]);
            programaId = newProg.insertId;
        }

        // 2. Asegurar Ficha con toda la info de cabecera
        await connection.query(`
            INSERT INTO fichas (numero_ficha, programa_id, codigo_programa, version_programa, fecha_inicio, fecha_fin) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                codigo_programa = VALUES(codigo_programa),
                version_programa = VALUES(version_programa),
                fecha_inicio = VALUES(fecha_inicio),
                fecha_fin = VALUES(fecha_fin)
        `, [info.numeroFicha, programaId, info.codigoPrograma, info.versionPrograma, info.fechaInicio, info.fechaFin]);

        // 3. Insertar Competencias y RAPs
        for (const comp of competencias) {
            let [compExist] = await connection.query(
                "SELECT id FROM competencias WHERE codigo_norma = ? AND programa_id = ?", 
                [comp.codigo_norma, programaId]
            );

            let competenciaId;
            if (compExist.length > 0) {
                competenciaId = compExist[0].id;
            } else {
                const [resComp] = await connection.query(
                    "INSERT INTO competencias (programa_id, codigo_norma, prefijo_id, nombre, duracion_horas) VALUES (?, ?, ?, ?, ?)",
                    [programaId, comp.codigo_norma, comp.prefijo_id, comp.nombre, comp.duracion]
                );
                competenciaId = resComp.insertId;
            }

            for (const rap of comp.resultados) {
                await connection.query(
                    `INSERT INTO resultados_aprendizaje (competencia_id, codigo_rap, denominacion) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE denominacion = VALUES(denominacion)`,
                    [competenciaId, rap.codigo_rap, rap.denominacion]
                );
            }
        }

        await connection.commit();
        return { success: true, ficha: info.numeroFicha };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
},

async guardarDetallesCurriculo(programaId, datosExtraidos) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        for (const competencia of datosExtraidos) {
            // Buscamos el ID de la competencia en este programa
            const [compRows] = await connection.query(
                "SELECT id FROM competencias WHERE codigo_norma = ? AND programa_id = ?",
                [competencia.codigo_norma, programaId]
            );

            if (compRows.length === 0) continue; 
            const competenciaId = compRows[0].id;

            for (const rap of competencia.resultados) {
                // Buscamos el ID del RAP vinculado a esa competencia
                const [rapRows] = await connection.query(
                    "SELECT id FROM resultados_aprendizaje WHERE codigo_rap = ? AND competencia_id = ?",
                    [rap.codigo_rap, competenciaId]
                );

                if (rapRows.length === 0) continue;
                const rapId = rapRows[0].id;

                // Insertar Procesos
                for (const desc of rap.procesos) {
                    await connection.query("INSERT INTO conocimientos_proceso (rap_id, descripcion) VALUES (?, ?)", [rapId, desc]);
                }
                // Insertar Saberes
                for (const desc of rap.saberes) {
                    await connection.query("INSERT INTO conocimientos_saber (rap_id, descripcion) VALUES (?, ?)", [rapId, desc]);
                }
                // Insertar Criterios
                for (const desc of rap.criterios) {
                    await connection.query("INSERT INTO criterios_evaluacion (rap_id, descripcion) VALUES (?, ?)", [rapId, desc]);
                }
            }
        }

        await connection.commit();
        return { status: "Completado" };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
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