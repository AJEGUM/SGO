import { curriculoService } from '../services/curriculo.js';

// Funcion que permite extraer la informacion del excel cargado por el administrador
export const importarDiseno = async (req, res) => {
    try {
        console.log("--- INICIO DE CARGA ---");
        if (!req.file) {
            console.error("Error: No se recibió archivo en req.file");
            return res.status(400).json({ msg: 'No se recibió ningún archivo válido.' });
        }

        console.log("Archivo recibido:", req.file.originalname, "Tamaño:", req.file.size);

        const resultado = await curriculoService.procesarExcel(req.file.buffer);

        console.log("Proceso completado con éxito para ficha:", resultado.ficha);
        res.status(201).json({ ok: true, ...resultado });
    } catch (error) {
        console.error("LOG SERVIDOR (Error Completo):", error);
        const statusCode = error.message.includes('ya existe') ? 400 : 500;
        res.status(statusCode).json({ 
            ok: false, 
            msg: error.message 
        });
    }
};

// Funcion que permite obtener las competencias registradas
export const getCompetencias = async (req, res) => {
    try {
        const { programaId } = req.params; // Extraemos el ID
        const data = await curriculoService.obtenerCompetencias(programaId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};

// En admin.controller.js
export const getProgramas = async (req, res) => {
    try {
        const data = await curriculoService.obtenerProgramas();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};

// Funcion que permite obtener toda la informacion de una competencia
export const getDetalleCurriculo = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await curriculoService.obtenerCurriculo(id);
        res.status(200).json(data);
    } catch (error) {
        const status = error.message === "La competencia no existe" ? 404 : 500;
        res.status(status).json({ ok: false, msg: error.message });
    }
};

// Funcion que permite actualizar los datos de una competencia
export const patchCurriculo = async (req, res) => {
    try {
        const { tipo, id } = req.params;
        const { valor } = req.body;

        const actualizado = await curriculoService.patchElemento(tipo, id, valor);
        
        if (actualizado) {
            res.json({ ok: true, msg: "Actualizado correctamente" });
        } else {
            res.status(404).json({ ok: false, msg: "No se encontró el registro" });
        }
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};