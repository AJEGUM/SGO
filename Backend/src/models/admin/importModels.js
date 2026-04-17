import db from '../../config/dbConfig.js';

export const programModel = {
  async upsertCentro(data) {
    const query = `
      INSERT INTO centros_formacion (codigo_centro, nombre_centro, regional)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        id = LAST_INSERT_ID(id), 
        nombre_centro = VALUES(nombre_centro), 
        regional = VALUES(regional)`;
    const [result] = await db.execute(query, [data.codigo, data.nombre, data.regional]);
    return result.insertId;
  },

  async upsertPrograma(data) {
    const query = `
      INSERT INTO programas (codigo, nombre, denominacion, version, nivel_formacion)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        programa_id = LAST_INSERT_ID(programa_id),
        denominacion = VALUES(denominacion)`;
    const [result] = await db.execute(query, [data.codigo, data.nombre, data.denominacion, data.version, data.nivel]);
    return result.insertId;
  },

  async crearFicha(data) {
    const query = `
      INSERT INTO fichas (
        codigo_ficha, ficha_caracterizacion, programa_id, centro_id, 
        fecha_inicio, fecha_fin, modalidad, estado_caracterizacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE estado_caracterizacion = VALUES(estado_caracterizacion)`;
    await db.execute(query, [
      data.codigo_interno, data.ficha_caracterizacion, data.programa_id, 
      data.centro_id, data.fecha_inicio, data.fecha_fin, 
      data.modalidad, data.estado_caracterizacion
    ]);
  }
};