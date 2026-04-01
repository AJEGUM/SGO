import { OAuth2Client } from 'google-auth-library';

// Cargamos el ID desde el entorno (asegúrate que dotenv esté en tu app.js)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const verificarGoogleToken = async (token) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    return payload; 
  } catch (error) {
    console.error('Error en la validación de Google:', error);
    return null;
  }
};