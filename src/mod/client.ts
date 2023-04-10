import * as net from "net";

/**
 * Cliente que ejecuta comandos en el sistema operativo
 * y devuelve el resultado al cliente.
 * @method executeCommand Ejecuta el comando en el cliente
 */
export class Client {
  //atributo de la clase
  private socket: net.Socket;

  /**
   * constructor de la clase
   * @param host
   * @param port
   */
  constructor(private host: string, private port: number) {
    this.socket = new net.Socket();
  }

  /**
   * Ejecuta el comando en el cliente
   * @param command
   * @param args
   * @returns Promise<string>
   */
  public executeCommand(command: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket.connect(this.port, this.host, () => {
        console.log("estamos dentro del server");
        this.socket.write(`${command} ${args.join(" ")}`);
      });

      this.socket.on("data", (data) => {
        const result = JSON.parse(data.toString());
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result.stdout);
        }
        this.socket.destroy();
      });

      this.socket.on("close", () => {
        console.log("conexion cerrada");
      });
    });
  }
}

export default Client;
