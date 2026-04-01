import pool from '../../config/db.js';

export const AuthModel = {
    
    // --- MÉTODO PARA LOGIN NORMAL (EL QUE TE FALTABA) ---
    async buscarUsuarioPorGoogleId(googleId) {
        const query = `
            SELECT 
                u.id, 
                u.nombre, 
                u.correo, 
                u.rol_id, 
                r.nombre_rol, 
                u.activo 
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.id
            WHERE u.google_id = ?
        `;
        const [rows] = await pool.query(query, [googleId]);
        return rows[0] || null;
    },

    // --- MÉTODO PARA VALIDAR LA INVITACIÓN ANTES DE REGISTRAR ---
    async obtenerDetalleInvitacion(token) {
        const query = `
            SELECT 
                i.id AS invitacion_id,
                i.correo,
                i.rol_id,
                r.nombre_rol,
                p.programa_id,
                p.nombre AS nombre_programa
            FROM invitaciones i
            INNER JOIN roles r ON i.rol_id = r.id
            LEFT JOIN invitaciones_programas ip ON i.id = ip.invitacion_id
            LEFT JOIN programas p ON ip.programa_id = p.programa_id
            WHERE i.token = ? 
            AND i.usada = 0 
            AND i.expiracion > NOW()
        `;
        
        const [rows] = await pool.query(query, [token]);
        if (rows.length === 0) return null;

        return {
            correo: rows[0].correo,
            rol_id: rows[0].rol_id,
            nombre_rol: rows[0].nombre_rol,
            programas: rows
                .filter(r => r.programa_id !== null)
                .map(r => ({
                    id: r.programa_id,
                    nombre: r.nombre_programa
                }))
        };
    },

    // --- MÉTODO TRANSACCIONAL PARA CREAR USUARIO Y QUEMAR TOKEN ---
    async finalizarProcesoInvitacion(token, payloadGoogle) {
        const { sub: googleId, email, name } = payloadGoogle;
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Obtener datos de la invitación
            const [inv] = await connection.query(
                'SELECT id, rol_id FROM invitaciones WHERE token = ? AND usada = 0',
                [token]
            );
            if (inv.length === 0) throw new Error("Invitación no válida");
            const invitacion = inv[0];

            // 2. Crear el usuario
            const [userResult] = await connection.query(
                `INSERT INTO usuarios (rol_id, nombre, correo, google_id, activo, estado_validacion) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [invitacion.rol_id, name, email, googleId, true, 'activo']
            );
            const nuevoUsuarioId = userResult.insertId;

            // 3. Vincular programas asignados
            const [programasInvitados] = await connection.query(
                'SELECT programa_id FROM invitaciones_programas WHERE invitacion_id = ?',
                [invitacion.id]
            );

            if (programasInvitados.length > 0) {
                const valoresAsignacion = programasInvitados.map(p => [nuevoUsuarioId, p.programa_id]);
                await connection.query(
                    'INSERT INTO asignaciones_programas (usuario_id, programa_id) VALUES ?',
                    [valoresAsignacion]
                );
            }

            // 4. Marcar invitación como usada
            await connection.query('UPDATE invitaciones SET usada = 1 WHERE id = ?', [invitacion.id]);

            await connection.commit();
            return { usuarioId: nuevoUsuarioId };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};