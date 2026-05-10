import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620',
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS, 10) || 4096,
};

if (!config.apiKey) {
    console.error('❌ FATAL ERROR: ANTHROPIC_API_KEY no encontrada en .env');
}

export const anthropic = new Anthropic({
    apiKey: config.apiKey,
});

export const anthropicConfig = config;