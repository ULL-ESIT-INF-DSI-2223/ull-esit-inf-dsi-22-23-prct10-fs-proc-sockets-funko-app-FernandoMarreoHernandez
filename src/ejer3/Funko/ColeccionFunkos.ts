import { Funko } from './Funko.js';

/**
 * Clase que representa una coleccion de Funkos
 * @class ColeccionFunkos
 * @method constructor
 * @method getFunkos
 * @method aniadirFunko
 * @method eliminarFunko
 * @method getFunko
 * @method getDuenioColeccion
 * @method setDuenioColeccion
 */
export class ColeccionFunkos {
  constructor(private funkos: Funko[], private Duenio:string) {
    this.funkos = funkos;
    this.Duenio = Duenio;
  }

  /**
   * Método que devuelve un array de funkos
   * @method getFunkos
   * @returns Funko[]
   */
  getFunkos(): Funko[] {
    return this.funkos;
  }

  /**
   * Método que añade un funko al array de funkos
   * @method aniadirFunko
   * @param funko
   * @returns void
   */
  aniadirFunko(funko_entrada: Funko) {
    this.funkos.push(funko_entrada);
    return funko_entrada;
  }

  /**
   * Método que elimina un funko del array de funkos a partir del id del funko
   * @method eliminarFunko
   * @param indice
   * @returns void
   */
  eliminarFunko(indice: number): void {
    const funko = this.funkos.find(funko => funko.GetId() === indice);
    if (funko) {
      const indiceFunko = this.funkos.indexOf(funko);
      this.funkos.splice(indiceFunko, 1);
    }
    else{
      throw new Error('No existe el funko con ese id');
    }
  }


  /**
   * Método que devuelve un funko a partir de su id
   * @method getFunko
   * @param id
   * @returns Funko
   */
  getFunko(id: number): Funko | undefined {
    const funko = this.funkos.find(funko => funko.GetId() === id);
    return funko;
  }

  /**
   * Método que devuelve el dueño de la colección
   * @method getDuenioColeccion
   * @returns string
   */
  getDuenioColeccion(): string {
    return this.Duenio;
  }

  /**
   * Método que modifica el dueño de la colección
   * @method setDuenioColeccion
   * @param duenio
   * @returns void
   */
  setDuenioColeccion(duenio: string): void {
    this.Duenio = duenio;
  }
}
