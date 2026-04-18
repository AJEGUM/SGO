import db from '../../config/dbConfig.js';

export const usuarioModel = {
        buscarPorCorreo: async (correo) => {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    },

    obtenerInvitacionValida: async (correo) => {
        const query = `
            SELECT * FROM invitaciones 
            WHERE correo = ? AND usado = FALSE AND expiracion > NOW() 
            LIMIT 1`;
        const [rows] = await db.execute(query, [correo]);
        return rows[0];
    },

    crearDesdeInvitacion: async (datosUsuario, invitacionId) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [res] = await conn.execute(
                'INSERT INTO usuarios (rol_id, nombre, correo, google_id) VALUES (?, ?, ?, ?)',
                [datosUsuario.rol_id, datosUsuario.nombre, datosUsuario.correo, datosUsuario.googleId]
            );

            await conn.execute(
                'UPDATE invitaciones SET usado = TRUE WHERE invitacion_id = ?',
                [invitacionId]
            );

            await conn.commit();
            return { id: res.insertId, ...datosUsuario };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    vincularGoogle: async (id, googleId) => {
        await db.execute('UPDATE usuarios SET google_id = ? WHERE id = ?', [googleId, id]);
    }
};