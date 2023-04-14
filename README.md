# Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js

## Indice
1. [Introducción](#introducción)
2. [Ejercicio1](#ejercicio1)
3. [Ejercicio2](#ejercicio2)
4. [Ejercicio3](#ejercicio3)
5. [conclusiones](#conclusiones)

## Introducción

En esta práctica nos toca trabajar con las APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js. Para ello, haremos distintos ejercicios que nos permitirán entender mejor los funcionamientos.

Ejercicio1

En este primer ejercicio nos daban el siguiente código y entender el funcionmiento:

```typescript

import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```
En este codigo se puede ver como primero se importan las funciones fs a utilizar. Tras esto, para el correcto funcionamiento del codigo se pide que en la ejecución del tenga un parametro extra el cual es el nombre de un fichero (por ejemplo: helloWorld.txt). Si no se cumple esta condición se muestra un mensaje de error.

Tras esto, llegamos al **access** el cual comprueba si el fichero existe o no y si el usuario que ejecuta el codigo tiene los permisos necesarios. Junto a este **access** se encuentra el nombre del fichero que se va a comprobar. y el **constants.F_OK**.

El **constant** es un objeto formado por una coleccion de constantes que representan los distintos tipos de verificacion que se pueden hacer en el **access**. En este caso, se utiliza el **F_OK** el cual comprueba si el fichero existe o no aunque tambien se puede utilizar el **R_OK** el cual comprueba si el fichero existe y si el usuario tiene permisos de lectura y tambien se puede utilizar el **W_OK** que es similar pero con permisos de escritura.


Si existe, se muestra un mensaje de que se va a empezar a observar el fichero con un **watch**. Tras esto, se muestra un mensaje de que el fichero ya no se observa.

Mientras el programa observa el fichero, si se modifica de alguna manera, se muestra un mensaje de que el fichero ha sido modificado de alguna manera. Dicho esto, para enter como funciona el **watch** miremos como se mueven por la webAPI y por la callbakc queue.

Una vez que se ejecuta el **watch** se mueve a la webAPI y se queda esperando a que se modifique el fichero. Cuando se modifica el fichero, se mueve a la callback queue y se ejecuta cuando le toca su turno en la cola con el mensaje de que el fichero se ha modificado.

Con todo esto explicado, un ejemplo de como funciona el codigo seria el siguiente:
1. Se ejecuta el codigo poniendo como parametro el nombre de un fichero que existe.
2. el programa comprueba si el fichero existe y si el usuario tiene permisos de lectura.
3. ya comprobado y avisado de que va todo bien por el programa principal, se ejecuta el **watch** sobre el fichero.
4. el **watch** se mueve a la webAPI y se queda esperando a que se modifique el fichero.
5. nos colocamos en el fichero y lo modificamos de alguna manera. (escribiendo algo por ejemplo)
6. el **watch** detecta que el fichero se ha modificado y se mueve a la callback queue.
7. cuando le toca su turno en la cola, se ejecuta y muestra el mensaje de que el fichero se ha modificado.
8. ya mostrado el mensaje, el **watch** vuelve a colocarse en la webAPI y se queda esperando a que se modifique el fichero.
9. volvemos a modificar el fichero.
10. el fichero se modifica y el **watch** se mueve a la callback queue otra vez.
11. tras esperar en la cola, se ejecuta y muestra el mensaje de que el fichero se ha modificado.
12. al cerrar el programa, se muestra el mensaje de que el fichero ya no se observa y **watch** se cierra.

## Ejercicio2

En este segundo ejercicio toca 2 programas que les pases un fichero y dependiendo de los parametros que le pases, te diga el numero de lineas, paralabras y/o caracteres que tiene el fichero. Los programas se haran, uno con pipes y otro con child_process.
El primero, con pipes, se hara de la siguiente manera:

```typescript
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
```
Como podemos ver, el codigo es bastante largo y no es muy legible. Para explicar como funciona, vamos a verlo paso a paso.

Lo primero que se ve es una pequeña interfaz que se encarga de definir los argumentos que se le pasan al programa. En este caso, la ruta del archivo, si se quiere contar lineas, palabras y/o caracteres.

tras esto inicia el programa donde lo primero que se contemplan son los yargs. En este caso, se usa el **hideBin** para que no se muestre el nombre del programa en la ayuda. Luego se usa el **command** para definir el comando que se va a usar. En este caso, el comando es el nombre del programa y se le pasa la ruta del archivo. Luego se usa el **positional** para definir la ruta del archivo y se le pasa la descripcion y el tipo de dato. Por ultimo, se usan los **option** para definir si se quiere contar lineas, palabras y/o caracteres. En este caso, en cada opcion se usa el **default** para que si no se le pasa ningun parametro no se tenga en cuenta este al estar a false.

Una vez con los comandos establecidos, se pasa a la funcion que se ejecuta cuando se ejecuta el comando. En este caso, se usa el **async** para que se pueda usar el **await**. Lo primero que se hace es definir la salida que se va a mostrar en la consola. Luego se comprueba si el archivo existe y si el usuario tiene permisos de lectura. Si no existe o no tiene permisos, se muestra un mensaje de error y se sale del programa. Si todo va bien, se crea un array de strings que se usara para pasar los parametros al comando **wc**. Luego se comprueba si se quiere contar lineas, palabras y/o caracteres. Si se quiere contar lineas, se añade el parametro **-l** al array de parametros y se añade la palabra **Líneas** a la salida. Si se quiere contar palabras, se añade el parametro **-w** al array de parametros y se añade la palabra **Palabras** a la salida. Si se quiere contar caracteres, se añade el parametro **-c** al array de parametros y se añade la palabra **Caracteres** a la salida. Si no se quiere contar nada, se añade el parametro **-lwc** al array de parametros.

El segundo codigo, con child_process, se hara de la siguiente manera:

```typescript
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
```
Como podemos ver, el codigo es similar al anterior pero en esta ocacion usamos el **spawn**.

Tras pasar la parte de yargs, que es igual, se pasa a la funcion que se ejecuta cuando se ejecuta el comando. En este caso, se usa el **async** tambien para que se pueda usar el **await**. Lo primero que se hace es definir la salida que se va a mostrar en la consola. Luego se comprueba si el archivo existe y si el usuario tiene permisos de lectura. Si no existe o no tiene permisos, se muestra un mensaje de error y se sale del programa. Si todo va bien, se crea un array de strings que se usara para pasar los parametros al comando **wc**. Luego se comprueba si se quiere contar lineas, palabras y/o caracteres. Si se quiere contar lineas, se añade el parametro **-l** al array de parametros y se añade la palabra **Líneas** a la salida. Si se quiere contar palabras, se añade el parametro **-w** al array de parametros y se añade la palabra **Palabras** a la salida. Si se quiere contar caracteres, se añade el parametro **-c** al array de parametros y se añade la palabra **Caracteres** a la salida. Si no se quiere contar nada, se añade el parametro **-lwc** al array de parametros. Para finalizar, en vez de usar **pipes** como en el codigo anterior, hacemos un "wc.stdout.on('data', (data) => {})" y dentro de esto, se muestra la salida por consola.

## Ejercicio3

en este ejercicio teniamos que usar la practica anterior de la base de datos de funkos y hacer un cliente y un servidor. El cliente se encargaria de recibir los parametros por comandos y de enviar peticiones al servidor y el servidor se encargaria de responder a las peticiones del cliente haciendo todo lo necesario.

para evitar que este informe sea innecesariamente largo, solo voy a explicar el funcionamiento del cliente y del servidor pues es lo nuevo que se ha hecho en esta practica.

### Cliente
Como anteriormente mencioné, el cliente es el que interactua con el usuario, ya sea recibiendo los parametros por comandos o mostrando los resultados de las peticiones al servidor. El codigo del cliente es el siguiente:

```typescript
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
      log(chalk.greenBright('Funko añadido correctamente'));
    }else{
      log(chalk.redBright('Error al añadir el funko'));
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
        log(chalk.greenBright('Funko eliminado correctamente'));
      }else{
        log(chalk.redBright('Error al eliminar el funko'));
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
      log(chalk.greenBright('Funko actualizado correctamente'));
    }else{
      log(chalk.redBright('Error al actualizar el funko'));
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
          log(chalk.redBright('Error al eliminar el funko'));
        }
      })
  })
  //const message = JSON.parse(dataJSON.toString());
  //console.log(message);
  .help()
  .argv;
});
```
Como se ve en el codigo, el cliente se conecta al servidor y envia un JSON con el tipo de peticion que se quiere realizar, el tipo de peticion puede ser:
1. __add__ para añadir un funko.
2. __delete__ para eliminar un funko.
3. __update__ para actualizar un funko.
4. __list__ para listar todos los funkos.
5. __show__ para mostrar un funko en concreto.
dependiendo del tipo de peticion, el servidor realiza una accion u otra, y devuelve un JSON con la respuesta de la peticion, el cliente recibe el JSON y lo muestra por pantalla.
en los primeros 3 casos, el servidor devuelve un JSON con un aviso indicando el resultado de la peticion, en el caso de __list__ devuelve un JSON con todos los funkos, y en el caso de __show__ devuelve un JSON con el funko que se ha pedido.

Por otra parte, el servidor se encarga de crear la base de datos, recibir los JSON del cliente, realizar las acciones correspondientes y devolver el JSON con la respuesta.

el codigo del servidor es el siguiente:

```typescript
import net from 'net';
import {watchFile} from 'fs';
import {Funko, Tipo, Genero} from './Funko/Funko.js';
import {ColeccionFunkos} from './Funko/ColeccionFunkos.js';
import { Usuario } from './Usuario/Usuario.js';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ColeccionDatos } from './Funko/ColeccionDatos.js';
import fs from 'fs';
import { createReadStream } from 'fs';
import { createWriteStream } from 'fs';
import { exit } from 'process';
import { access, constants } from 'node:fs';
import { Console } from 'console';
import { resolveNs } from 'dns';
//import { number } from 'yargs';
const log = console.log;
let ColeccionDatos1 = new ColeccionDatos([]);


interface ColeccionDeDatos {
  funkos: Funko[];
  Duenio: string;
}

/**
 * funcion para crear la base de datos
 * @returns void
 */
function crearBaseDatos(){
  //comprueba si existe el directorio datos
  if(!fs.existsSync('./datos')){
    //si no existe lo crea
    fs.mkdirSync('./datos');
  }
  //lee los directorios del directorio datos y crea objetos usuario con cada nombre
  fs.readdirSync('./datos').forEach(folder => {
    let usuario = new Usuario(folder);
    let ColeccionFunkos1 = new ColeccionFunkos([],usuario.GetNombre());
    //lee los archivos json de cada directorio y crea objetos funko con cada uno
    //esos funkos los añade a la coleccion de funkos del usuario
    fs.readdirSync('./datos/'+folder).forEach(file => {
      //crea el objeto funko con los datos del archivo json
      let funko = fs.readFileSync('./datos/'+folder+'/'+file);
      let funkoJson = JSON.parse(funko.toString());
      const tipo = funkoJson.Tipo as Tipo;
      const genero = funkoJson.Genero as Genero;
      let funkoObjeto = new Funko(parseInt(funkoJson.id),funkoJson.nombre,funkoJson.descripcion,genero,tipo,funkoJson.Franquicia,parseInt(funkoJson.idFranquicia),funkoJson.exclusivo,funkoJson.caracteristicas,parseInt(funkoJson.valorNumerico));
      //añade el funko a la coleccion de funkos del usuario
      ColeccionFunkos1.aniadirFunko(funkoObjeto);
    });
    //añade la coleccion de funkos del usuario a la coleccion de datos
    ColeccionDatos1.aniadirDatos(ColeccionFunkos1);
  });
}

/**
 * funcion para guardar la base de datos
 * @returns void
 * */
function guardarBaseDatos(){
  //para cada coleccion de funkos de la coleccion de datos
  ColeccionDatos1.getDatos().forEach(coleccion => {
    //busca el directorio del usuario y guarda los datos de cada funko en un archivo json
    fs.readdirSync('./datos').forEach(folder => {
      if(folder == coleccion.getDuenioColeccion()){
        coleccion.getFunkos().forEach(funko => {
          fs.writeFileSync('./datos/'+folder+'/'+funko.GetId()+'.json',JSON.stringify(funko));
        });
      }
    });
  });
}


net.createServer((connection) => {
  //recibe el mensaje del cliente
  connection.on('data', (data) => {
    //analiza el tipo de mensaje
    let mensaje = JSON.parse(data.toString());
    crearBaseDatos();
    const response = {
      success: false,
      data: ColeccionDatos1,
      id: 0,
      nombre: '',
      descripcion: '',
      tipo: '',
      genero: '',
      franquicia: '',
      numero: 0,
      exclusivo: false,
      caracteristicas: '',
      valor: 0,
    };

    //si el mensaje es de tipo add
    switch (mensaje.type) {
      case 'add':
        const tipo = mensaje.tipo as Tipo;
        const genero = mensaje.genero as Genero;
        //crea el objeto funko con los datos del comando
        let usuario = new Usuario(mensaje.usuario);
        //busca si hay un funko con el mismo id
        if (ColeccionDatos1.getDatosUsuario(mensaje.usuario)?.getFunko(mensaje.id) != undefined){
          //si existe envia un mensaje de error al cliente
          response.success = false;
          connection.write(JSON.stringify(response));
          connection.end();
          break;
        }
        //comprueba si existe un funko con el mismo numero de franquicia y mismo nombre de franquicia
        if (Funko.idFranquicia.has(mensaje.idFranquicia) && Funko.Franquicia.has(mensaje.Franquicia)){
          //si existe envia un mensaje de error al cliente
          response.success = false;
          connection.write(JSON.stringify(response));
          connection.end();
          break;
        }
        //comprueba si el valor numerico es un numero negativo
        if (mensaje.valorNumerico < 0){
          response.success = false;
          connection.write(JSON.stringify(response));
          connection.end();
          break;
        }
          //si existe envia un mensaje de error al cliente
        let funko = new Funko(mensaje.id,mensaje.nombre,mensaje.descripcion,
          genero,tipo,mensaje.franquicia,mensaje.numero,mensaje.exclusivo,
          mensaje.caracteristicas,mensaje.valor);
        //comprueba si existe el usuario y si no lo crea
        if(!fs.existsSync('./datos/'+mensaje.usuario)){
          fs.mkdirSync('./datos/'+mensaje.usuario);
          let NuevaColeccionFunkos = new ColeccionFunkos([funko],usuario.GetNombre());
          ColeccionDatos1.aniadirDatos(NuevaColeccionFunkos);
        }
        else{
          //si el usuario ya existe añade el funko a su coleccion
          ColeccionDatos1.getDatosUsuario(mensaje.usuario)?.aniadirFunko(funko);
        }
        //guarda todos los datos en los archivos json
        guardarBaseDatos();
        //envia un mensaje de confirmacion al cliente
        response.success = true;
        connection.write(JSON.stringify(response));
        connection.end();
      break;
      case 'delete':
        //comprueba si existe el usuario
        if(fs.existsSync('./datos/'+mensaje.usuario)){
        //compueba si existe el funko con ese id
          if (ColeccionDatos1.getDatosUsuario(mensaje.usuario)?.getFunko(mensaje.id) == undefined){            response.success = false;
            response.success = false;
            guardarBaseDatos();
            connection.write(JSON.stringify(response));
            connection.end();
            break;
          }
          //si existe borra el funko de la coleccion de funkos del usuario
          ColeccionDatos1.getDatosUsuario(mensaje.usuario)?.eliminarFunko(mensaje.id);
          //borra el archivo json del funko
          fs.unlink('./datos/'+mensaje.usuario+'/'+mensaje.id+'.json', (err) => {
            if (err) {
              console.error(err);
            }
          })
            response.success = true;
            connection.write(JSON.stringify(response));
            guardarBaseDatos();
            connection.end();
            //guarda todos los datos en los archivos json
            break;
        }
        else{
          response.success = false;
          guardarBaseDatos();
          connection.write(JSON.stringify(response));
          connection.end();
          break;
        }
      case 'update':
        if(!fs.existsSync('./datos/'+mensaje.user)){
          let usuario = new Usuario(mensaje.usuario);
          //compueba si existe el funko con ese id
          if(ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)){
            //modifica el funko con los datos del comando
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetNombre(mensaje.nombre);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetDescripcion(mensaje.descripcion);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetTipo(mensaje.tipo as Tipo);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetGenero(mensaje.genero as Genero);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetFranquicia(mensaje.franquicia);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetIdFranquicia(mensaje.numero);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetExclusivo(mensaje.exclusivo);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetCaracteristicas(mensaje.caracteristicas);
            ColeccionDatos1.getDatosUsuario(usuario.GetNombre())?.getFunko(mensaje.id)?.SetValorNumerico(mensaje.valor);
            response.success = true;
            connection.write(JSON.stringify(response));
            guardarBaseDatos();
            connection.end();
            break;
          }
          else{
            response.success = false;
            guardarBaseDatos();
            connection.write(JSON.stringify(response));
            connection.end();
            break;
          }
        }
        else{
          response.success = false;
          guardarBaseDatos();
          connection.write(JSON.stringify(response));
          connection.end();
          break;
        }
        case 'list':
          response.success = true;
          response.data = ColeccionDatos1;
          connection.write(JSON.stringify(response));
          connection.end();
          break;
        case 'show':
          //comprueba si existe el usuario
          if(fs.existsSync('./datos/'+mensaje.usuario)){
            let usuario = new Usuario(mensaje.usuario);
            //compueba si existe el funko con ese id
            ColeccionDatos1.getDatos()?.forEach((usuario) => {
              //busca un funko con ese id con funcion find
              usuario.getFunkos().find((funko) => {
                if(funko.GetId() == mensaje.id){
                  response.success = true;
                  response.id = funko.GetId();
                  response.nombre = funko.GetNombre();
                  response.descripcion = funko.GetDescripcion();
                  response.tipo = funko.GetTipo();
                  response.genero = funko.GetGenero();
                  response.franquicia = funko.GetFranquicia();
                  response.numero = funko.GetIdFranquicia();
                  response.exclusivo = funko.GetExclusivo();
                  response.caracteristicas = funko.GetCaracteristicas();
                  response.valor = funko.GetValorNumerico();
                  connection.write(JSON.stringify(response));
                  connection.end();
                }
              })
              //si no existe el funko con ese id
              if(response.success == false){
                response.success = false;
                connection.write(JSON.stringify(response));
                connection.end();
              }
            })
          }
          break;
    }

  });
  connection.on('connect', () => {
    console.log(chalk.green('Client connected'));
  });
  connection.on('end', () => {
    console.log('Client disconnected');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
```
como podemos ver, y al igual que pasa con el cliente, este codigo es bastante similar al index de la practica anterior, pues el servidor al crearse, crea la base de datos, y cada vez que modifica algo, vuelve a guardar los datos en los archivos json. El servidor tambien tiene un switch case, que dependiendo del comando que reciba, ejecutara una funcion u otra. Por ejemplo, si recibe un comando de tipo "add", añadira un funko a la coleccion del usuario, y si recibe un comando de tipo "delete", borrara el funko de la coleccion del usuario. El servidor tambien tiene un switch case para los comandos de tipo "list", "show" y "update", que son los que se usan para listar los funkos de un usuario, mostrar un funko en concreto, y modificar un funko en concreto respectivamente.

A diferencia de en la practica anterior, en esta los mensajes tienen que ser enviados al client, por lo que no podemos usar los clasicos console.log, sino que tenemos que usar la funcion connection.write, que es la que se encarga de enviar los mensajes al cliente, en los primeros casos solo enviamos un booleano aunque en las funciones de tipo "list" y "show" enviamos tambien los datos.

##Conclusiones

En lineas generales el uso de los hilos me parece algo de especial utilidad pues puedes hacer que varios programas iteractuen entre ellos, y que puedan ejecutarse al mismo tiempo, o que por ejemplo se puedan tener simultaneamente varias funciones interactuando sin necesidad de que una termine para que comience la otra.

