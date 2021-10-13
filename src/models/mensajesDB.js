import mongoose from 'mongoose'
import { normalize, schema } from 'normalizr';



const schemaMensaje = new mongoose.Schema({
    author: {
        mail: { type: String, required: true },
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        alias: { type: String, required: true },
        edad: { type: Number, required: true },
        url :{ type: String, required: true },
    },   
    createdAt: { type: String ,required: true},
    mensaje: { type: String, required: true }
  });

const URL = 'mmongodb://localhost:27017/ecommerce';


const author = new schema.Entity('author', {}, { idAttribute: 'mail' });

const msg = new schema.Entity(
  'message',
  {
    author: author,
  },
  { idAttribute: 'id_' }
);

const msgesSchema = new schema.Array(msg);


class mensajesDB {
    constructor() {
        mongoose.connect(URL);
        this.mensajes = mongoose.model('mensajes', schemaMensaje);
    }


    async init() {
        console.log("Inicializo la base");
    };

    async get(){
        // const msjData = (await this.mensajes.find()).map((aMsg) => ({
        //     _id: aMsg._id,
        //     author: aMsg.author,
        //     mensaje: aMsg.mensaje,
        //   }));
        // const normalizedMsj = normalize(msjData, msgesSchema);
        // //console.log(normalizedMsj);
        
        return this.mensajes.find()
      }


    async create(data) {
        const newMsj = new this.mensajes(data);
        await newMsj.save();
        return newMsj;
    }
}

export const dbConnection = new mensajesDB();