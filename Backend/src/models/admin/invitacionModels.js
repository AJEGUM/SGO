import db from '../../config/dbConfig.js';

export const invitacionModel = {
  async guardarInvitacion(data) {
    const query = `
      INSERT INTO invitaciones (correo, rol_id, token, expiracion, usado)
      VALUES (?, ?, ?, ?, false)
      ON DUPLICATE KEY UPDATE 
        token = VALUES(token),
        expiracion = VALUES(expiracion),
        usado = false,
        created_at = CURRENT_TIMESTAMP`;
    
    await db.execute(query, [
      data.correo, 
      data.rol_id, 
      data.token, 
      data.expiracion
    ]);
  },

  async getTodosLosRoles() {
    const query = `
      SELECT rol_id, nombre_rol 
      FROM roles 
      WHERE rol_id != 1 
      ORDER BY nombre_rol ASC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  }
};