SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS sgo;
USE sgo;

-- 1. MAESTRAS Y SEGURIDAD
CREATE TABLE IF NOT EXISTS roles (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NULL,
    activo BOOLEAN DEFAULT TRUE, 
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(rol_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS configuracion_sistema (
    clave VARCHAR(50) PRIMARY KEY,
    valor TEXT NOT NULL,
    ultima_edicion_por INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_config_admin FOREIGN KEY (ultima_edicion_por) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invitaciones (
    invitacion_id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) UNIQUE NOT NULL,
    rol_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiracion DATETIME NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_rol_fk FOREIGN KEY (rol_id) REFERENCES roles(rol_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semillas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    programa_id INT NOT NULL,
    nombre_semilla VARCHAR(255),
    estado ENUM('en_construccion', 'pendiente_rector', 'aprobada', 'rechazada'),
    CONSTRAINT fk_semilla_prog FOREIGN KEY (programa_id) REFERENCES programas(programa_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS expertos_semillas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    experto_id INT NOT NULL,
    semilla_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rel_experto FOREIGN KEY (experto_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_rel_semilla FOREIGN KEY (semilla_id) REFERENCES semillas(id) ON DELETE CASCADE,
    UNIQUE(experto_id, semilla_id) -- Evita que asignes al mismo experto dos veces a la misma semilla
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS programas (
    programa_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL, 
    nombre VARCHAR(255) NOT NULL, 
    version VARCHAR(10) NOT NULL, 
    UNIQUE(codigo, version) 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS competencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    programa_id INT NOT NULL, 
    codigo_norma VARCHAR(50) NOT NULL, 
    nombre TEXT NOT NULL,
    CONSTRAINT fk_comp_programa FOREIGN KEY (programa_id) REFERENCES programas(programa_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resultados_aprendizaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    competencia_id INT NOT NULL, 
    ciclo_id INT DEFAULT NULL, 
    codigo_rap VARCHAR(20),      
    denominacion TEXT NOT NULL,           
    CONSTRAINT fk_comp_rap FOREIGN KEY (competencia_id) REFERENCES competencias(id) ON DELETE CASCADE,
    CONSTRAINT fk_rap_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclos_didacticos(id) ON DELETE SET NULL
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

CREATE TABLE IF NOT EXISTS ciclos_didacticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    semilla_id INT NOT NULL,
    fase_proyecto_id INT NOT NULL,
    titulo VARCHAR(255),
    descripcion_general TEXT,
    CONSTRAINT fk_cd_semilla FOREIGN KEY (semilla_id) REFERENCES semillas(id) ON DELETE CASCADE,
    CONSTRAINT fk_cd_fase_proy FOREIGN KEY (fase_proyecto_id) REFERENCES fases_proyecto(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fases_proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(5) UNIQUE NOT NULL, 
    nombre_fase VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fichas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_ficha VARCHAR(20) UNIQUE NOT NULL,
    programa_id INT NOT NULL, -- Importante: La ficha nace de un programa
    semilla_id INT DEFAULT NULL, -- Se vincula a la semilla cuando esta sea aprobada
    estado ENUM('lectiva', 'productiva', 'finalizada') DEFAULT 'lectiva',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ficha_programa FOREIGN KEY (programa_id) REFERENCES programas(programa_id),
    CONSTRAINT fk_ficha_semilla FOREIGN KEY (semilla_id) REFERENCES semillas(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS matriculas_aprendices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aprendiz_id INT NOT NULL,
    ficha_id INT NOT NULL,
    CONSTRAINT fk_mat_user FOREIGN KEY (aprendiz_id) REFERENCES usuarios(id),
    CONSTRAINT fk_mat_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE,
    UNIQUE(aprendiz_id, ficha_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vinculacion_instructores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    ficha_id INT NOT NULL,
    competencia_id INT NOT NULL,
    CONSTRAINT fk_vinc_inst FOREIGN KEY (instructor_id) REFERENCES usuarios(id),
    CONSTRAINT fk_vinc_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE,
    CONSTRAINT fk_vinc_comp FOREIGN KEY (competencia_id) REFERENCES competencias(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recursos_r2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seccion_id INT NOT NULL,
    nombre_archivo VARCHAR(255),
    url_r2 TEXT NOT NULL, -- Link al bucket de Cloudflare
    tipo_archivo VARCHAR(50),
    CONSTRAINT fk_recurso_seccion FOREIGN KEY (seccion_id) REFERENCES ciclo_secciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. CONTENIDOS Y EVALUACIONES (HIJOS DEL CICLO)
CREATE TABLE IF NOT EXISTS ciclo_secciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ciclo_id INT NOT NULL,
    tipo_seccion ENUM('Reflexion', 'Contextualizacion', 'Apropiacion', 'Transferencia') NOT NULL,
    titulo VARCHAR(255),
    contenido_html TEXT, -- Aquí vive el texto/guía generado por la IA
    orden INT DEFAULT 1,
    CONSTRAINT fk_seccion_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclos_didacticos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- El Test es "hijo" de una sección específica (Normalmente Apropiación o Transferencia)
CREATE TABLE IF NOT EXISTS tests_ia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seccion_id INT NOT NULL, -- Apunta a la sección de la que hace parte
    nombre_test VARCHAR(255),
    ponderacion DECIMAL(5,2), -- Cuánto vale este test dentro del 100% del ciclo
    preguntas_json JSON, -- Las preguntas generadas por la IA
    CONSTRAINT fk_test_seccion FOREIGN KEY (seccion_id) REFERENCES ciclo_secciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;