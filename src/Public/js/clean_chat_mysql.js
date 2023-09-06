const socket = io();
//Obteniendo los elementos del from
const $messageForm = $('#message-form');
const $messageBox = $('#message');
const $chat = $('#chat');
const $clearChatButton = $('#clear-chat');
const $toggleDarkModeButton = $('#toggle-dark-mode');
const $menu = $('#menu');
const $clearChatButtonToMove = $('#clear-chat');
$clearChatButton.prop('disabled', true);


socket.on('user verified', () => {
    // Activar el botón de borrar el chat
$clearChatButton.prop('disabled', false);
$clearChatButton.click(function() {
  // Cambiar los estilos CSS para mostrar la ventana modal
  $('#modal2').css({
    display: 'flex',
    visibility: 'visible'
  });

  // Mostrar la ventana modal
  $('#modal2').show();
});


    $('#clear-chat-yes').click(function() {
      const chatTemplate = document.getElementById('chat-template');
      const chatElement = chatTemplate.content.cloneNode(true).querySelector('#chat');
      const chatContainer = document.getElementById('chat-container');
      chatContainer.textContent = ''; // Limpia el contenido actual del contenedor de chat
      // Asumiendo que "message" contiene el contenido del mensaje recibido
      $chat.prepend('<div class="message">' + message + '</div>');
      // Agrega el nuevo chat clonado al principio del contenedor
      //socket.emit('clear messages');
      // Ocultar la ventana modal después de limpiar el chat
      $('#modal2').hide();
    });
    
    $('#clear-chat-no').click(function() {
    
      $('#modal2').hide();
    });

// Función para limpiar la ventana del chat en el cliente
function clearChatWindow() {
  const chatContainer = document.getElementById('chat-container');
  chatContainer.innerHTML = ''; // Elimina todos los mensajes anteriores en el contenedor del chat
}

// Escucha el evento 'clear chat' y llama a la función clearChatWindow() para limpiar la ventana del chat
socket.on('clear chat', () => {
  clearChatWindow();
});
});