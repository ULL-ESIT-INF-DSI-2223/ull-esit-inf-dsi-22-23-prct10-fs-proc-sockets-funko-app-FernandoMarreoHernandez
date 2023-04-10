import * as net from "net";
import * as child_process from "child_process";

/**
 * Servidor que ejecuta comandos en el sistema operativo
 * y devuelve el resultado al cliente.
 * @method start Inicia el servidor
 * @method handleConnection Maneja la conexion con el cliente
 */
export class Server {
  //atributo de la clase
  private server: net.Server;

  /**
   * constructor de la clase
   * @param port 
   */
  constructor(private port: number) {}

  /** 
   * Inicia el servidor
   * @returns void
   */
  public start(): void {
    
    this.server = net.createServer({allowHalfOpen: true}){
      console.log("llega un cliente");

      client.on("data", (data) => {
        // recupera el comando
        const command = data.toString().trim();
        console.log(`entra un comando: ${command}`);
        //subproceso que ejecuta el comando
        child_process.exec(command, (error, stdout, stderr) => {
          if (error) {
            console.log(`esto creo que no es un comando: ${error.message}`);
            client.write(JSON.stringify({ error: error.message }));
          } else {
            console.log(`ejecutado el comando: ${command}`);
            client.write(JSON.stringify({ stdout: stdout, stderr: stderr }));
          }
          client.end();
        });
      });
  
      client.on("end", () => {
        console.log("se cierra la conexion");
      });
    }
    };
    this.server.listen(this.port, () => {
      console.log(`el servidor conectado en el ${this.port}`);
    });
  }

  /**
   * Maneja la conexion con el cliente
   * @param client
   * @returns void
   */
  private handleConnection(client: net.Socket): void {
    
}

export default Server;

const server = new Server(3000);
server.start();