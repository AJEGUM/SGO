import passport from 'passport';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

export const authController = {
  
  iniciarGoogle: passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  }),

googleCallback: (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${FRONTEND_URL}/login?error=no_invitacion`);

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      // --- CAMBIO CLAVE AQUÍ ---
      // Forzamos el guardado de la sesión antes de redireccionar
      req.session.save((err) => {
        if (err) {
          console.error("Error al guardar la sesión:", err);
          return next(err);
        }

        console.log("Sesión guardada físicamente en el almacén para:", user.id);

        const rutasPorRol = {
          1: '/dashboard/aprendiz',
          2: '/dashboard/instructor',
          3: '/dashboard/bienestar',
          5: '/importar' 
        };

        const rutaDestino = rutasPorRol[user.rol_id] || '/';
        
        // Ahora sí, el redirect es seguro
        return res.redirect(`${FRONTEND_URL}${rutaDestino}`);
      });
      // --------------------------
    });
  })(req, res, next);
},

  obtenerPerfil: (req, res) => {
    console.log("¿Está autenticado?:", req.isAuthenticated());
    console.log("Sesión ID:", req.sessionID);
    console.log("Usuario en req:", req.user);
    if (req.isAuthenticated()) {
      return res.status(200).json({
        ok: true,
        usuario: req.user
      });
    }

    return res.status(401).json({
      ok: false,
      message: 'Sesión inválida o expirada'
    });
  },

  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
    
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect(`${FRONTEND_URL}/login`);
      });
    });
  }
};