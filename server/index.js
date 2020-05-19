const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('New Connection');

    /** JOINING/LEAVING ROOMS */
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });

        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });

        socket.join(user.room);

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    });
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    });

    /** SENDING MESSAGES */
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
        // io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        callback();
    });

    /** VIDEO STATE CHANGES */
    socket.on('sendVideoState', (params, callback) => {
        const { name, room, eventName, eventParams } = params;
        socket.to(room).emit('receiveVideoState', params);
        let admin_msg;
        switch (eventName) {
            case 'videoPlay':
                admin_msg = `${name} played the video.`; break;
            case 'videoPause':
                admin_msg = `${name} paused the video.`; break;
            case 'videoSeek':
                admin_msg = `${name} seeked the video.`; break;
            case 'videoPlaybackRate':
                admin_msg = `${name} changed the playback rate to ${eventParams.playbackRate}.`; break;
            default:
                admin_msg = ''; break;
        }
        console.log(admin_msg);
        io.in(room).emit('message', { user: 'admin', text: admin_msg });
        callback();
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));