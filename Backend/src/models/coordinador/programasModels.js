import db from '../../config/dbConfig.js';

export const programaModel = {
    // Obtener lista simple para el selector del Coordinador
    async listarProgramas() {
        const query = `SELECT programa_id, codigo, nombre, version FROM programas ORDER BY nombre ASC`;
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