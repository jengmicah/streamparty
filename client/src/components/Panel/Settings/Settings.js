import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sckt } from '../../Socket';
import { store } from 'react-notifications-component';
import './Settings.css';

const Settings = ({ currUser, updateCurrUser, room, history, users }) => {
  const [currName, setCurrName] = useState(currUser.name);
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
  const changeName = () => {
    const trimmedName = currName.trim();
    // Check that name was changed
    if (trimmedName && trimmedName != currUser.name) {
      // Check that name is unique
      if (!users.find(x => x.name === trimmedName)) {
        store.addNotification({
          title: `Hello, ${trimmedName}!`,
          message: `Who's ${currUser.name}?`,
          type: "success",
          insert: "top",
          container: "bottom-right",
          animationIn: ["animated", "fadeInUp"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: false
          }
        });
        sckt.socket.emit('changeUsername', { oldName: currUser.name, newName: trimmedName });
        updateCurrUser({ name: trimmedName });
      } else {
        store.addNotification({
          title: "Uh oh!",
          message: "User exists in this room already",
          type: "warning",
          insert: "top",
          container: "bottom-right",
          animationIn: ["animated", "fadeInUp"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: false
          }
        });
      }
    }
  }
  return (
    <div className="settingsContainer">
      <div>
        <h3>Invite your friends!</h3>
        <div className="inputButtonContainer">
          <input id="copyInput" value={window.location.href} readOnly />
          <button className="copyButton" onClick={copyText}>
            <FontAwesomeIcon className="copyIcon" size='sm' icon="copy" />
          </button>
        </div>
      </div>
      <div>
        <h3>Hello, my name is:</h3>
        <div className="inputButtonContainer">
          <input
            value={currName}
            onChange={e => setCurrName(e.target.value)}
            onKeyPress={e => e.key === 'Enter' ? changeName() : null}
          />
          <button onClick={changeName}>
            <FontAwesomeIcon size='sm' icon="check" />
          </button>
        </div>
      </div>
      <button onClick={leaveRoom} className="button leaveButton">Leave Room</button>
    </div>
  )
};

export default Settings;