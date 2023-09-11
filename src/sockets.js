const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { User } = require('./Models/Chat');

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

const WELCOME_MESSAGE1 = '¡Bienvenido! Por favor, ingrese sus credenciales para acceder y realizar las peticiones al asistente virtual';
const WELCOME_MESSAGE = 'Por favor, ingrese su número de identificación';
const IDENTIFICATION_MESSAGE = 'Ingrese su número de identificación';
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

    socket.emit('new user VALIDATION', { message: WELCOME_MESSAGE1 });
    socket.emit('new user VALIDATION', { message: IDENTIFICATION_MESSAGE });

    socket.on('Send message', handleMessage);
    socket.on('clear messages', clearMessages);

    async function handleMessage(data) {
      const userId = socket.id;
    
      if (!isVerified) {
        if (!identification) {
          if (!validateIdentification(data)) {
            const errorMessage = 'El número de identificación es inválido';
            io.to(userId).emit('new bot message', { error: true, message: errorMessage });
            return;
          }
    
          identification = data;
          io.to(userId).emit('new user message', { message: data });
          io.to(userId).emit('new user VALIDATION', { message: 'Por favor, ingrese su contraseña' });
          return;
        } else if (!password) {
          if (!validatePassword(data)) {
            const errorMessage = 'La contraseña es inválida';
            io.to(userId).emit('new bot message', { error: true, message: errorMessage });
            return;
          }
    
          password = data;
          io.to(userId).emit('new user message', { message: data });
        }
      }
    
      if (identification && password && !isVerified) {
        try {
          await verifyCredentials(userId);
        } catch (error) {
          handleVerificationError(userId, error);
        }
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
    function saveMessageToLocalStorage(message) {
      const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
      storedMessages.push(message);
      localStorage.setItem('chatMessages', JSON.stringify(storedMessages));
    }
    
    async function verifyCredentials(userId) {
      const url = 'http://servicios.espam.edu.ec/Datos/login';
      const formData = new FormData();
      formData.append('identificacion', identification);
      formData.append('password', password);
    
      try {
        const response = await axios.post(url, formData);
    
        if (response.status !== 200) {
          throw new Error(CONNECTION_ERROR_MESSAGE);
        }
    
        const userData = response.data.data;
        const user = userData.find((user) => user.Identificacion === identification);
    
        if (!user) {
          logger.info('El usuario no existe o las credenciales son incorrectas.');
          throw new Error(INVALID_CREDENTIALS_MESSAGE);
        }
    
        isVerified = true;
        io.to(userId).emit('user verified');
        const { Nombre1, Apellido1 } = user;
        userName = `${Nombre1} ${Apellido1}`;
        logger.info('El usuario existe.');
    
        let dbUser = await User.findOne({ identification });
    
        if (!dbUser) {
          await createUserInDatabase(userId);
        } else {
          await handleExistingUser(userId, dbUser);
        }
      } catch (error) {
        logger.error(`No se pudo establecer la conexión con la API: ${error.message}`);
        throw new Error(CONNECTION_ERROR_MESSAGE);
      }
    }
    
    async function createUserInDatabase(userId) {
      io.to(userId).emit('clear chat');
      const dbUser = new User({ identification });
      await dbUser.save();
      const greetingMessage = `¡Hola, ${userName}! Se ha establecido la conexión correctamente. Ahora puedes realizar peticiones al asistente virtual`;
      io.to(userId).emit('new bot message', { error: true, message: greetingMessage });
    }
    
    async function handleExistingUser(userId, dbUser) {
      io.to(userId).emit('clear chat');
      const Historial = `¡Hola, ${userName}! Este es su historial de conversación:`;
      io.to(userId).emit('new bot message', { error: true, message: Historial });
    
      const conversations = dbUser.conversations;
    
      for (const conversation of conversations) {
        const { userMessage, message } = conversation;
        io.to(userId).emit('new user message', { message: userMessage, fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: 'text-gray-100' });
        io.to(userId).emit('new user r', { message, fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: 'text-gray-100' });
      }
    }

    function handleVerificationError(userId, error) {
      if (error.message === INVALID_CREDENTIALS_MESSAGE) {
        io.to(userId).emit('new bot message', { error: true, message: INVALID_CREDENTIALS_MESSAGE });
      } else {
        io.to(userId).emit('new bot message', { error: true, message: INVALID_CREDENTIALS_MESSAGE });
      }

      resetCredentials(userId);
    }

    function requestToAssistant(userId, data) {
      if (!isVerified) {
        const errorMessage = 'No puede realizar peticiones. Por favor, ingrese sus credenciales';
        io.to(userId).emit('new bot message', { error: true, message: errorMessage, fontSize: '12px' });

        identification = '';
        password = '';
        io.to(userId).emit('new user VALIDATION', { message: welcomeMessage });
        return;
      }

      const https = require('https');
      const options = {
        hostname: '3ffc-200-24-154-53.ngrok.io',
        port: 443,
        path: '/webhooks/rest/webhook',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };

      const req = https.request(options, async (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', async () => {
          try {
            const response = JSON.parse(responseBody);
            const responseMessages = response.map((item) => item.text);
            const joinedMessages = responseMessages.join('\n');

            io.to(userId).emit('new bot message', { messages: responseMessages, fontSize: '12px' });
            const conversation = { userId: socket.id, message: joinedMessages, userMessage: data };

            await User.findOneAndUpdate(
              { identification: identification },
              { $push: { conversations: conversation } }
            );

          } catch (error) {
            console.error(error);
            io.to(userId).emit('new bot message', { error: true, message: UNAVAILABLE_ASSISTANT_MESSAGE, fontSize: '12px' });

          }
        });
      });

      req.on('error', (error) => {
        console.error(error);

        io.to(userId).emit('new bot message', { error: true, message: UNAVAILABLE_ASSISTANT_MESSAGE, fontSize: '12px' });
      });

      req.write(JSON.stringify({ message: data }));
      req.end();
    }

    function clearMessages() {
      io.to(socket.id).emit('clear messages');
      User.findOne({ identification: identification })
        .then((user) => {
          if (!user) {
            console.log('No se encontró ningún usuario con la identificación proporcionada.');
            return;
          }
          const deletedIdentification = user.identification;

          User.updateOne({ identification: identification }, { $set: { conversations: [] } })
            .then(() => {
              console.log(`Se han eliminado las conversaciones del usuario con identificación: ${deletedIdentification}.`);
            })
            .catch((err) => {
              console.error('Error al eliminar las conversaciones del usuario:', err);
            });
        })
        .catch((err) => {
          console.error('Error al buscar el usuario:', err);
        });
    }
    function resetCredentials(userId) {
      isVerified = false;
      identification = '';
      password = '';
      io.to(userId).emit('new user VALIDATION', { message: IDENTIFICATION_MESSAGE });
    }
    function validateIdentification(identification) {
      return identification.length > 5;
    }
    function validatePassword(password) {
      return password.length > 0;
    }
  });
};