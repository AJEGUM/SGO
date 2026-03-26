export const promptExtraerDetallesSena = (bloqueTexto) => {
  return `
  Eres un experto analista de currículos del SENA. Tu misión es reconstruir la estructura de una competencia técnica a partir de un texto extraído de un PDF.
  
  CONTEXTO DEL TEXTO:
  El texto está organizado por secciones: 4.5 (Resultados), 4.6.1 (Procesos), 4.6.2 (Saberes) y 4.7 (Criterios).
  Cada una de estas secciones repite los mismos "ENCABEZADOS DE ACTIVIDAD" (ej: "CONSTRUIR LA BASE DE DATOS...", "REALIZAR PRUEBAS...").
  
  TU TAREA:
  1. Identifica los nombres de los Resultados de Aprendizaje (RAPs) en la sección 4.5.
  2. Busca esos mismos nombres exactos como encabezados en las secciones 4.6.1, 4.6.2 y 4.7.
  3. Agrupa todos los ítems con asterisco (*) que encuentres debajo de cada encabezado y asígnalos al RAP correspondiente.
  4. IMPORTANTE: Ignora encabezados de página, fechas, números de página o nombres de redes tecnológicas que interrumpan el texto.
  
  DATOS DE CABECERA:
  - Nombre de la competencia: Se encuentra en 4.3 (ej: CONSTRUCCIÓN DEL SOFTWARE).
  - Código de la norma: Se encuentra en 4.1 o 4.2 (ej: 220501096).

  TEXTO A PROCESAR:
  ${bloqueTexto}

  RESPUESTA EN JSON (ESTRICTO ARRAY):
  [{
    "codigo_norma": "Extraer código",
    "nombre_competencia": "Extraer nombre de 4.3",
    "resultados": [
      {
        "codigo_rap": "Ej: 01, 02",
        "nombre_rap": "Nombre completo del RAP",
        "procesos": ["Lista limpia de ítems con asterisco en 4.6.1"],
        "saberes": ["Lista limpia de ítems con asterisco en 4.6.2"],
        "criterios": ["Lista limpia de ítems con asterisco en 4.7"]
      }
    ]
  }]
  `;
};