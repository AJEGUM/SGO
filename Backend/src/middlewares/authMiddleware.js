// middlewares/authMiddleware.js
export const verificarAuth = (req, res, next) => {
  console.log("Ruta solicitada:", req.originalUrl);
  console.log("¿Está autenticado?:", req.isAuthenticated());
  console.log("Usuario en req:", req.user);
  // Passport inyecta isAuthenticated() y req.user automáticamente
  if (req.isAuthenticated()) {
    return next();
  }

  // Si no está autenticado, mandamos el 401
  return res.status(401).json({ 
    mensaje: "Acceso denegado. No has iniciado sesión o la sesión expiró." 
  });
};