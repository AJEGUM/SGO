export const getWelcomeTemplate = (nombre) => {
  const senaGreen = '#39A900';
  const senaOrange = '#FF6B00';

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 40px 10px;">
        <tr>
          <td align="center">
            
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 48px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
              
              <tr>
                <td style="background-color: ${senaGreen}; padding: 60px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 6px;">
                    SGO
                  </h1>
                  <p style="color: rgba(255,255,255,0.8); font-family: 'Segoe UI', sans-serif; font-size: 12px; margin-top: 8px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                    Sistema de Gestión de OVAs
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 50px 40px; font-family: 'Segoe UI', system-ui, sans-serif;">
                  <span style="color: ${senaGreen}; font-weight: 900; font-size: 10px; text-transform: uppercase; tracking: 2px; display: block; margin-bottom: 10px;">
                    Notificación de Acceso
                  </span>
                  
                  <h2 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 800; letter-spacing: -1px; line-height: 1.2;">
                    Hola, <span style="color: ${senaOrange};">${nombre}</span>
                  </h2>

                  <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-top: 25px;">
                    Es un gusto saludarte. Tu cuenta en el <strong>Sistema de Gestión de Objetos Virtuales de Aprendizaje (SGO)</strong> ha sido habilitada exitosamente por el equipo administrativo.
                  </p>
                  
                  <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 24px; padding: 25px; margin-top: 30px;">
                    <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">
                      Ya puedes ingresar para gestionar contenido educativo, competencias y componentes técnicos de manera centralizada.
                    </p>
                  </div>

                  <div style="text-align: center; margin-top: 40px;">
                    <a href="https://solodeploy.com/login" 
                       style="background-color: ${senaGreen}; color: #ffffff; padding: 20px 40px; border-radius: 24px; text-decoration: none; font-family: 'Segoe UI', sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(57, 169, 0, 0.2);">
                       Ingresar a SGO
                    </a>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="margin: 0; font-family: 'Segoe UI', sans-serif; font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                    © 2026 SENA Centro de Biotecnología Industrial
                  </p>
                  <p style="margin: 5px 0 0; font-family: 'Segoe UI', sans-serif; font-size: 10px; color: #cbd5e1;">
                    Plataforma institucional de gestión y desarrollo educativo.
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};