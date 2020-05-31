import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Users.css';
import { store } from 'react-notifications-component';

const Users = ({ users }) => {
  const copyText = () => {
    let text = document.getElementById('copyInput');
    text.focus();
    text.select();
    text.setSelectionRange(0, 99999)
    try {
      document.execCommand('copy');
      store.addNotification({
        // title: "Link copied to clipboard!",
        message: "Link copied to clipboard!",
        type: "info",
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "fadeInUp"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 1000,
          onScreen: false
        }
      });
    } catch (err) {
      // console.log('Oops, unable to copy');
    }
  }

  return (
    <div className="infoContainer" id="infoContainer">
      {
        users
          ? (
            <div>
              <div className="inputButtonContainer">
                <input id="copyInput" value={window.location.href} readOnly /><br />
                <button className="copyButton" onClick={copyText}>
                  <FontAwesomeIcon className="copyIcon" size='sm' icon="copy" />
                </button>
              </div>
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
  )
};

export default Users;