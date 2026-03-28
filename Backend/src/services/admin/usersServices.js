import { authModel } from '../../models/admin/usersModel.js';
import bcrypt from 'bcrypt';

export const usuariosServices = {
  async registrarUsuario(datos) {
    // 1. Validar si ya existe
    const existe = await authModel.buscarPorEmail(datos.email);
    if (existe) throw new Error("El correo ya está registrado");

    // 2. Hashear password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(datos.password, salt);

    // 3. Preparar datos para el modelo
    const userData = {
      nombre: datos.nombre,
      correo: datos.email,
      password: hashedPassword,
      rol_id: datos.rol_id,
      programa_id: datos.programa_id
    };

    // 4. Si es instructor, buscamos las competencias de ese programa para asignarlas
    let competenciasIds = [];
    if (datos.rol_id === 2 && datos.programa_id) {
      const competencias = await authModel.obtenerCompetenciasPorPrograma(datos.programa_id);
      competenciasIds = competencias.map(c => c.id);
    }

    // 5. Mandar a guardar
    return await authModel.crearUsuarioCompleto(userData, competenciasIds);
  },

  async listarRoles() {
    return await authModel.obtenerRoles();
  },
};