const express = require('express');
const { use } = require('express/lib/application');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Attach Socket.io to the server

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Serve the HTML file
});

const users={}
// io.on('connection', (socket) => {
//   console.log('a user connected');

//   // Emit "joined" event when a new user joins
//   socket.on('new', (name) => {
//     users[socket.id]=name
//     console.log(name,"joined")
//     socket.broadcast.emit('joined', name);
//   });

//   // Listen for messages from clients
//   socket.on('message', (message) => {
//     io.emit('response', message); // Broadcast message to all clients
//   });

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });


io.on('connection',socket=>{
    console.log('user conected')

    socket.on('new',name=>{
        users[socket.id]=name
        console.log(name,"joined")
        socket.broadcast.emit('joined',name)
    })

    socket.on('message' ,message=>{
        io.emit('response',{message:message,name:users[socket.id]})
    })

    socket.on('disconnect',()=>{
        console.log(`user disconnected`)
        delete users[socket.id]
    })
})

server.listen(8080, () => {
  console.log('listening on *:8080');
});
