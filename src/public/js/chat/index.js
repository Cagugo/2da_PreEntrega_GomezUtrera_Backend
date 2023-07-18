console.log('Corriendo Socket.io');

const socket = io();

let user = null;

function promptEmail() {
  return swal({
    text: 'Escribe tu Email',
    content: {
      element: 'input',
      attributes: {
        placeholder: 'nombre@correo.com',
        type: 'email',
      },
    },
    button: {
      text: 'Iniciar el Chat',
      closeModal: true,
    },
  });
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function startChat() {
  promptEmail().then((name) => {
    if (!name || !validateEmail(name)) {
      swal('Dirección de Email inválida', 'Por favor, ingresa una direccion de Email válida', 'error').then(() => {
        startChat();
      });
    } else {
      user = name;
      const nameElement = document.getElementById('user-name');
      nameElement.innerHTML = `<b>Usuario conectado:</b> ${user}`;
    }
  });
}

startChat();

let message = document.getElementById('mensaje');
let btnEnviar = document.getElementById('enviar');

let chat_contenedor = document.getElementById('chat');

btnEnviar.addEventListener('click', sendMessage);

message.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  if (!user) {
    swal('Error', 'Ingresar una Dirección de Email', 'error');
    return;
  }

  if (!message.value.trim()) {
    swal('Error', 'El mensaje no puede estar vacío', 'error');
    return;
  }

  const payload = {
    user: user,
    message: message.value,
  };

  socket.emit('mensaje', payload);

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Mensaje send a la BD:', data);
      message.value = '';
    })
    .catch((error) => {
      console.error(error);
    });
}

readSockets();

function loadChat() {
  socket.on('init', (data) => {
    console.log('init', data);
    loadData(data);
  });
}

function readSockets() {
  loadChat();
  socket.on('Mensaje Nuevo', (data) => {
    loadData(data);
  });
}

function loadData(data) {
  let innerHtml = '';
  data.forEach((msj) => {
    innerHtml += `<b>${msj.user}:</b> <span>${msj.message}</span><br>`;
  });
  chat_contenedor.innerHTML = innerHtml;
}
