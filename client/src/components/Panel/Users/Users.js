import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Users.css';
import { store } from 'react-notifications-component';
import { sckt } from '../../Socket';

const Users = ({ users, room, history }) => {
  const copyText = () => {
    let text = document.getElementById('copyInput');
    text.focus();
    text.select();
    text.setSelectionRange(0, 99999)
    try {
      document.execCommand('copy');
      store.addNotification({
        title: "Yay!",
        message: "Link copied to clipboard",
        type: "info",
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "fadeInUp"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: false
        }
      });
    } catch (err) {
      // console.log('Oops, unable to copy');
    }
  }
  const leaveRoom = () => {
    sckt.socket.emit('leaveRoom', { room });
    history.push('/');
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
      <button onClick={leaveRoom} className="button leaveButton">Leave Room</button>
    </div>
  )
};

export default Users;