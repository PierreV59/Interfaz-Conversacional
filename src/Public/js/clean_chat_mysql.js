const socket = io();
//Obteniendo los elementos del from
const $messageForm = $('#message-form');
const $messageBox = $('#message');
const $chat = $('#chat');
const $clearChatButton = $('#clear-chat');
const $toggleDarkModeButton = $('#toggle-dark-mode');
const $menuButton = $('#menu-button');
const $menu = $('#menu');
const $clearChatButtonToMove = $('#clear-chat');
$clearChatButton.click(function() {
    // Eliminar atributo de datos para permitir la creación de nuevos botones de confirmación
    $clearChatButton.removeData('confirm-buttons');
    
    // Verificar si los botones de confirmación ya están presentes
    if (!$clearChatButton.data('confirm-buttons')) {
      // Eliminar botones de confirmación anteriores
      $clearChatButton.find('.clear-chat-confirm').remove();
  
      // Agregar botones de confirmación
      $clearChatButton.append('<div class="clear-chat-confirm flex">' +
      '<button id="clear-chat-yes" class="bg-transparent ml-12">' +
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block align-middle mr-2" viewBox="0 0 20 20" fill="currentColor">' +
          '<path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>' +
        '</svg>' +
      '</button>' +
      '<button id="clear-chat-no" class="bg-transparent ml-2">' +
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block align-middle mr-2" viewBox="0 0 20 20" fill="currentColor">' +
          '<path fill-rule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm2.12 9.88a1 1 0 1 1-1.41 1.41L10 11.41l-1.71 1.71a1 1 0 1 1-1.41-1.41L8.59 10l-1.7-1.71a1 1 0 1 1 1.41-1.41L10 8.59l1.71-1.71a1 1 0 0 1 1.41 1.41L11.41 10l1.71 1.71z" clip-rule="evenodd"/>' +
        '</svg>' +
      '</button>' +
    '</div>');
  
      // Establecer el atributo de datos para indicar que los botones ya están presentes
      $clearChatButton.data('confirm-buttons', true);
    }

    // Mostrar botones de confirmación y ocultar ícono
    $clearChatButton.find('.clear-chat-confirm').show();
    $clearChatButton.find('.clear-chat-icon').hide();

    // Eliminar eventos click anteriores
    $('#clear-chat-yes, #clear-chat-no').off('click');
  
    // Agregar eventos a los botones de confirmación
    $('#clear-chat-yes').click(function() {
      $chat.empty();
      socket.emit('clear messages');
      // Ocultar botones de confirmación y mostrar ícono de confirmación
      $clearChatButton.find('.clear-chat-confirm').hide();
      $clearChatButton.find('.clear-chat-icon.success').show();
      
      // Eliminar botones de confirmación
      $clearChatButton.find('.clear-chat-confirm').remove();
    });
  
    $('#clear-chat-no').click(function() {
      // Ocultar botones de confirmación y mostrar ícono de cancelación
      $clearChatButton.find('.clear-chat-confirm').hide();
      $clearChatButton.find('.clear-chat-icon.cancel').show();
      
      // Eliminar botones de confirmación
      $clearChatButton.find('.clear-chat-confirm').remove();
    });
  
    $('#clear-chat-yes').click(function() {
      $chat.empty();
      socket.emit('clear messages');
      chat.innerHTML = ''; 
    
      // Ocultar botones de confirmación y mostrar ícono de confirmación
      $clearChatButton.find('.clear-chat-confirm').hide();
      $clearChatButton.find('.clear-chat-icon.success').show();
    
      // Esperar un segundo antes de eliminar los botones de confirmación
      setTimeout(function() {
        // Eliminar botones de confirmación
        $clearChatButton.find('.clear-chat-confirm').remove();
      }, 1000);
    });
  
    $('#clear-chat-no').click(function() {
    
      // Ocultar botones de confirmación y mostrar ícono de confirmación
      $clearChatButton.find('.clear-chat-confirm').hide();
      $clearChatButton.find('.clear-chat-icon.success').show();
    
      // Esperar un segundo antes de eliminar los botones de confirmación
      setTimeout(function() {
        // Eliminar botones de confirmación
        $clearChatButton.find('.clear-chat-confirm').remove();
      }, 500);
    });
  });