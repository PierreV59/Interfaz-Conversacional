class ChatComponent extends HTMLElement {
  constructor() {
    super();

    const template = document.querySelector('#chat-template');
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    const chatContainer = this.querySelector('#chat-container');
    const scrollDownButton = this.querySelector('#scrollDownBtn');

    scrollDownButton.addEventListener('click', () => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    // Agregar estilos para el modo oscuro
    const addDarkModeStyles = () => {
      chatContainer.classList.add('dark-mode');
    };

    // Quitar estilos para el modo oscuro
    const removeDarkModeStyles = () => {
      chatContainer.classList.remove('dark-mode');
    };

    // Escuchar el evento de cambio de modo oscuro
    $('#toggle-dark-mode').click(function() {
      $('body').toggleClass('dark-mode');
      if ($('body').hasClass('dark-mode')) {
        $('#dark-mode-text').text('Modo claro');
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
        addDarkModeStyles();
      } else {
        $('#dark-mode-text').text('Modo oscuro');
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
        removeDarkModeStyles();
      }
    });


    // Listen for new user messages and add them to the chat
    socket.on('new user message', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');
    
      const userMessage = document.createElement('div');
      userMessage.classList.add('bg-blue-500', 'p-6', 'rounded-3xl', 'rounded-br-none', 'self-end');
      userMessage.innerHTML = `
        <small class="text-white rounded font-light" style="font-family: 'Poppins', sans-serif;">${data.message}</small>
      `;
    
      const userMessageTime = document.createElement('small');
      userMessageTime.classList.add('text-gray-500', 'font-light', 'self-end');
      userMessageTime.textContent = time;
    
      messageContainer.appendChild(userMessage);
      messageContainer.appendChild(userMessageTime);
    
      chatContainer.appendChild(messageContainer);
      messageContainer.scrollIntoView({ behavior: 'smooth' });
    });


    socket.on('new user CREDENCIALES', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');
    
      const userMessage = document.createElement('div');
      userMessage.classList.add('bg-blue-500', 'p-6', 'rounded-3xl', 'rounded-br-none', 'self-end');
      userMessage.innerHTML = `
        <small class="text-white rounded font-light" style="font-family: 'Poppins', sans-serif;">${data.message}</small>
      `;
    
      const userMessageTime = document.createElement('small');
      userMessageTime.classList.add('text-gray-500', 'font-light', 'self-end');
      userMessageTime.textContent = time;
    
      messageContainer.appendChild(userMessage);
      messageContainer.appendChild(userMessageTime);
    
      chatContainer.appendChild(messageContainer);
      messageContainer.scrollIntoView({ behavior: 'smooth' });
    });


    socket.on('new user VALIDATION', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');
    
      const botErrorMessage = document.createElement('div');
      botErrorMessage.classList.add('bg-gray-200', 'p-6', 'rounded-3xl', 'rounded-bl-none', 'self-start');
      botErrorMessage.innerHTML = `
        <small class="text-black rounded font-light" style="font-family: 'Poppins', sans-serif;">${data.message}</small>
      `;
    
      const botErrorMessageTime = document.createElement('small');
      botErrorMessageTime.classList.add('text-gray-500', 'font-light', 'self-start');
      botErrorMessageTime.textContent = time;
    
      messageContainer.appendChild(botErrorMessage);
      messageContainer.appendChild(botErrorMessageTime);
    
      chatContainer.appendChild(messageContainer);
      messageContainer.scrollIntoView({ behavior: 'smooth' });
    });

    socket.on('new user r', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');
    
      const botErrorMessage = document.createElement('div');
      botErrorMessage.classList.add('bg-gray-200', 'p-6', 'rounded-3xl', 'rounded-bl-none', 'self-start');
      botErrorMessage.innerHTML = `
        <small class="text-black rounded font-light" style="font-family: 'Poppins', sans-serif;">${data.message}</small>
      `;
    
      const botErrorMessageTime = document.createElement('small');
      botErrorMessageTime.classList.add('text-gray-500', 'font-light', 'self-start');
      botErrorMessageTime.textContent = time;
    
      messageContainer.appendChild(botErrorMessage);
      messageContainer.appendChild(botErrorMessageTime);
    
      chatContainer.appendChild(messageContainer);
      messageContainer.scrollIntoView({ behavior: 'smooth' });
      console.log(data.message)
    });
    
    socket.on('new bot message', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');
    
      if (data.error) {
        const botErrorMessage = document.createElement('div');
        botErrorMessage.classList.add('bg-gray-200', 'p-6', 'rounded-3xl', 'rounded-bl-none', 'self-start');
        botErrorMessage.innerHTML = `
          <small class="text-black rounded font-light" style="font-family: 'Poppins', sans-serif;">${data.message}</small>
        `;
    
        const botErrorMessageTime = document.createElement('small');
        botErrorMessageTime.classList.add('text-gray-500', 'font-light', 'self-start');
        botErrorMessageTime.textContent = time;
    
        messageContainer.appendChild(botErrorMessage);
        messageContainer.appendChild(botErrorMessageTime);
      } else {
        data.messages.forEach((message) => {
          const botMessageContainer = document.createElement('div');
          botMessageContainer.classList.add('flex', 'flex-col', 'items-start');
    
          const botMessage = document.createElement('div');
          botMessage.classList.add('bg-gray-200', 'p-6', 'rounded-3xl', 'rounded-bl-none', 'self-start' );
          botMessage.textContent = message;
          botMessage.style.fontFamily = "'Poppins', sans-serif";
          botMessage.style.fontSize = data.fontSize;
    
          const botMessageTime = document.createElement('small');
          botMessageTime.classList.add('text-gray-500', 'font-light', 'self-start');
          botMessageTime.textContent = time;
    
          botMessageContainer.appendChild(botMessage);
          botMessageContainer.appendChild(botMessageTime);
    
          messageContainer.appendChild(botMessageContainer);
        });
      }
    
      chatContainer.appendChild(messageContainer);
      messageContainer.scrollIntoView({ behavior: 'smooth' });
    });
    

    socket.on('new bot VALIDATIONS', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');
    
      if (data.error) {
        const botErrorMessage = document.createElement('div');
        botErrorMessage.classList.add('bg-gray-200', 'p-6', 'rounded-3xl', 'rounded-bl-none', 'self-start');
        botErrorMessage.innerHTML = `
          <small class="text-black rounded font-light" style="font-family: 'Poppins', sans-serif;">${data.message}</small>
        `;
    
        const botErrorMessageTime = document.createElement('small');
        botErrorMessageTime.classList.add('text-gray-500', 'font-light', 'self-start');
        botErrorMessageTime.textContent = time;
    
        messageContainer.appendChild(botErrorMessage);
        messageContainer.appendChild(botErrorMessageTime);
      } else {
        data.messages.forEach((message) => {
          const botMessageContainer = document.createElement('div');
          botMessageContainer.classList.add('flex', 'flex-col', 'items-start');
    
          const botMessage = document.createElement('div');
          botMessage.classList.add('bg-gray-200', 'p-6', 'rounded-3xl', 'rounded-bl-none', 'self-start');
          botMessage.textContent = message;
    
          const botMessageTime = document.createElement('small');
          botMessageTime.classList.add('text-gray-500', 'font-light', 'self-start');
          botMessageTime.textContent = time;
    
          botMessageContainer.appendChild(botMessage);
          botMessageContainer.appendChild(botMessageTime);
    
          messageContainer.appendChild(botMessageContainer);
        });
      }
    
      chatContainer.appendChild(messageContainer);
      messageContainer.scrollIntoView({ behavior: 'smooth' });
    });
    let storedToken; // Declarar la variable en un ámbito más amplio

    socket.on('authentication token', ({ token }) => {
      // Aquí puedes manejar el token recibido del servidor
      console.log('Token recibido del servidor:', token);
    
      // Almacena el token en el almacenamiento local
      localStorage.setItem('authToken', token);
    
      // Asigna el token a la variable storedToken
      storedToken = token;
    });
    
    try {
      // Obtén el token almacenado en el almacenamiento local
      storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        // Envía el token almacenado al servidor para su verificación
        socket.emit('authentication token', { token: storedToken });
        console.log('Token almacenado:', storedToken);
      }
    } catch (error) {
      console.error('Error al acceder al almacenamiento local:', error);
    }
    
  
  }
}

customElements.define('chat-component', ChatComponent);
