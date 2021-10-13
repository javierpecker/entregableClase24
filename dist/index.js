"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _moment = _interopRequireDefault(require("moment"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var http = _interopRequireWildcard(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _fs = _interopRequireDefault(require("fs"));

var _rutas = _interopRequireDefault(require("./routes/rutas"));

var _db = require("./services/db");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var puerto = 8080;
var server = http.Server(app);

_db.DBService.init();

server.listen(puerto, function () {
  return console.log('Server up en puerto', puerto);
});
server.on('error', function (err) {
  console.log('ERROR ATAJADO', err);
});

var layoutFolderPath = _path["default"].resolve(__dirname, '../views/layouts');

var defaultLayerPath = _path["default"].resolve(__dirname, '../views/layouts/index.hbs');

var partialFolderPath = _path["default"].resolve(__dirname, '../views/partial');

app.set('view engine', 'hbs');
app.engine('hbs', (0, _expressHandlebars["default"])({
  layoutsDir: layoutFolderPath,
  partialsDir: partialFolderPath,
  defaultLayout: defaultLayerPath,
  extname: 'hbs'
}));

var publicPath = _path["default"].resolve(__dirname, '../public');

app.use(_express["default"]["static"](publicPath));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/api', _rutas["default"]);

var readfile = function readfile() {
  var filenames = _fs["default"].readdirSync("./persistentdata");

  var found = filenames.find(function (element) {
    return "messages.txt" === element;
  });

  if (found === "messages.txt") {
    var data = _fs["default"].readFileSync("./persistentdata/messages.txt", "utf-8");

    return data;
  } else {
    console.log("Archivo no leido");
  }
};

var guardarMessages = function guardarMessages(messages) {
  _fs["default"].writeFileSync("./persistentdata/messages.txt", JSON.stringify(messages, undefined, 2), "utf-8");
};

var guardarNewMessage = function guardarNewMessage(data) {
  var messages = JSON.parse(readfile());
  var now = new Date();
  var date = (0, _moment["default"])(now).format("DD/MM/YYYY HH:MM:SS");
  var newMessage = {
    email: data.email,
    fecha: date,
    mensaje: data.mensaje
  };
  messages.push(newMessage);
  guardarMessages(messages);
};

var productos = [];
var myWSServer = (0, _socket["default"])(server);
myWSServer.on('connection', function (socket) {
  console.log('\n\nUn cliente se ha conectado');
  console.log("ID DEL SOCKET DEL CLIENTE => ".concat(socket.client.id));
  console.log("ID DEL SOCKET DEL SERVER => ".concat(socket.id));
  socket.on('new-message', function (data) {
    productos.push(data);
    socket.emit('messages', productos);
  });
  socket.on('askData', function (data) {
    var chatfile = readfile();
    socket.emit('messages', productos);
    socket.emit('message', chatfile);
  });
  socket.on("chatMessage", function (chat) {
    guardarNewMessage(chat);
    var chatfile = readfile();
    socket.emit("message", chatfile);
    socket.broadcast.emit("message", chatfile);
  });
});