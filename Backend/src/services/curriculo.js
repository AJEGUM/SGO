import ExcelJS from 'exceljs';
import { curriculoModel } from '../models/curriculoModel.js';

export const curriculoService = {
    async procesarExcel(fileBuffer) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) throw new Error("No se pudo leer la hoja del Excel");

        // 1. Datos Maestros (En tu archivo están en la FILA 2)
        const rawCodigo = worksheet.getCell('A2').value?.toString() || "";
        const competencia = {
            codigo_norma: rawCodigo,
            prefijo_id: rawCodigo ? `C${rawCodigo.slice(-4)}` : 'C0000', 
            nombre: worksheet.getCell('B2').value, // Columna B
            duracion: parseInt(worksheet.getCell('C2').value) || 0 // Columna C
        };

        // Consultamos al modelo si ya existe ese código de norma
        const competenciaExistente = await curriculoModel.buscarPorCodigo(competencia.codigo_norma);
    
        if (competenciaExistente) {
            // Lanzamos un error descriptivo que llegará al frontend
            throw new Error(`La competencia con código ${competencia.codigo_norma} ya existe en el sistema.`);
        }

        const resultados = [];
        
        // 2. Extraer RAPs (Empiezan en la FILA 2, Columna E y H)
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            // Saltamos el encabezado (Fila 1)
            if (rowNumber >= 2) {
                const codigoRap = row.getCell(5).value; // Columna E (Código RAP)
                
                if (codigoRap) {
                    resultados.push({
                        codigo_rap: codigoRap.toString().trim(),
                        denominacion: row.getCell(6).value?.toString().trim() || "", // Columna F
                        // Detalles están en las columnas I, J, K (9, 10, 11)
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

    _limpiarTextoSena(valor) {
        if (!valor) return [];
        return valor.toString().split('*')
            .map(s => s.trim()).filter(s => s.length > 0);
    },

    async obtenerCompetencias() {
        return await curriculoModel.listarTodas();
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
    }
    
};