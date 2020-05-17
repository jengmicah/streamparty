import React from "react";
import Chat from '../Chat/Chat';
import Video from '../Video/Video';

import './Watch.css';

const Watch = ({ location }) => {
    const ENDPOINT = 'localhost:5000';
    
    return (
        <div className="outerContainer">
            <Video location={location} endpoint={ENDPOINT} />
            <Chat location={location} endpoint={ENDPOINT} />
        </div>
    );
}

export default Watch;