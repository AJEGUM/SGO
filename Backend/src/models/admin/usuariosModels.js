import db from '../../config/dbConfig.js';

export const usuarioModel = {
  async obtenerTodos() {
    const query = `
      SELECT 
        u.id, 
        u.nombre, 
        u.correo, 
        u.activo, 
        u.created_at, 
        r.nombre_rol as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.rol_id
      ORDER BY u.created_at DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  async cambiarEstado(id, activo) {
    const query = `UPDATE usuarios SET activo = ? WHERE id = ?`;
    const [result] = await db.execute(query, [activo, id]);
    return result;
  }
};