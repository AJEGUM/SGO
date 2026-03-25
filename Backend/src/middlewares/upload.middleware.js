import multer from 'multer';

const storage = multer.memoryStorage(); // Se queda en la RAM

const fileFilter = (req, file, cb) => {
    const validMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (file.mimetype === validMimeType) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de Excel (.xlsx)'), false);
    }
};

export const uploadCurriculoMiddleware = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB es seguro para la RAM
});