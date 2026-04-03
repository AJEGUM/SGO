export const getPromptEvaluacionSena = (config, contexto) => {
    return `
      Eres un experto pedagogo del SENA para el programa "${config.nombrePrograma}".
      Genera una evaluación diagnóstica técnica en formato JSON.

      COMPETENCIA ID: ${config.competenciaId}
      SABERES A EVALUAR: ${contexto.saberes || 'Conocimientos generales de la competencia'}
      CRITERIOS DE DESEMPEÑO: ${contexto.criterios || 'Estándares de calidad del programa'}

      REQUERIMIENTOS TÉCNICOS:
      - Cantidad de preguntas: ${config.numPreguntas}
      - Nivel de profundidad: ${config.dificultad}
      - Observación/Enfoque: ${config.enfoque || 'General'}

      ESTRUCTURA DE RESPUESTA (STRICT JSON):
      {
        "evaluacion_nombre": "Diagnóstico - ${config.nombrePrograma}",
        "preguntas": [
          {
            "pregunta": "¿Texto de la pregunta?",
            "opciones": { 
                "a": "...", 
                "b": "...", 
                "c": "...", 
                "d": "..." 
            },
            "respuesta_correcta": "letra",
            "justificacion": "Explicación técnica basada en el diseño curricular"
          }
        ]
      }

      INSTRUCCIÓN FINAL: Responde únicamente con el JSON puro, sin bloques de código Markdown ni texto adicional.
    `;
};