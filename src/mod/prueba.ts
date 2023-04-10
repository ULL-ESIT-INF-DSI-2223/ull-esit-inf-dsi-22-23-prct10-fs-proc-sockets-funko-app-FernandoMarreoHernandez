import * as net from 'net';


const client = net.connect({port: 60300});


let data = '';
client.on('data', (chunk) => {
  data += chunk;
});


client.on('end', () => {
  const message = JSON.parse(data);
  if (message.type === 'watch') {
    console.log(`Connection established: watching file ${message.file}`);
  } else if (message.type === 'change') {
    console.log('File has been modified.');
    console.log(`Previous size: ${message.prevSize}`);
    console.log(`Current size: ${message.currSize}`);
  } else {
    console.log(`Message type ${message.type} is not valid`);
  }
});