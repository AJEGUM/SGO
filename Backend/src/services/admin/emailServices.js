import { resend, EMAIL_CONFIG } from '../../config/resend.js';
import { plantillas } from '../../templates/email/templates.js';

// Este está perfecto, recibe la URL ya lista y se la entrega a la plantilla
export const emailService = {
  async enviarInvitacion(correo, urlRegistro, rol_id) {
    try {
      const generador = plantillas[rol_id] || plantillas.default;
      
      // Aquí 'urlRegistro' ya es el link completo: http://.../registro?token=xyz
      const htmlContent = generador(urlRegistro); 

      await resend.emails.send({
        from: EMAIL_CONFIG.from, 
        to: [correo],
        subject: '🚀 Invitación de Acceso - Sistema SGO',
        html: htmlContent
      });
      console.log(`[EMAIL_SENT] Enviado a: ${correo}`);
    } catch (error) {
      console.error("[EMAIL_SERVICE_ERROR]:", error.message);
    }
  }
};