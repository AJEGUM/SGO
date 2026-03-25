import ExcelJS from 'exceljs';
import { curriculoModel } from '../models/curriculoModel.js';

export const curriculoService = {
    // funcion para extraer la informacion de el excel
    async procesarExcel(fileBuffer) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) throw new Error("No se pudo leer la hoja del Excel");

        // 1. Se extraen los datos maestros del excel
        const rawCodigo = worksheet.getCell('A2').value?.toString() || "";
        const competencia = {
            codigo_norma: rawCodigo,
            prefijo_id: rawCodigo ? `C${rawCodigo.slice(-4)}` : 'C0000', 
            nombre: worksheet.getCell('B2').value,
            duracion: parseInt(worksheet.getCell('C2').value) || 0
        };

        // consulta al modelo si ya existe ese código de norma (Validacion)
        const competenciaExistente = await curriculoModel.buscarPorCodigo(competencia.codigo_norma);
    
        if (competenciaExistente) {
            // Lanzamos un error descriptivo que llegará al frontend
            throw new Error(`La competencia con código ${competencia.codigo_norma} ya existe en el sistema.`);
        }

        const resultados = [];
        
        // 2. Extraer RAPs
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            // Saltamos el encabezado 
            if (rowNumber >= 2) {
                const codigoRap = row.getCell(5).value;
                
                if (codigoRap) {
                    resultados.push({
                        codigo_rap: codigoRap.toString().trim(),
                        denominacion: row.getCell(6).value?.toString().trim() || "",
                        procesos: this._limpiarTextoSena(row.getCell(9).value),
                        saberes: this._limpiarTextoSena(row.getCell(10).value),
                        criterios: this._limpiarTextoSena(row.getCell(11).value)
                    });
                }
            }
        });

        if (resultados.length === 0) throw new Error("No hay RAPs para procesar");

        return await curriculoModel.insertarTodo(competencia, resultados);
    },

    // Funcion vital para limpiar la data antes de ingresar a la DB
    _limpiarTextoSena(valor) {
        if (!valor) return [];
        return valor.toString().split('*')
            .map(s => s.trim()).filter(s => s.length > 0);
    },

    // Funcion comunicadora con el model para ejecutar la consulta (Obtener) SQL
    async obtenerCompetencias() {
        return await curriculoModel.listarTodas();
    },

// Funcion comunicadora con el model para ejecutar la consulta (Obtener) SQL
    async obtenerCurriculo(id) {
        const data = await curriculoModel.obtenerDetalleCompleto(id);
        if (!data) throw new Error("La competencia no existe");
        return data;
    },

    // Funcion comunicadora que especifica a la DB que dato se guardara, esto reduce la creacion de varias rutas por cada dato
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
    }
    
};