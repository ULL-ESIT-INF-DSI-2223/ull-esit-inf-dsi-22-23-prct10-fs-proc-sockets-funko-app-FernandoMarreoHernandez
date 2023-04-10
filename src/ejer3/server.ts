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
import { exit } from 'process';
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
    console.log(mensaje);
    crearBaseDatos();
    //si el mensaje es de tipo add
    switch (mensaje.type) {
      case 'add':
        const tipo = mensaje.tipo as Tipo;
        const genero = mensaje.genero as Genero;
        //crea el objeto funko con los datos del comando
        let usuario = new Usuario(mensaje.usuario);
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
        console.log(chalk.green('Funko añadido'));
        //guarda todos los datos en los archivos json
        guardarBaseDatos();
      break;
    }
  });



  /*console.log('A client has connected.');

  connection.write(JSON.stringify("Bienvenido al servidor"));
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });*/
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
