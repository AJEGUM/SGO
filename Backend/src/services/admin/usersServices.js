import crypto from 'crypto';
import { authModel } from '../../models/admin/usersModel.js';
import { emailService } from './emailServices.js';

export const usuariosServices = {
  async procesarInvitacion(datos) {
    // 1. Validar si el usuario ya existe en la tabla de usuarios activos
    const usuarioExistente = await authModel.buscarPorEmail(datos.email);
    if (usuarioExistente) throw new Error("El correo ya está registrado como usuario activo");

    // 2. Generar Token y Expiración (24 horas)
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 24);

    const invitacionData = {
      correo: datos.email,
      rol_id: Number(datos.rol_id),
      token,
      expiracion,
      programas: datos.programas || [] // Array de IDs de programas
    };

    // 3. Guardar en DB (Invitación + Programas vinculados)
    await authModel.guardarInvitacionCompleta(invitacionData);

    // 4. Disparar Correo
    const urlRegistro = `${process.env.FRONTEND_URL}/completar-registro?token=${token}`;
    
    // Aquí puedes usar tu servicio de Resend que ya tienes
    await emailService.enviarInvitacion(invitacionData.correo, urlRegistro, invitacionData.rol_id);

    return { correo: datos.email, token }; // Retornamos para loggear o debug
  },

  async listarRoles() {
    return await authModel.obtenerRoles();
  },

  async listarUsuarios() {
    return await authModel.obtenerTodosUsusarios();
  }
};