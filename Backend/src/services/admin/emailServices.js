import { resend, EMAIL_CONFIG } from '../../config/resend.js';
import { getWelcomeTemplate } from '../../templates/email/templates.js';

// En tu archivo del emailService
export const emailService = {
  async enviarBienvenida(correo, nombre) {
    try {
      const htmlContent = getWelcomeTemplate(nombre);

      const { data, error } = await resend.emails.send({
        // CAMBIO AQUÍ: Usa tu configuración de solodeploy.com
        from: EMAIL_CONFIG.from, 
        to: [correo],
        subject: 'Registro Exitoso - Sistema SGO',
        html: htmlContent
      });

      if (error) {
        return console.error("[RESEND_ERROR]:", error);
      }

      console.log(`[EMAIL_SENT] Enviado a: ${correo} desde solodeploy.com`);
      
    } catch (error) {
      console.error("[EMAIL_SERVICE_ERROR]:", error.message);
    }
  }
};