const senaGreen = '#39A900';
const senaBlack = '#323232';

export const emailTemplates = {
  // 1: Aprendiz, 2: Instructor, 3: Experto, etc. (Ajusta según tus IDs de la DB)
  templates: {
    1: { // Aprendiz
      subject: '¡Bienvenido Aprendiz al Sistema SGO!',
      title: 'Hola Aprendiz,',
      body: 'Has sido invitado a la plataforma para gestionar tus actividades y objetos de aprendizaje.'
    },
    2: { // Instructor
      subject: 'Acceso Instructor - Plataforma SGO',
      title: 'Estimado Instructor,',
      body: 'Se le ha otorgado acceso para gestionar fichas, programas y evaluaciones de aprendices.'
    },
    3: { // Experto Temático
      subject: 'Invitación Colaborador: Experto Temático',
      title: 'Cordial saludo,',
      body: 'Requerimos su acceso para la validación técnica de los contenidos en SGO.'
    },
    4: { // Coordinador Académico
      subject: 'Control Académico SGO - Invitación',
      title: 'Respetado Coordinador,',
      body: 'Tiene disponible el acceso para la supervisión y reporte de centros de formación.'
    },
    5: { // Admin
      subject: 'ALERTA: Nuevo Acceso Administrativo SGO',
      title: 'Administrador,',
      body: 'Se ha generado un nuevo acceso con privilegios totales sobre el sistema.'
    },
    6: { // Rector
      subject: 'Acceso Institucional SGO',
      title: 'Señor Rector,',
      body: 'Invitación formal para el seguimiento de métricas institucionales del SENA.'
    }
  },

  getHtml(rol_id, url) {
    const config = this.templates[rol_id] || this.templates[1]; // Por defecto aprendiz
    
    return `
      <div style="font-family: 'Poppins', sans-serif; border-top: 6px solid ${senaGreen}; padding: 30px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
        <h2 style="color: ${senaBlack};">${config.title}</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">${config.body}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: ${senaGreen}; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            Activar mi Cuenta SGO
          </a>
        </div>
        <p style="font-size: 0.85rem; color: #888; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
          Esta invitación es personal e intransferible y expira en 24 horas.<br>
          <strong>SGO - SENA Palmira</strong>
        </p>
      </div>
    `;
  }
};