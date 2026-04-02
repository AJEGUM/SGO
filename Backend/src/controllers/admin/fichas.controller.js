import { fichasService } from '../../services/admin/fichasService.js';

export const crearFicha = async (req, res) => {
    try {
        const { numero_ficha, programa_id, fecha_inicio, fecha_fin } = req.body;
        const id = await fichasService.nuevaFicha(numero_ficha, programa_id, fecha_inicio, fecha_fin);
        res.status(201).json({ ok: true, msg: "Ficha creada con éxito", id });
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};

export const getFichas = async (req, res) => {
    try {
        const fichas = await fichasService.listarTodas();
        res.json(fichas);
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};

export const getFichasPorPrograma = async (req, res) => {
    try {
        const { programaId } = req.params;
        const fichas = await fichasService.listarPorPrograma(programaId);
        res.json(fichas);
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};