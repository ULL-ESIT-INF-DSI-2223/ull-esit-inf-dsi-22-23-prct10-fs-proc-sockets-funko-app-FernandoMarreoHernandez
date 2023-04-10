import chalk from "chalk";
import { exit } from "process";

/**
 * enumerable que contiene los generos de los Funkos
 */
export enum Genero {
  Animacion = 'Animacion',
  PeliculasYTv = 'Peliculas y TV',
  Videojuegos = 'Videojuegos',
  Deportes = 'Deportes',
  Musica = 'Musica',
  Anime = 'Anime',
  Otros = 'Otros',
}

/**
 * enumerable que contiene los tipos de los Funkos
 */
export enum Tipo {
  Pop = 'Pop!',
  PopVinilo = 'Pop! Vinilo',
  PopRides = 'Pop! Rides',
  PopVinilGold = 'Pop! Vinilo Gold',
  PopXXL = 'Pop! XXL',
}


/**
 * Clase Funko
 * @param id id del Funko
 * @param nombre nombre del Funko
 * @param Genero genero del Funko
 * @param Tipo tipo del Funko
 * @param Franquicia franquicia del Funko
 * @param idFranquicia id de la franquicia del Funko
 * @param exclusivo si el Funko es exclusivo o no
 * @param caracteristicas caracteristicas del Funko
 * @param valorNumerico valor numerico del Funko en el mercado
 * @method GetId() devuelve el id del Funko
 * @method GetNombre() devuelve el nombre del Funko
 * @method GetGenero() devuelve el genero del Funko
 * @method GetTipo() devuelve el tipo del Funko
 * @method GetFranquicia() devuelve la franquicia del Funko
 * @method GetIdFranquicia() devuelve el id de la franquicia del Funko
 * @method GetExclusivo() devuelve si el Funko es exclusivo o no
 * @method GetCaracteristicas() devuelve las caracteristicas del Funko
 * @method GetValorNumerico() devuelve el valor numerico del Funko en el mercado
 * @method SetId() cambia el id del Funko
 * @method SetNombre() cambia el nombre del Funko
 * @method SetGenero() cambia el genero del Funko
 * @method SetTipo() cambia el tipo del Funko
 * @method SetFranquicia() cambia la franquicia del Funko
 * @method SetIdFranquicia() cambia el id de la franquicia del Funko
 * @method SetExclusivo() cambia si el Funko es exclusivo o no
 * @method SetCaracteristicas() cambia las caracteristicas del Funko
 * @method SetValorNumerico() cambia el valor numerico del Funko en el mercado
 */
export class Funko{
  static id = new Set<number>();
  static idFranquicia = new Set<number>();
  static Franquicia = new Set<string>();
  static nombre = new Set<string>();
  private id: number;
  private nombre: string;
  private descripcion: string;
  private Genero: Genero;
  private Tipo: Tipo;
  private Franquicia: string;
  private idFranquicia: number;
  private exclusivo: boolean;
  private caracteristicas: string;
  private valorNumerico: number;
  constructor(
    id: number,
    nombre: string,
    descripcion: string,
    Genero: Genero,
    Tipo: Tipo,
    Franquicia: string,
    idFranquicia: number,
    exclusivo: boolean,
    caracteristicas: string,
    valorNumerico: number,
  ){
    try{
      //comprueba si existe otro funko con el mismo id
      if (Funko.id.has(id)) {
        throw new Error('El id ya en uso');
      }
      //comprueba si con la misma franquicia existe otro funko con el mismo id de franquicia
      if (Funko.idFranquicia.has(idFranquicia) && Funko.Franquicia.has(Franquicia)) {
        //comprueba si existe otro funko con el mismo nombre y distinto idfranquicia
        if (!Funko.nombre.has(nombre) && Funko.idFranquicia.has(idFranquicia)) {
          throw new Error('El id de la franquicia ya en uso');
        }
      }
      if (valorNumerico < 0) {
        throw new Error('El valor numerico no puede ser negativo');
      }
    }catch(error){
      console.log(chalk.red(error.message));
      exit(1);
    }
    //funcion que comprueba si el objeto tiene el id de la franquicia y el nombre de la franquicia
    this.id = id;
    Funko.id.add(id);
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.Genero = Genero;
    this.Tipo = Tipo;
    this.Franquicia = Franquicia;
    Funko.Franquicia.add(Franquicia);
    this.idFranquicia = idFranquicia;
    Funko.idFranquicia.add(idFranquicia);
    this.exclusivo = exclusivo;
    this.caracteristicas = caracteristicas;
    this.valorNumerico = valorNumerico;
  }
  /**
   * Funcion que devuelve el id del Funko
   * @returns id
   */
  GetId(): number {
    return this.id;
  }
  /**
   * Funcion que devuelve el id de la franquicia del Funko
   * @returns idFranquicia
   */
  GetIdFranquicia(): number {
    return this.idFranquicia;
  }
  /**
   * Funcion que devuelve el nombre del Funko
   * @returns nombre
   * */
  GetNombre(): string {
    return this.nombre;
  }
  /**
   * Funcion que devuelve el genero del Funko
   * @returns genero
   * */
  GetGenero(): Genero {
    return this.Genero;
  }
  /**
   * Funcion que devuelve el tipo del Funko
   * @returns tipo
   * */
  GetTipo(): Tipo {
    return this.Tipo;
  }
  /**
   * Funcion que devuelve la franquicia del Funko
   * @returns franquicia
   * */
  GetFranquicia(): string {
    return this.Franquicia;
  }
  /**
   * Funcion que devuelve si el Funko es exclusivo o no
   * @returns exclusivo
   * */
  GetExclusivo(): boolean {
    return this.exclusivo;
  }
  /**
   * Funcion que devuelve las caracteristicas del Funko
   * @returns caracteristicas
   * */
  GetCaracteristicas(): string {
    return this.caracteristicas;
  }
  /**
   * Funcion que devuelve el valor numerico del Funko
   * @returns valorNumerico
   * */
  GetValorNumerico(): number {
    return this.valorNumerico;
  }

  /**
   * Funcion que devuelve la descripcion del Funko
   * @returns descripcion
   * */
  GetDescripcion(): string {
    return this.descripcion;
  }

  /**
   * Setid
   * @param id
   * */
  public SetId(id: number) {
    this.id = id;
  }

  /**
   * SetNombre
   */
  public SetNombre(nombre: string) {
    this.nombre = nombre;
  }

  /**
   * SetDescripcion
   * @param descripcion
   * */
  public SetDescripcion(descripcion: string) {
    this.descripcion = descripcion;
  }

  /**
   * SetGenero
   * @param genero
   * */
  public SetGenero(genero: Genero) {
    this.Genero = genero;
  }

  /**
   * SetTipo
   * @param tipo
   * */
  public SetTipo(tipo: Tipo) {
    this.Tipo = tipo;
  }

  /**
   * SetFranquicia
   * @param franquicia
   * */
  public SetFranquicia(franquicia: string) {
    this.Franquicia = franquicia;
  }

  /**
   * SetIdFranquicia
   * @param idFranquicia
   * */
  public SetIdFranquicia(idFranquicia: number) {
    this.idFranquicia = idFranquicia;
  }

  /**
   * SetExclusivo
   * @param exclusivo
   * */
  public SetExclusivo(exclusivo: boolean) {
    this.exclusivo = exclusivo;
  }

  /**
   * SetCaracteristicas
   * @param caracteristicas
   * */
  public SetCaracteristicas(caracteristicas: string) {
    this.caracteristicas = caracteristicas;
  }

  /**
   * SetValorNumerico
   * @param valorNumerico
   * */
  public SetValorNumerico(valorNumerico: number) {
    this.valorNumerico = valorNumerico;
  }
}
