const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow your frontend
        methods: ['GET', 'POST'],
    },
});

const port = 5000;
app.use(express.json());

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); 
    });

    socket.on('send', (msg) => {
        socket.broadcast.emit('receive', { name: users[socket.id], message: msg });
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            socket.broadcast.emit('user-disconnected', name);
            delete users[socket.id];
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});