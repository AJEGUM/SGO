import { invitacionModel } from '../../models/admin/invitacionModels.js';
import { emailTemplates } from '../../utils/emailPlantillas.js'; 
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export const invitacionService = {
  async crearYEnviarInvitacion(correo, rol_id) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 24);

    // Guardar en DB (El token servirá para validar la invitación al momento del login)
    await invitacionModel.guardarInvitacion({ correo, rol_id, token, expiracion });

    const urlAterrizaje = `${process.env.FRONTEND_URL}/login?invitation=true`;
    
    const templateConfig = emailTemplates.templates[rol_id] || emailTemplates.templates[1];
    const htmlContent = emailTemplates.getHtml(rol_id, urlAterrizaje);

    const { data, error } = await resend.emails.send({
      from: 'SGO SENA <soporte@solodeploy.com>', // Excelente dominio para un DevOps
      to: correo,
      subject: templateConfig.subject,
      html: htmlContent
    });

    if (error) throw new Error("Error Resend: " + error.message);

    return { correo, rol: rol_id, enviado: true };
  },

  async listarRoles() {
    return await invitacionModel.getTodosLosRoles();
  }
};