import pool from '../../config/db.js';

export const authModel = {
  // Crea el usuario y sus asignaciones en una sola transacción
// En authModel dentro de usersModel.js
async crearUsuarioCompleto(userData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insertar el usuario en la tabla 'usuarios'
    const queryUser = `INSERT INTO usuarios (rol_id, nombre, correo, password) VALUES (?, ?, ?, ?)`;
    const [userResult] = await connection.query(queryUser, [
      userData.rol_id,
      userData.nombre,
      userData.correo,
      userData.password
    ]);

    const userId = userResult.insertId;

    // 2. Si es INSTRUCTOR (Rol 2) y seleccionó un programa
    if (userData.rol_id === 2 && userData.programa_id) {
      
      const queryVinculo = `
        INSERT INTO asignaciones_programas (usuario_id, programa_id) 
        VALUES (?, ?)
      `;
      
      await connection.query(queryVinculo, [userId, userData.programa_id]);
      console.log(`[DB]: Instructor ${userId} vinculado al programa ${userData.programa_id}`);
    }

    await connection.commit();
    return { id: userId, ...userData };

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("!!! ERROR EN TRANSACCIÓN DB:", error.sqlMessage || error.message);
    throw error;
  } finally {
    if (connection) connection.release();
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