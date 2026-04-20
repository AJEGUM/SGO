import db from '../../config/dbConfig.js';

export const programaModel = {
    // Obtener lista simple para el selector del Coordinador
async listarProgramas() {
    const query = `
        SELECT 
            p.programa_id,
            p.codigo,
            p.nombre,
            p.version,
            -- Total de RAPs esperados
            (SELECT COUNT(*) 
             FROM resultados_aprendizaje ra
             JOIN competencias c ON ra.competencia_id = c.id
             WHERE c.programa_id = p.programa_id) AS total_raps_esperados,
            -- RAPs que tienen la trinidad completa
            (SELECT COUNT(DISTINCT ra.id)
             FROM resultados_aprendizaje ra
             JOIN competencias c ON ra.competencia_id = c.id
             JOIN conocimientos_proceso cp ON cp.rap_id = ra.id
             JOIN conocimientos_saber cs ON cs.rap_id = ra.id
             JOIN criterios_evaluacion ce ON ce.rap_id = ra.id
             WHERE c.programa_id = p.programa_id
               AND TRIM(cp.descripcion) <> ''
               AND TRIM(cs.descripcion) <> ''
               AND TRIM(ce.descripcion) <> '') AS raps_completados
        FROM programas p
        ORDER BY p.nombre ASC;
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