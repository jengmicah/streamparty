import React, { useState } from 'react';

import './Join.css';

const JoinRoom = ({ history }) => {
    const [room, setRoom] = useState('');

    const joinRoom = () => {
        let trimmedRoom = room.trim();
        if (trimmedRoom.length > 0) {
            history.push(`/room/${trimmedRoom}`);
        }
    };

    return (
        <div className='joinOuterContainer'>
            <div className='joinInnerContainer'>
                <h1 className='heading'>Join a Room</h1>
                <div>
                    <input
                        autoFocus
                        placeholder='Room Name'
                        className='joinInput'
                        type='text'
                        onChange={(event) => setRoom(event.target.value)}
                        onKeyPress={(event) => event.key === 'Enter' ? joinRoom() : null}
                    />
                </div>
                <button
                    className='button mt-20'
                    onClick={() => joinRoom()}
                >
                    Join
                </button>
            </div>
        </div>
    )
}

export default JoinRoom;