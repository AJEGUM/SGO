import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import process from 'process'; // Importamos process para detectar el SO

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ejecutarPythonParser = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        // Al estar en src/utils, subimos un nivel para llegar a src/ y luego a python/
        const pythonFolder = path.join(__dirname, '../python'); 
        
        // --- LÓGICA HÍBRIDA DEVOPS ---
        // Detectamos si es Windows (win32). Si no, asumimos entorno Unix (Linux/Mac)
        const isWindows = process.platform === 'win32';
        const pythonBinPath = isWindows 
            ? path.join('venv', 'Scripts', 'python.exe') 
            : path.join('venv', 'bin', 'python');

        const pythonExecutable = path.join(pythonFolder, pythonBinPath);
        const scriptPath = path.join(pythonFolder, 'parse.py');

        // DEBUG LOGS (Útiles para tu video de sustentación)
        console.log("--- Verificando Entorno Multiplataforma ---");
        console.log("Sistema Operativo detectado:", process.platform);
        console.log("Python EXE existe:", fs.existsSync(pythonExecutable), "->", pythonExecutable);
        console.log("Script existe:", fs.existsSync(scriptPath), "->", scriptPath);

        if (!fs.existsSync(pythonExecutable)) {
            return reject(`ENOENT: No se encontró el binario de Python en la ruta: ${pythonExecutable}. Asegúrate de haber creado el venv localmente.`);
        }

        // Ejecución del proceso
        const py = spawn(pythonExecutable, [scriptPath]);

        let output = '';
        let errorOutput = '';

        // Pasamos el buffer al script de Python vía stdin
        py.stdin.write(fileBuffer);
        py.stdin.end();

        py.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        py.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`[Python Debug Error]: ${data.toString()}`);
        });

        py.on('close', (code) => {
            if (code !== 0) {
                return reject(`Python proceso terminó con código ${code}. Error: ${errorOutput}`);
            }
            try {
                // Intentamos parsear la salida JSON del script
                resolve(JSON.parse(output));
            } catch (e) {
                console.error("Contenido de salida no parseable:", output);
                reject("Error al parsear el JSON generado por el script de Python.");
            }
        });
    });
};