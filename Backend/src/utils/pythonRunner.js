import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ejecutarPythonParser = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        // Al estar en src/utils, subimos un nivel para llegar a src/
        // Y luego entramos a la carpeta python/
        const pythonFolder = path.join(__dirname, '../python'); 
        
        const pythonExecutable = path.join(pythonFolder, 'venv/Scripts/python.exe');
        const scriptPath = path.join(pythonFolder, 'parse.py');

        // DEBUG LOGS (Solo para desarrollo, luego puedes quitarlos)
        console.log("--- Verificando Rutas ---");
        console.log("Python EXE existe:", fs.existsSync(pythonExecutable), "->", pythonExecutable);
        console.log("Script existe:", fs.existsSync(scriptPath), "->", scriptPath);

        if (!fs.existsSync(pythonExecutable)) {
            return reject(`ENOENT: No se encontró Python en ${pythonExecutable}`);
        }

        const py = spawn(pythonExecutable, [scriptPath]);

        let output = '';
        let errorOutput = '';

        py.stdin.write(fileBuffer);
        py.stdin.end();

        py.stdout.on('data', (data) => output += data.toString());
        
        py.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.log(`[Python Debug]: ${data.toString()}`);
        });

        py.on('close', (code) => {
            if (code !== 0) return reject(`Python Error (${code}): ${errorOutput}`);
            try {
                resolve(JSON.parse(output));
            } catch (e) {
                reject("Error al parsear el JSON generado por Python. Revisa la consola.");
            }
        });
    });
};