import { resend, EMAIL_CONFIG } from '../../config/resend.js';
import { plantillas } from '../../templates/email/templates.js';

export const emailService = {
  async enviarBienvenida(correo, nombre, rol_id) {
    try {
      // 1. Seleccionamos la función según el rol (1, 2, 3 o 4)
      // Si el rol_id no coincide, usa la plantilla 'default'
      const generador = plantillas[rol_id] || plantillas.default;
      
      const htmlContent = generador(nombre);

      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from, 
        to: [correo],
        subject: '🚀 Acceso Habilitado - Sistema SGO',
        html: htmlContent
      });

      if (error) {
        return console.error("[RESEND_ERROR]:", error);
      }

      console.log(`[EMAIL_SENT] Plantilla Rol ${rol_id} enviada a: ${correo}`);
      
    } catch (error) {
      console.error("[EMAIL_SERVICE_ERROR]:", error.message);
    }
  }
};