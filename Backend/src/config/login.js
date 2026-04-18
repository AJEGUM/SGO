import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authService } from '../services/login/loginService.js';
import db from '../config/dbConfig.js'; // Necesario para deserialize si no creas un método en el model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const usuario = await authService.procesarOAuthGoogle(profile);
        return done(null, usuario);
    } catch (error) {
        // Pasamos el error de la invitación al callback
        return done(null, false, { message: error.message });
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Importante: db.execute devuelve [rows, fields]
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        
        if (!rows || rows.length === 0) {
            console.log("Deserialización fallida: Usuario no encontrado en DB");
            return done(null, false);
        }

        // Passport pondrá esto en req.user
        done(null, rows[0]);
    } catch (error) {
        console.error("Error en deserializeUser:", error);
        done(error, null);
    }
});