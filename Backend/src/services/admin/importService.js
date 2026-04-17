import { programModel } from '../../models/admin/importModels.js';
import { ExcelParser } from '../../utils/ExcelParser.js';
import XLSX from 'xlsx';

export const importService = {
  async procesarFichaSena(fileBuffer) {
    const parser = new ExcelParser(fileBuffer);

    // Mapeo centralizado: Si mañana el SENA cambia un nombre, solo editas aquí
    const centroRaw = parser.getValueOf('centro de formacion') || "";
    const [c_codigo, c_nombre] = centroRaw.toString().includes(' - ') 
        ? centroRaw.split(' - ') 
        : [centroRaw, null];

    const dataSGO = {
      regional: parser.getValueOf('regional'),
      centro_codigo: c_codigo?.trim(),
      centro_nombre: c_nombre?.trim() || 'CENTRO NO ESPECIFICADO',
      programa_codigo: parser.getValueOf('cogigo') || parser.getValueOf('codigo'),
      denominacion: parser.getValueOf('denominacion'),
      version: parser.getValueOf('version'),
      nivel_formacion: parser.getValueOf('nivel de formacion') || 'TECNOLOGO',
      ficha_caracterizacion: parser.getValueOf('ficha de caracterizacion'),
      fecha_inicio: this.formatearFecha(parser.getValueOf('fecha inicio')),
      fecha_fin: this.formatearFecha(parser.getValueOf('fecha fin')),
      modalidad: parser.getValueOf('modalidad de formacion'),
      estado_caracterizacion: parser.getValueOf('estado de la ficha de caracterizacion')
    };

    // Validación de integridad
    if (!dataSGO.ficha_caracterizacion || !dataSGO.programa_codigo) {
      throw new Error("Estructura de archivo no reconocida o faltan datos críticos.");
    }

    // Persistencia
    const centroId = await programModel.upsertCentro({
      codigo: dataSGO.centro_codigo,
      nombre: dataSGO.centro_nombre,
      regional: dataSGO.regional
    });

    const programaId = await programModel.upsertPrograma({
      codigo: dataSGO.programa_codigo,
      nombre: dataSGO.denominacion,
      denominacion: dataSGO.denominacion,
      version: dataSGO.version,
      nivel: dataSGO.nivel_formacion
    });

    await programModel.crearFicha({
      codigo_interno: dataSGO.ficha_caracterizacion,
      ficha_caracterizacion: dataSGO.ficha_caracterizacion,
      programa_id: programaId,
      centro_id: centroId,
      fecha_inicio: dataSGO.fecha_inicio,
      fecha_fin: dataSGO.fecha_fin,
      modalidad: dataSGO.modalidad,
      estado_caracterizacion: dataSGO.estado_caracterizacion
    });

    return { ficha: dataSGO.ficha_caracterizacion, status: 'ok' };
  },

  formatearFecha(fecha) {
    if (!fecha) return null;
    if (typeof fecha === 'number') {
      const dateObj = XLSX.SSF.parse_date_code(fecha);
      return `${dateObj.y}-${String(dateObj.m).padStart(2, '0')}-${String(dateObj.d).padStart(2, '0')}`;
    }
    const fechaStr = String(fecha).trim();
    if (fechaStr.includes('/')) {
      const [dia, mes, anio] = fechaStr.split('/');
      return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    return null;
  }
};