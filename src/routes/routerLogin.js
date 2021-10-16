import { Router, request, Response } from 'express';
import express from 'express';
import cookieParser from 'cookie-parser'
import path from 'path';
import { publicPath } from "../index";



const app = express();


const routerLogin = express.Router();
const usuarios = [
	{ nombre: 'admin', password: '1234' },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


routerLogin.get('/', (req, res) => {
    console.log('esta el usuario?',req.session.nombre)
	if (req.session.nombre) {
        res.redirect('/datos');
      } else {
        res.redirect('/login');
      }
  });

/* --------- LOGIN ---------- */
routerLogin.get('/login', (req, res) => {
	res.sendFile(publicPath + '/login.html');
});

routerLogin.post('/login', (req, res) => {
	const { nombre, password } = req.body;
	const credencialesOk = usuarios.filter(
	  (usuario) => usuario.nombre === nombre && usuario.password === password
	).length;
	if (credencialesOk) {
	  req.session.nombre = nombre;
	  req.session.contador = 0;
	  res.redirect('/');
      console.log(req.session)
	} else {
	  res.render('login-error', {});
	}
});

routerLogin.get('/register', (req, res) => {
	const registerPath = path.resolve(__dirname, '/index.html');
	res.sendFile(publicPath + registerPath);
});


routerLogin.post('/register', (req, res) => {
	let { nombre } = req.body;
	let encontrado = usuarios.filter(
	  (usuario) => usuario.nombre == nombre
	).length;
	if (!encontrado) {
	  usuarios.push(req.body);
	  req.session.nombre = nombre;
	  req.session.contador = 0;
	  res.redirect('/');
	} else {
	  res.render('register-error', {});
	}
});


routerLogin.get('/datos', (req, res) => {
	if (req.session.nombre) {
	  req.session.contador ++;
      console.log(req.session.contador)
	  res.render('datos', {
		datos: usuarios.find((usuario) => usuario.nombre == req.session.nombre),
		contador: req.session.contador,
	  });
	} else {
	  res.redirect('/login');
	}
});

routerLogin.get('/logout', (req, res) => {
	req.session.destroy((err) => {
	  res.redirect('/');
	});
});



   

export default routerLogin;