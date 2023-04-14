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


const client = net.createConnection({ port: 60300, allowHalfOpen: true });

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
  'franquicia': argv.franquicia,
  'numero': argv.numero,
  'exclusivo': argv.exclusivo,
  'caracteristicas': argv.caracteristicas,
  'valor': argv.valor,
  'usuario': argv.usuario}
  ));
  //recibimos y mostramos el string del servidor
  client.on('data', (data) => {
    const response = JSON.parse(data.toString());
    console.log(response);
    if(response.success){
      console.log(chalk.greenBright('Funko añadido correctamente'));
    }else{
      console.log(chalk.redBright('Error al añadir el funko'));
    }
  })
  })
  .command('delete', 'Deletes a funko', {
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
  }, (argv) => {
    //enviamos los datos al servidor
    client.write(JSON.stringify({'type': 'delete',
    'id': argv.id,
    'usuario': argv.usuario}
    ));
    //recibimos y mostramos el string del servidor
    client.on('data', (data) => {
      const response = JSON.parse(data.toString());
      console.log(response);
      if(response.success){
      console.log(chalk.greenBright('Funko eliminado correctamente'));
      }else{
      console.log(chalk.redBright('Error al eliminar el funko'));
      }
    })
  })
  .command('update', 'Updates a funko', {
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
    client.write(JSON.stringify({'type': 'update',
    'id': argv.id,
    'nombre': argv.nombre,
    'descripcion': argv.descripcion,
    'tipo': argv.tipo,
    'genero': argv.genero,
    'franquicia': argv.franquicia,
    'numero': argv.numero,
    'exclusivo': argv.exclusivo,
    'caracteristicas': argv.caracteristicas,
    'valor': argv.valor,
    'usuario': argv.usuario}
  ));
  //recibimos y mostramos el string del servidor
  client.on('data', (data) => {
    const response = JSON.parse(data.toString());
    console.log(response);
    if(response.success){
    console.log(chalk.greenBright('Funko actualizado correctamente'));
    }else{
    console.log(chalk.redBright('Error al actualizar el funko'));
    }
  })
  })
  .command('list', 'Lists all funkos', {}, () => {
    //enviamos los datos al servidor
    client.write(JSON.stringify({'type': 'list'}
  ));
  //recibimos y mostramos el string del servidor
  client.on('data', (data) => {
    //creamos la coleccion de datos con los datos recibidos
    let respuesta = JSON.parse(data.toString());
    const coleccionDatos = new ColeccionDatos(respuesta);
    coleccionDatos.getDatos().forEach((usuario:ColeccionFunkos) => {
      console.log(chalk.blue('Usuario: '+usuario.getDuenioColeccion()));
      usuario.getFunkos().forEach((funko:Funko) => {
        if(funko.GetValorNumerico() <= 10){
          console.log(chalk.green('Funko: '+funko.GetNombre()));
        }
        else if(funko.GetValorNumerico() <= 20 && funko.GetValorNumerico() > 10){
          console.log(chalk.yellow('Funko: '+funko.GetNombre()));
        }
        else if(funko.GetValorNumerico() <= 30 && funko.GetValorNumerico() > 20){
          console.log(chalk.magenta('Funko: '+funko.GetNombre()));
        }
        else{
          console.log(chalk.white('Funko: '+funko.GetNombre()));
        }
      })
    })
  })
  })
  .command ('show', 'Shows a funko', {
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
        }, (argv) => {
        //enviamos los datos al servidor
        client.write(JSON.stringify({'type': 'show',
        'id': argv.id,
        'usuario': argv.usuario}
      ));
      //recibimos y mostramos el string del servidor
      client.on('data', (data) => {
        const response = JSON.parse(data.toString());
        //console.log(response);
        if(response.success){
          if(response.valor <= 10){
            console.log(chalk.green('id:'+response.id));
            console.log(chalk.green('nombre:'+response.nombre));
            console.log(chalk.green('descripcion:'+response.descripcion));
            console.log(chalk.green('tipo:'+response.tipo));
            console.log(chalk.green('genero:'+response.genero));
            console.log(chalk.green('franquicia:'+response.franquicia));
            console.log(chalk.green('numero:'+response.numero));
            console.log(chalk.green('exclusivo:'+response.exclusivo));
            console.log(chalk.green('caracteristicas:'+response.caracteristicas));
            console.log(chalk.green('valor:'+response.valor));
          }
          else if(response.valor <= 20 && response.valor > 10){
            console.log(chalk.yellow('id:'+response.id));
            console.log(chalk.yellow('nombre:'+response.nombre));
            console.log(chalk.yellow('descripcion:'+response.descripcion));
            console.log(chalk.yellow('tipo:'+response.tipo));
            console.log(chalk.yellow('genero:'+response.genero));
            console.log(chalk.yellow('franquicia:'+response.franquicia));
            console.log(chalk.yellow('numero:'+response.numero));
            console.log(chalk.yellow('exclusivo:'+response.exclusivo));
            console.log(chalk.yellow('caracteristicas:'+response.caracteristicas));
            console.log(chalk.yellow('valor:'+response.valor));
          }
          else if(response.valor <= 30 && response.valor > 20){
            console.log(chalk.magenta('id:'+response.id));
            console.log(chalk.magenta('nombre:'+response.nombre));
            console.log(chalk.magenta('descripcion:'+response.descripcion));
            console.log(chalk.magenta('tipo:'+response.tipo));
            console.log(chalk.magenta('genero:'+response.genero));
            console.log(chalk.magenta('franquicia:'+response.franquicia));
            console.log(chalk.magenta('numero:'+response.numero));
            console.log(chalk.magenta('exclusivo:'+response.exclusivo));
            console.log(chalk.magenta('caracteristicas:'+response.caracteristicas));
            console.log(chalk.magenta('valor:'+response.valor));
          }
          else{
            console.log(chalk.red('id:'+response.id));
            console.log(chalk.red('nombre:'+response.nombre));
            console.log(chalk.red('descripcion:'+response.descripcion));
            console.log(chalk.red('tipo:'+response.tipo));
            console.log(chalk.red('genero:'+response.genero));
            console.log(chalk.red('franquicia:'+response.franquicia));
            console.log(chalk.red('numero:'+response.numero));
            console.log(chalk.red('exclusivo:'+response.exclusivo));
            console.log(chalk.red('caracteristicas:'+response.caracteristicas));
            console.log(chalk.red('valor:'+response.valor));
          }
        }else{
        console.log(chalk.redBright('Error al eliminar el funko'));
        }
      })
  })
  //const message = JSON.parse(dataJSON.toString());
  //console.log(message);
  .help()
  .argv;
});


