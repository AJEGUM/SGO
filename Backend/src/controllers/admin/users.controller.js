import { usuariosServices } from '../../services/admin/usersServices.js';

export const registrar = async (req, res) => {
  try {
    // Solo llamamos al service y el service hace TODO
    const data = await usuariosServices.registrarUsuario(req.body);

    res.status(201).json({
      ok: true,
      msg: "Proceso completado con éxito",
      data
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: error.message || "Error en el registro"
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