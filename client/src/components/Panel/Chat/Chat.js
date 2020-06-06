import React, { useState, useEffect } from "react";

import ChatMessages from './ChatMessages/ChatMessages';
import ChatInput from './ChatInput/ChatInput';

import './Chat.css';

import { sckt } from '../../Socket';

const Chat = ({ name, room, users }) => {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        sckt.socket.on('message', message => {
            setMessages(messages => [...messages, message]);
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
            <ChatMessages messages={messages} name={name} />
            <ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
    );
}

export default Chat;