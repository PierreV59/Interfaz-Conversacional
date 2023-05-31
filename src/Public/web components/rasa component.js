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

    // Listen for new user messages and add them to the chat
    socket.on('new user message', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');

      const userMessage = document.createElement('div');
      userMessage.classList.add('bg-blue-500', 'p-6', 'w-96', 'rounded-3xl', 'rounded-br-none', 'self-end');
      userMessage.innerHTML = `
        <small class="text-white rounded font-light">${data.message}</small>
      `;

      const userMessageTime = document.createElement('small');
      userMessageTime.classList.add('text-gray-500', 'font-light', 'self-end');
      userMessageTime.textContent = time;

      messageContainer.appendChild(userMessage);
      messageContainer.appendChild(userMessageTime);

      chatContainer.appendChild(messageContainer);
      messageContainer.scrollIntoView(); // Desplaza automáticamente hacia abajo

      // chatContainer.scrollTop = chatContainer.scrollHeight; (comenta esta línea)
    });

    // Listen for new bot messages and add them to the chat
    socket.on('new bot message', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text', 'animate__animated', 'animate__fadeIn');

      if (data.error) {
        const botErrorMessage = document.createElement('div');
        botErrorMessage.classList.add('bg-gray-200', 'p-6', 'w-96', 'rounded-3xl', 'rounded-bl-none', 'self-start');
        botErrorMessage.innerHTML = `
          <small class="text-black rounded font-light">${data.message}</small>
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
          botMessage.classList.add('bg-gray-200', 'p-6', 'w-96', 'rounded-3xl', 'rounded-bl-none', 'self-start');
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
      messageContainer.scrollIntoView();

      // chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  }
}

customElements.define('chat-component', ChatComponent);
