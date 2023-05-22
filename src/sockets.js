/*const mysql = require('mysql');

const connectionB = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat'
});

connectionB.connect(function(err) {
  if (err) {
    console.error('Error al conectarse a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos como el ID ' + connectionB.threadId);
});

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
    connectionB.query('SELECT * FROM messages ORDER BY msg_id ASC', function(error, results, fields) {
      if (error) throw error;
      results.forEach(function(result) {
        socket.emit('new message', { message: result.msg, response: result.bots });
      });
    });    
  
    socket.on('Send message', function(data) {
      const https = require('https');
      const options = {
        hostname: '25a0-200-24-154-53.ngrok.io/',
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
            const responseData = response[0].text;
            io.emit('new message', { message: data, response: responseData });
            const cleanMsg = responseData.replace(/\p{Emoji}/gu, '');
            connectionB.query('INSERT INTO messages (incoming_msg_id, outgoing_msg_id, msg, bots) VALUES (?, ?, ?, ?)', [2, 3, data, cleanMsg], function(error, results, fields) {
              if (error) throw error;
              console.log('Mensaje insertado correctamente!');
              });
          } catch (error) {
            console.error(error);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error(error);
      });
      
      req.write(JSON.stringify({ message: data }));
      req.end();
    });
    socket.on('clear messages', function() {
      try {
        connectionB.query('DELETE FROM messages', function(error, results, fields) {
          if (error) throw error;
          console.log('Mensajes eliminados correctamente!');
          socket.emit('clear chat');
        });
      } catch (error) {
        console.log('Error al eliminar mensajes:', error);
      }
    });
  });
};*/
module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');
  
    socket.on('Send message', function(data) {
      io.emit('new message', { message: data });
      const https = require('https');
      const options = {
        hostname: '25a0-200-24-154-53.ngrok.io/',
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
            const responseData = response[0].text;
            io.emit('new message', { message: responseData });
            const cleanMsg = responseData.replace(/\p{Emoji}/gu, '');
            console.log('Mensaje insertado correctamente!');
          } catch (error) {
            console.error(error);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error(error);
      });
      
      req.write(JSON.stringify({ message: data }));
      req.end();
    });
    
    socket.on('clear messages', function() {
      console.log('Mensajes eliminados correctamente!');
      socket.emit('clear chat');
    });
  });
};
