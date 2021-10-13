
const socket = io.connect("http://localhost:8080", { forceNew: true });

socket.emit('askData');

function sendData(e) {
  const formData = {
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      thumbnail: document.getElementById("thumbnail").value
  }
  console.log(formData);
  socket.emit('new-message', formData);
  return false;
}

function render(data) {
  const html = data
    .map(function (elem, index) {
      console.log(elem)
      return `<tr>
                <td>${elem.title}</td>
                <td>${elem.price}</td>
                <td><img style="width: 50px" src="${elem.thumbnail}"></img></td>
            </tr>`;
      })
      .join(' ');

  document.getElementById('lista').innerHTML = html;
}

socket.on("message", (chat) => {
  console.log("emitiendo");
  const html = chat
    .map((mensaje) => {
      console.log("este mensaje:",mensaje)
      return `<div>
                 <div class="">${mensaje.createdAt} ${mensaje.author.mail} dice: </div>
                 <div class="">${mensaje.mensaje}</div>
                 <div class="">---------------------- </div>
                 <div class="">---------------------- </div>
              </div>`;
    })
    .join(" ");
  document.getElementById("chat").innerHTML = html;
});

const chatForm = document.getElementById("chatform");
console.log(chatForm)
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const chat = {
    author: {
      mail: e.target.elements.mail.value,
      nombre: e.target.elements.nombre.value,
      apellido: e.target.elements.apellido.value,
      alias: e.target.elements.alias.value,
      edad: e.target.elements.edad.value,
      url: e.target.elements.url.value,
    },
    mensaje: e.target.elements.msg.value,
  };

  if (!msg) {
    return false;
  }

  // enviar chat al servidor
  console.log("datos", chat)
  socket.emit("chatMessage", chat);

  // borrar el input
  e.target.elements.msg.value = "";
  e.target.elements.mail.value = "";
  e.target.elements.msg.focus();
});


socket.on('messages', function (data) {
  console.log('RECIBI MENSAJE');
  render(data);
});