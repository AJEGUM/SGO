import db from '../../config/dbConfig.js';

export const expertoModel = {
    async obtenerSemillasPorExperto(expertoId) {
        const query = `
            SELECT 
                s.id, 
                s.nombre_semilla, 
                s.estado,
                p.nombre AS programa_nombre,
                p.codigo AS programa_codigo,
                es.fecha_asignacion
            FROM expertos_semillas es
            JOIN semillas s ON es.semilla_id = s.id
            JOIN programas p ON s.programa_id = p.programa_id
            WHERE es.experto_id = ?
            ORDER BY es.fecha_asignacion DESC
        `;
        const [rows] = await db.execute(query, [expertoId]);
        return rows;
    }
};