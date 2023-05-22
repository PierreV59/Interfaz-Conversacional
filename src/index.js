const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const bodyParser = require('body-parser');
const Typo = require('typo-js');

app.use(bodyParser.json());

const dictionary = new Typo('en_US');

app.post('/check-spelling', (req, res) => {
  const message = req.body.message;
  const words = message.split(' ');
  const misspelledWords = words.filter((word) => !dictionary.check(word));
  const suggestions = misspelledWords.map((word) => dictionary.suggest(word)[0]);
  res.json(suggestions);
});

require = require("esm")(module)
app.set('port', process.env.PORT||3000);

const sockets = require('./sockets');
sockets(io);
app.use(express.static(path.join(__dirname, 'Public')));

server.listen(app.get('port'), ()=>{
    console.log('server on port', app.get('port'))
});