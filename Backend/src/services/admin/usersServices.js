import { authModel } from '../../models/admin/usersModel.js';
import { curriculoModel } from '../../models/admin/curriculoModel.js';
import bcrypt from 'bcrypt';

export const usuariosServices = {
  async registrarUsuario(datos) {
    const existe = await authModel.buscarPorEmail(datos.email);
    if (existe) throw new Error("El correo ya está registrado");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(datos.password, salt);

    // --- CORRECCIÓN AQUÍ ---
    // Si datos.programa_id es "null" (string) o undefined, lo dejamos en null
    const rawProgramaId = datos.programa_id;
    const programaIdNum = (rawProgramaId && rawProgramaId !== 'null') ? Number(rawProgramaId) : null;
    const rolIdNum = Number(datos.rol_id);

    const userData = {
      nombre: datos.nombre,
      correo: datos.email,
      password: hashedPassword,
      rol_id: rolIdNum,
      programa_id: programaIdNum // Ahora será un número real o null, nunca NaN
    };

    let competenciasIds = [];
    
    // Solo buscamos si el rol es Instructor (2) Y el programa es válido
    if (rolIdNum === 2 && !isNaN(programaIdNum) && programaIdNum !== null) {
      console.log(`[DEBUG]: Buscando competencias para programa ID: ${programaIdNum}`);
      
      const competencias = await curriculoModel.listarProgramas(programaIdNum);
      
      if (competencias && competencias.length > 0) {
        competenciasIds = competencias.map(c => c.id);
        console.log(`[DEBUG]: Se encontraron ${competenciasIds.length} competencias.`);
      }
    }

    return await authModel.crearUsuarioCompleto(userData, competenciasIds);
  },

  async listarRoles() {
    return await authModel.obtenerRoles();
  },

  async listarUsuarios() {
    return await authModel.obtenerTodosUsusarios();
  }
};