
const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs.log' }),
  ],
});

const WELCOME_MESSAGE = 'Por favor, ingrese sus credenciales para realizar peticiones al asistente virtual';
const IDENTIFICATION_MESSAGE = 'Ingrese su número de identificación';
const GREETING_MESSAGE = '¡Hola, %s! Se ha establecido la conexión correctamente. Ahora puedes realizar peticiones al asistente virtual';
const INVALID_CREDENTIALS_MESSAGE = 'Las credenciales son incorrectas. Inténtelo de nuevo.';
const CONNECTION_ERROR_MESSAGE = 'Error al establecer conexión con la API';
const UNAVAILABLE_ASSISTANT_MESSAGE = 'El asistente no está disponible en este momento. Por favor, inténtalo más tarde.';

const postRequest = promisify(https.request);

module.exports = function (io) {
  io.on('connection', (socket) => {
    let isVerified = false;
    let userName = '';

    let identification = '';
    let password = '';

    socket.emit('new user VALIDATION', { message: WELCOME_MESSAGE });
    socket.emit('new user VALIDATION', { message: IDENTIFICATION_MESSAGE });

    socket.on('Send message', handleMessage);
    socket.on('clear messages', clearMessages);

    async function handleMessage(data) {
      const userId = socket.id;

      if (!isVerified) {
        if (!identification) {
          identification = data;
          io.to(userId).emit('new user message', { message: data });
          io.to(userId).emit('new user VALIDATION', { message: 'Por favor, ingrese su contraseña' });
          return;
        } else if (!password) {
          password = data;
          io.to(userId).emit('new user message', { message: data });
        }
      }

      if (identification && password && !isVerified) {
        await verifyCredentials(userId);
      } else {
        if (!isVerified) {
          const errorMessage = 'No puede realizar peticiones. Por favor, ingrese sus credenciales';
          io.to(userId).emit('new bot message', { error: true, message: errorMessage });

          resetCredentials(userId);
          return;
        }

        io.to(userId).emit('new user message', { message: data });
        requestToAssistant(userId, data);
      }
    }

    async function verifyCredentials(userId) {
      const url = 'http://servicios.espam.edu.ec/Datos/login';
      const formData = new FormData();
      formData.append('identificacion', identification);
      formData.append('password', password);

      const instance = axios.create({
        headers: formData.getHeaders(),
      });

      try {
        const response = await instance.post(url, formData);
        if (response.status === 200) {
          const userData = response.data.data;
          const exists = userData.some((user) => user.Identificacion === identification);
          if (exists) {
            isVerified = true;
            const user = userData.find((user) => user.Identificacion === identification);
            const { Nombre1, Apellido1 } = user;
            userName = `${Nombre1} ${Apellido1} `;
            logger.info('El usuario existe.');

            const greetingMessage = `¡Hola, ${userName}! Se ha establecido la conexión correctamente. Ahora puedes realizar peticiones al asistente virtual`;
            io.to(userId).emit('new bot message', { error: true, message: greetingMessage });
          } else {
            logger.info('El usuario no existe o las credenciales son incorrectas.');
            io.to(userId).emit('new bot message', { error: true, message: INVALID_CREDENTIALS_MESSAGE });

            resetCredentials(userId);
          }
        } else {
          logger.info(`No se pudo establecer la conexión con la API: ${response.status}`);
          io.to(userId).emit('new bot message', { error: true, message: CONNECTION_ERROR_MESSAGE });

          resetCredentials(userId);
        }
      } catch (error) {
        logger.error(`No se pudo establecer la conexión con la API: ${error.message}`);
        io.to(userId).emit('new bot message', { error: true, message: CONNECTION_ERROR_MESSAGE });

        resetCredentials(userId);
      }
    }

    function requestToAssistant(userId, data) {
      if (!isVerified) {
        const errorMessage = 'No puede realizar peticiones. Por favor, ingrese sus credenciales';
        io.to(userId).emit('new bot message', { error: true, message: errorMessage });


        identification = '';
        password = '';
        io.to(userId).emit('new user VALIDATION', { message: welcomeMessage });
        return;
      }
      const https = require('https');
      const options = {
        hostname: 'e8c7-200-24-154-53.ngrok.io',
        port: 443,
        path: '/webhooks/rest/webhook',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };

      const req = https.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseBody);
            const responseMessages = response.map((item) => item.text);
            io.to(userId).emit('new bot message', { messages: responseMessages });
          } catch (error) {
            console.error(error);
            const errorMessage = 'El asistente no está disponible en este momento. Por favor, inténtalo más tarde.';
            io.to(userId).emit('new bot message', { error: true, message: errorMessage });
          }
        });
      });

      req.on('error', (error) => {
        console.error(error);
        const errorMessage = 'El asistente no está disponible en este momento. Por favor, inténtalo más tarde.';
        io.to(userId).emit('new bot message', { error: true, message: errorMessage });
      });

      req.write(JSON.stringify({ message: data }));
      req.end();

    }
    
    function resetCredentials(userId) {
      identification = '';
      password = '';
      io.to(userId).emit('new user VALIDATION', { message: WELCOME_MESSAGE });
    }

    function clearMessages() {
      const userId = socket.id;
      logger.info('Mensajes eliminados correctamente!');
      io.to(userId).emit('clear chat');
    }
  });
};