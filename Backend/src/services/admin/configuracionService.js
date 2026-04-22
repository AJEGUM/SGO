import { configuracionModel } from '../../models/admin/configuracionModel.js';
import { CONFIG_KEYS } from '../../constants/configKeys.js';

export const configuracionService = {
  async obtenerValor(clave) {
    const claveValida = Object.values(CONFIG_KEYS).includes(clave);
    if (!claveValida) throw new Error("Clave de configuración no permitida.");

    const registro = await configuracionModel.obtenerPorClave(clave);
    if (!registro) return null;

    // Opcional: Si la clave es de intentos, asegúrate de devolver un número
    if (clave === CONFIG_KEYS.IntentosTest) {
      return Number(registro.valor);
    }

    return registro.valor;
  },

  async guardarCambio(clave, valor, adminId) {
    // Validaciones específicas
    if (clave === CONFIG_KEYS.PROMPT_IA && String(valor).trim().length < 50) {
      throw new Error("El prompt es demasiado corto.");
    }
    
    // Ahora esta validación sí funcionará porque CONFIG_KEYS.IntentosTest es un string
    if (clave === CONFIG_KEYS.IntentosTest) {
      const n = Number(valor);
      if (n < 1 || n > 10) throw new Error("Los intentos deben estar entre 1 y 10.");
    }

    return await configuracionModel.guardarOActualizarConfig(clave, valor, adminId);
  }
};