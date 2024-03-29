
class MessageBox extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById('message-box-template');
    const content = template.content.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(content);
    this.messageInput = this.shadowRoot.querySelector('#message');
    this.messageForm = this.shadowRoot.querySelector('#message-form');
    this.messageBoxKeyPress = this.messageBoxKeyPress.bind(this);
    this.messageFormSubmit = this.messageFormSubmit.bind(this);
    this.btnSend = this.shadowRoot.querySelector('#btnSend');
    this.btnSend.addEventListener('click', this.messageFormSubmit);

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;

    const btnStartStopRecord = this.shadowRoot.getElementById('btn2');
    const recognitionText = this.shadowRoot.getElementById('recognition');
    const recordingStatus = this.shadowRoot.getElementById('recording-status');
    const microIcon = this.shadowRoot.getElementById('micro');
    const pauseIcon = this.shadowRoot.getElementById('pause');


    let isRecording = false;
    let recognizedMessage = '';

    recognition.onstart = () => {
      // Comprobar si los elementos están presentes antes de acceder a sus propiedades
      if (recordingStatus && microIcon && pauseIcon) {
        // Crear el contexto de audio
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Crear el nodo oscilador
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine'; // Cambiar el tipo de onda
        oscillator.frequency.value = 600; // Cambiar la frecuencia

        // Conectar el nodo oscilador a la salida de audio
        oscillator.connect(audioCtx.destination);

        // Iniciar la oscilación
        oscillator.start();

        // Detener la oscilación después de 1 segundo
        setTimeout(() => {
          oscillator.stop();
        }, 200);

        // Resto del código de inicio de grabación
        this.messageInput.style.display = 'none';
        recordingStatus.classList.add('recording');
        recordingStatus.innerText = 'Grabando...';
        microIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
      }

    };

    recognition.onresult = (event) => {
      const results = event.results;
      const frase = results[results.length - 1][0].transcript;
      this.messageInput.value += frase;
      recognizedMessage += frase;
    };

    recognition.onend = () => {
      // Comprobar si los elementos están presentes antes de acceder a sus propiedades
      if (recordingStatus && microIcon && pauseIcon) {
        // Mostrar el cuadro de texto y ocultar la animació
        this.messageInput.style.display = 'block';
        recordingStatus.classList.remove('recording');
        recordingStatus.innerText = '';
        microIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
      };
      new Notification('Grabación finalizada', {
        body: 'Se detuvo la grabación de voz.'
      });

      const message = recognizedMessage.trim();
      if (message !== '') {
        socket.emit('Send message', message);
        this.messageInput.value = '';
        recognizedMessage = '';
      }
    }

    btnStartStopRecord.addEventListener('click', () => {
      if (!isRecording) {
        recognition.start();
        isRecording = true;
        btnStartStopRecord.classList.add('active');
      } else {
        if (isRecording) {
          recognition.stop();
          isRecording = false;
          btnStartStopRecord.classList.remove('active');
        }
      }
    });

    this.messageInput.addEventListener('input', function () {
      const regex = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu;
      if (regex.test(this.value)) {
        this.value = this.value.replace(regex, '');
       // Mostrar la ventana modal
       const modal = document.getElementById('modal');
       modal.style.display = 'flex';
     } else {
       // Ocultar la ventana modal si ya estaba mostrada
       const modal = document.getElementById('modal');
       modal.style.display = 'none';
     }
   });
   
   // Cerrar la ventana modal al hacer clic en el botón de cerrar
   document.getElementById('close-modal').addEventListener('click', function() {
     const modal = document.getElementById('modal');
     modal.style.display = 'none';
   });
    // Escuchar el evento de cambio de modo oscuro


    /*this.messageForm.addEventListener('submit', (event) => {
      const regex = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu;
      if (regex.test(this.messageInput.value)) {
        event.preventDefault();
        try {
          const notification = new Notification('Error', {
            body: 'No se permiten emoticones en el mensaje'
          });
        } catch (err) {
          console.log('No se pudo mostrar la notificación:', err);
        }
      }
    });*/



  }
  connectedCallback() {
    this.messageInput = this.shadowRoot.querySelector('#message');
    this.messageForm = this.shadowRoot.querySelector('#message-form');

    this.messageInput.addEventListener('keydown', this.messageBoxKeyPress.bind(this));
  }

  messageBoxKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.messageFormSubmit(event);
    }
  }

  messageFormSubmit(event) {
    event.preventDefault();
    const message = this.messageInput.value.trim();
    if (message !== '') {
      socket.emit('Send message', message);
      this.messageInput.value = '';
    }
  }


}

customElements.define('message-box', MessageBox);
