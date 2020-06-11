import React, { useState, useEffect } from 'react';
import { sckt } from '../Socket';
import Logo from '../Logo/Logo';

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
        <div className='joinOuterContainer'>
            <div className='joinInnerContainer'>
                <Logo />
                <section>
                    {/* <h2><strong>Room:</strong> {room}</h2> */}
                    {/* <p><strong>Users:</strong> {users.length}</p> */}
                    <div className="mid">
                        <input
                            autoFocus
                            placeholder='Username'
                            type='text'
                            maxLength='50'
                            onChange={(e) => setCurrName(e.target.value.trim())}
                            onKeyPress={(e) => e.key === 'Enter' ? joinRoomAsUser(currName) : null}
                        />
                    </div>
                    <button
                        className='button'
                        onClick={(e) => currName ? joinRoomAsUser(currName) : null}
                    >
                        Set Username
                    </button>
                </section>
            </div>
        </div>
    )
}

export default JoinUser;