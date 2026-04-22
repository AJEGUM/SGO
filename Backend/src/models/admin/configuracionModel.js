import db from '../../config/dbConfig.js';

export const configuracionModel = {
  async obtenerPorClave(clave) {
    const sql = `SELECT valor FROM configuracion_sistema WHERE clave = ?`;
    const [filas] = await db.execute(sql, [clave]);
    return filas[0] || null;
  },

  async guardarOActualizarConfig(clave, valor, adminId) {
    const sql = `
      INSERT INTO configuracion_sistema (clave, valor, ultima_edicion_por)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        valor = VALUES(valor),
        ultima_edicion_por = VALUES(ultima_edicion_por),
        updated_at = CURRENT_TIMESTAMP
    `;
    // Convertimos a String para la DB si el valor es numérico u objeto
    const valorString = typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
    
    const [resultado] = await db.execute(sql, [clave, valorString, adminId]);
    return resultado;
  }
};