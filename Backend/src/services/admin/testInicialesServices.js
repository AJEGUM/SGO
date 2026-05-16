import { iaModel } from '../../models/admin/testInicialModel.js';
import { claudeProvider } from '../../services/claude/claudeService.js';
import { IA_PROMPTS } from '../../prompts/prompts.js';
import redis from '../../config/redis.js';

export const iaService = {
    listarProgramasYCompetencias: async () => {
        // Obtenemos los programas y sus competencias asociadas
        return await iaModel.getProgramasWithCompetencias();
    },

    obtenerDetalleParaIA: async (competenciaId) => {
        // Traemos toda la "carne" de la competencia: RAPs, Saber, Proceso y Criterios
        // Esto es vital para que el prompt de la IA sea preciso
        const raps = await iaModel.getEstructuraPedagogica(competenciaId);
        
        return {
            competenciaId,
            totalRaps: raps.length,
            estructura: raps
        };
    },

    generarTestTecnico: async (payload) => {
        console.log("🔥 [IA SERVICE] Iniciando generarTestTecnico con payload:", payload);
        // 1. Extraemos con seguridad
        const { competenciaId, ...configuracionIA } = payload;

        // 2. CORRECCIÓN AQUÍ: Llamamos directamente al modelo para obtener los RAPs
        const raps = await iaModel.getEstructuraPedagogica(competenciaId ?? null);

        // Barajear los raps para que la IA no siempre genere lo mismo
        const rapsBarajados = raps.sort(() => Math.random() - 0.5);
        
        // 3. Construimos el objeto 'detalle' manualmente para el prompt
        const datosCurriculares = rapsBarajados.map(r => ({
            id: r.codigo_rap,
            // Limpiamos espacios múltiples y saltos de línea en el título
            tema: r.rap_nombre.replace(/\s+/g, ' ').trim(),
            
            // Limpiamos los arrays de saberes y procesos
            conocimientos: r.saberes.map(s => 
                s.replace(/[*]/g, '')     // Elimina asteriscos decorativos
                .replace(/\n/g, ' ')      // Cambia saltos de línea por espacios
                .replace(/\s+/g, ' ')     // Colapsa espacios múltiples
                .trim()
            ),
            procesos: r.procesos.map(p => 
                p.replace(/[*]/g, '')
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
            )
        }));

        const detalle = {
            competenciaId,
            totalRaps: raps.length,
            estructura: datosCurriculares
        };

        const cacheKey = `test_history:comp:${competenciaId}`;
            let preguntasPrevias = [];
            
            try {
                const historyRaw = await redis.get(cacheKey);
                preguntasPrevias = historyRaw ? JSON.parse(historyRaw) : [];
        } catch (err) {
            console.error("Redis Get Error:", err);
        }

        console.log("DEBUG - Estructura enviada a la IA:", JSON.stringify(detalle.estructura, null, 2));

        // 4. Extracción y construcción del prompt
        const { system, user } = IA_PROMPTS.GENERAR_TEST;
        const promptDinamico = user(detalle, { 
            ...configuracionIA, 
            excluded_questions: preguntasPrevias 
        });

        // 5. Ejecución de la IA con Logs de Tiempo y Seguridad
        console.log("🤖 [IA SERVICE] Llamando a la API de IA... (esto puede tardar)");
        console.time("Timer-IA"); // Iniciamos cronómetro

        console.log("🧠 [DEBUG REDIS] Preguntas recuperadas de la memoria:", preguntasPrevias.length);
        console.log("📝 [PROMPT FINAL] Enviando historial de exclusión a la IA...");

        try {
            const resultadoIA = await claudeProvider.ask(promptDinamico, system);
            console.timeEnd("Timer-IA"); 
            console.log("📡 [IA SERVICE] Respuesta recibida de la API");

            // 6. LIMPIEZA DE SEGURIDAD Y GUARDADO EN REDIS
            // Cambiamos resultadoIA.data por resultadoIA.content
            if (resultadoIA.ok && resultadoIA.content) {
                console.log("✅ [IA SERVICE] IA respondió correctamente. Procesando JSON...");
                
                // Buscamos el JSON dentro del texto recibido (content)
                const jsonMatch = resultadoIA.content.match(/\{[\s\S]*\}/);
                
                if (jsonMatch) {
                    // Guardamos el JSON limpio de vuelta en una propiedad .data para el return
                    resultadoIA.data = jsonMatch[0];
                    
                    try {
                        const dataObj = JSON.parse(resultadoIA.data);
                        console.log("🆔 ID de Competencia para Redis:", competenciaId);
                        
                        // 1. Extraemos los enunciados nuevos
                        const nuevosEnunciados = dataObj.preguntas.map(p => p.enunciado);
                        
                        // 2. COMBINAMOS: Unimos los previos que recuperamos al inicio con los nuevos
                        // Usamos un Set para evitar duplicados por si acaso la IA repitió algo
                        const historialAcumulado = [...new Set([...preguntasPrevias, ...nuevosEnunciados])];
                        
                        // 3. LÍMITE: ¿Hasta cuánto? 
                        // Te recomiendo un límite de 30 o 40. 
                        // Si mandas 100 preguntas al prompt, el mensaje será muy largo y costoso.
                        const historialFinal = historialAcumulado.slice(-30); 

                        // 4. GUARDAMOS el historial completo (no solo los nuevos)
                        console.log(`💾 [IA SERVICE] Actualizando memoria: De ${preguntasPrevias.length} a ${historialFinal.length} preguntas.`);
                        await redis.set(cacheKey, JSON.stringify(historialFinal), 'EX', 3600);

                        // Verificación inmediata
                        const verificado = await redis.get(cacheKey);
                        console.log("🚀 [IA SERVICE] VERIFICACIÓN REDIS:", verificado ? "GUARDADO EXITOSO" : "NO SE GUARDÓ");
                        
                    } catch (e) {
                        console.error("❌ [IA SERVICE] Error procesando JSON o guardando en Redis:", e.message);
                    }
                }
            } else {
                console.error("❌ [IA SERVICE] La IA falló. Detalles:", {
                    error: resultadoIA.error,
                    ok: resultadoIA.ok
                });
            }

            // Retornamos el resultado con la data ya limpia
            return {
                ...resultadoIA,
                competenciaId
            };

        } catch (error) {
            if (console.timeEnd) console.timeEnd("Timer-IA"); 
            console.error("💀 [IA SERVICE] ERROR CRÍTICO EN EL FLUJO:", error);
            
            return {
                ok: false,
                error: "Error interno en el servicio de IA",
                competenciaId
            };
        }
    },

    verificarExistenciaTest: async (competenciaId) => {
        const test = await iaModel.obtenerTestPorCompetencia(competenciaId);
        
        if (!test) return null;

        // Parseo de JSON si la DB lo devuelve como string
        return {
            ...test,
            preguntas_json: typeof test.preguntas_json === 'string' 
                ? JSON.parse(test.preguntas_json) 
                : test.preguntas_json
        };
    }
};