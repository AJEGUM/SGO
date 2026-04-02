SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS sgo;
USE sgo;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
) ENGINE=InnoDB;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    activo BOOLEAN DEFAULT FALSE, 
    google_id VARCHAR(255) UNIQUE,
    estado_validacion ENUM('pendiente', 'activo', 'rechazado') DEFAULT 'pendiente',
    motivo_rechazo TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE invitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) UNIQUE NOT NULL,
    rol_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiracion DATETIME NOT NULL,
    usada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_rol_fk FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE programas (
    programa_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20), 
    nombre VARCHAR(255), 
    version VARCHAR(10), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(codigo, version) 
) ENGINE=InnoDB;

CREATE TABLE invitaciones_programas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invitacion_id INT NOT NULL,
    programa_id INT NOT NULL,
    CONSTRAINT fk_ip_inv FOREIGN KEY (invitacion_id) REFERENCES invitaciones(id) ON DELETE CASCADE,
    CONSTRAINT fk_ip_prog FOREIGN KEY (programa_id) REFERENCES programas(programa_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE competencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    programa_id INT NOT NULL, 
    codigo_norma VARCHAR(50), 
    prefijo_id VARCHAR(20),   
    nombre TEXT,              
    duracion_horas INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(codigo_norma, programa_id),
    CONSTRAINT fk_comp_programa FOREIGN KEY (programa_id) REFERENCES programas(programa_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE resultados_aprendizaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    competencia_id INT NOT NULL, 
    codigo_rap VARCHAR(10),      
    denominacion TEXT,           
    UNIQUE(competencia_id, codigo_rap),
    CONSTRAINT fk_comp_rap FOREIGN KEY (competencia_id) REFERENCES competencias(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE fases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(2) UNIQUE NOT NULL,
    nombre_fase VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE asignaciones_programas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    programa_id INT NOT NULL,
    fecha_vinculacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ap_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_ap_programa FOREIGN KEY (programa_id) REFERENCES programas(programa_id) ON DELETE CASCADE,
    UNIQUE(usuario_id, programa_id)
) ENGINE=InnoDB;

CREATE TABLE asignaciones_competencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_programa_id INT NOT NULL,
    competencia_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ac_vinculo FOREIGN KEY (asignacion_programa_id) REFERENCES asignaciones_programas(id) ON DELETE CASCADE,
    CONSTRAINT fk_ac_competencia FOREIGN KEY (competencia_id) REFERENCES competencias(id) ON DELETE CASCADE,
    UNIQUE(asignacion_programa_id, competencia_id)
) ENGINE=InnoDB;

CREATE TABLE asignaciones_raps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_competencia_id INT NOT NULL,
    rap_id INT NOT NULL,
    fase_id INT NOT NULL,
    fecha_eleccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ar_vinculo FOREIGN KEY (asignacion_competencia_id) REFERENCES asignaciones_programas(id) ON DELETE CASCADE,
    CONSTRAINT fk_ar_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE,
    CONSTRAINT fk_ar_fase FOREIGN KEY (fase_id) REFERENCES fases(id) ON DELETE RESTRICT,
    UNIQUE(asignacion_competencia_id, rap_id) 
) ENGINE=InnoDB;

CREATE TABLE fichas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ficha VARCHAR(10) UNIQUE, 
    programa_id INT NOT NULL, 
    fecha_inicio DATE,
    fecha_fin DATE,
    codigo_invitacion VARCHAR(20) UNIQUE,
    fecha_limite_registro DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ficha_programa FOREIGN KEY (programa_id) REFERENCES programas(programa_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE usuario_fichas (
    usuario_id INT NOT NULL,
    ficha_id INT NOT NULL,
    fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_aprendiz ENUM('Formación','Retirado', 'Certificado') DEFAULT 'Formación',
    PRIMARY KEY (usuario_id, ficha_id),
    CONSTRAINT fk_uf_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_uf_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE conocimientos_proceso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT, 
    CONSTRAINT fk_proc_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE conocimientos_saber (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT, 
    CONSTRAINT fk_saber_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE criterios_evaluacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT, 
    CONSTRAINT fk_crit_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ciclos_didacticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_creador_id INT NOT NULL, 
    id_secuencial VARCHAR(10), -- Ej: CD-001
    codigo_anatomia VARCHAR(100) UNIQUE,
    titulo VARCHAR(255),
    descripcion_general TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cd_creador FOREIGN KEY (usuario_creador_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE ciclo_raps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ciclo_id INT NOT NULL,
    asignacion_rap_id INT NOT NULL,
    CONSTRAINT fk_cr_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclos_didacticos(id) ON DELETE CASCADE,
    CONSTRAINT fk_cr_rap FOREIGN KEY (asignacion_rap_id) REFERENCES asignaciones_raps(id) ON DELETE CASCADE,
    UNIQUE(ciclo_id, asignacion_rap_id)
) ENGINE=InnoDB;

CREATE TABLE ciclo_secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ciclo_id INT NOT NULL,
    tipo_seccion ENUM('Reflexion', 'Contextualizacion', 'Apropiacion', 'Transferencia') NOT NULL,
    titulo VARCHAR(255),
    contenido_html TEXT, 
    url_recurso_apoyo TEXT, 
    orden INT DEFAULT 1,
    CONSTRAINT fk_seccion_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclos_didacticos(id) ON DELETE CASCADE,
    UNIQUE KEY uk_ciclo_momento (ciclo_id, tipo_seccion)
) ENGINE=InnoDB;

CREATE TABLE examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seccion_id INT NOT NULL, 
    nombre_examen VARCHAR(255),
    descripcion TEXT,
    ponderacion INT DEFAULT 100,
    intentos_permitidos INT DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_examen_seccion FOREIGN KEY (seccion_id) REFERENCES ciclo_secciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    examen_id INT NOT NULL,
    enunciado TEXT NOT NULL,
    puntos INT DEFAULT 1,
    CONSTRAINT fk_pregunta_examen FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE opciones_respuesta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta_id INT NOT NULL,
    texto_opcion TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_opcion_pregunta FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE seguimiento_ciclos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ciclo_id INT NOT NULL,
    fase_actual ENUM('Reflexion', 'Contextualizacion', 'Apropiacion', 'Transferencia') DEFAULT 'Reflexion',
    estado ENUM('no_iniciado', 'en_progreso', 'completado') DEFAULT 'no_iniciado',
    fecha_ultimo_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_seg_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_seg_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclos_didacticos(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, ciclo_id)
) ENGINE=InnoDB;

CREATE TABLE intentos_examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    examen_id INT NOT NULL,
    puntaje_obtenido DECIMAL(5,2),
    fecha_intento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_intento_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_intento_examen FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO roles (nombre_rol, descripcion) VALUES 
('ADMIN', 'Administrador total del sistema (Control de usuarios y configuración)'),
('COORDINADOR', 'Supervisión académica y gestión de procesos del centro'),
('INSTRUCTOR', 'Gestor de contenidos, diseño curricular y fichas'),
('PEDAGOGO', 'Responsable de la validación pedagógica de los objetos de aprendizaje'),
('DISENADOR WEB', 'Responsable de la interfaz gráfica y experiencia de usuario de los OVAs'),
('APRENDIZ', 'Usuario final para consulta y consumo de OVAs');

INSERT INTO fases (sigla, nombre_fase) VALUES 
('AN', 'Análisis'),
('PL', 'Planeación'),
('EJ', 'Ejecución'),
('EV', 'Evaluación');

CREATE TABLE plantillas_prompts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plantilla VARCHAR(100) DEFAULT 'Estándar SENA',
    prompt_maestro TEXT NOT NULL,
    creado_por_admin_id INT NOT NULL,
    CONSTRAINT fk_plantilla_admin FOREIGN KEY (creado_por_admin_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE evaluaciones_diagnosticas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plantilla_id INT NOT NULL,
    ficha_id INT NOT NULL,
    competencia_id INT NOT NULL,
    admin_id INT NOT NULL,
    anotaciones_especificas TEXT,
    json_test JSON NOT NULL,
    activo BOOLEAN DEFAULT FALSE,
    fecha_lanzamiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_diag_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE,
    CONSTRAINT fk_diag_comp FOREIGN KEY (competencia_id) REFERENCES competencias(id),
    CONSTRAINT fk_diag_admin FOREIGN KEY (admin_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE resultados_diagnosticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    evaluacion_id INT NOT NULL,
    respuestas_usuario JSON,
    puntaje DECIMAL(5,2),
    nivel_detectado ENUM('Bajo', 'Medio', 'Alto'),
    fecha_presentacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_res_user FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_res_eval FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones_diagnosticas(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, evaluacion_id)
) ENGINE=InnoDB;