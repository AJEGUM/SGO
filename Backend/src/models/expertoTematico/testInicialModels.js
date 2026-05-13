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
    }
};