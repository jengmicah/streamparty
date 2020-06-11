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
        <div className='inputButtonContainer'>
            <input
                // autoFocus
                className='chatInput'
                type='text'
                placeholder="Type a message..."
                value={message}
                onChange={e => handleInputChange(e)}
                onKeyPress={e => e.key === 'Enter' ? handleInputSend(e) : null}
            />
            <button className='chatButton' onClick={(e) => handleInputSend(e)}>
                <FontAwesomeIcon id='sendIcon' icon="paper-plane" size="2x" />
            </button>
        </div>
    )
};

export default ChatInput;