import { ejecutarPythonParser } from '../utils/pythonRunner.js';
import { curriculoModel } from '../models/curriculoModel.js'; 

export const curriculoService = {

async procesarExcel(fileBuffer, datosFicha) { // <-- Recibimos los datos del modal
    try {
        console.log("1. Llamando al motor de extracción externo...");
        const competencias = await ejecutarPythonParser(fileBuffer);

        if (!competencias || competencias.length === 0) {
            throw new Error("No se extrajeron datos del archivo.");
        }

        console.log(`2. Extracción exitosa. Procesando ${competencias.length} competencias.`);

        // Priorizamos el nombre que viene del modal, si no, usamos el del excel
        const infoFinal = {
            ...datosFicha,
            nombrePrograma: datosFicha.nombrePrograma || competencias[0]?.nombre || "PROGRAMA IMPORTADO"
        };

        console.log("3. Guardando en base de datos con info de ficha...");
        return await curriculoModel.insertarDesdeExcelDetallado(
            infoFinal, // <-- Ahora pasamos TODO: numero_ficha, fechas, etc.
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
        competencia: { nombre: 'competencias', col: 'nombre', esBloque: false },
        rap:         { nombre: 'resultados_aprendizaje', col: 'denominacion', esBloque: false },
        procesos:    { nombre: 'conocimientos_proceso', col: 'descripcion', esBloque: true },
        saberes:     { nombre: 'conocimientos_saber', col: 'descripcion', esBloque: true },
        criterios:   { nombre: 'criterios_evaluacion', col: 'descripcion', esBloque: true }
    };

    const config = tablas[tipo];
    if (!config) throw new Error("Tipo de entidad no válido");

    // Si es un bloque de texto (Procesos, Saberes, Criterios)
    if (config.esBloque) {
        // Aquí el 'id' que viene de Angular es el rap_id
        return await curriculoModel.sincronizarDetallesRap(config.nombre, id, config.col, nuevoTexto);
    }

    // Si es una actualización simple de nombre o denominación
    return await curriculoModel.actualizarEntidad(config.nombre, id, config.col, nuevoTexto);
},

_limpiarTextoSena(valor) {
    if (!valor) return [];
    return valor.toString().split('*').map(s => s.trim()).filter(s => s.length > 0);
}
};