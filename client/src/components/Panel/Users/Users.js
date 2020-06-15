import React, { useEffect } from 'react';

import './Users.css';
import { getAvatarUrl } from '../../../Helper';

const Users = ({ users }) => {
  return (
    <div className="infoContainer" id="infoContainer">
      {
        users.length > 0 && (
            <div className="activeContainer">
              {users.map(({ id, name, colors }) => (
                <div key={id} className="activeItem">
                  <img src={getAvatarUrl({
                    name,
                    background: colors.bg,
                    color: colors.txt,
                  })}/>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          )
      }
    </div>
  )
};

export default Users;