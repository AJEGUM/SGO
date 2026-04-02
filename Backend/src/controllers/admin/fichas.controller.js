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

export const checkEvaluacion = async (req, res) => {
    try {
        const { fichaId, competenciaId } = req.query;
        
        if (!fichaId || !competenciaId) {
            return res.status(400).json({ ok: false, msg: 'Faltan parámetros: fichaId y competenciaId' });
        }
        
        const evaluacion = await fichasService.validarTest(fichaId, competenciaId);
        
        res.json({ 
            existe: !!evaluacion, 
            detalles: evaluacion 
        });
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};