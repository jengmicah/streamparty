import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Users.css';

const Users = ({ users }) => (
  <div className="infoContainer" id="infoContainer">
    {
      users
        ? (
          <div>
            {/* <h2>Currently watching:</h2> */}
            <div className="activeContainer">
              <h4>
                {users.map(({ name }) => (
                  <div key={name} className="activeItem">
                    <span>{name}</span>
                    <FontAwesomeIcon className="onlineIcon" size='xs' icon="circle" />
                  </div>
                ))}
              </h4>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default Users;