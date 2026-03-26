import XLSX from 'xlsx';
import { curriculoModel } from '../models/curriculoModel.js'; 
import groqModel from '../config/groq.js';
import { promptExtraerDetallesSena } from '../prompts/disenoCurricular.js';
import pdf from 'pdf-parse-fork';

export const curriculoService = {

async procesarExcel(fileBuffer) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!rows || rows.length < 14) {
        throw new Error("El archivo no tiene el formato esperado del reporte de juicios.");
    }

    const excelDateToJS = (serial) => {
        if (!serial || isNaN(serial)) return null;
        const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
        return date.toISOString().split('T')[0];
    };

    const infoCabecera = {
        numeroFicha: rows[2][2]?.toString().split('.')[0].trim(),
        codigoPrograma: rows[3][2]?.toString().trim(),
        versionPrograma: rows[4][2]?.toString().trim(),
        nombrePrograma: rows[5][2]?.toString().trim(),
        fechaInicio: excelDateToJS(rows[7][2]),
        fechaFin: excelDateToJS(rows[8][2])
    };

    if (!infoCabecera.numeroFicha || !infoCabecera.nombrePrograma) {
        throw new Error("No se pudo encontrar la Ficha o el Programa.");
    }

    const mapaCompetencias = new Map();

    for (let i = 13; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 7) continue;

        const textoComp = row[5]?.toString().trim();
        const textoRap = row[6]?.toString().trim();

        if (textoComp && textoRap && textoComp.includes(' - ')) {
            const partsComp = textoComp.split(' - ');
            // CODIGO VIRGEN: Limpiamos cualquier espacio o carácter raro
            const codComp = partsComp[0].trim(); 
            const nomComp = partsComp.slice(1).join(' - ').trim();

            const partsRap = textoRap.split(' - ');
            const codRap = partsRap[0].trim();
            const nomRap = partsRap.slice(1).join(' - ').trim();

            if (!mapaCompetencias.has(codComp)) {
                mapaCompetencias.set(codComp, {
                    codigo_norma: codComp, // Guardado puro
                    nombre: nomComp,
                    prefijo_id: codComp,   // Quitamos la "C", dejamos el código virgen
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
    console.log("--- INICIANDO EXTRACCIÓN (MODO ROBUSTO) ---");
    const data = await pdf(pdfBuffer);
    const textoCompleto = data.text;
    
    // Marcador para dividir el PDF por competencias
    const regexMarcador = /4\.\s*CONTENIDOS\s+CURRICULARES/gi;
    let secciones = textoCompleto.split(regexMarcador);
    secciones.shift(); // Quitamos el encabezado inicial del PDF

    let todasLasCompetencias = [];

    for (let i = 0; i < secciones.length; i++) {
      const bloqueTexto = secciones[i];
      if (bloqueTexto.length < 300) continue;

      console.log(`>> Procesando bloque ${i + 1}/${secciones.length}...`);
      
      // Delay de 3 segundos para respetar el RPM de Groq
      await new Promise(r => setTimeout(r, 3000)); 

      try {
        const promptFinal = promptExtraerDetallesSena(bloqueTexto);
        const result = await groqModel.generateContent(promptFinal);
        const responseText = result.response.text();
        
        // --- LIMPIEZA DE JSON SEGURA ---
        // Buscamos los límites del array para ignorar cualquier texto extra de la IA
        const inicioJson = responseText.indexOf('[');
        const finJson = responseText.lastIndexOf(']') + 1;

        if (inicioJson === -1 || finJson === 0) {
          console.warn(`⚠️ El bloque ${i + 1} no devolvió un JSON válido. Reintentando o saltando...`);
          continue;
        }

        const jsonLimpio = responseText.substring(inicioJson, finJson);
        const datosParsed = JSON.parse(jsonLimpio);
        // -------------------------------

        const array = Array.isArray(datosParsed) ? datosParsed : [datosParsed];
        todasLasCompetencias.push(...array);
        console.log(`  ✅ Bloque ${i + 1} extraído con éxito.`);

      } catch (err) {
        if (err.message.includes("429")) {
            console.log("⏳ Límite de tokens excedido. Esperando 30 segundos...");
            await new Promise(r => setTimeout(r, 30000));
            i--; // Retrocedemos el índice para reintentar este mismo bloque
        } else {
            console.error(`❌ Error parseando bloque ${i + 1}:`, err.message);
        }
      }
    }

    if (todasLasCompetencias.length === 0) {
      throw new Error("No se pudo extraer información válida del PDF.");
    }

    console.log(`--- EXTRACCIÓN FINALIZADA --- Total: ${todasLasCompetencias.length} competencias.`);
    
    // Llamada al model con la nueva lógica de Bulk Inserts
    return await curriculoModel.guardarDetallesCurriculo(programaId, todasLasCompetencias);

  } catch (error) {
    console.error("Error crítico en procesarPdfDiseno:", error);
    throw error;
  }
},

    async obtenerCompetencias(programaId) {
        return await curriculoModel.listarCompetencias(programaId);
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