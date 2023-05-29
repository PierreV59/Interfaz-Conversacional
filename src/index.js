const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

app.set('port', process.env.PORT||3000);

const sockets = require('./sockets');
sockets(io);
app.use(express.static(path.join(__dirname, 'Public')));

server.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'))
});