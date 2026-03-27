import XLSX from 'xlsx';
import { curriculoModel } from '../models/curriculoModel.js'; 
import * as Extractor from '../utils/excelExtractors.js';

export const curriculoService = {

async procesarExcel(fileBuffer) {
    // 1. Llamamos a la lógica extraída
    const competenciasProcesadas = Extractor.extraerTodoElContenido(fileBuffer);

    // 2. Definimos metadatos básicos
    const nombreProg = competenciasProcesadas[0]?.nombre || "IMPORTACIÓN CURRÍCULO";

    // 3. Persistencia
    return await curriculoModel.insertarDesdeExcelDetallado(
        { nombrePrograma: nombreProg }, 
        competenciasProcesadas
    );
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