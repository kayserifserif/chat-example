const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/post', (req, res) => {
// app.post('/post', cors(), (req, res) => {
  console.log("content-type", req.headers['content-type']);
  console.log("request body", req.body);
  // console.log("title received: " + req.body.title);
  res.send("welcome to post");
});

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});