import 'dotenv/config';
import { app } from './src/app.js'; // IMPORTANTE: Agregar el .js

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; 

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor Express corriendo en http://${HOST}:${PORT}`);
});