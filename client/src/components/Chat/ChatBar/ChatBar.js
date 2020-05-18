import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ChatBar.css';

const ChatBar = ({ room, users }) => {
    let activeUsers = document.getElementById('infoContainer');
    const handleShowUsers = () => {
        activeUsers.classList.toggle('displayInfo');
    };

    return (
        <div className='infoBar'>
            <div className='leftInnerContainer'>
                <FontAwesomeIcon className="onlineIcon" size='xs' icon="circle" />
                <h3>{room}</h3>
                <FontAwesomeIcon className="usersIcon" onClick={(event) => handleShowUsers(event)} icon="users" />
            </div>
            <div className='rightInnerContainer'>
                <a href='/'><FontAwesomeIcon className="closeIcon" size='sm' icon="times" /></a>
            </div>
        </div>
    )
};

export default ChatBar;