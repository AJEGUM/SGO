import db from '../../config/db.js';

export const CoordinadorModel = {
    async listarExpertosAcademicos() {
        const query = `
            SELECT 
                u.id,
                u.nombre AS usuario,
                u.correo,
                u.activo,
                u.estado_validacion,
                r.nombre_rol,
                -- Agrupamos programas, competencias y fichas usando los nombres reales de las tablas
                GROUP_CONCAT(DISTINCT p.nombre SEPARATOR ', ') AS programas,
                GROUP_CONCAT(DISTINCT c.nombre SEPARATOR ' | ') AS competencias,
                GROUP_CONCAT(DISTINCT f.numero_ficha SEPARATOR ', ') AS fichas,
                
                -- Cálculo de carga académica (Total de RAPs únicos asignados)
                (SELECT COUNT(DISTINCT ar.rap_id) 
                 FROM asignaciones_raps ar 
                 INNER JOIN asignaciones_programas ap_interna ON ar.asignacion_competencia_id = ap_interna.id
                 WHERE ap_interna.usuario_id = u.id) AS carga_raps
                 
            FROM usuarios u
            INNER JOIN roles r ON u.rol_id = r.id
            -- Relaciones correctas según tu esquema
            LEFT JOIN asignaciones_programas ap ON u.id = ap.usuario_id
            LEFT JOIN programas p ON ap.programa_id = p.programa_id
            -- Aquí está el truco: las competencias se vinculan por la tabla intermedia asignaciones_competencias
            LEFT JOIN asignaciones_competencias ac ON ap.id = ac.asignacion_programa_id
            LEFT JOIN competencias c ON ac.competencia_id = c.id
            -- Fichas vinculadas al usuario
            LEFT JOIN usuario_fichas uf ON u.id = uf.usuario_id
            LEFT JOIN fichas f ON uf.ficha_id = f.id 
            
            WHERE r.nombre_rol IN ('INSTRUCTOR', 'PEDAGOGO')
            
            GROUP BY u.id
            ORDER BY carga_raps DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    }
};