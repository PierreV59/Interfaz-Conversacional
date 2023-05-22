let lastWord = '';
let skippedWords = [];

function checkSpelling(event) {
  const message = document.getElementById('message').value;
  const words = message.split(' ');
  const currentWord = words[words.length - 1];

  if (lastWord !== '' && (currentWord === lastWord || event.keyCode === 32)) {
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/check-spelling', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const suggestions = JSON.parse(xhr.responseText);
      showSuggestions(suggestions, event);
      if (event.keyCode !== 32) {
        lastWord = currentWord;
      }
    }
  };
  xhr.send(JSON.stringify({ message }));
}

function showSuggestions(suggestions, event) {
  const suggestionsList = document.getElementById('suggestions');
  suggestionsList.innerHTML = '';
  const currentMessage = document.getElementById('message').value;
  const words = currentMessage.split(' ');
  const lastEnteredWord = words[words.length - 1];

  if ((lastEnteredWord !== lastWord || event.keyCode === 32) && lastEnteredWord.length > 0 && suggestions.length > 0) {
    suggestionsList.classList.remove('hidden');
    suggestions.forEach((suggestion) => {
      if (suggestion !== lastEnteredWord && suggestion !== lastWord && !skippedWords.includes(suggestion)) {
        const suggestionLi = document.createElement('li');
        suggestionLi.innerText = suggestion;
        suggestionLi.addEventListener('click', function() {
          selectSuggestion(suggestion);
        });
        suggestionsList.appendChild(suggestionLi);
      }
    });
    lastWord = lastEnteredWord;
  } else {
    suggestionsList.classList.add('hidden');
  }

  // Eliminar las palabras omitidas de la lista de sugerencias
  skippedWords.forEach((skippedWord) => {
    const suggestionToRemove = suggestionsList.querySelector(`li:not(.hidden):not(.selected):not(.removed)[innerText="${skippedWord}"]`);
    if (suggestionToRemove) {
      suggestionToRemove.classList.add('removed');
    }
  });
}

function selectSuggestion(suggestion) {
  const messageInput = document.getElementById('message');
  const currentMessage = messageInput.value;
  const startIndex = currentMessage.lastIndexOf(' ') + 1;
  const newMessage = currentMessage.substring(0, startIndex) + suggestion;
  messageInput.value = newMessage;
  document.getElementById('suggestions').innerHTML = '';

  const suggestionsList = document.getElementById('suggestions');
  const selectedSuggestion = suggestionsList.querySelector(`li:not(.hidden).selected`);
  if (selectedSuggestion && selectedSuggestion.innerText === suggestion) {
    skippedWords.push(suggestion);
  }
  suggestionsList.removeChild(selectedSuggestion);

}

const messageInput = document.getElementById('message');
messageInput.addEventListener('keydown', function(event) {
  checkSpelling(event);
  if (event.keyCode === 32) {
    document.getElementById('suggestions').innerHTML = '';
    skippedWords.length = 0;
  }
});
