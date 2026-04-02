import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authServices } from '../services/auth/authServices.js';
import 'dotenv/config';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true, // Habilitamos para recibir el token de invitación desde la URL
    proxy: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
        // El token de invitación vendrá en el state de la URL (lo configuramos en la ruta)
        const tokenInvitacion = req.query.state; 
        const payloadGoogle = {
            sub: profile.id,
            email: profile.emails[0].value, 
            name: profile.displayName
        };

        // Si hay un token de invitación, es un proceso de registro
        if (tokenInvitacion) {
            const registro = await authServices.procesarRegistroGoogle(tokenInvitacion, payloadGoogle);
            return done(null, registro);
        }

        // Si NO hay token, es un Login normal
        const usuario = await authServices.loginConGoogle(payloadGoogle);
        return done(null, usuario);

    } catch (error) {
        return done(null, false, { message: error.message });    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;