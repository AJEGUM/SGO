import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

const app = express();

// 1. Configuración de Proxy (Vital para Digital Ocean/Cloudflare Tunnels)
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
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction, 
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 
  },
  proxy: true 
}));

// 4. INICIALIZACIÓN DE PASSPORT (ESTO FALTABA)
// // Debe ir después de express-session para que passport pueda usar la sesión
// app.use(passport.initialize());
// app.use(passport.session());

// 5. Rutas
// app.use('/api/auth', authRoutes);
// app.use('/api/mascotas', mascotas);

// Exportamos solo app para el server.js o index.js
export { app };