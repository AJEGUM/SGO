import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: La API Key no se cargó desde el .env");
} else {
    console.log("✅ API Key cargada correctamente (Primeros 4: " + process.env.GEMINI_API_KEY.substring(0, 4) + ")");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Usamos el modelo que definiste
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", // O el modelo que prefieras
    generationConfig: {
        maxOutputTokens: 9000,
        temperature: 0.1, // Baja temperatura para respuestas JSON más precisas
        responseMimeType: "application/json", // <-- Esto es clave
    }
});

export default model; // <-- IMPORTANTE: Cambia module.exports por export default