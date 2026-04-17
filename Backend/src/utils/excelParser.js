import XLSX from 'xlsx';

export class ExcelParser {
  constructor(buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    this.rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  }

  static superNormalize(str) {
    if (!str) return "";
    return str.toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  getValueOf(label) {
    const target = ExcelParser.superNormalize(label);
    for (let i = 0; i < this.rows.length; i++) {
      const rowIndex = this.rows[i].findIndex(cell => ExcelParser.superNormalize(cell) === target);
      if (rowIndex !== -1) {
        for (let j = rowIndex + 1; j <= rowIndex + 10; j++) {
          let val = this.rows[i][j];
          if (val !== null && val !== undefined && val.toString().trim() !== "") return val;
        }
      }
    }
    return null;
  }

// Extraer las competencias
  getColumnaDesde(cabeceraObjetivo) {
    const target = ExcelParser.superNormalize(cabeceraObjetivo);
    let indiceColumna = -1;
    let filaInicio = -1;

    // 1. Buscar dónde empieza la tabla (la fila que contiene "Competencia")
    for (let i = 0; i < this.rows.length; i++) {
      const idx = this.rows[i].findIndex(cell => ExcelParser.superNormalize(cell) === target);
      if (idx !== -1) {
        indiceColumna = idx;
        filaInicio = i + 1; // Empezamos a leer desde la fila siguiente
        break;
      }
    }

    if (indiceColumna === -1) return [];

    // 2. Extraer valores únicos de esa columna hasta el final del archivo
    const valores = new Set();
    for (let i = filaInicio; i < this.rows.length; i++) {
      const valor = this.rows[i][indiceColumna];
      if (valor && valor.toString().trim() !== "") {
        valores.add(valor.toString().trim());
      }
    }

    return Array.from(valores);
  }

  // Estraer los raps para vincularlos a las competencias
  getEstructuraCurricular() {
    const colComp = ExcelParser.superNormalize('competencia');
    const colRap = ExcelParser.superNormalize('resultado de aprendizaje');
    
    let idxComp = -1;
    let idxRap = -1;
    let filaInicio = -1;

    // Localizar las columnas en los encabezados de la tabla
    for (let i = 0; i < this.rows.length; i++) {
      const fila = this.rows[i].map(c => ExcelParser.superNormalize(c));
      idxComp = fila.indexOf(colComp);
      idxRap = fila.indexOf(colRap);

      if (idxComp !== -1 && idxRap !== -1) {
        filaInicio = i + 1;
        break;
      }
    }

    if (filaInicio === -1) return [];

    const mapaEstructura = new Map(); // Para evitar duplicados eficientemente

    for (let i = filaInicio; i < this.rows.length; i++) {
      const compRaw = this.rows[i][idxComp];
      const rapRaw = this.rows[i][idxRap];

      if (compRaw && rapRaw) {
        const key = `${compRaw.toString().trim()}||${rapRaw.toString().trim()}`;
        if (!mapaEstructura.has(key)) {
          mapaEstructura.set(key, {
            competencia: compRaw.toString().trim(),
            rap: rapRaw.toString().trim()
          });
        }
      }
    }

    return Array.from(mapaEstructura.values());
  }
}