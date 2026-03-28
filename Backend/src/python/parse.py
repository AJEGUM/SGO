import pandas as pd
import sys
import json
import io
import re

def limpiar_texto(val):
    if pd.isna(val): return ""
    return str(val).strip()

def extraer_el_mas_largo(row):
    """Extrae el contenido real, ignorando títulos de encabezado del SENA."""
    celdas = [limpiar_texto(c) for c in row]
    
    # Lista de frases que NO son datos, son solo títulos del formato
    titulos_formato = [
        "DURACIÓN MÁXIMA", "RESULTADOS DE APRENDIZAJE", "CONTENIDOS CURRICULARES",
        "CONOCIMIENTOS DE PROCESO", "CONOCIMIENTOS DEL SABER", "CRITERIOS DE EVALUACIÓN",
        "NORMA / UNIDAD", "CÓDIGO NORMA", "NOMBRE DE LA COMPETENCIA", "DENOMINACIÓN",
        "ESTIMADA PARA EL LOGRO", "4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7"
    ]

    candidatos = []
    for c in celdas:
        # Solo consideramos celdas con texto largo
        if len(c) >= 3:
            # Si la celda contiene alguno de los títulos de arriba, la ignoramos
            if any(titulo in c.upper() for titulo in titulos_formato):
                continue
            candidatos.append(c)
            
    return max(candidatos, key=len) if candidatos else ""

def manejar_competencia(fila_txt, row, comp_actual, competencias):
    celdas = [limpiar_texto(c) for c in row if pd.notna(c)]
    
    # 1. Detectar inicio por código de norma (Ej: 220501046)
    codigos = re.findall(r'\d{7,}', fila_txt)
    if codigos:
        # Si ya había una competencia detectada antes, la guardamos antes de iniciar la nueva
        if comp_actual and comp_actual.get("nombre"):
            if not any(c['codigo_norma'] == comp_actual['codigo_norma'] for c in competencias):
                competencias.append(comp_actual)
        
        return {
            "codigo_norma": codigos[0],
            "prefijo_id": codigos[0][:5],
            "nombre": "",
            "duracion": 0,
            "resultados": []
        }
    
    # 2. CAPTURA DEL NOMBRE (Busca el indicador 4.3 en cualquier celda de la fila)
    if comp_actual and not comp_actual["nombre"]:
        # Si alguna celda contiene exactamente "4.3" o empieza con ello
        if any(re.match(r'^4\.3', c) for c in celdas):
            # Buscamos la celda que NO sea el indicador y que tenga el texto (como "TIC")
            for c in celdas:
                c_up = c.upper()
                if "4.3" not in c_up and "NOMBRE" not in c_up and len(c) >= 2:
                    comp_actual["nombre"] = c.strip().upper()
                    return comp_actual
            
    return comp_actual  

def manejar_rap(fila_txt, comp_actual):
    """Detecta un RAP buscando patrones como '01 ', '02 '."""
    # Buscamos el patrón: numero de 2 cifras + espacio + Texto largo
    match_rap = re.search(r'^(\d{1,2})\s+([A-ZÁÉÍÓÚÑ\s]{10,})', fila_txt.strip())
    
    if match_rap and comp_actual:
        num_rap, texto_rap = match_rap.groups()
        # Limpieza extra para no traerse títulos
        if "DENOMINACIÓN" not in texto_rap.upper():
            if not any(r['denominacion'] == texto_rap.strip() for r in comp_actual['resultados']):
                comp_actual["resultados"].append({
                    "codigo_rap": num_rap,
                    "denominacion": texto_rap.strip(),
                    "procesos": "", "saberes": "", "criterios": ""
                })

def procesar():
    try:
        input_data = sys.stdin.buffer.read()
        if not input_data: return

        df = pd.read_excel(io.BytesIO(input_data), header=None, engine='openpyxl')
        
        competencias = []
        c_actual = None
        seccion_actual = None 

        for _, row in df.iterrows():
            # Limpiamos cada celda y las unimos
            celdas_limpias = [limpiar_texto(c) for c in row if pd.notna(c)]
            fila_txt = " ".join(celdas_limpias).upper()
            indicador = celdas_limpias[0] if celdas_limpias else ""

            # 1. Competencia
            c_actual = manejar_competencia(fila_txt, row, c_actual, competencias)

            if c_actual:
                # 2. Duración (Buscamos el número de horas específicamente)
                if "4.4" in indicador or "DURACIÓN" in fila_txt:
                    # Buscamos solo el número que acompaña a las horas
                    nums = re.findall(r'\d+', fila_txt)
                    if nums:
                        # Normalmente el número de horas es el último número en esa fila (ej: "48")
                        c_actual["duracion"] = int(nums[-1])

                # 3. RAPs
                if "4.5" in indicador or "DENOMINACIÓN" in fila_txt or re.match(r'^\d{2}\s', fila_txt.strip()):
                    manejar_rap(fila_txt, c_actual)

                # 4. Secciones de conocimiento
                if "4.6.1" in indicador: seccion_actual = "procesos"
                elif "4.6.2" in indicador: seccion_actual = "saberes"
                elif "4.7" in indicador: seccion_actual = "criterios"
                
                if seccion_actual and c_actual["resultados"]:
                    texto_bloque = extraer_el_mas_largo(row)
                    if texto_bloque and len(texto_bloque) > 15:
                        texto_limpio = re.sub(r'^[\s\*\-\u2022\.]+', '', texto_bloque)
                        rap_destino = c_actual["resultados"][-1]
                        if texto_limpio not in rap_destino[seccion_actual]:
                            sep = "\n" if rap_destino[seccion_actual] else ""
                            rap_destino[seccion_actual] += sep + texto_limpio

        if c_actual and c_actual["nombre"]:
            competencias.append(c_actual)

        # Filtrado final de duplicados
        vistos = set()
        final = []
        for comp in competencias:
            if comp["codigo_norma"] not in vistos and len(comp["nombre"]) >= 3:
                final.append(comp)
                vistos.add(comp["codigo_norma"])

        sys.stdout.write(json.dumps(final))
        
    except Exception as e:
        sys.stderr.write(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    procesar()