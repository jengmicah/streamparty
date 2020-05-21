import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoSelect.css';
import { useState } from 'react';

const VideoSelect = ({ playYTVideoURL }) => {

    const handleInputSend = (event) => {
        event.preventDefault();
        playYTVideoURL(event.target.value);
    };
    return (
        <div className="videoSelectContainer">
            <form className='form'>
                <input
                    className='input'
                    type='text'
                    placeholder="Paste a video URL..."
                    onKeyPress={event => event.key === 'Enter' ? handleInputSend(event) : null}
                />
                <button id='sendButton' onClick={(event) => handleInputSend(event)}>
                    <FontAwesomeIcon id='sendIcon' icon="paper-plane" size="2x" />
                </button>
            </form>
        </div>
    )
};

export default VideoSelect;