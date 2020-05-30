import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Settings.css';

import { sckt } from '../../Socket';

const Settings = ({ room, history }) => {

  const leaveRoom = () => {
    sckt.socket.emit('leaveRoom', { room });
    history.push('/');
  }

  return (
    <div className="infoContainer" id="infoContainer">
      <button onClick={leaveRoom} className="button leaveButton">Leave Room</button>
    </div>
  )
};

export default Settings;