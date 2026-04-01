import pool from '../../config/db.js';

export const authModel = {
 // ... dentro de tu objeto de modelo
// src/models/admin/usersModel.js
async guardarInvitacionCompleta(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [invResult] = await connection.query(
      'INSERT INTO invitaciones (correo, rol_id, token, expiracion) VALUES (?, ?, ?, ?)',
      [data.correo, data.rol_id, data.token, data.expiracion]
    );

    const invitacionId = invResult.insertId;

    // LIMPIEZA RADICAL: Filtramos nulos, undefined y valores vacíos
    if (Array.isArray(data.programas)) {
      const valoresValidos = data.programas
        .filter(id => id !== null && id !== undefined && id !== '') 
        .map(id => [invitacionId, Number(id)]); // Aseguramos que sea número

      if (valoresValidos.length > 0) {
        await connection.query(
          'INSERT INTO invitaciones_programas (invitacion_id, programa_id) VALUES ?',
          [valoresValidos]
        );
        console.log(`[DB] Se vincularon ${valoresValidos.length} programas a la invitación ${invitacionId}`);
      } else {
        console.warn("[DB] La invitación se creó sin programas vinculados (Array vacío o nulo)");
      }
    }

    await connection.commit();
    return invitacionId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
},

  async buscarPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
    return rows[0];
  },

  async obtenerRoles() {
    const [rows] = await pool.query('SELECT id, nombre_rol FROM roles');
    return rows;
  },

  async obtenerTodosUsusarios() {
    const query = `
        SELECT 
            u.id, 
            u.nombre, 
            u.correo, 
            u.activo, 
            u.created_at,
            r.nombre_rol,
            p.nombre
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        LEFT JOIN asignaciones_programas ap ON u.id = ap.usuario_id
        LEFT JOIN programas p ON ap.programa_id = p.programa_id
        ORDER BY u.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
}
};