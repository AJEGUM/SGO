import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RESEND_API_KEY) {
  console.error('[CONFIG-ERROR] Falta RESEND_API_KEY en las variables de entorno.');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: 'SGO <soporte@solodeploy.com>',
  reply_to: 'no-reply@tu-dominio.com'
};