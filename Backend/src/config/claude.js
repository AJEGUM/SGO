import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    apiKey: process.env.ANTHROPIC_API_KEY,
    // ID actualizado según tu tabla de "Últimos modelos"
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6', 
    // Mantenemos 4096 para evitar el error de Streaming por ahora
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS, 10) || 4096,
};

console.log("🛠️ SGO-IA Config: Cargando modelo", config.model); // <--- ESTO ES VITAL

if (!config.apiKey) {
    console.error('❌ FATAL ERROR: ANTHROPIC_API_KEY no encontrada en .env');
}

export const anthropic = new Anthropic({
    apiKey: config.apiKey,
});

export const anthropicConfig = config;