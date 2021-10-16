import express, { application } from 'express';
import session from 'express-session'
import path from 'path';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser'
import * as http from 'http';

import routerRead from './routes/routerProduct';
import routerLogin from './routes/routerLogin';
import { dbConnection } from './models/mensajesDB';
import { initWSServer } from './api/sockets';


const app = express();
const puerto = 8080;
const server = http.Server(app);

dbConnection.init();
initWSServer(server);

server.listen(puerto, () =>
  console.log('Server up en puerto', puerto)
);
server.on('error', (err) => {
  console.log('ERROR ATAJADO', err);
});

const layoutFolderPath = path.resolve(__dirname, '../views/layouts');
const defaultLayerPath = path.resolve(__dirname, '../views/layouts/index.hbs');
const partialFolderPath = path.resolve(__dirname, '../views/partial');
app.set('view engine', 'hbs');

app.engine(
  'hbs',
  handlebars({
    layoutsDir: layoutFolderPath,
    partialsDir: partialFolderPath,
    defaultLayout: defaultLayerPath,
    extname: 'hbs',
  })
);

export const publicPath = path.resolve(__dirname, '../public');

app.use(cookieParser());
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: '1234',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 150000,
    },
  })
);
app.use('/api', routerRead);
app.use('/', routerLogin);



