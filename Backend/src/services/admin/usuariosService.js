import { usuarioModel } from '../../models/admin/usuariosModels.js';

export const usuarioService = {
  async listarUsuarios() {
    return await usuarioModel.obtenerTodos();
  },

  async alternarEstadoUsuario(id, estadoActual) {
    const nuevoEstado = !estadoActual;
    return await usuarioModel.cambiarEstado(id, nuevoEstado);
  },

  async actualizarEstadoDirecto(id, nuevoEstado) {
    return await usuarioModel.cambiarEstado(id, nuevoEstado);
  }
};