import { curriculoService } from '../services/curriculo.js';

// Funcion que permite extraer la informacion del excel cargado por el administrador
export const importarDiseno = async (req, res) => {
    try {
        console.log("--- INICIO DE CARGA ---");
        if (!req.file) {
            return res.status(400).json({ msg: 'No se recibió ningún archivo válido.' });
        }

        // 1. EXTRAER LA INFO DEL MODAL
        // Como viene de un FormData, llega en req.body.info como string.
        let datosFicha = {};
        if (req.body.info) {
            try {
                datosFicha = JSON.parse(req.body.info);
                console.log("Datos de la ficha recibidos:", datosFicha);
            } catch (e) {
                console.error("Error parseando JSON de info:", e);
            }
        }

        console.log("Archivo recibido:", req.file.originalname);

        // 2. PASAR AMBOS PARÁMETROS AL SERVICIO
        // Ahora le pasamos el buffer Y los datos del objeto (ficha, fechas, etc)
        const resultado = await curriculoService.procesarExcel(req.file.buffer, datosFicha);

        console.log("Proceso completado con éxito");
        res.status(201).json({ ok: true, ...resultado });

    } catch (error) {
        console.error("LOG SERVIDOR (Error Completo):", error);
        res.status(500).json({ 
            ok: false, 
            msg: error.message 
        });
    }
};

// Funcion que permite obtener las competencias registradas
export const getCompetencias = async (req, res) => {
    try {
        const { programaId } = req.params;
        
        // LOG CRÍTICO: Verifica que no llegue un "undefined" o un string vacío
        console.log(`[SGO-DEBUG] Consultando competencias para programa_id: ${programaId}`);

        const data = await curriculoService.obtenerCompetencias(programaId);
        
        // Verifica si el servicio realmente retornó datos antes de enviarlos
        console.log(`[SGO-DEBUG] Competencias encontradas: ${data.length}`);

        res.status(200).json(data);
    } catch (error) {
        console.error("[SGO-ERROR] Error en getCompetencias:", error);
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
// En tu archivo de controladores (donde está getDetalleCurriculo)
export const getDetalleCurriculo = async (req, res) => {
    try {
        const id = parseInt(req.params.id); // <--- FUERZA EL ENTERO AQUÍ
        if (isNaN(id)) return res.status(400).json({ msg: "ID inválido" });

        const data = await curriculoService.obtenerCurriculo(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
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