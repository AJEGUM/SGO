import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

const groqInstance = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Exportamos un objeto que tenga el método generateContent que usas en el service
const groqModel = {
    async generateContent(prompt) {
        const completion = await groqInstance.chat.completions.create({
            messages: [
                { role: "system", content: "Eres un analista experto del SENA. Solo devuelves JSON." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.1
        });

        return {
            response: {
                text: () => completion.choices[0].message.content
            }
        };
    }
};

export default groqModel;