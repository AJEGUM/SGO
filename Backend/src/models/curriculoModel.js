import db from '../config/db.js'; // Tu pool con mysql2/promise

export const curriculoModel = {
    async insertarTodo(comp, resultados) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insertar Competencia
            const [resComp] = await connection.query(
                'INSERT INTO competencias (codigo_norma, prefijo_id, nombre, duracion_horas) VALUES (?, ?, ?, ?)',
                [comp.codigo_norma, comp.prefijo_id, comp.nombre, comp.duracion]
            );
            const competenciaId = resComp.insertId;

            // 2. Insertar RAPs y sus detalles
            for (const rap of resultados) {
                const [resRap] = await connection.query(
                    'INSERT INTO resultados_aprendizaje (competencia_id, codigo_rap, denominacion) VALUES (?, ?, ?)',
                    [competenciaId, rap.codigo_rap, rap.denominacion]
                );
                const rapId = resRap.insertId;

                // 3. Insertar Conocimientos de Proceso
                if (rap.procesos.length > 0) {
                    const valuesProcesos = rap.procesos.map(p => [rapId, p.trim()]);
                    await connection.query('INSERT INTO conocimientos_proceso (rap_id, descripcion) VALUES ?', [valuesProcesos]);
                }

                // 4. Insertar Conocimientos del Saber
                if (rap.saberes.length > 0) {
                    const valuesSaberes = rap.saberes.map(s => [rapId, s.trim()]);
                    await connection.query('INSERT INTO conocimientos_saber (rap_id, descripcion) VALUES ?', [valuesSaberes]);
                }

                // 5. Insertar Criterios
                if (rap.criterios.length > 0) {
                    const valuesCriterios = rap.criterios.map(c => [rapId, c.trim()]);
                    await connection.query('INSERT INTO criterios_evaluacion (rap_id, descripcion) VALUES ?', [valuesCriterios]);
                }
            }

            await connection.commit();
            return competenciaId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

async buscarPorCodigo(codigo) {
    const [rows] = await db.query('SELECT id FROM competencias WHERE codigo_norma = ?', [codigo]);
    return rows.length > 0 ? rows[0] : null;
},

async listarTodas() {
    const [rows] = await db.query(
        'SELECT id, codigo_norma, prefijo_id, nombre, duracion_horas, created_at FROM competencias ORDER BY created_at DESC'
    );
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
        // Traemos explícitamente el id para poder hacer el PATCH luego
        const [procesos] = await db.query('SELECT id, descripcion FROM conocimientos_proceso WHERE rap_id = ?', [rap.id]);
        const [saberes] = await db.query('SELECT id, descripcion FROM conocimientos_saber WHERE rap_id = ?', [rap.id]);
        const [criterios] = await db.query('SELECT id, descripcion FROM criterios_evaluacion WHERE rap_id = ?', [rap.id]);

        return {
            ...rap,
            procesos: procesos, // Ahora devuelve [{id: 1, descripcion: '...'}, ...]
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