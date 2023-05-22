/*socket.on('new message', function(data) {
  const now = new Date();
  const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

  $chat.append('<div class="flex flex-col message-text">' +
    '<div class="bg-blue-500 p-6 w-96 rounded-3xl rounded-br-none self-end">' +
    '<small class="text-white rounded font-light">' + data.message + '</small>' +
    '</div>' +
    '<small class="text-gray-500 font-light self-end">' + time + '</small>' +
    '</div>' +
    '<div class="flex flex-col message-text">' +
    '<div id="Chatbot" class="bg-gray-200 p-6 w-96 rounded-3xl rounded-bl-none self-start">' +
    '<small class="text-gray-600 rounded font-light">' + data.response + '</small>' +
    '</div>' +
    '<small class="text-gray-500 font-light self-start">' + time + '</small>' +
    '</div>'
  );
});*/

class ChatComponent extends HTMLElement {
  constructor() {
    super();

    // Clone the chat template and attach it to the component
    const template = document.querySelector('#chat-template');
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    // Get the chat container and scroll down button
    const chatContainer = this.querySelector('#chat-container');
    const scrollDownButton = this.querySelector('#scrollDownBtn');

    // Bind the event listener to the scroll down button
    scrollDownButton.addEventListener('click', () => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    // Listen for new messages and add them to the chat
    socket.on('new message', function(data) {
      const now = new Date();
      const time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

      const messageContainer = document.createElement('div');
      messageContainer.classList.add('flex', 'flex-col', 'message-text');

      const userMessage = document.createElement('div');
      userMessage.classList.add('bg-blue-500', 'p-6', 'w-96', 'rounded-3xl', 'rounded-br-none', 'self-end');
      userMessage.innerHTML = `
        <small class="text-white rounded font-light">${data.message}</small>
      `;

      const userMessageTime = document.createElement('small');
      userMessageTime.classList.add('text-gray-500', 'font-light', 'self-end');
      userMessageTime.textContent = time;

      const botMessage = document.createElement('div');
      botMessage.classList.add('bg-gray-200', 'p-6', 'w-96', 'rounded-3xl', 'rounded-bl-none', 'self-start');
      botMessage.innerHTML = `
        <small class="text-gray-600 rounded font-light">${data.response}</small>
      `;

      const botMessageTime = document.createElement('small');
      botMessageTime.classList.add('text-gray-500', 'font-light', 'self-start');
      botMessageTime.textContent = time;

      messageContainer.appendChild(userMessage);
      messageContainer.appendChild(userMessageTime);
      messageContainer.appendChild(botMessage);
      messageContainer.appendChild(botMessageTime);

      chatContainer.appendChild(messageContainer);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });

  }
}

customElements.define('chat-component', ChatComponent);
