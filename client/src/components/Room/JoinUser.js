import React, { useState } from 'react';
import { motion } from "framer-motion"

import '../Join/Join.css';

const JoinUser = ({ room, joinRoomAsUser }) => {
    const [name, setName] = useState('');
    const animationVariant = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -50 },
    }
    return (
        <div className='joinOuterContainer two-col'>
            {/* <div className='header two-col-child'>
                Watch Party
            </div> */}
            <motion.div
                initial="hidden"
                animate="visible"
                transition={{ ease: "easeOut", duration: 0.3 }}
                variants={animationVariant}
            >
            <div className='joinInnerContainer two-col-child'>
                <h1 className='heading'>Make a Username</h1>
                <p><strong>Room:</strong> {room}</p>
                {/* <p><strong>Number of People:</strong> {users.length}</p> */}
                <div>
                    <input
                        autoFocus
                        placeholder='Username'
                        className='joinInput'
                        type='text'
                        onChange={(event) => setName(event.target.value)}
                        onKeyPress={(event) => event.key === 'Enter' ? joinRoomAsUser(name) : null}
                    />
                </div>
                <button
                    className='button mt-20'
                    onClick={(event) => name ? joinRoomAsUser(name) : null}
                >
                    Set Username
                </button>
            </div>
            </motion.div>
        </div>
    )
}

export default JoinUser;