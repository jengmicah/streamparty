import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ChatInput.css';

const ChatInput = ({ message, setMessage, sendMessage }) => {

    const handleInputChange = event => {
        let msg = event.target.value;
        setMessage(msg);
        let send = document.getElementById('sendIcon');
        if (msg.trim().length > 0) {
            send.classList.add('readyToPress');
        } else {
            send.classList.remove('readyToPress');
        }
    }

    const handleInputSend = (event) => {
        sendMessage(event);
        let send = document.getElementById('sendIcon');
        send.classList.remove('readyToPress');
    }

    return (
        <div className='form'>
            <input
                // autoFocus
                className='input'
                type='text'
                placeholder="Type a message..."
                value={message}
                onChange={event => handleInputChange(event)}
                onKeyPress={event => event.key === 'Enter' ? handleInputSend(event) : null}
            />
            <div id='sendButton' onClick={(event) => handleInputSend(event)}>
                <FontAwesomeIcon id='sendIcon' icon="paper-plane" size="2x" />
            </div>
        </div>
    )
};

export default ChatInput;