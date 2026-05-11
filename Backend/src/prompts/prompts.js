export const IA_PROMPTS = {
    GENERAR_TEST: {
        system: "Eres un experto en diseño curricular del SENA. Tu salida debe ser exclusivamente JSON puro, sin bloques de código markdown ni texto adicional.",
        user: (estructura, config) => `
        Genera un examen técnico basado en: ${JSON.stringify(estructura.estructura).substring(0, 2000)}.

        ESQUEMA OBLIGATORIO DE RESPUESTA:
        {
          "nombre_test": "${config.nombre_test}",
          "descripcion": "${config.descripcion}",
          "preguntas": [
            {
              "enunciado": "Pregunta técnica clara",
              "opciones": [
                { "texto": "Opción 1", "es_correcta": false },
                { "texto": "Opción 2", "es_correcta": true },
                { "texto": "Opción 3", "es_correcta": false },
                { "texto": "Opción 4", "es_correcta": false }
              ],
              "justificacion": "Explicación breve de por qué es la respuesta correcta"
            }
          ]
        }

        RESTRICCIONES:
        - Cantidad de preguntas: ${config.cantidad_preguntas}
        - Dificultad: ${config.dificultad}
        - No incluyas caracteres especiales que rompan el JSON.
        `
    }
};