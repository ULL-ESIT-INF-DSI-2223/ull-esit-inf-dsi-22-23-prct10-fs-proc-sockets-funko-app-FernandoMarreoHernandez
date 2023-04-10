/**
 * Clase que representa un usuario
 * @param nombre nombre del usuario
 * @method GetNombre() getter que retorna el nombre del usuario
 */
export class Usuario{
  constructor(private nombre: string){};
  /**
   * Getter que retorna el nombre de usuario
   * @returns nombre
   */
  GetNombre(): string{
    return this.nombre;
  }
}
