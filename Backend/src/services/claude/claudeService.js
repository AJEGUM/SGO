import { anthropic, anthropicConfig } from '../../config/claude.js';

// Envolvemos la función en un objeto para que coincida con claudeProvider.ask
export const claudeProvider = {
    ask: async (prompt, system = "") => {
        try {
            const response = await anthropic.messages.create({
                model: anthropicConfig.model,
                max_tokens: anthropicConfig.maxTokens,
                system: system,
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            });

            return {
                ok: true,
                content: response.content[0].text,
                usage: response.usage
            };
        } catch (error) {
            console.error('❌ Error en Claude Provider:', error.message);
            throw error;
        }
    }
};