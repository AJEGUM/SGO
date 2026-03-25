CREATE DATABASE IF NOT EXISTS sgo;
USE sgo;

-- 1. FICHAS (7 dígitos)
CREATE TABLE fichas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ficha VARCHAR(7) UNIQUE NOT NULL,
    nombre_programa TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. COMPETENCIAS (Prefijo C1046)
CREATE TABLE competencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_norma VARCHAR(50) UNIQUE NOT NULL,
    prefijo_id VARCHAR(10) NOT NULL,
    nombre TEXT NOT NULL,
    duracion_horas INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. RESULTADOS DE APRENDIZAJE (RA02)
CREATE TABLE resultados_aprendizaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    competencia_id INT NOT NULL,
    codigo_rap VARCHAR(10) NOT NULL,
    denominacion TEXT NOT NULL,
    UNIQUE(competencia_id, codigo_rap),
    CONSTRAINT fk_comp_rap 
        FOREIGN KEY (competencia_id) REFERENCES competencias(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. FASES (AN, PL, EJ, EV)
CREATE TABLE fases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(2) UNIQUE NOT NULL,
    nombre_fase VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- 5. OVAS (El nudo de la anatomía del código)
CREATE TABLE ovas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ficha_id INT NOT NULL,
    rap_id INT NOT NULL,
    fase_id INT NOT NULL,
    id_secuencial VARCHAR(10) NOT NULL,
    codigo_anatomia VARCHAR(100) UNIQUE NOT NULL,
    titulo_ova TEXT NOT NULL,
    url_recurso TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- RELACIONES (Los cables que mencionabas)
    CONSTRAINT fk_ova_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE,
    CONSTRAINT fk_ova_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE,
    CONSTRAINT fk_ova_fase FOREIGN KEY (fase_id) REFERENCES fases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- DETALLES (3FN)
CREATE TABLE conocimientos_proceso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT fk_proc_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE conocimientos_saber (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT fk_saber_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE criterios_evaluacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rap_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    CONSTRAINT fk_crit_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE
) ENGINE=InnoDB;