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
}