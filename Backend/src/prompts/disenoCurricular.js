export const promptExtraerDetallesSena = (textoCompleto) => `
Analiza el siguiente extracto de un programa de formación del SENA. 
Tu tarea es extraer los 'Conocimientos de Proceso', 'Conocimientos de Saber' y 'Criterios de Evaluación'.

INSTRUCCIONES CRÍTICAS:
1. Identifica cada competencia por su código numérico.
2. Identifica cada Resultado de Aprendizaje (RAP) por su código o denominación.
3. La respuesta debe ser ESTRICTAMENTE un array de objetos JSON.
4. No incluyas explicaciones, solo el JSON.

ESTRUCTURA REQUERIDA:
[{
    "codigo_norma": "Ej: 220501092",
    "resultados": [{
        "codigo_rap": "Ej: 01",
        "procesos": ["item1", "item2"],
        "saberes": ["item1", "item2"],
        "criterios": ["item1", "item2"]
    }]
}]

TEXTO DEL DISEÑO CURRICULAR:
${textoCompleto.substring(0, 40000)}
`;