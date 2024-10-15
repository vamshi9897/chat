const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Attach Socket.io to the server

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve the HTML file
});

const users = {};

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    // Handle new user joining
    socket.on('new', name => {
        users[socket.id] = name; // Store user's name
        console.log(name + " joined");
        socket.broadcast.emit('joined', name); // Notify others
    });

    // Handle messages from users
    socket.on('message', message => {
        if (message) { // Check if message is not empty
            io.emit('response', { message: message, name: users[socket.id] }); // Broadcast message with sender's name
        }
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove user from the users object
        const userName = users[socket.id];
        if (userName) {
            delete users[socket.id];
            socket.broadcast.emit('joined', userName + " left the chat"); // Notify others about the disconnection
        }
    });
});

// Start the server
server.listen(8080, () => {
    console.log('Listening on 8080');
});
