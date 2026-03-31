CREATE DATABASE IF NOT EXISTS sgo;
USE sgo;

-- 1. SEGURIDAD Y ACCESO
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
    -- 'activo' será FALSE por defecto hasta que el Admin lo habilite
    activo BOOLEAN DEFAULT FALSE, 
    google_id VARCHAR(255) UNIQUE,
    -- Añadimos esto para manejar el rechazo si es necesario
    estado_validacion ENUM('pendiente', 'activo', 'rechazado') DEFAULT 'pendiente',
    motivo_rechazo TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 2. ESTRUCTURA CURRICULAR (DEFINICIÓN)
CREATE TABLE programas (
    programa_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20), 
    nombre VARCHAR(255), 
    version VARCHAR(10), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(codigo, version) 
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

-- 3. GESTIÓN ACADÉMICA (INSTANCIAS)
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

CREATE TABLE fases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(2) UNIQUE NOT NULL,
    nombre_fase VARCHAR(20)
) ENGINE=InnoDB;

-- 4. CONTENIDO TÉCNICO (ESTRUCTURACIÓN)
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

-- 5. OBJETOS VIRTUALES
CREATE TABLE ovas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_rap_id INT NOT NULL, -- Ahora apunta a la asignación (que ya tiene RAP y Fase)
    usuario_creador_id INT NOT NULL, 
    id_secuencial VARCHAR(10), -- Ejemplo: '01', '02'
    codigo_anatomia VARCHAR(100) UNIQUE,
    titulo_ova TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ova_asignacion_rap FOREIGN KEY (asignacion_rap_id) REFERENCES asignaciones_raps(id) ON DELETE CASCADE,
    CONSTRAINT fk_ova_creador FOREIGN KEY (usuario_creador_id) REFERENCES usuarios(id),
    -- Ahora la llave única tiene sentido: No repetir secuencia para una misma asignación
    UNIQUE KEY uk_ova_secuencia (asignacion_rap_id, id_secuencial)
) ENGINE=InnoDB;

-- 6. ASIGNACIONES JERÁRQUICAS (CORREGIDO)

-- Paso 1: Vinculamos al Instructor con el Programa
CREATE TABLE asignaciones_programas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    programa_id INT NOT NULL,
    fecha_vinculacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ap_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_ap_programa FOREIGN KEY (programa_id) REFERENCES programas(programa_id) ON DELETE CASCADE,
    UNIQUE(usuario_id, programa_id)
) ENGINE=InnoDB;

-- Paso 2: Basado en el programa asignado, vinculamos las competencias
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
    fase_id INT NOT NULL, -- <--- Nueva columna: Define el momento pedagógico
    fecha_eleccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Relaciones
    CONSTRAINT fk_ar_vinculo FOREIGN KEY (asignacion_competencia_id) REFERENCES asignaciones_competencias(id) ON DELETE CASCADE,
    CONSTRAINT fk_ar_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE,
    CONSTRAINT fk_ar_fase FOREIGN KEY (fase_id) REFERENCES fases(id) ON DELETE RESTRICT,
    -- Un RAP solo puede ser elegido por UN instructor para evitar duplicidad de esfuerzos
    UNIQUE(rap_id) 
) ENGINE=InnoDB;

-- Asignación de aprendices a fichas
CREATE TABLE usuario_fichas (
    usuario_id INT NOT NULL,
    ficha_id INT NOT NULL,
    fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_aprendiz ENUM('Formación','Retirado', 'Certificado') DEFAULT 'Formación',
    PRIMARY KEY (usuario_id, ficha_id),
    CONSTRAINT fk_uf_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_uf_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ova_secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ova_id INT NOT NULL,
    tipo_seccion ENUM('Reflexion', 'Contextualizacion', 'Apropiacion', 'Transferencia') NOT NULL,
    titulo VARCHAR(255),
    contenido_html TEXT, 
    url_recurso_apoyo TEXT, -- Para archivos en R2 o Hostinger
    orden INT DEFAULT 1,
    CONSTRAINT fk_seccion_ova FOREIGN KEY (ova_id) REFERENCES ovas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE examenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seccion_id INT NOT NULL, 
    nombre_examen VARCHAR(255),
    descripcion TEXT,
    ponderacion INT DEFAULT 100,
    intentos_permitidos INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_examen_seccion FOREIGN KEY (seccion_id) REFERENCES ova_secciones(id) ON DELETE CASCADE
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

CREATE TABLE seguimiento_ovas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ova_id INT NOT NULL,
    estado ENUM('no_iniciado', 'en_progreso', 'completado') DEFAULT 'no_iniciado',
    fecha_ultimo_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_seg_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_seg_ova FOREIGN KEY (ova_id) REFERENCES ovas(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, ova_id)
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

-- 7. DATA INICIAL
INSERT INTO roles (nombre_rol, descripcion) VALUES 
('ADMIN', 'Administrador total del sistema'),
('INSTRUCTOR', 'Gestor de contenidos y fichas'),
('PEDAGOGO', 'Responsable de la validación pedagógica de los objetos de aprendizaje'),
('DISENADOR WEB', 'Responsable de la interfaz gráfica y experiencia de usuario de los OVAs'),
('APRENDIZ', 'Usuario de consulta de OVAs');

INSERT INTO fases (sigla, nombre_fase) VALUES 
('AN', 'Análisis'),
('PL', 'Planeación'),
('EJ', 'Ejecución'),
('EV', 'Evaluación');