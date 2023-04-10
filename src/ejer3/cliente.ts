import net from 'net';
import {Funko, Tipo, Genero} from './Funko/Funko.js';
import {ColeccionFunkos} from './Funko/ColeccionFunkos.js';
import { Usuario } from './Usuario/Usuario.js';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ColeccionDatos } from './Funko/ColeccionDatos.js';
import fs from 'fs';
import { exit } from 'process';
const log = console.log;

const client = net.connect({port: 60300});

//enivamos el comando al servidor
client.on('connect', () => {
  yargs(hideBin(process.argv))
  //comando para añadir un funko a la base de datos
  .command('add', 'Adds a funko', {
  usuario: {
    description: 'Usuario', //descripcion del campo
    type: 'string', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  id: {
   description: 'Funko ID', //descripcion del campo
   type: 'number', //tipo de dato del campo
   demandOption: true //dice si el campo es obligatorio o no
  },
  nombre: {
    description: 'Funko Nombre', //descripcion del campo
    type: 'string', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  descripcion: {
    description: 'Funko Descripcion', //descripcion del campo
    type: 'string', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  tipo: {
    description: 'Funko Tipo', //descripcion del campo
    type: 'string', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  genero: {
    description: 'Funko Genero', //descripcion del campo
    type: 'string', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  franquicia: {
    description: 'Funko Franquicia', //descripcion del campo
    type: 'string', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  numero: {
    description: 'Funko Numero Franquicia', //descripcion del campo
    type: 'number', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  exclusivo: {
    description: 'Funko Exclusivo', //descripcion del campo
    type: 'boolean', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  caracteristicas: {
    description: 'Funko Caracteristicas', //descripcion del campo
    type: 'string', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
  valor: {
    description: 'Funko Precio', //descripcion del campo
    type: 'number', //tipo de dato del campo
    demandOption: true //dice si el campo es obligatorio o no
  },
 }, (argv) => {
  //enviamos los datos al servidor
  client.write(JSON.stringify({'type': 'add',
  'id': argv.id,
  'nombre': argv.nombre,
  'descripcion': argv.descripcion,
  'tipo': argv.tipo,
  'genero': argv.genero,
  'franquicia': argv.franquicia, 'numero': argv.numero, 'exclusivo': argv.exclusivo, 'caracteristicas': argv.caracteristicas, 'valor': argv.valor, 'usuario': argv.usuario}));
  log(chalk.green('Funko añadido correctamente'));
  exit(0);
  })
  //const message = JSON.parse(dataJSON.toString());
  //console.log(message);
  .help()
  .argv;
});


