import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
// import passport from './config/passportGoogle.js'; // Importamos tu estrategia corregida
// import authRoutes from './routes/authGoogle.route.js';
import admin from './routes/admin/admin.route.js';
import auth from './routes/auth/auth.routes.js';

const app = express();

// 1. Configuración de Proxy (Vital para Digital Ocean/Cloudflare Tunnels)
app.set('trust proxy', 1);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// 2. Configuración de CORS
app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Configuración de Sesión
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: process.env.SESSION_SECRET || 'scooby_secret_999',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction, // Cámbialo a true porque el túnel te da HTTPS
    httpOnly: true,
    sameSite: 'lax', // Obligatorio para que la cookie viaje entre los dos túneles
    maxAge: 24 * 60 * 60 * 1000 
  },
  proxy: true 
}));

// 4. INICIALIZACIÓN DE PASSPORT (ESTO FALTABA)
// Debe ir después de express-session para que passport pueda usar la sesión
// app.use(passport.initialize());
// app.use(passport.session());

// 5. Rutas
app.use('/api/admin', admin);
app.use('/api/auth', auth);
// Exportamos solo app para el server.js o index.js
export { app };