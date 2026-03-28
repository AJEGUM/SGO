import { usuariosServices } from '../../services/admin/usersServices.js';
import { emailService } from '../../services/admin/emailServices.js';

export const registrar = async (req, res) => {
  try {
    // Llamamos al servicio de lógica
    const usuario = await usuariosServices.registrarUsuario(req.body);

    // Disparamos el email (sin await para no bloquear la respuesta)
    emailService.enviarBienvenida(usuario.correo, usuario.nombre);

    res.status(201).json({
      ok: true,
      msg: "Usuario creado y competencias asignadas correctamente",
      data: { id: usuario.id, nombre: usuario.nombre }
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: error.message
    });
  }
};

export const obtenerRoles = async (req, res) => {
    try {
        const roles = await usuariosServices.listarRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener roles' });
    }
};