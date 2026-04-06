import jwt from 'jsonwebtoken';

export const protectAuth = (req, res, next) => {
    // 1. Obtener el token del header (Bearer token)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token con tu clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Validar si es ADMIN (Rol 1) [cite: 2026-02-27]
        if (decoded.rol !== 1) {
            return res.status(403).json({ error: 'Prohibido. Se requiere rol de Administrador.' });
        }

        // 4. Adjuntar info del usuario al request por si la necesitas en el controller
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};