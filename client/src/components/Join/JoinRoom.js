import React, { useState, useEffect } from 'react';
import './Join.css';
import Logo from '../Logo/Logo';
import { Input, Button, Icon } from 'semantic-ui-react'

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
                    <Button
                        content='Create a New Room'
                        // icon='sign-in'
                        // labelPosition='right'
                        className='button-join'
                        onClick={joinRoom}
                    />
                </section>
            </div >
        </div >
    )
}

export default JoinRoom;