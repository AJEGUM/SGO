import * as XLSX from 'xlsx';

/**
 * Convierte el buffer a filas y procesa toda la estructura.
 */
export const extraerTodoElContenido = (fileBuffer) => {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let todasLasCompetencias = [];
    let contexto = { 
        currentCompetencia: null, 
        currentRap: null, 
        modoActual: null 
    };

    for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];
        if (!fila || fila.length === 0) continue;

        // Delegación de responsabilidades
        detectarModo(fila, contexto);
        extraerCompetencia(fila, rows[i + 1] || null, contexto, todasLasCompetencias);
        extraerRap(fila, contexto);
        // Aquí podrías llamar a extraerRap y extraerCriterio cuando los habilites
    }

    // Lógica de cierre: Guardar la última procesada
    if (contexto.currentCompetencia) {
        todasLasCompetencias.push(contexto.currentCompetencia);
    }

    return todasLasCompetencias;
};

export const detectarModo = (fila, contexto) => {
    const celda = fila[0]?.toString().trim() || "";
    
    // Añadimos la detección de la sección de RAPs (4.5)
    if (celda.includes("4.5")) {
        contexto.modoActual = 'raps';
    } else if (celda.includes("4.6.1")) {
        contexto.modoActual = 'procesos';
    } else if (celda.includes("4.6.2")) {
        contexto.modoActual = 'saberes';
    } else if (celda.includes("4.7")) {
        contexto.modoActual = 'criterios';
    } else if (celda.includes("4.8") || celda.includes("PERFIL")) {
        contexto.modoActual = null;
    }
};

export const extraerCompetencia = (fila, siguienteFila, contexto, todasLasCompetencias) => {
    const textoFilaA = fila.slice(0, 5).join(" ").trim();
    
    if (textoFilaA.includes("4.2")) {
        if (contexto.currentCompetencia) todasLasCompetencias.push(contexto.currentCompetencia);
        
        const codigoRaw = fila.slice(5, 15).find(c => c) || (siguienteFila?.slice(5, 15).find(c => c));
        const codigoStr = codigoRaw?.toString().trim() || "999999999";

        contexto.currentCompetencia = {
            codigo_norma: codigoStr,
            prefijo_id: codigoStr.substring(0, 5),
            nombre: "COMPETENCIA",
            resultados: []
        };
        return;
    }

    if (textoFilaA.includes("4.3") && contexto.currentCompetencia) {
        const nombreRaw = fila.slice(5, 20).find(c => c) || (siguienteFila?.slice(5, 20).find(c => c));
        if (nombreRaw) {
            contexto.currentCompetencia.nombre = nombreRaw.toString().trim().toUpperCase();
        }
    }
};

export const extraerRap = (fila, contexto) => {
    // Solo actuamos si estamos en modo 'raps' y tenemos una competencia activa
    if (contexto.modoActual !== 'raps' || !contexto.currentCompetencia) return;

    const celda = fila[0]?.toString().trim() || "";
    
    // Regex para capturar el código (01, 02, etc.) y la descripción del RAP
    // Basado en las imágenes, el formato es "Número [espacio] Descripción"
    const match = celda.match(/^(\d{2})\s+(.+)/);

    if (match) {
        contexto.currentRap = {
            codigo_rap: match[1],
            denominacion: match[2].trim().toUpperCase(),
            criterios: [], 
            procesos: [], 
            saberes: []
        };
        
        // Lo vinculamos inmediatamente a la competencia actual
        contexto.currentCompetencia.resultados.push(contexto.currentRap);
    }
};