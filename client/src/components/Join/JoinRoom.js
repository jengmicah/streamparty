import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const JoinRoom = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const handleLinkClick = (event) => {
        if (!room) {
            event.preventDefault();
        }
    }

    return (
        <div className='joinOuterContainer'>
            <div className='joinInnerContainer'>
                <h1 className='heading'>Join a Room</h1>
                {/* <div><input placeholder='Name' className='joinInput' type='text' onChange={(event) => setName(event.target.value)} /></div> */}
                {/* <div><input placeholder='Room' className='joinInput mt-20' type='text' onChange={(event) => setRoom(event.target.value)} /></div> */}
                <div><input placeholder='Room Name' className='joinInput' type='text' onChange={(event) => setRoom(event.target.value)} /></div>
                {/* <Link onClick={event => handleLinkClick(event)} to={`/room?name=${name}&room=${room}`}> */}
                <Link onClick={event => handleLinkClick(event)} to={{pathname: `/room/${room}`, room: room, name: name}}>
                    <button className='button mt-20' type='submit'>Join Room</button>
                </Link>
            </div>
        </div>
    )
}

export default JoinRoom;