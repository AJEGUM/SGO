import pool from '../../config/db.js';

export const authModel = {
async guardarInvitacionCompleta(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Registro simple de la invitación
    const query = `
      INSERT INTO invitaciones (correo, rol_id, token, expiracion) 
      VALUES (?, ?, ?, ?)
    `;
    
    const [invResult] = await connection.query(query, [
      data.correo, 
      data.rol_id, 
      data.token, 
      data.expiracion
    ]);

    const invitacionId = invResult.insertId;

    // 2. Commit directo ya que no hay inserciones dependientes (programas)
    await connection.commit();
    
    console.log(`[DB] Invitación creada exitosamente con ID: ${invitacionId}`);
    return invitacionId;

  } catch (error) {
    // Si algo falla en la inserción inicial, revertimos
    if (connection) await connection.rollback();
    console.error("[DB-ERROR] Error al crear invitación:", error);
    throw error;
  } finally {
    // Siempre liberamos la conexión al pool
    if (connection) connection.release();
  }
},

  async buscarPorEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [email]);
    return rows[0];
  },

  async obtenerRoles() {
      const [rows] = await pool.query(
          'SELECT id, nombre_rol FROM roles WHERE nombre_rol NOT IN ("APRENDIZ", "Aprendiz")'
      );
      return rows;
  },

async obtenerTodosUsuarios() {
    const query = `
        SELECT 
            u.id, 
            u.nombre, 
            u.correo, 
            u.activo, 
            u.estado_validacion,
            u.created_at,
            r.nombre_rol,
            GROUP_CONCAT(p.nombre SEPARATOR ', ') AS programas
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        LEFT JOIN asignaciones_programas ap ON u.id = ap.usuario_id
        LEFT JOIN programas p ON ap.programa_id = p.programa_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
}
};