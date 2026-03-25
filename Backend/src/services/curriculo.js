import XLSX from 'xlsx';
import { curriculoModel } from '../models/curriculoModel.js'; 
import geminiModel from '../config/gemini.js';
import { promptExtraerDetallesSena } from '../prompts/disenoCurricular.js';
import pdf from 'pdf-parse-fork';

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export const curriculoService = {

async procesarExcel(fileBuffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!rows || rows.length < 14) {
        throw new Error("El archivo no tiene el formato esperado del reporte de juicios.");
    }

    // Función interna para convertir fechas seriales de Excel a formato YYYY-MM-DD
    const excelDateToJS = (serial) => {
        if (!serial || isNaN(serial)) return null;
        const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
        return date.toISOString().split('T')[0];
    };

    // 2. Extracción de información de cabecera extendida
    const infoCabecera = {
        numeroFicha: rows[2][2]?.toString().split('.')[0].trim(),   // C3
        codigoPrograma: rows[3][2]?.toString().trim(),            // C4
        versionPrograma: rows[4][2]?.toString().trim(),           // C5
        nombrePrograma: rows[5][2]?.toString().trim(),            // C6
        fechaInicio: excelDateToJS(rows[7][2]),                    // C8
        fechaFin: excelDateToJS(rows[8][2])                        // C9
    };

    if (!infoCabecera.numeroFicha || !infoCabecera.nombrePrograma) {
        throw new Error("No se pudo encontrar la Ficha o el Programa en las celdas correspondientes.");
    }

    // 3. Mapeo de Competencias y RAPs
    const mapaCompetencias = new Map();

    for (let i = 13; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 7) continue;

        const textoComp = row[5]?.toString().trim();
        const textoRap = row[6]?.toString().trim();

        if (textoComp && textoRap && textoComp.includes(' - ')) {
            const partsComp = textoComp.split(' - ');
            const codComp = partsComp[0].trim();
            const nomComp = partsComp.slice(1).join(' - ').trim();

            const partsRap = textoRap.split(' - ');
            const codRap = partsRap[0].trim();
            const nomRap = partsRap.slice(1).join(' - ').trim();

            if (!mapaCompetencias.has(codComp)) {
                mapaCompetencias.set(codComp, {
                    codigo_norma: codComp,
                    nombre: nomComp,
                    prefijo_id: `C${codComp.slice(-4)}`,
                    duracion: 0,
                    resultados: new Map()
                });
            }

            const comp = mapaCompetencias.get(codComp);
            if (!comp.resultados.has(codRap)) {
                comp.resultados.set(codRap, {
                    codigo_rap: codRap,
                    denominacion: nomRap
                });
            }
        }
    }

    if (mapaCompetencias.size === 0) {
        throw new Error("No se encontraron competencias o RAPs válidos.");
    }

    const listaCompetencias = Array.from(mapaCompetencias.values()).map(c => ({
        ...c,
        resultados: Array.from(c.resultados.values())
    }));

    return await curriculoModel.insertarDesdeReporte(infoCabecera, listaCompetencias);
},

// Función auxiliar para evitar el error 503 (Rate Limit)

async procesarPdfDiseno(pdfBuffer, programaId) {
  try {
    console.log("--- INICIANDO PROCESAMIENTO POR LOTES (ESTRATEGIA CHUNKING OPTIMIZADA) ---");

    // 1. Extraer el texto completo
    const data = await pdf(pdfBuffer);
    let textoOriginal = data.text;
    console.log("Caracteres totales extraídos:", textoOriginal.length);

    // 2. Recortar la introducción administrativa
    const marcadorInicio = "4.  CONTENIDOS CURRICULARES DE LA COMPETENCIA";
    const indiceInicio = textoOriginal.indexOf(marcadorInicio);
    let textoLimpio = (indiceInicio !== -1) ? textoOriginal.substring(indiceInicio) : textoOriginal;

    // 3. Configuración de fragmentación (Chunks más pequeños para evitar JSON incompleto)
    const tamañoChunk = 15000; 
    const chunks = [];
    for (let i = 0; i < textoLimpio.length; i += tamañoChunk) {
      chunks.push(textoLimpio.substring(i, i + tamañoChunk));
    }

    console.log(`El texto se dividió en ${chunks.length} partes. Procesando con pausas de seguridad...`);

    let todasLasCompetencias = [];

    // 4. Bucle de procesamiento con manejo de Rate Limit
    for (let i = 0; i < chunks.length; i++) {
      console.log(`>> Procesando bloque ${i + 1} de ${chunks.length}...`);
      
      // Pausa obligatoria a partir del segundo bloque para evitar el error 503
      if (i > 0) {
        console.log("   ⏳ Esperando 3.5 segundos para liberar cuota de API...");
        await delay(3500);
      }

      const prompt = `
        ${promptExtraerDetallesSena(chunks[i])}
        
        CONTEXTO: Parte ${i + 1} de ${chunks.length}.
        INSTRUCCIÓN DE SEGURIDAD: 
        - Extrae únicamente la información presente en este fragmento.
        - Asegúrate de cerrar correctamente todas las llaves y corchetes del JSON.
        - Si no hay competencias completas en este fragmento, devuelve [].
      `;

      try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Limpieza y parseo
        const jsonString = text.replace(/```json|```/g, "").trim();
        
        // Validación básica antes de intentar parsear
        if (!jsonString.startsWith('[') && !jsonString.startsWith('{')) {
             console.log(`   ℹ️ Bloque ${i + 1}: La IA no detectó formato JSON (posiblemente no hay datos).`);
             continue;
        }

        const datosFragmento = JSON.parse(jsonString);

        if (Array.isArray(datosFragmento) && datosFragmento.length > 0) {
          console.log(`   ✅ Bloque ${i + 1}: Se encontraron ${datosFragmento.length} competencias.`);
          todasLasCompetencias = [...todasLasCompetencias, ...datosFragmento];
        } else {
          console.log(`   ℹ️ Bloque ${i + 1}: Sin competencias en este fragmento.`);
        }
      } catch (err) {
        console.error(`   ❌ Error en bloque ${i + 1}:`, err.message);
        // En DevOps, si un bloque falla, seguimos con el resto para rescatar lo que se pueda
      }
    }

    // 5. Consolidación y Guardado
    if (todasLasCompetencias.length === 0) {
      throw new Error("No se logró extraer ninguna información válida tras procesar todos los bloques.");
    }

    console.log(`--- PROCESO FINALIZADO --- Total acumulado: ${todasLasCompetencias.length} competencias.`);
    
    // Eliminar duplicados si una competencia quedó partida entre dos chunks (opcional)
    const competenciasUnicas = Array.from(new Set(todasLasCompetencias.map(c => JSON.stringify(c)))).map(s => JSON.parse(s));

    return await curriculoModel.guardarDetallesCurriculo(programaId, competenciasUnicas);

  } catch (error) {
    console.error("Error crítico en procesarPdfDiseno:", error);
    throw new Error("Error en la arquitectura de extracción: " + error.message);
  }
},

    async obtenerCompetencias() {
        return await curriculoModel.listarTodas();
    },

    async obtenerProgramas() {
        return await curriculoModel.listarProgramas();
    },

    async obtenerCurriculo(id) {
        const data = await curriculoModel.obtenerDetalleCompleto(id);
        if (!data) throw new Error("La competencia no existe");
        return data;
    },

    async patchElemento(tipo, id, nuevoTexto) {
        const tablas = {
            competencia: { nombre: 'competencias', col: 'nombre' },
            rap: { nombre: 'resultados_aprendizaje', col: 'denominacion' },
            proceso: { nombre: 'conocimientos_proceso', col: 'descripcion' },
            saber: { nombre: 'conocimientos_saber', col: 'descripcion' },
            criterio: { nombre: 'criterios_evaluacion', col: 'descripcion' }
        };
        const config = tablas[tipo];
        if (!config) throw new Error("Tipo de entidad no válido");
        return await curriculoModel.actualizarEntidad(config.nombre, id, config.col, nuevoTexto);
    },

    _limpiarTextoSena(valor) {
        if (!valor) return [];
        return valor.toString().split('*').map(s => s.trim()).filter(s => s.length > 0);
    }
};