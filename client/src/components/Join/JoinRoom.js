import React, { useEffect, useState } from 'react';
import { Button, Transition } from 'semantic-ui-react';
import { generateWords } from '../../utils/generateWords';
import Logo from '../Logo/Logo';
import './Join.scss';

const JoinRoom = ({ location, history }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const joinRoom = () => {
        const randomRoom = encodeURIComponent(generateWords({ delimiter: '-', shouldCap: false }));
        history.push({
            pathname: `/room/${randomRoom}`,
            state: { from: location }
        });
    };
    // const browseRooms = () => {
    //     history.push(`/browse`);
    // }

    return (
        <div className='joinOuterContainer'>
            <Transition visible={mounted} animation='scale' duration={500}>
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
            </Transition>
        </div >
    )
}

export default JoinRoom;