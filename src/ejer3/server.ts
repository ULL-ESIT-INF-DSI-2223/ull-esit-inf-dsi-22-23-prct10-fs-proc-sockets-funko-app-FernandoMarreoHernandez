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
          ColeccionDatos1.getDatos()?.forEach((usuario) => {
      console.log(chalk.blue('Usuario: '+usuario.getDuenioColeccion()));
      usuario.getFunkos()?.forEach((funko) => {
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
