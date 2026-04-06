import jwt from 'jsonwebtoken';

// Este solo revisa que el token sea válido
export const protectAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ msg: 'No autorizado' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Aquí guardamos el rol que viene en el token
        next();
    } catch (e) {
        return res.status(401).json({ msg: 'Token inválido' });
    }
};

// ESTE ES EL CENTRALIZADOR: Recibe los roles permitidos para la ruta
export const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ 
                ok: false, 
                msg: `Tu rol no tiene permiso para esta acción.` 
            });
        }
        next();
    };
};