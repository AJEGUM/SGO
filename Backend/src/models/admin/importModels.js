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
  },

  async upsertCompetencia({ programa_id, codigo_norma, nombre }) {
    // Buscamos si ya existe esa competencia para ese programa
    const [existente] = await db.execute(
      'SELECT id FROM competencias WHERE programa_id = ? AND codigo_norma = ?',
      [programa_id, codigo_norma]
    );

    if (existente.length > 0) return existente[0].id;

    // Si no existe, la creamos
    const [resultado] = await db.execute(
      'INSERT INTO competencias (programa_id, codigo_norma, nombre) VALUES (?, ?, ?)',
      [programa_id, codigo_norma, nombre]
    );
    return resultado.insertId;
  },

  async upsertRAP({ competencia_id, codigo_rap, denominacion }) {
    // Verificar si existe el RAP en esa competencia
    const [existente] = await db.execute(
      'SELECT id FROM resultados_aprendizaje WHERE competencia_id = ? AND (codigo_rap = ? OR denominacion = ?)',
      [competencia_id, codigo_rap, denominacion]
    );

    if (existente.length > 0) return existente[0].id;

    // Insertar si no existe
    const [resultado] = await db.execute(
      'INSERT INTO resultados_aprendizaje (competencia_id, codigo_rap, denominacion) VALUES (?, ?, ?)',
      [competencia_id, codigo_rap, denominacion]
    );
    
    return resultado.insertId;
  },

  async listarProgramas() {
    const consulta = `SELECT * FROM programas ORDER BY nombre ASC`;
    const [filas] = await db.execute(consulta);
    return filas;
  },

  async obtenerDetalleCompleto(programaId) {
    const consulta = `
      SELECT 
        p.nombre AS programa_nombre, p.codigo AS programa_codigo, p.nivel_formacion,
        c.id AS comp_id, c.codigo_norma, c.nombre AS comp_nombre,
        r.id AS rap_id, r.codigo_rap, r.denominacion AS rap_nombre,
        ce.descripcion AS criterio,
        cs.descripcion AS saber,
        cp.descripcion AS proceso
      FROM programas p
      LEFT JOIN competencias c ON p.programa_id = c.programa_id
      LEFT JOIN resultados_aprendizaje r ON c.id = r.competencia_id
      LEFT JOIN criterios_evaluacion ce ON r.id = ce.rap_id
      LEFT JOIN conocimientos_saber cs ON r.id = cs.rap_id
      LEFT JOIN conocimientos_proceso cp ON r.id = cp.rap_id
      WHERE p.programa_id = ?
    `;
    const [filas] = await db.execute(consulta, [programaId]);
    return filas;
  }
};