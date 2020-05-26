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
                <div className="usersIconContainer" onClick={(event) => handleShowUsers(event)}>
                    <FontAwesomeIcon className="usersIcon" icon="users" />
                    <h3 className="usersIcon" >{users.length}</h3>
                </div>
            </div>
            <div className='rightInnerContainer'>
                <a href='/'><FontAwesomeIcon className="closeIcon" size='sm' icon="times" /></a>
            </div>
        </div>
    )
};

export default ChatBar;