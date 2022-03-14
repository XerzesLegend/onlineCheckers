const path = require('path');


const express = require('express');
let app = express();
const http = require ('http');
let server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

io.on('connection', (socket) => {
    console.log("user has connected");
    socket.on('disconnect', () => {
        console.log("user has disconnected");
    });
    socket.on("moved", (arg) => {
        socket.broadcast.emit("moved", arg);
    });
});