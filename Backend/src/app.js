import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import './config/login.js';

import adminRoutes from './routes/admin.routes.js';
import loginRoutes from './routes/login.routes.js';

const app = express();

// 1. Configuración de Proxy (Vital para Cloudflare Tunnels/Digital Ocean)
app.set('trust proxy', 1);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// 2. Configuración de CORS
app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 3. Configuración de Sesión
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: process.env.SESSION_SECRET || 'scooby_secret_999',
  resave: true,
  saveUninitialized: true,
  rolling: true, // Esto ayuda a que la cookie se refresque y se mantenga activa
  cookie: { 
    secure: false, 
    httpOnly: true,
    sameSite: 'lax',
    path: '/', // Asegura que la cookie sea válida para todas las rutas
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// 4. INICIALIZACIÓN DE PASSPORT
// Siempre debe ir después del middleware de session
app.use(passport.initialize());
app.use(passport.session());

// 5. Rutas
app.use('/api/auth', loginRoutes); // Prefijo para autenticación
app.use('/api/admin', adminRoutes);

export { app };