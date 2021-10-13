//import { Router, req, Response } from 'express';
import express from 'express';
import { publicPath } from '../../src/index';
import path from 'path';


const routerLogin = express.Router();
const usuarios = [
	{ nombre: 'admin', password: '1234' },
];


routerLogin.get('/', (req, res) => {
	if (req.session.nombre) {
	  res.redirect('/datos');
	} else {
	  res.redirect('/login');
	}
});

/* --------- LOGIN ---------- */
routerLogin.get('/login', (req, res) => {
    console.log(`${publicPath  }/login.html`)
	res.sendFile(publicPath + '/login.html');
});

routerLogin.post('/login', (req, res) => {
	const { nombre, password } = req.body;
    console.log(nombre);
    console.log(password);

	const credencialesOk = usuarios.filter(
	  (usuario) => usuario.nombre === nombre && usuario.password === password
	).length;
	if (credencialesOk) {
      //console.log()
	//   req.session.nombre = nombre;
	//   req.session.contador = 0;
	  res.redirect('/');
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
	  req.session.contador =+ 1;
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