export const validarTokenMiddleware = (req, res, next) => {
    const { token } = req.params;

    if (!token || token.length < 32) {
        return res.status(400).json({
            ok: false,
            msg: "El token de invitación es inválido o está mal formado."
        });
    }
    next();
};