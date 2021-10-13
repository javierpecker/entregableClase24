import moment from "moment";
import io from 'socket.io';
import { dbConnection } from '../../models/mensajesDB';




const guardarNewMessage = (data) => {
    const now = new Date();
    const date = moment(now).format("DD/MM/YYYY HH:MM:SS");
    const newMessage = { 
      author: { 
        mail: data.author.mail, 
        nombre: data.author.nombre,
        apellido: data.author.apellido,
        alias: data.author.alias,
        edad: data.author.edad,
        url: data.author.url,
      },  
      createdAt: date,  
      mensaje: data.mensaje,
       };
    dbConnection.create(newMessage);
  };

const productos = [];

export const initWSServer = (server) => {
    const myWSServer = io(server);
    myWSServer.on('connection', (socket) => {
    console.log('\n\nUn cliente se ha conectado');
    console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
    console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);
  
    socket.on('new-message', (data) => {
      productos.push(data);
      socket.emit('messages', productos);
    });
  
    socket.on('askData', () => {
        dbConnection.get().then(chatfile => {
        socket.emit('messages', productos);
        socket.emit('message', chatfile);
      });
    });
  
    socket.on("chatMessage", (chat) => {
      guardarNewMessage(chat);
      dbConnection.get().then(chatfile => {
        socket.emit('message', chatfile);
        // socket.broadcast.emit("message", chatfile);
      });  
    });
  });
};