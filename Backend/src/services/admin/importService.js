import { programModel } from '../../models/admin/importModels.js';
import XLSX from 'xlsx'; // Asegúrate de tener XLSX disponible aquí también

export const importService = {
  async procesarExcelSena(rows) {
    const reportesProcesados = [];

    for (const row of rows) {
      try {
        const centroId = await programModel.upsertCentro({
          codigo: row.centro_codigo,
          nombre: row.centro_nombre,
          regional: row.regional
        });

        const programaId = await programModel.upsertPrograma({
          codigo: row.programa_codigo,
          nombre: row.programa_nombre,
          denominacion: row.denominacion,
          version: row.version,
          nivel: row.nivel_formacion
        });

        await programModel.crearFicha({
          codigo_interno: row.codigo_ficha,
          ficha_caracterizacion: row.ficha_caracterizacion,
          programa_id: programaId,
          centro_id: centroId,
          fecha_inicio: this.formatearFecha(row.fecha_inicio),
          fecha_fin: this.formatearFecha(row.fecha_fin),
          modalidad: row.modalidad,
          estado_caracterizacion: row.estado_caracterizacion
        });

        reportesProcesados.push({ ficha: row.ficha_caracterizacion, status: 'ok' });
      } catch (error) {
        console.error(`Error procesando ficha ${row.ficha_caracterizacion}:`, error);
        // Tip de DevOps: Aquí podrías integrar Sentry.captureException(error);
      }
    }
    return reportesProcesados;
  },

  formatearFecha(fecha) {
    if (!fecha) return null;

    let dateObj;

    // Caso 1: Excel lo leyó como número de serie (ej: 45397)
    if (typeof fecha === 'number') {
      // XLSX.SSF convertirá el número de serie en un objeto de fecha de JS
      dateObj = XLSX.SSF.parse_date_code(fecha);
      const anio = dateObj.y;
      const mes = String(dateObj.m).padStart(2, '0');
      const dia = String(dateObj.d).padStart(2, '0');
      return `${anio}-${mes}-${dia}`;
    }

    // Caso 2: Es un string (ej: "25/03/2026")
    const fechaStr = String(fecha).trim();
    if (fechaStr.includes('/')) {
      const parts = fechaStr.split('/');
      if (parts.length === 3) {
        const [dia, mes, anio] = parts;
        return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }

    return null;
  }
};