import db from '../../config/dbConfig.js';

export const testModel = {
    async insertarTest(datos) {
        const { competencia_id, nombre_test, descripcion, preguntas } = datos;
        
        const query = `
            INSERT INTO tests_diagnosticos 
            (competencia_id, nombre_test, descripcion, preguntas_json) 
            VALUES (?, ?, ?, ?);
        `;

        // Al pasar un objeto o array a una columna JSON en mysql2, 
        // lo ideal es pasarlo como string usando JSON.stringify
        const [result] = await db.execute(query, [
            competencia_id,
            nombre_test,
            descripcion || null,
            JSON.stringify(preguntas)
        ]);

        return result;
    },

    async obtenerTestPorId(testId) {
        const query = `
            SELECT 
                td.id AS test_id,
                td.competencia_id,
                td.nombre_test,
                td.descripcion,
                td.preguntas_json,
                td.activo,
                c.nombre AS competencia_nombre,
                cd.titulo AS ciclo_nombre
            FROM tests_diagnosticos td
            INNER JOIN competencias c ON td.competencia_id = c.id
            LEFT JOIN ovas o ON o.competencia_id = c.id
            LEFT JOIN ciclos_didacticos cd ON cd.ova_id = o.id
            WHERE td.id = ?
            LIMIT 1;
        `;

        console.log(`🗄️ [Model] Consultando test ID: ${testId}`);
        const [rows] = await db.execute(query, [testId]);
        
        if (rows.length === 0) return null;

        const test = rows[0];

        // Controlamos que el JSON sea un objeto puro de JS antes de subirlo al Service
        if (typeof test.preguntas_json === 'string') {
            test.preguntas_json = JSON.parse(test.preguntas_json);
        }

        return test;
    }
};