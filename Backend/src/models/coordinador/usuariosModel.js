import db from '../../config/db.js';

export const CoordinadorModel = {
    async listarExpertosAcademicos() {
        const query = `
            SELECT 
                u.id,
                u.nombre,
                u.correo,
                u.activo,
                r.nombre_rol,
                GROUP_CONCAT(DISTINCT p.nombre SEPARATOR ', ') AS programas,
                -- Cálculo de carga académica: Total de RAPs asignados al instructor
                (SELECT COUNT(*) 
                 FROM asignaciones_raps ar 
                 INNER JOIN asignaciones_programas ap_interna ON ar.asignacion_competencia_id = ap_interna.id
                 WHERE ap_interna.usuario_id = u.id) AS carga_raps,
                u.estado_validacion
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.id
            LEFT JOIN asignaciones_programas ap ON u.id = ap.usuario_id
            LEFT JOIN programas p ON ap.programa_id = p.programa_id
            -- Filtramos solo por los roles que el Coordinador debe supervisar
            WHERE r.nombre_rol IN ('INSTRUCTOR', 'PEDAGOGO')
            GROUP BY u.id
            ORDER BY carga_raps DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }
};