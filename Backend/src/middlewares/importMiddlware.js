import multer from 'multer';

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Opcional: Filtro para aceptar solo archivos Excel
const excelFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'application/vnd.ms-excel'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Formato no válido. Por favor sube un archivo Excel (.xlsx)'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: excelFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // Límite de 50MB
});