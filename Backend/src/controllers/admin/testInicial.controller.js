import { IAService } from '../../services/admin/testInicialService.js';

export const postGenerarTestIA = async (req, res) => {
    try {
        const configAngular = req.body;
        
        // 1. Extraemos el ID del admin que el middleware 'protectAdmin' puso en req.user
        // Asegúrate de que en tu JWT el campo se llame 'id' (o como lo hayas nombrado al firmarlo)
        const adminId = req.user.id; 

        if (!adminId) {
            return res.status(401).json({ ok: false, message: "Usuario no identificado en el token" });
        }

        // 2. Inyectamos el ID real en la configuración que va al Service
        const dataParaIA = { ...configAngular, adminId };

        const resultado = await IAService.generarEvaluacionSENA(dataParaIA);

        res.status(201).json({
            ok: true,
            message: "Evaluación generada y guardada exitosamente",
            id: resultado.id,
            data: resultado.test
        });

    } catch (error) {
        console.error("❌ Error en Motor IA:", error);
        res.status(500).json({ ok: false, message: "Error al procesar con Gemini" });
    }
};

// Añadir esta función a tu archivo de controladores existente
export const postGuardarTestEditado = async (req, res) => {
    try {
        const { ficha_id, competencia_id, json_test, anotaciones } = req.body;
        const adminId = req.user.id; 

        if (!adminId) {
            return res.status(401).json({ ok: false, message: "Sesión no válida" });
        }

        const resultado = await IAService.guardarRevisionManual({
            fichaId: ficha_id,
            competenciaId: competencia_id,
            jsonTest: json_test,
            adminId,
            anotaciones
        });

        res.status(200).json({
            ok: true,
            message: resultado.message,
            id: resultado.id
        });

    } catch (error) {
        console.error("❌ Error al persistir evaluación:", error);
        res.status(500).json({ ok: false, message: "Error al guardar en base de datos" });
    }
};