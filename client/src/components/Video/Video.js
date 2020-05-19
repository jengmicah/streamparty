import React, { useState, useEffect } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';

import { sckt } from '../Socket';

const Video = ({ name, room }) => {
    const [player, setPlayer] = useState();

    const sendVideoState = ({ eventName, eventParams }) => {
        let params = {
            name: name,
            room: room,
            eventName: eventName,
            eventParams: eventParams
        };
        sckt.socket.emit('sendVideoState', params, (error) => { });
    };

    useEffect(() => {
        sckt.socket.on("receiveVideoState", ({ name, room, eventName, eventParams }) => {
            // console.log(player);
            // player.playVideo();
        });
    }, []);

    return (
        <div className="videoContainer">
            <VideoPlayer
                videoId="A_kdC7m8Prs"
                sendVideoState={sendVideoState}
                setPlayer={setPlayer}
            />
        </div>
    );
}

export default Video;