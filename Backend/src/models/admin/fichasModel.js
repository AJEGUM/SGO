import  db  from '../../config/db.js';

export const fichasModel = {
    async insertar(numero, programaId, inicio, fin) {
        const query = `
            INSERT INTO fichas (numero_ficha, programa_id, fecha_inicio, fecha_fin) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [numero, programaId, inicio, fin]);
        return result.insertId;
    },

    async listar() {
        const query = `
            SELECT 
                f.id, 
                f.numero_ficha, 
                f.programa_id,
                f.fecha_inicio, 
                f.fecha_fin, 
                p.nombre AS nombre_programa_vinculado
            FROM fichas f
            INNER JOIN programas p ON f.programa_id = p.programa_id
            ORDER BY f.created_at DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    async filtrarPorPrograma(programaId) {
        const query = `SELECT * FROM fichas WHERE programa_id = ? ORDER BY numero_ficha ASC`;
        const [rows] = await db.query(query, [programaId]);
        return rows;
    }
};