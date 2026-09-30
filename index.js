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
  console.log("connected");
  io.sockets.emit("other-connection", socket.id);

  // socket.emit("session", {
  //   sessionID: socket.sessionID,
  //   userID: socket.userID,
  // });

  // socket.join(socket.userID);

  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    io.sockets.emit("other-disconnect", socket.id);
  });
});

// io.on("disconnect", (socket) => {
//   console.log("disconnected");
//   io.sockets.emit("message", "socket disconnected: " + socket.id);

//   socket.on("disconnect", async () => {
//     const matchingSockets = await io.in(socket.userID).allSockets();
//     const isDisconnected = matchingSockets.size === 0;
//     if (isDisconnected) {
//       // notify other users
//       socket.broadcast.emit("user disconnected", socket.userID);
//       // update the connection status of the session
//       sessionStore.saveSession(socket.sessionID, {
//         userID: socket.userID,
//         username: socket.username,
//         connected: false,
//       });
//     }
//   });
// })

// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     // find existing session
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.username = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   // create new session
//   socket.sessionID = randomId();
//   socket.userID = randomId();
//   socket.username = username;
//   next();
// });

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});