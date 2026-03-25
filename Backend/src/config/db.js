import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Puerto por defecto de MySQL
    waitForConnections: true,          // Espera cuando las conexiones están ocupadas
    connectionLimit: 10,               // Límite de conexiones al mismo tiempo
    queueLimit: 0,                     // No hay límite de conexiones en la cola
    charset: 'utf8mb4'                 // Soporte para emojis y caracteres especiales
});

export default pool;