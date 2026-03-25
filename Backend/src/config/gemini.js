import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

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