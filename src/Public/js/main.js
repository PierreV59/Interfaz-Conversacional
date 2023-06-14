$(document).ready(function() {
  const socket = io();

  const $messageForm = $('#message-form');
  const $messageBox = $('#message');
  const $chat = $('#chat');
  const $clearChatButton = $('#clear-chat');
  const $toggleDarkModeButton = $('#toggle-dark-mode');
  const $menuButton = $('#menu-button');
  const $menu = $('#menu');
  const $clearChatButtonToMove = $('#clear-chat');

  const sunIcon = document.getElementById("sun");
  const moonIcon = document.getElementById("moon");

  sunIcon.classList.add("hidden");
  // Eventos
  $('#toggle-dark-mode').click(function() {
    $('body').toggleClass('dark-mode');
    if ($('body').hasClass('dark-mode')) {
      $('#dark-mode-text').text('Modo claro');
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
      $('.message-text .bg-gray-200').css('background-color', '#4b5563');
      $('.message-text .bg-gray-200 .text-black').css('color', '#FFFF');

    } else {
      $('#dark-mode-text').text('Modo oscuro');
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
      $('.message-text .bg-gray-200').css('background-color', '#f3f4f6');
      $('.message-text .bg-gray-200 .text-black').css('color', '#000');
    }
  });
  

  $menuButton.click(function() {
    $menu.slideToggle('fast', function() {
      const marginTop = $menu.is(':visible') ? $menu.height() + 20 : 0; 
      $clearChatButtonToMove.css('margin-top', marginTop);
    });
  });

  $(window).resize(function() {
    const marginTop = $menu.is(':visible') ? $menu.height() + 20 : 0; 
    $clearChatButtonToMove.css('margin-top', marginTop);
  });

    socket.on('clear messages', function() {
    $chat.empty();
  })

  const scrollDownBtn = document.getElementById('scrollDownBtn');
  const chatContainer = document.getElementById('chat');

  scrollDownBtn.addEventListener('click', () => {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    checkScrollPosition();
  });
  
  function checkScrollPosition() {
    const isAtBottom = chatContainer.scrollTop === (chatContainer.scrollHeight - chatContainer.clientHeight);
    if (isAtBottom) {
      scrollDownBtn.style.display = 'none';
    } else {
      scrollDownBtn.style.display = 'block';
    }
  }
  chatContainer.addEventListener('scroll', () => {
    checkScrollPosition();
  });


  // 
  ////
  ////WEB COMPONENT DEL FILTRO DE BUSQUEDA DE CONVERSACIÓN
  ////
  //

   //BUSQUEDA DE CONVERSACIÓN
   const searchInput = document.getElementById('search-input');
   const messages = document.getElementsByClassName('message-text');
   const messageContainer = document.getElementById('message-container');
   const originalMessages = Array.from(messages); 
   const noResultsMessage = document.getElementById('no-results');
   
   searchInput.addEventListener('input', function() {
     const searchTerm = searchInput.value.toLowerCase();
     let hasResults = false; 
     
     for (let i = 0; i < messages.length; i++) {
       const messageText = messages[i].textContent.toLowerCase();
       
       if (messageText.includes(searchTerm)) {
         messages[i].classList.remove('hidden');
         hasResults = true; 
       } else {
         messages[i].classList.add('hidden');
       }
     }

     if (!hasResults) {
       noResultsMessage.classList.remove('hidden');
     } else {
       noResultsMessage.classList.add('hidden');
     }
   });
   searchInput.addEventListener('keyup', function(event) {
     if (event.keyCode === 27 || event.code === 'Escape') {
       searchInput.value = '';
       for (let i = 0; i < originalMessages.length; i++) {
         originalMessages[i].classList.remove('hidden');
       }
   
       noResultsMessage.classList.add('hidden');
     }
   });
  // 
  ////
  ////WEB COMPONENT DEL FILTRO DE BUSQUEDA DE CONVERSACIÓN
  ////
  //
});
