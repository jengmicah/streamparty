import React, { useState, useEffect } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';

import { sckt } from '../Socket';

const Video = ({ name, room }) => {
    const [videoProps, setVideoProps] = useState({
        url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
        // url: "https://vimeo.com/81633670"
        playing: true,
        playbackRate: 1.0,
        seekTime: 23,
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
        sckt.socket.on("receiveVideoState", ({ name, room, eventName, eventParams }) => {
            console.log(name, room, eventName, eventParams);
            switch (eventName) {
                case 'videoPlay':
                    setVideoProps((prev) => ({ ...prev, playing: true }));
                    break;
                case 'videoPause':
                    setVideoProps((prev) => ({ ...prev, playing: false }));
                    break;
                case 'videoSeek':
                    // setVideoProps((prev) => ({ ...prev, seekTime: eventParams.currTime }));
                    break;
                case 'videoPlaybackRate':
                    break;
                default:
                    break;
            }
        });
    }, []);

    const update = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
    }
    const changeStuff = () => {
        setVideoProps((prev) => ({ ...prev, playing: !videoProps.playing }));
    }

    useEffect(() => {
        console.log(videoProps.seekTime);
    }, [videoProps.seekTime]);

    return (
        <div className="videoContainer">
            <VideoPlayer
                videoProps={videoProps}
                sendVideoState={sendVideoState}
                update={update}
                changeStuff={changeStuff}
            />
        </div>
    );
}

export default Video;