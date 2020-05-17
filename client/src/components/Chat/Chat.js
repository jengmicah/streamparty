import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import ChatInfo from './ChatInfo/ChatInfo';
import ChatMessages from './ChatMessages/ChatMessages';
import ChatBar from './ChatBar/ChatBar';
import ChatInput from './ChatInput/ChatInput';

import './Chat.css';

let socket;

const Chat = ({ location, endpoint }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(endpoint);

        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }, [endpoint, location.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim().length > 0) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div className="chatContainer">
            <ChatBar room={room} />
            <ChatMessages messages={messages} name={name} />
            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
            <ChatInfo users={users} />
        </div>
    );
}

export default Chat;