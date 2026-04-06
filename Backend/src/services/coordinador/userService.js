import { CoordinadorModel } from '../../models/coordinador/usuariosModel.js';

export const CoordinadorService = {
    async obtenerExpertosAcademicos() {
        const expertos = await CoordinadorModel.listarExpertosAcademicos();

        return expertos.map(experto => {
            let disponibilidad = 'Disponible';
            let color_alerta = 'emerald'; // Clase base para Tailwind

            // Determinamos el estado según la cantidad de RAPs asignados
            if (experto.carga_raps > 10 && experto.carga_raps <= 20) {
                disponibilidad = 'Carga Media';
                color_alerta = 'amber';
            } else if (experto.carga_raps > 20) {
                disponibilidad = 'Carga Alta / Ocupado';
                color_alerta = 'red';
            }

            return {
                ...experto,
                disponibilidad,
                color_alerta,
                // Cálculo de porcentaje para barras de progreso en el Frontend
                // Usamos 25 RAPs como tope teórico de carga máxima
                porcentaje_carga: Math.min(Math.round((experto.carga_raps / 25) * 100), 100)
            };
        });
    }
};