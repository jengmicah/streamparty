import React, { useState } from 'react';
import Logo from '../Logo/Logo';
import { Input, Button } from 'semantic-ui-react'

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
                        {/* <input
                            autoFocus
                            placeholder='Username'
                            type='text'
                            maxLength='50'
                            onChange={(e) => setCurrName(e.target.value.trim())}
                            onKeyPress={(e) => e.key === 'Enter' ? joinRoomAsUser(currName) : null}
                        /> */}
                        <Input
                            autoFocus
                            size='large'
                            placeholder='Username'
                            maxLength='50'
                            value={currName}
                            onChange={(e) => setCurrName(e.target.value.trim())}
                            onKeyPress={(e) => e.key === 'Enter' ? joinRoomAsUser(currName) : null}
                        />
                    </div>
                    <Button
                        content='Set Username'
                        // icon='sign-in'
                        // labelPosition='right'
                        className='button-join'
                        onClick={(e) => currName ? joinRoomAsUser(currName) : null}
                    />
                </section>
            </div>
        </div>
    )
}

export default JoinUser;