import { Server } from "../mod/server.js";
import Client from "../mod/client.js";

const [command, ...args] = process.argv.slice(2);

// Ejecutar el comando en el cliente
const client = new Client("localhost", 3000);
client.executeCommand(command, args).then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
