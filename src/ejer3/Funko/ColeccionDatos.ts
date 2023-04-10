import { ColeccionFunkos } from "./ColeccionFunkos.js";
import { Funko,Genero,Tipo } from "./Funko.js";
/**
 * Clase que representa una coleccion de Funkos
 * @class ColeccionFunkos
 * @method constructor
 * @method getDatos
 * @method getDatosUsuario
 * @method aniadirDatos
 * @method eliminarDatos
 */
export class ColeccionDatos {
  constructor(private datos: ColeccionFunkos[]) {

    this.datos = datos;
  }
  /**
   * getter para obtener los datos
   * @returns ColeccionFunkos[]
   */
  getDatos(): ColeccionFunkos[] {
    return this.datos;
  }
  /**
   * Método que devuelve un array de funkos
   * @method getDatosUsuario
   * @returns ColeccionFunkos | undefined
   */
  getDatosUsuario(nombre: string): ColeccionFunkos | undefined {
    const datos = this.datos.find((c) => c.getDuenioColeccion() === nombre);
    return datos;
  }
  /**
   * Método que añade un funko al array de funkos
   * @method aniadirDatos
   * @param coleccion
   * @returns void
   */
  aniadirDatos(coleccion: ColeccionFunkos): void {
    this.datos.push(coleccion);
  }
  /**
   * Método que elimina un funko del array de funkos a partir del id del funko
   * @method eliminarDatos
   * @param nombre
   * @returns void
   */
  eliminarDatos(nombre : string): void {
    this.datos = this.datos.filter((c) => c.getDuenioColeccion() !== nombre);
  }
}
