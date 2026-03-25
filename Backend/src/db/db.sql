CREATE DATABASE IF NOT EXISTS sgo;
USE sgo;

-- 1. PROGRAMAS (La raíz de todo)
CREATE TABLE programas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_programa VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. FICHAS (Vinculadas a un programa)
CREATE TABLE fichas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ficha VARCHAR(7) UNIQUE NOT NULL,
    programa_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ficha_programa FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE fichas 
ADD COLUMN codigo_programa VARCHAR(20) AFTER programa_id,
ADD COLUMN version_programa VARCHAR(10) AFTER codigo_programa,
ADD COLUMN fecha_inicio DATE AFTER version_programa,
ADD COLUMN fecha_fin DATE AFTER fecha_inicio;

-- 3. COMPETENCIAS (Ahora vinculadas a un programa para evitar mezclas)
CREATE TABLE competencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    programa_id INT NOT NULL, -- Agregado para que el Modelo funcione
    codigo_norma VARCHAR(50) NOT NULL,
    prefijo_id VARCHAR(10) NOT NULL,
    nombre TEXT NOT NULL,
    duracion_horas INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(codigo_norma, programa_id), -- Una norma es única por programa
    CONSTRAINT fk_comp_programa FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. RESULTADOS DE APRENDIZAJE (RA02)
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

-- 5. FASES (AN, PL, EJ, EV)
CREATE TABLE fases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sigla VARCHAR(2) UNIQUE NOT NULL,
    nombre_fase VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

-- 6. OVAS (El nudo de la anatomía del código)
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
    
    CONSTRAINT fk_ova_ficha FOREIGN KEY (ficha_id) REFERENCES fichas(id) ON DELETE CASCADE,
    CONSTRAINT fk_ova_rap FOREIGN KEY (rap_id) REFERENCES resultados_aprendizaje(id) ON DELETE CASCADE,
    CONSTRAINT fk_ova_fase FOREIGN KEY (fase_id) REFERENCES fases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. DETALLES (3FN - Conocimientos y Criterios)
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

-- 8. DATA INICIAL NECESARIA
INSERT INTO fases (sigla, nombre_fase) VALUES 
('AN', 'Análisis'),
('PL', 'Planeación'),
('EJ', 'Ejecución'),
('EV', 'Evaluación');