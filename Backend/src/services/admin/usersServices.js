import { authModel } from '../../models/admin/usersModel.js';
import { emailService } from './emailServices.js';
import bcrypt from 'bcrypt';

export const usuariosServices = {
  async registrarUsuario(datos) {
    // 1. Validaciones de existencia
    const existe = await authModel.buscarPorEmail(datos.email);
    if (existe) throw new Error("El correo ya está registrado");

    // 2. Preparación de seguridad
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(datos.password, salt);

    // 3. Limpieza de tipos de datos
    const rolIdNum = Number(datos.rol_id);
    const programaIdNum = (datos.programa_id && datos.programa_id !== 'null') ? Number(datos.programa_id) : null;

    const userData = {
      nombre: datos.nombre,
      correo: datos.email,
      password: hashedPassword,
      rol_id: rolIdNum,
      programa_id: programaIdNum
    };

    // 4. Persistencia en DB (Usuario + Vínculo a Programa)
    // El modelo se encargará de insertar en 'usuarios' y luego en 'asignaciones_programas'
    const nuevoUsuario = await authModel.crearUsuarioCompleto(userData);

    // 5. Notificación por Email
    try {
      await emailService.enviarBienvenida(userData.correo, userData.nombre, rolIdNum);
      console.log(`[MAIL SUCCESS]: Notificación enviada a ${userData.correo}`);
    } catch (mailError) {
      console.error("[MAIL ERROR]: Registro exitoso, pero falló el envío del correo:", mailError);
    }

    return { 
      id: nuevoUsuario.id, 
      nombre: userData.nombre, 
      rol_id: rolIdNum 
    };
  },

  async listarRoles() {
    return await authModel.obtenerRoles();
  },

  async listarUsuarios() {
    return await authModel.obtenerTodosUsusarios();
  }
};