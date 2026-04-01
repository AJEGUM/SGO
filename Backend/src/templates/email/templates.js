const senaGreen = '#39A900';
const senaOrange = '#FF6B00';

const layoutBase = (urlRegistro, badge, titulo, mensaje, pasos) => {
  // Eliminamos la construcción de urlRegistro de aquí, porque ya viene por parámetro
  return `
  <!DOCTYPE html>
  <html lang="es">
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 35px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="background-color: ${senaGreen}; padding: 45px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 5px;">SGO</h1>
                  <p style="color: rgba(255,255,255,0.9); font-size: 12px; margin-top: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    Sistema de Gestión de Objetos Virtuales de Aprendizaje
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 45px 40px;">
                  <span style="background: #ecfdf5; color: ${senaGreen}; padding: 6px 14px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; border: 1px solid #d1fae5;">
                    ${badge}
                  </span>
                  
                  <h2 style="color: #0f172a; font-size: 28px; font-weight: 800; margin: 25px 0 15px 0; letter-spacing: -1px;">
                    ¡Hola! Te damos la <span style="color: ${senaOrange};">Bienvenida</span>
                  </h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.7; margin-bottom: 25px;">
                    Has sido invitado(a) a participar en el <strong>SGO</strong>. Para habilitar tu cuenta y empezar a trabajar, es necesario que completes tu registro de seguridad.
                  </p>

                  <div style="background-color: #f8fafc; border-left: 5px solid ${senaGreen}; padding: 25px; margin: 30px 0; border-radius: 0 15px 15px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px; font-weight: 700;">Tu propósito como ${badge}:</h3>
                    <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                      ${mensaje}
                    </p>
                  </div>

                  <h4 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-bottom: 15px;">Para activar tu acceso:</h4>
                  <ul style="color: #64748b; font-size: 14px; line-height: 1.8; padding-left: 20px; margin-bottom: 35px;">
                    <li>Haz clic en el botón de abajo "Activar mi cuenta".</li>
                    <li>Define tu contraseña personal o usa el inicio de sesión con Google.</li>
                    ${pasos}
                  </ul>

                  <div style="text-align: center; margin-bottom: 20px;">
                    <a href="${urlRegistro}" 
                       style="background-color: ${senaGreen}; color: #ffffff; padding: 20px 40px; border-radius: 18px; text-decoration: none; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(57, 169, 0, 0.3);">
                       Activar mi cuenta ahora
                    </a>
                  </div>
                  <p style="text-align: center; color: #94a3b8; font-size: 11px;">Este enlace de invitación expirará en 24 horas.</p>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f8fafc; padding: 35px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">© 2026 Centro de Biotecnología Industrial - SENA</p>
                  <p style="margin: 5px 0 0; font-size: 10px; color: #cbd5e1;">Palmira, Valle del Cauca</p>
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

// Las plantillas reciben la URL (u) que viene del Service
export const plantillas = {
  1: (u) => layoutBase(
    u, 'ADMINISTRADOR', 'Gestión de Infraestructura', 
    'Como administrador, tu rol es fundamental para garantizar la operatividad del sistema. Eres el responsable de supervisar el flujo de trabajo y asegurar que cada usuario tenga las herramientas necesarias.',
    `<li>Gestionar altas y bajas de usuarios.</li>
     <li>Supervisar las estadísticas globales de los OVAs.</li>`
  ),
  2: (u) => layoutBase(
    u, 'INSTRUCTOR', 'Experto Temático', 
    'Tu experiencia técnica es el motor de los OVAs. Tu propósito es estructurar contenidos precisos que faciliten el aprendizaje de los aprendices en sus respectivas competencias.',
    `<li>Vincular programas de formación.</li>
     <li>Cargar los contenidos técnicos de tus competencias.</li>`
  ),
  3: (u) => layoutBase(
    u, 'PEDAGOGO', 'Asesoría Pedagógica', 
    'Eres el filtro de calidad educativa. Tu misión es asegurar que cada Objeto Virtual cumpla con los lineamientos pedagógicos institucionales.',
    `<li>Revisar y validar la estructura de los OVAs.</li>
     <li>Emitir conceptos técnicos de aprobación.</li>`
  ),
  4: (u) => layoutBase(
    u, 'DISEÑADOR', 'Diseño Web & Multimedia', 
    'Le das vida visual a la educación. Tu propósito es transformar los contenidos en experiencias visuales atractivas y accesibles.',
    `<li>Diseñar interfaces para los nuevos objetos.</li>
     <li>Optimizar la experiencia de usuario (UX).</li>`
  ),
  default: (u) => layoutBase(
    u, 'USUARIO', 'Acceso Habilitado', 
    'Bienvenido al SGO. Tu cuenta ha sido habilitada para que puedas participar en los procesos de gestión educativa del centro.',
    `<li>Explorar los módulos habilitados en tu perfil.</li>
     <li>Completar tu información personal en el sistema.</li>`
  )
};