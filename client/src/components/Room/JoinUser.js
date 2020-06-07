import React, { useState, useEffect } from 'react';
import { sckt } from '../Socket';

import '../Join/Join.css';

const JoinUser = ({ room, joinRoomAsUser }) => {
    const [currName, setCurrName] = useState('');
    // const [users, setUsers] = useState({});
    // 
    // useEffect(() => {
    //     sckt.socket.emit('getRoomData', { room });
    // }, []);
    // useEffect(() => {
    //     sckt.socket.on("roomData", ({ users }) => {
    //         console.log(users);
    //         setUsers(users);
    //     });
    // }, []);
    return (
        <div className='joinOuterContainer two-col'>
            {/* <div className='header two-col-child'>
                Watch Party
            </div> */}
            <div className='joinInnerContainer two-col-child'>
                <h1 className='heading'>Make a Username</h1>
                <p><strong>Room:</strong> {room}</p>
                {/* <p><strong>Users:</strong> {users.length}</p> */}
                <div>
                    <input
                        autoFocus
                        placeholder='Username'
                        className='joinInput'
                        type='text'
                        maxLength='50'
                        onChange={(event) => setCurrName(event.target.value.trim())}
                        onKeyPress={(event) => event.key === 'Enter' ? joinRoomAsUser(currName) : null}
                    />
                </div>
                <button
                    className='button mt-20'
                    onClick={(event) => currName ? joinRoomAsUser(currName) : null}
                >
                    Set Username
                </button>
            </div>
        </div>
    )
}

export default JoinUser;