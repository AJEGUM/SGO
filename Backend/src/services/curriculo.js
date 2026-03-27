import { ejecutarPythonParser } from '../utils/pythonRunner.js';
import { curriculoModel } from '../models/curriculoModel.js'; 

export const curriculoService = {

async procesarExcel(fileBuffer) {
    try {
        console.log("1. Llamando al motor de extracción externo...");
        
        // Usamos la función importada
        const competencias = await ejecutarPythonParser(fileBuffer);

        if (!competencias || competencias.length === 0) {
            throw new Error("No se extrajeron datos del archivo.");
        }

        console.log(`2. Extracción exitosa. Procesando ${competencias.length} competencias.`);

        const nombreProg = competencias[0]?.nombre || "PROGRAMA IMPORTADO";

        console.log("3. Guardando en base de datos...");
        return await curriculoModel.insertarDesdeExcelDetallado(
            { nombrePrograma: nombreProg }, 
            competencias
        );

    } catch (error) {
        console.error("Error en curriculoService:", error.message);
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