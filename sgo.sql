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
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 2. ESTRUCTURA CURRICULAR (DEFINICIÓN)
CREATE TABLE programas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_programa VARCHAR(20), 
    nombre_programa VARCHAR(255), 
    version_programa VARCHAR(10), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(codigo_programa, version_programa) 
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
    CONSTRAINT fk_comp_programa FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ficha_programa FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE
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
    ficha_id INT NOT NULL,
    rap_id INT NOT NULL,
    fase_id INT NOT NULL,
    id_secuencial VARCHAR(10),
    codigo_anatomia VARCHAR(100) UNIQUE,
    titulo_ova TEXT,
    url_recurso TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ova_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE,
    CONSTRAINT fk_ova_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE,
    CONSTRAINT fk_ova_fase FOREIGN KEY (fase_id) REFERENCES fases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. ASIGNACIONES (SIN CIRCUITO CERRADO - 3FN)
-- Unificamos la asignación: El instructor solo ve las competencias asignadas aquí.
CREATE TABLE asignaciones_instructor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    programa_id INT NOT NULL,
    competencia_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asig_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_asig_programa FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE,
    CONSTRAINT fk_asig_competencia FOREIGN KEY (competencia_id) REFERENCES competencias(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, programa_id, competencia_id)
) ENGINE=InnoDB;

CREATE TABLE usuario_fichas (
    usuario_id INT NOT NULL,
    ficha_id INT NOT NULL,
    fecha_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_aprendiz ENUM('Inducción', 'Formación', 'Condicionado', 'Retirado', 'Certificado') DEFAULT 'Formación',
    PRIMARY KEY (usuario_id, ficha_id),
    CONSTRAINT fk_uf_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_uf_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. DATA INICIAL
INSERT INTO roles (nombre_rol, descripcion) VALUES 
('ADMIN', 'Administrador total del sistema'),
('INSTRUCTOR', 'Gestor de contenidos y fichas'),
('APRENDIZ', 'Usuario de consulta de OVAs');

INSERT INTO fases (sigla, nombre_fase) VALUES 
('AN', 'Análisis'),
('PL', 'Planeación'),
('EJ', 'Ejecución'),
('EV', 'Evaluación');