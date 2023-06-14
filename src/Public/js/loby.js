// Obtener los contenedores de la introducción y del chat
var introContainer = document.getElementById("intro-container");
var chatContainer = document.getElementById("modoTotal");
var Helpmebtn = document.getElementById("clear-chat");

Helpmebtn.setAttribute("disabled", "");

var enChat = false;

const newConversationButton = document.getElementById("menu-button");

newConversationButton.addEventListener("click", () => {
  if (enChat) {
    chatContainer.style.display = "none";
    introContainer.style.display = "block";
    Helpmebtn.setAttribute("disabled", "");
    newConversationButton.innerHTML = `<svg class="w-4 text-gray-500 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>`;
    enChat = false;
  } else {
    chatContainer.style.display = "block";
    introContainer.style.display = "none";
    Helpmebtn.removeAttribute("disabled");
    newConversationButton.innerHTML = `
    <svg id="Lobyr" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="currentColor" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
    </svg>`;
    enChat = true;
  }
});
