import { importService } from '../../services/admin/importService.js';
import XLSX from 'xlsx';

export const importController = {
  async importarReporte(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: "No hay archivo" });

      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // Usamos defval para que las celdas vacías no desaparezcan del array
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

      // NORMALIZACIÓN AGRESIVA: Quita tildes, símbolos, espacios y deja solo letras base
      const superNormalize = (str) => {
        if (!str) return "";
        return str.toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Quita tildes
          .replace(/[^a-z0-9]/g, "")      // Quita TODO lo que no sea letra o número (incluye :)
          .trim();
      };

      const getValueOf = (label) => {
        const target = superNormalize(label);

        for (let i = 0; i < rows.length; i++) {
          const rowIndex = rows[i].findIndex(cell => superNormalize(cell) === target);

          if (rowIndex !== -1) {
            // Buscamos el valor en las siguientes 10 celdas a la derecha
            for (let j = rowIndex + 1; j <= rowIndex + 10; j++) {
              let val = rows[i][j];
              if (val !== null && val !== undefined && val.toString().trim() !== "") {
                return val;
              }
            }
          }
        }
        return null;
      };

      // Extraemos usando los nombres normalizados (sin tildes ni espacios)
      const centroRaw = getValueOf('centro de formacion') || "";
      const centroParts = centroRaw.toString().includes(' - ') ? centroRaw.split(' - ') : [centroRaw, null];

      const dataSGO = {
        regional: getValueOf('regional'),
        centro_codigo: centroParts[0]?.trim() || null,
        centro_nombre: centroParts[1]?.trim() || 'CENTRO NO ESPECIFICADO',
        // El reporte trae "Cógigo", esta normalización lo encontrará como "cogigo"
        programa_codigo: getValueOf('cogigo') || getValueOf('codigo'), 
        programa_nombre: getValueOf('denominacion'),
        denominacion: getValueOf('denominacion'),
        version: getValueOf('version'),
        nivel_formacion: getValueOf('nivel de formacion') || 'TECNOLOGO',
        codigo_ficha: getValueOf('ficha de caracterizacion'),
        ficha_caracterizacion: getValueOf('ficha de caracterizacion'),
        fecha_inicio: getValueOf('fecha inicio'),
        fecha_fin: getValueOf('fecha fin'),
        modalidad: getValueOf('modalidad de formacion'),
        estado_caracterizacion: getValueOf('estado de la ficha de caracterizacion')
      };

      // Debug para consola
      console.log("Ficha detectada:", dataSGO.ficha_caracterizacion);
      console.log("Programa detectado:", dataSGO.programa_codigo);

      if (!dataSGO.ficha_caracterizacion || !dataSGO.programa_codigo) {
        return res.status(400).json({ 
          message: "Error: El sistema no pudo leer la Ficha o el Código del Programa.",
          intentado: { 
            busco_ficha: "ficha de caracterizacion", 
            busco_codigo: "cogigo/codigo",
            encontrado_ficha: dataSGO.ficha_caracterizacion,
            encontrado_codigo: dataSGO.programa_codigo
          }
        });
      }

      const resultado = await importService.procesarExcelSena([dataSGO]);
      res.status(200).json({ message: "Importación exitosa", detalle: resultado });

    } catch (error) {
      console.error("Error en importController:", error);
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
  }
};