import React, { useState, useEffect } from "react";

import ChatInfo from './ChatInfo/ChatInfo';
import ChatMessages from './ChatMessages/ChatMessages';
import ChatBar from './ChatBar/ChatBar';
import ChatInput from './ChatInput/ChatInput';

import './Chat.css';

import { sckt } from '../Socket';

const Chat = ({ name, room }) => {
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        sckt.socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });
        sckt.socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        let trimmedMessage = message.trim();
        if (trimmedMessage.length > 0) {
            sckt.socket.emit('sendMessage', trimmedMessage, () => setMessage(''));
        }
    }

    return (
        <div className="chatContainer">
            <ChatBar room={room} users={users} />
            <ChatMessages messages={messages} name={name} />
            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
            <ChatInfo users={users} />
        </div>
    );
}

export default Chat;