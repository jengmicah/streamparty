import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ChatInfo.css';

const ChatInfo = ({ users }) => (
  <div className="infoContainer" id="infoContainer">
    {
      users
        ? (
          <div>
            <h2>Currently watching:</h2>
            <div className="activeContainer">
              <h3>
                {users.map(({ name }) => (
                  <div key={name} className="activeItem">
                    {name}
                    <FontAwesomeIcon className="onlineIcon" size='xs' icon="circle" />
                  </div>
                ))}
              </h3>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default ChatInfo;