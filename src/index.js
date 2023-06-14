const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const cors = require('cors');

app.set('port', process.env.PORT || 3000);

app.use(cors());

const sockets = require('./sockets');
sockets(io);
app.use(express.static(path.join(__dirname, 'Public')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:50043');
  next();
});

server.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'))
});
