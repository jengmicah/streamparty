import React from 'react';

import closeIcon from '../../../icons/closeIcon.png';
import onlineIcon from '../../../icons/onlineIcon.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ChatBar.css';

const ChatBar = ({ room, users }) => {
    let send = document.getElementById('sendIcon');
    const handleShowUsers = () => {
        send.classList.toggle('showUsers');
    };

    return (
        <div className='infoBar'>
            <div className='leftInnerContainer'>
                <img className='onlineIcon' src={onlineIcon} alt='online' />
                <h3>{room}</h3>
            </div>
            <div className='rightInnerContainer'>
                <FontAwesomeIcon onClick={(event) => handleShowUsers(event)} icon="users" />
                <a href='/'><img src={closeIcon} alt='close' /></a>
            </div>
        </div>
    )
};

export default ChatBar;