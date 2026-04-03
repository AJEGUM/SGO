import pool from '../../config/db.js';

export const EvaluacionModel = {
    // 1. RAG: Traer saberes y criterios reales de la DB para la competencia
    async getContextoCurricular(competenciaId) {
        const query = `
            SELECT 
                (SELECT GROUP_CONCAT(descripcion SEPARATOR '; ') 
                 FROM conocimientos_saber 
                 WHERE rap_id IN (SELECT id FROM resultados_aprendizaje WHERE competencia_id = ?)) as saberes,
                (SELECT GROUP_CONCAT(descripcion SEPARATOR '; ') 
                 FROM criterios_evaluacion 
                 WHERE rap_id IN (SELECT id FROM resultados_aprendizaje WHERE competencia_id = ?)) as criterios
        `;
        const [rows] = await pool.execute(query, [competenciaId, competenciaId]);
        return rows[0];
    },

    // 2. Guardar el resultado en la tabla evaluaciones_diagnosticas
    async guardarTestGenerado(data) {
        const { fichaId, competenciaId, adminId, jsonTest } = data;
        const query = `
            INSERT INTO evaluaciones_diagnosticas 
            (plantilla_id, ficha_id, competencia_id, admin_id, json_test, activo, fecha_lanzamiento)
            VALUES (1, ?, ?, ?, ?, FALSE, NOW())
        `;
        // Convertimos el objeto JS a String JSON para la columna tipo JSON de MySQL
        const [result] = await pool.execute(query, [
            fichaId, 
            competenciaId, 
            adminId, 
            JSON.stringify(jsonTest)
        ]);
        return result.insertId;
    },

    async buscarPorFichaYCompetencia(fichaId, competenciaId) {
        const query = `SELECT id FROM evaluaciones_diagnosticas WHERE ficha_id = ? AND competencia_id = ? LIMIT 1`;
        const [rows] = await pool.execute(query, [fichaId, competenciaId]);
        return rows[0];
    },

    async actualizarTest(id, data) {
        const query = `
            UPDATE evaluaciones_diagnosticas 
            SET json_test = ?, admin_id = ?, anotaciones_especificas = ?, activo = TRUE, fecha_lanzamiento = NOW()
            WHERE id = ?
        `;
        return await pool.execute(query, [
            JSON.stringify(data.jsonTest), 
            data.adminId, 
            data.anotaciones || '', 
            id
        ]);
    },

    async guardarTestFinal(data) {
        const query = `
            INSERT INTO evaluaciones_diagnosticas 
            (plantilla_id, ficha_id, competencia_id, admin_id, json_test, anotaciones_especificas, activo, fecha_lanzamiento)
            VALUES (1, ?, ?, ?, ?, ?, TRUE, NOW())
        `;
        const [result] = await pool.execute(query, [
            data.fichaId,
            data.competenciaId,
            data.adminId,
            JSON.stringify(data.jsonTest),
            data.anotaciones || ''
        ]);
        return result.insertId;
    }
};