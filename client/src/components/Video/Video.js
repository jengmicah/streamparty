import React, { useState, useEffect } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';

import { sckt } from '../Socket';

const Video = ({ name, room }) => {
    const [videoProps, setVideoProps] = useState({
        // url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",

        url: "ysz5S6PUM-U",
        // url: "https://vimeo.com/81633670",
        playing: true,
        playbackRate: 1.0,
        seekTime: 0,
        receiving: false,
        // loop: false,
        // pip: false,
        // controls: true,
        // light: false,
        // volume: 0.8,
        // muted: false,
        // played: 0,
        // loaded: 0,
        // duration: 0,
    });

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
        sckt.socket.on("receiveVideoState", ({ name, room, eventName, eventParams = {} }) => {
            console.log(name, eventName, eventParams);
            const { seekTime, playbackRate } = eventParams;
            updateState({ receiving: true });
            switch (eventName) {
                case 'videoPlay':
                    updateState({ playing: true, seekTime });
                    break;
                case 'videoPause':
                    updateState({ playing: false });
                    break;
                case 'videoPlaybackRate':
                    updateState({ playbackRate });
                    break;
                default:
                    break;
            }
        });
    }, []);

    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
    }
    // useEffect(() => {
    //     console.log(videoProps.seekTime);
    // }, [videoProps.seekTime]);

    return (
        <div className="videoContainer">
            <VideoPlayer
                videoProps={videoProps}
                sendVideoState={sendVideoState}
                updateState={updateState}
            />
        </div>
    );
}

export default Video;