import { usuariosServices } from '../../services/admin/usersServices.js';
import { emailService } from '../../services/admin/emailServices.js';

export const registrar = async (req, res) => {
  try {
    console.log("--- Inicio de Registro ---");
    console.log("Body recibido:", req.body);

    const usuario = await usuariosServices.registrarUsuario(req.body);
    
    console.log("Usuario creado en DB:", usuario);

    // OJO AQUÍ: Verifica si tu objeto usa 'email' o 'correo'
    const destinatario = usuario.correo || usuario.email; 
    emailService.enviarBienvenida(destinatario, usuario.nombre);

    res.status(201).json({
      ok: true,
      msg: "Usuario creado y asignaciones procesadas",
      data: { id: usuario.id, nombre: usuario.nombre }
    });
  } catch (error) {
    // ESTO ES VITAL: Ver el error real en la consola de VS Code/Terminal
    console.error("!!! ERROR EN CONTROLLER:", error); 
    
    res.status(400).json({
      ok: false,
      msg: error.message || "Error interno en el servidor"
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

export const obtenerUsuarios = async (req, res) => {
    try {
        const data = await usuariosServices.listarUsuarios();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error en getUsuarios:", error);
        res.status(500).json({ ok: false, msg: "Error al obtener usuarios" });
    }
};