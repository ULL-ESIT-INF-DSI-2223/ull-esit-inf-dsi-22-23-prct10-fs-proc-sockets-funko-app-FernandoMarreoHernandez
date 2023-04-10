/**
 * @file child.ts
 * @description Contiene la implementacion de la funcion que se encarga de contar las lineas, palabras y caracteres de un archivo usando child_process
 */
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { access } from 'fs/promises';
import { spawn } from 'child_process';

/**
 * interfaz de los argumentos
 * @param ruta ruta del archivo
 * @param lineas contar lineas
 * @param palabras contar palabras
 * @param caracteres contar caracteres
 */
interface Arguments {
  ruta: string;
  lineas: boolean;
  palabras: boolean;
  caracteres: boolean;
}

/**
 * Funcion que se encarga de contar las lineas, palabras y caracteres de un archivo usando child_process
 * @param argv argumentos
 * @returns void
 */
yargs(hideBin(process.argv))
  .command<{
    ruta: string;
    lineas: boolean;
    palabras: boolean;
    caracteres: boolean;
  }>(
    '$0 <ruta>',
    'Contar líneas, palabras y caracteres de un archivo',
    (yargsOption: Argv<Arguments>) => {
      yargsOption
        .positional('ruta', {
          describe: 'Ruta del archivo',
          type: 'string',
        })
        .option('lineas', {
          describe: 'Contar líneas',
          type: 'boolean',
          default: false,
        })
        .option('palabras', {
          describe: 'Contar palabras',
          type: 'boolean',
          default: false,
        })
        .option('caracteres', {
          describe: 'Contar caracteres',
          type: 'boolean',
          default: false,
        });
    },
    async (argv: Arguments) => {
      try {
        let salida = '';
        const filename = argv.ruta;
        await access(filename);
        const args: string[] = [];
        if (argv.lineas) {
          args.push('-l');
        }
        if (argv.palabras) {
          args.push('-w');
        }
        if (argv.caracteres) {
          args.push('-c');
        }
        if (args.length === 0) {
          args.push('-lwc');
        }
        const wc = spawn('wc', args.concat([filename]));

        wc.stdout.on('data', (data) => {
          process.stdout.write(data);
        });

        wc.stderr.on('data', (data) => {
          process.stderr.write(data);
        });

        wc.on('close', (code) => {
          console.log(`El proceso de wc ha finalizado con el código ${code}`);
        });
      } catch (error) {
        console.error(`El archivo ${argv.ruta} no existe`);
      }
    }
  )
  .demandCommand()
  .parse();
