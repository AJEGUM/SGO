import pool from '../../config/db.js';

export const authModel = {
  // Crea el usuario y sus asignaciones en una sola transacción
  async crearUsuarioCompleto(userData, competenciasIds = []) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insertar en tabla usuarios
      const queryUser = `
        INSERT INTO usuarios (rol_id, nombre, correo, password) 
        VALUES (?, ?, ?, ?)
      `;
      const [userResult] = await connection.query(queryUser, [
        userData.rol_id,
        userData.nombre,
        userData.correo,
        userData.password // Ya debe venir hasheada del service
      ]);

      const userId = userResult.insertId;

      // 2. Si hay competencias para asignar (Caso Instructor)
      if (competenciasIds.length > 0 && userData.programa_id) {
        const values = competenciasIds.map(compId => [userId, userData.programa_id, compId]);
        
        const queryAsignacion = `
          INSERT INTO asignaciones_instructor (usuario_id, programa_id, competencia_id) 
          VALUES ?
        `;
        await connection.query(queryAsignacion, [values]);
      }

      await connection.commit();
      return { id: userId, ...userData };
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

  async obtenerCompetenciasPorPrograma(programa_id) {
    const [rows] = await pool.query('SELECT id FROM competencias WHERE programa_id = ?', [programa_id]);
    return rows;
  },

  async obtenerRoles() {
    const [rows] = await pool.query('SELECT id, nombre_rol FROM roles');
    return rows;
  }
};