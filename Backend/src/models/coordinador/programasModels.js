import db from '../../config/dbConfig.js';

export const programaModel = {
    // Obtener lista simple para el selector del Coordinador
async listarProgramas() {
        // Esta consulta verifica que existan: Competencias -> RAPs -> (Proceso Y Saber Y Criterios)
        const query = `
            SELECT 
                p.programa_id, p.codigo, p.nombre, p.version,
                (SELECT COUNT(*) FROM competencias WHERE programa_id = p.programa_id) as total_competencias,
                (
                    SELECT COUNT(*) 
                    FROM competencias c
                    JOIN resultados_aprendizaje r ON c.id = r.competencia_id
                    WHERE c.programa_id = p.programa_id
                ) as total_raps,
                -- Validación de integridad profunda
                CASE 
                    WHEN NOT EXISTS (SELECT 1 FROM competencias WHERE programa_id = p.programa_id) THEN 0
                    WHEN EXISTS (
                        SELECT 1 
                        FROM competencias c
                        JOIN resultados_aprendizaje r ON c.id = r.competencia_id
                        WHERE c.programa_id = p.programa_id
                        -- Verificamos que al menos existan hijos en las tablas de nivel 4
                        AND EXISTS (SELECT 1 FROM conocimientos_proceso WHERE rap_id = r.id)
                        AND EXISTS (SELECT 1 FROM conocimientos_saber WHERE rap_id = r.id)
                        AND EXISTS (SELECT 1 FROM criterios_evaluacion WHERE rap_id = r.id)
                    ) THEN 1
                    ELSE 0
                END as integridad_completa
            FROM programas p
            ORDER BY p.nombre ASC
        `;
        const [rows] = await db.execute(query);
        return rows;
    },

    // Obtener el programa con TODA su estructura pedagógica
    async obtenerEstructuraCompleta(programaId) {
        // 1. Obtener Competencias
        const [competencias] = await db.execute(
            `SELECT id, codigo_norma, nombre FROM competencias WHERE programa_id = ?`,
            [programaId]
        );

        // 2. Por cada competencia, traer sus RAPs y detalles
        // Nota: En un entorno de alto tráfico, esto se optimiza con un JOIN complejo
        for (let comp of competencias) {
            const [raps] = await db.execute(
                `SELECT id, codigo_rap, denominacion FROM resultados_aprendizaje WHERE competencia_id = ?`,
                [comp.id]
            );
            
            for (let rap of raps) {
                const [saberes] = await db.execute(`SELECT descripcion FROM conocimientos_saber WHERE rap_id = ?`, [rap.id]);
                const [criterios] = await db.execute(`SELECT descripcion FROM criterios_evaluacion WHERE rap_id = ?`, [rap.id]);
                
                rap.saberes = saberes;
                rap.criterios = criterios;
            }
            comp.raps = raps;
        }

        return competencias;
    }
};