import React, { useState, useEffect } from "react";
import Chat from '../Chat/Chat';
import Video from '../Video/Video';
import JoinUser from './JoinUser';

import { sckt } from '../Socket';

import './Room.css';

const Room = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    // From JoinRoom.js 
    useEffect(() => {
        const room = location.pathname.split('/').pop();
        setRoom(room);
    }, [location.pathname]);
    
    // From JoinUser.js
    const joinRoomAsUser = (name) => {
        setName(name);
        sckt.socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }

    return (
        name && room
            ? (
                <div className="outerContainer">
                    <Video name={name} room={room} />
                    <Chat name={name} room={room} />
                </div>
            ) : (
                <JoinUser room={room} joinRoomAsUser={joinRoomAsUser} />
            )
    );
}

export default Room;