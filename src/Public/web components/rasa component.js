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

    const addDarkModeStyles = () => {
      chatContainer.classList.add('dark-mode');
    };

    const removeDarkModeStyles = () => {
      chatContainer.classList.remove('dark-mode');
    };

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

    let storedToken;

    socket.on('token expired', () => {
      console.log('El token ha expirado en el servidor, eliminando del local storage.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('Identificacion');
      localStorage.removeItem('userId');

    });
    
    socket.on('authentication token', ({ token, userId, identification }) => {
      console.log('Token recibido del servidor:', token);
      console.log('UserId recibido del servidor:', userId);
      console.log('Identificacion recibido del servidor:', identification);

      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('Identificacion', identification);
      storedToken = token;
    });
    
    
    try {
      storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        const userId = localStorage.getItem('userId');
        const identification = localStorage.getItem('Identificacion');
        socket.emit('authentication token', { token: storedToken, userId: userId, identification: identification });
        console.log('Token almacenado:', storedToken);
        console.log('User almacenado:', userId);
        console.log('Identificacion almacenado:', identification);

      }
    } catch (error) {
      console.error('Error al acceder al almacenamiento local:', error);
    }
  
  }
}

customElements.define('chat-component', ChatComponent);
