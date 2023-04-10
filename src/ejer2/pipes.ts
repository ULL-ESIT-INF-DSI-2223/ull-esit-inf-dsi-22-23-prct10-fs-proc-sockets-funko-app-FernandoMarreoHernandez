/**
 * @file pipes.ts
 * @description Contiene la implementacion de la funcion que se encarga de contar las lineas, palabras y caracteres de un archivo usando pipes
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
 * Funcion que se encarga de contar las lineas, palabras y caracteres de un archivo usando pipes
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
          salida += '|Líneas';
          args.push('-l');
        }
        if (argv.palabras) {
          salida += '|Palabras';
          args.push('-w');
        }
        if (argv.caracteres) {
          salida += '|Caracteres|';
          args.push('-c');
        }
        if (args.length === 0) {
          args.push('-lwc');
        }
        console.log(salida);
        const wc = spawn('wc', args.concat([filename]));
        wc.stdout.pipe(process.stdout);
      } catch (error) {
        console.error(`El archivo ${argv.ruta} no existe`);
      }
    }
  )
  .demandCommand()
  .parse();

