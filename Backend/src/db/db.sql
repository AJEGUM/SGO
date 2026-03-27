CREATE DATABASE IF NOT EXISTS sgo;
USE sgo;

-- 1. PROGRAMAS
CREATE TABLE programas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_programa VARCHAR(255) UNIQUE, -- Quitamos NOT NULL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. FICHAS
CREATE TABLE fichas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ficha VARCHAR(7) UNIQUE, -- Quitamos NOT NULL
    programa_id INT NOT NULL, -- Mantenemos NOT NULL por ser FK
    codigo_programa VARCHAR(20),
    version_programa VARCHAR(10),
    fecha_inicio DATE,
    fecha_fin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ficha_programa FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. COMPETENCIAS
CREATE TABLE competencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    programa_id INT NOT NULL, -- Mantenemos NOT NULL por ser FK
    codigo_norma VARCHAR(50), -- Quitamos NOT NULL
    prefijo_id VARCHAR(10),   -- Quitamos NOT NULL (Soluciona tu error anterior)
    nombre TEXT,              -- Quitamos NOT NULL
    duracion_horas INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(codigo_norma, programa_id),
    CONSTRAINT fk_comp_programa FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. RESULTADOS DE APRENDIZAJE
CREATE TABLE resultados_aprendizaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    competencia_id INT NOT NULL, -- Mantenemos NOT NULL por ser FK
    codigo_rap VARCHAR(10),      -- Quitamos NOT NULL
    denominacion TEXT,           -- Quitamos NOT NULL
    UNIQUE(competencia_id, codigo_rap),
    CONSTRAINT fk_comp_rap 
        FOREIGN KEY (competencia_id) REFERENCES competencias(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. FASES
CREATE TABLE fases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(2) UNIQUE NOT NULL,
    nombre_fase VARCHAR(20)
) ENGINE=InnoDB;

-- 6. OVAS
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

-- 7. DETALLES (Conocimientos y Criterios)
CREATE TABLE conocimientos_proceso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT, -- Quitamos NOT NULL
    CONSTRAINT fk_proc_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE conocimientos_saber (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT, -- Quitamos NOT NULL
    CONSTRAINT fk_saber_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE criterios_evaluacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT, -- Quitamos NOT NULL
    CONSTRAINT fk_crit_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. DATA INICIAL
INSERT INTO fases (sigla, nombre_fase) VALUES 
('AN', 'Análisis'),
('PL', 'Planeación'),
('EJ', 'Ejecución'),
('EV', 'Evaluación');