import React, { useState, useEffect, useRef } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';

import { sckt } from '../Socket';

const Video = ({ name, room }) => {
    const player = useRef(null);

    const [videoProps, setVideoProps] = useState({
        // url: "https://www.youtube.com/watch?v=LR9msTsmpZs",

        url: "ffyKY3Dj5ZE",
        // url: "https://vimeo.com/81633670",
        playing: true,
        receiving: false,
        others_buffering: false,
        last_YT_state: -1,
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
            // console.log(name, eventName, eventParams);
            const { seekTime, playbackRate } = eventParams;
            updateState({ receiving: true });
            switch (eventName) {
                case 'videoPlay':
                    // updateState({ playing: true, seekTime });
                    modifyVideoState({ playing: true, seekTime });
                    console.log("RECEIVING PLAY");
                    break;
                case 'videoPause':
                    // updateState({ playing: false });
                    modifyVideoState({ playing: false });
                    console.log("RECEIVING PAUSE");
                    break;
                case 'videoPlaybackRate':
                    // updateState({ playbackRate });
                    modifyVideoState({ playbackRate });
                    console.log("PLAYBACK RATE CHANGE");
                    break;
                // case 'videoStartBuffer':
                //     updateState({ others_buffering: true, seekTime });                    console.log("ME FINISH BUFFER");
                //     // modifyVideoState({ others_buffering: true, seekTime });                    console.log("ME FINISH BUFFER");
                // case 'videoFinishBuffer':
                //     updateState({ others_buffering: false })
                //     // modifyVideoState({ others_buffering: false })
                default:
                    break;
            };
            // updateState({ receiving: false });
        });
    }, []);

    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
    }
    const modifyVideoState = (paramsToChange) => {
        const { playing, seekTime, playbackRate, others_buffering } = paramsToChange;
        let internalPlayer = player.current.internalPlayer;
        if (playing !== undefined) {
            if (playing) {
                // if(videoProps.last_YT_state !== 3)
                internalPlayer.seekTo(seekTime);
                // if(!videoProps.others_buffering)
                    internalPlayer.playVideo();
            } else {
                internalPlayer.pauseVideo();
            }
        } else if (playbackRate !== undefined) {
            internalPlayer.setPlaybackRate(playbackRate);
        // } else if (others_buffering !== undefined) {
        //     if(others_buffering) {
        //         internalPlayer.seekTo(seekTime);
        //     } else {
        //     }
        }
    }

    return (
        <div className="videoContainer">
            <VideoPlayer
                videoProps={videoProps}
                sendVideoState={sendVideoState}
                updateState={updateState}
                player={player}
            />
        </div>
    );
}

export default Video;