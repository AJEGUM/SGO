import { usuariosServices } from '../../services/admin/usersServices.js';

export const invitar = async (req, res) => {
  console.log("BODY RECIBIDO:", req.body);
  console.log("TIPO DE PROGRAMAS:", Array.isArray(req.body.programas));
  console.log("CONTENIDO DE PROGRAMAS:", JSON.stringify(req.body.programas));
  try {
    // req.body trae: { email, rol_id, programas: [1, 2...] }
    const resultado = await usuariosServices.procesarInvitacion(req.body);

    res.status(201).json({
      ok: true,
      msg: "Invitación enviada con éxito",
      data: resultado
    });
  } catch (error) {
    console.error("Error en invitar:", error);
    res.status(400).json({
      ok: false,
      msg: error.message || "Error al procesar la invitación"
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