import pool from '../../config/db.js';

// src/models/admin/usersModel.js

export const AuthModel = {
    async obtenerDetalleInvitacion(token) {
        const query = `
            SELECT 
                i.id AS invitacion_id,
                i.correo,
                i.rol_id,
                r.nombre_rol,
                p.programa_id AS programa_id, -- <--- CAMBIADO AQUÍ
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

        // El mapeo se mantiene igual porque usamos el AS programa_id
        const detalle = {
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

        return detalle;
    }
}