const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom, getOtherUserInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const cors = require('cors');

io.on('connection', (socket) => {
    console.log('New Connection');

    /** JOINING/LEAVING ROOMS */
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `Hi ${user.name}! You can invite your friends to watch in this room by sending them the link to this page down below.` });

        socket.emit('message', { user: 'admin', text: `http://localhost:3000/room/${user.room}` });

        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });

        if (getUsersInRoom(user.room).length > 1) {
            const otherUser = getOtherUserInRoom(room, user);
            socket.to(otherUser.id).emit('getSync', { id: user.id });
        }

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
    socket.on('sendSync', ({ id, ...videoProps }, callback) => {
        console.log(videoProps);
        socket.to(id).emit('startSync', videoProps);
    });
    socket.on('sendVideoState', (params, callback) => {
        const { name, room, eventName, eventParams } = params;
        socket.to(room).emit('receiveVideoState', params);
        let admin_msg;
        switch (eventName) {
            case 'syncPlay':
                admin_msg = `${name} played the video.`; break;
            case 'syncPause':
                admin_msg = `${name} paused the video.`; break;
            case 'videoStartBuffer':
                admin_msg = `${name} is buffering.`; break;
            case 'videoFinishBuffer':
                admin_msg = `${name} finished buffering.`; break;
            case 'syncRateChange':
                admin_msg = `${name} changed the playback rate to ${eventParams.playbackRate}.`; break;
            case 'syncLoad':
                admin_msg = `${name} changed the video.`; break;
            case 'syncAddToQueue':
                admin_msg = `${name} added a video to the queue.`; break;
            case 'syncLoadFromQueue':
                admin_msg = `${name} loaded next video on the queue.`; break;
            case 'syncQueue':
                admin_msg = `${name} modifed queue.`; break;
            case 'syncHistory':
                admin_msg = `${name} modifed history.`; break;
            default:
                admin_msg = ''; break;
        }
        console.log(admin_msg);
        io.in(room).emit('message', { user: 'admin', text: admin_msg });
        callback();
    });


});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));