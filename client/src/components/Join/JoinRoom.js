import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Join.css';
import Logo from '../Logo/Logo';

const Sentencer = require('sentencer');

const JoinRoom = ({ history }) => {
    const [room, setRoom] = useState('');

    const joinRoom = () => {
        const randomRoom = encodeURIComponent(Sentencer.make("{{ adjective }}-{{ noun }}"));
        history.push(`/room/${randomRoom}`);
    };
    // const browseRooms = () => {
    //     history.push(`/browse`);
    // }
    return (
        <div className='joinOuterContainer'>
            <div className='joinInnerContainer'>
                <Logo />
                <section>
                    <div className="mid">
                        <h2>Watch videos with friends and family from far away!</h2>
                    </div>
                    <button
                        className='button'
                        onClick={joinRoom}>
                        Create a New Room
                    </button>
                </section>
                {/* <p>or</p>
                <h1 className='heading'>Browse Rooms</h1>
                <button
                    className='button'
                    onClick={() => browseRooms()}
                >
                    Browse Rooms
                </button> */}
            </div >
        </div >
    )
}

export default JoinRoom;