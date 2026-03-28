import pandas as pd
import sys
import json
import io
import re

def limpiar_texto(val):
    if pd.isna(val): return ""
    return str(val).strip()

def manejar_competencia(fila_txt, row, comp_actual, competencias):
    celdas = [limpiar_texto(c) for c in row if pd.notna(c)]
    
    # 1. Detectar inicio por código de norma (Ej: 220501046)
    codigos = re.findall(r'\d{7,}', fila_txt)
    if codigos:
        # Si ya había una competencia detectada antes, la guardamos
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
    
    # 2. CAPTURA DEL NOMBRE (Indicador 4.3)
    if comp_actual and not comp_actual["nombre"]:
        if any(re.match(r'^4\.3', c) for c in celdas):
            for c in celdas:
                c_up = c.upper()
                if "4.3" not in c_up and "NOMBRE" not in c_up and len(c) >= 2:
                    comp_actual["nombre"] = c.strip().upper()
                    return comp_actual
            
    return comp_actual  

def manejar_rap(fila_txt, comp_actual):
    """Detecta un RAP y lo inicializa con campos de detalle vacíos."""
    # Patrón: número + texto largo (Ej: "01 REALIZAR MANTENIMIENTO...")
    match_rap = re.search(r'^(\d{1,2})\s+([A-ZÁÉÍÓÚÑ\s]{10,})', fila_txt.strip())
    
    if match_rap and comp_actual:
        num_rap, texto_rap = match_rap.groups()
        if "DENOMINACIÓN" not in texto_rap.upper():
            # Evitamos duplicar el mismo RAP en la misma competencia
            if not any(r['denominacion'] == texto_rap.strip() for r in comp_actual['resultados']):
                comp_actual["resultados"].append({
                    "codigo_rap": num_rap,
                    "denominacion": texto_rap.strip(),
                    # CAMPOS VACÍOS PARA LLENADO MANUAL:
                    "procesos": "", 
                    "saberes": "", 
                    "criterios": ""
                })

def procesar():
    try:
        input_data = sys.stdin.buffer.read()
        if not input_data: return

        df = pd.read_excel(io.BytesIO(input_data), header=None, engine='openpyxl')
        
        competencias = []
        c_actual = None

        for _, row in df.iterrows():
            celdas_limpias = [limpiar_texto(c) for c in row if pd.notna(c)]
            fila_txt = " ".join(celdas_limpias).upper()
            indicador = celdas_limpias[0] if celdas_limpias else ""

            # 1. Detectar o actualizar Competencia
            c_actual = manejar_competencia(fila_txt, row, c_actual, competencias)

            if c_actual:
                # 2. Capturar Duración (4.4)
                if "4.4" in indicador or "DURACIÓN" in fila_txt:
                    nums = re.findall(r'\d+', fila_txt)
                    if nums:
                        c_actual["duracion"] = int(nums[-1])

                # 3. Capturar RAPs (4.5)
                # Eliminamos toda la lógica de 4.6 y 4.7 (conocimientos/criterios)
                if "4.5" in indicador or "DENOMINACIÓN" in fila_txt or re.match(r'^\d{2}\s', fila_txt.strip()):
                    manejar_rap(fila_txt, c_actual)

        # Agregar la última competencia procesada
        if c_actual and c_actual["nombre"]:
            competencias.append(c_actual)

        # Limpieza de duplicados y nombres cortos
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