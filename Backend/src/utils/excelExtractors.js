// YA NO necesitas importar XLSX aquí, Python ya hizo ese trabajo.

export const extraerTodoElContenido = (rows) => {
    let todasLasCompetencias = [];
    let contexto = { 
        currentCompetencia: null, 
        currentRap: null, 
        modoActual: null,
        celdaAcumulada: "" 
    };

    // Recorremos las filas que Python ya "aplanó" (sin celdas vacías por combinación)
    for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];
        if (!fila) continue; 

        detectarModo(fila, contexto);
        // Pasamos fila actual y siguiente para capturar códigos/nombres que a veces saltan de línea
        extraerCompetencia(fila, rows[i + 1] || null, contexto, todasLasCompetencias);
        extraerRap(fila, contexto);
        extraerConocimientosProceso(fila, contexto);
    }

    // Insertar la última competencia procesada
    if (contexto.currentCompetencia) {
        todasLasCompetencias.push(contexto.currentCompetencia);
    }

    return todasLasCompetencias;
};

// --- Las funciones de apoyo se mantienen casi igual, pero más confiables ---

export const detectarModo = (fila, contexto) => {
    const celda = fila[0] ? fila[0].toString().trim().toUpperCase() : "";
    
    if (celda.match(/^4\.\d/)) {
        contexto.currentRap = null; 
    }

    if (celda.includes("4.4")) {
        contexto.modoActual = 'horas';
    } else if (celda.includes("4.5")) {
        contexto.modoActual = 'raps';
    } else if (celda.includes("4.6.1")) {
        contexto.modoActual = 'procesos'; // <--- CAMBIO AQUÍ
    } else if (celda.includes("4.6.2")) {
        contexto.modoActual = 'saberes';  // <--- CAMBIO AQUÍ
    } else if (celda.includes("4.7")) {
        contexto.modoActual = 'criterios'; // <--- CAMBIO AQUÍ
    } else if (celda.match(/^4\.[8-9]/)) {
        contexto.modoActual = null;
    }
};

export const extraerCompetencia = (fila, siguienteFila, contexto, todasLasCompetencias) => {
    const textoFilaA = fila.slice(0, 5).join(" ").trim();
    
    // Captura de Código y Creación de Objeto
    if (textoFilaA.includes("4.2")) {
        if (contexto.currentCompetencia) todasLasCompetencias.push(contexto.currentCompetencia);
        
        const codigoRaw = fila.slice(5, 15).find(c => c) || (siguienteFila?.slice(5, 15).find(c => c));
        
        contexto.currentCompetencia = {
            codigo_norma: codigoRaw?.toString().trim() || "0",
            nombre: "SIN NOMBRE",
            horas: 0, // Campo nuevo
            resultados: []
        };
    }

    // Captura de Nombre
    if (textoFilaA.includes("4.3") && contexto.currentCompetencia) {
        const nombreRaw = fila.slice(5, 20).find(c => c) || (siguienteFila?.slice(5, 20).find(c => c));
        if (nombreRaw) {
            contexto.currentCompetencia.nombre = nombreRaw.toString().trim().toUpperCase();
        }
    }

    // Captura de Horas (Sección 4.4)
    if (contexto.modoActual === 'horas' && contexto.currentCompetencia) {
        // Buscamos el primer número que no sea el "4.4"
        const posibleHora = fila.find(c => {
            const n = parseInt(c);
            return !isNaN(n) && !c.toString().includes("4.4") && n > 0;
        });
        if (posibleHora) {
            contexto.currentCompetencia.horas = parseInt(posibleHora);
        }
    }
};

export const extraerRap = (fila, contexto) => {
    if (contexto.modoActual !== 'raps' || !contexto.currentCompetencia) return;

    // Buscamos en la fila un texto que parezca un RAP (longitud considerable)
    // Evitamos el encabezado "4.5 RESULTADOS DE APRENDIZAJE..."
    const contenido = fila.find(c => {
        const t = c?.toString().trim();
        return t && t.length > 15 && !t.includes("4.5") && !t.includes("RESULTADOS");
    });

    if (contenido) {
        const denominacion = contenido.toString().trim().toUpperCase();
        
        // Evitar duplicados si Python hizo ffill
        const existe = contexto.currentCompetencia.resultados.some(r => r.denominacion === denominacion);
        
        if (!existe) {
            contexto.currentRap = {
                codigo_rap: (contexto.currentCompetencia.resultados.length + 1).toString(),
                denominacion: denominacion
            };
            contexto.currentCompetencia.resultados.push(contexto.currentRap);
        }
    }
};

export const extraerConocimientosProceso = (fila, contexto) => {
    const modosPermitidos = ['procesos', 'saberes', 'criterios'];
    if (!modosPermitidos.includes(contexto.modoActual) || !contexto.currentCompetencia) return;

    const tablaDestino = contexto.modoActual;
    
    // Buscamos el contenido real (texto largo)
    let contenidoReal = fila.find(celda => {
        const text = celda?.toString().trim();
        return text && text.length > 15 && !text.match(/^4\.\d/);
    })?.toString().trim() || "";

    if (!contenidoReal) return;

    // ESTRATEGIA: Buscar a qué RAP pertenece este bloque de texto
    // El texto del conocimiento suele empezar con el nombre del RAP
    const rapAsociado = contexto.currentCompetencia.resultados.find(rap => 
        contenidoReal.toUpperCase().includes(rap.denominacion.toUpperCase().substring(0, 30))
    );

    if (rapAsociado) {
        // Inicializar si no existe
        if (!rapAsociado[tablaDestino]) rapAsociado[tablaDestino] = "";
        
        // Evitar duplicados y acumular
        if (!rapAsociado[tablaDestino].includes(contenidoReal.substring(0, 40))) {
            rapAsociado[tablaDestino] += (rapAsociado[tablaDestino] ? "\n" : "") + contenidoReal;
        }
    }
};