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

    const competenciasRaw = parser.getColumnaDesde('competencia');

    // 2. Procesar y guardar cada competencia
    for (const compRaw of competenciasRaw) {
      // El formato suele ser "CÓDIGO - NOMBRE"
      // Ejemplo: "220501046 - DISEÑAR LA ESTRUCTURA DE DATOS..."
      let [codigo_norma, ...restoNombre] = compRaw.includes(' - ') 
        ? compRaw.split(' - ') 
        : [compRaw, 'COMPETENCIA SIN NOMBRE'];
      
      const nombreComp = Array.isArray(restoNombre) ? restoNombre.join(' - ') : restoNombre;

      // Persistencia de la competencia vinculada al programaId
      await programModel.upsertCompetencia({
        programa_id: programaId, // El ID que obtuviste arriba
        codigo_norma: codigo_norma.trim(),
        nombre: nombreComp.trim()
      });
    }

    const estructura = parser.getEstructuraCurricular();

    for (const item of estructura) {
      // 1. Procesar Competencia (Código - Nombre)
      let [c_codigo, ...c_nombrePartes] = item.competencia.includes(' - ') 
          ? item.competencia.split(' - ') 
          : [item.competencia, 'COMPETENCIA SIN NOMBRE'];
      
      const compId = await programModel.upsertCompetencia({
        programa_id: programaId,
        codigo_norma: c_codigo.trim(),
        nombre: c_nombrePartes.join(' - ').trim()
      });

      // 2. Procesar RAP (Código - Denominación)
      // Nota: El RAP suele venir como "590803 - APLICAR EN LA RESOLUCIÓN..."
      let [r_codigo, ...r_denominacionPartes] = item.rap.includes(' - ')
          ? item.rap.split(' - ')
          : [null, item.rap];

      await programModel.upsertRAP({
        competencia_id: compId,
        codigo_rap: r_codigo ? r_codigo.trim() : null,
        denominacion: r_denominacionPartes.join(' - ').trim()
      });
    }

    return { 
      ficha: dataSGO.ficha_caracterizacion, 
      competencias_procesadas: competenciasRaw.length,
      status: 'ok' 
    };
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
  },

  async obtenerProgramas() {
    return await programModel.listarProgramas();
  },

  async obtenerEstructuraPrograma(id) {
    const datos = await programModel.obtenerDetalleCompleto(id);
    if (!datos.length) return null;

    // Lógica para formatear el árbol del programa
    const programa = {
      id,
      nombre: datos[0].programa_nombre,
      codigo: datos[0].programa_codigo,
      nivel: datos[0].nivel_formacion,
      competencias: []
    };

    // Mapeo para evitar duplicados al agrupar
    const compsMap = {};

    datos.forEach(fila => {
      if (!fila.comp_id) return;
      
      if (!compsMap[fila.comp_id]) {
        compsMap[fila.comp_id] = {
          id: fila.comp_id,
          codigo: fila.codigo_norma,
          nombre: fila.comp_nombre,
          raps: {}
        };
        programa.competencias.push(compsMap[fila.comp_id]);
      }

      if (fila.rap_id) {
        if (!compsMap[fila.comp_id].raps[fila.rap_id]) {
          compsMap[fila.comp_id].raps[fila.rap_id] = {
            id: fila.rap_id,
            codigo: fila.codigo_rap,
            nombre: fila.rap_nombre,
            criterios: new Set(),
            saberes: new Set(),
            procesos: new Set()
          };
        }
        if (fila.criterio) compsMap[fila.comp_id].raps[fila.rap_id].criterios.add(fila.criterio);
        if (fila.saber) compsMap[fila.comp_id].raps[fila.rap_id].saberes.add(fila.saber);
        if (fila.proceso) compsMap[fila.comp_id].raps[fila.rap_id].procesos.add(fila.proceso);
      }
    });

    // Convertir Sets a Arrays para el JSON final
    programa.competencias.forEach(c => {
      c.raps = Object.values(c.raps).map(r => ({
        ...r,
        criterios: Array.from(r.criterios),
        saberes: Array.from(r.saberes),
        procesos: Array.from(r.procesos)
      }));
    });

    return programa;
  },

  async procesarActualizacionRap(rapId, payload) {
    if (!rapId) throw new Error("El ID del RAP es obligatorio");

    // Verificamos si los campos del payload son nulos o vacíos para determinar la acción
    const tieneContenido = payload.proceso?.trim() || payload.saber?.trim() || payload.criterio?.trim();

    if (!tieneContenido) {
        // Acción: Limpieza profunda (Nivel 4)
        await programModel.eliminarDetallesEspecificos(rapId);
        return { action: 'deleted' };
    }

    // Acción: Guardado/Upsert
    const datosLimpios = {
        proceso: payload.proceso?.trim() || '',
        saber: payload.saber?.trim() || '',
        criterio: payload.criterio?.trim() || ''
    };

    await programModel.guardarDetallesCurriculares(rapId, datosLimpios);
    return { action: 'updated' };
  }
};