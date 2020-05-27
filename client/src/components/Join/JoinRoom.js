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
    const browseRooms = () => {
        history.push(`/browse`);
    }

    return (
        <div className='joinOuterContainer two-col'>
            {/* <div className='header two-col-child'>
                Sync Party
            </div> */}
            <div className='joinInnerContainer two-col-child'>
                <h1 className='heading'>Join or Create a Room</h1>
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
                    Join Room
                </button>
                {/* <p>or</p>
                <h1 className='heading'>Browse Rooms</h1>
                <button
                    className='button'
                    onClick={() => browseRooms()}
                >
                    Browse Rooms
                </button> */}
            </div>
        </div>
    )
}

export default JoinRoom;