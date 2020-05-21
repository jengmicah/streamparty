import React, { useState, useEffect, useRef } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import VideoSelect from './VideoSelect/VideoSelect';

import { sckt } from '../Socket';

const Video = ({ name, room }) => {
    const player = useRef(null);
    const [videoProps, setVideoProps] = useState({
        currVideoId: "ffyKY3Dj5ZE",
        queueVideoIds: [],
        playing: true,
        receiving: false,
        others_buffering: false,
        last_YT_state: -1,
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
                    break;
                case 'videoPause':
                    // updateState({ playing: false });
                    modifyVideoState({ playing: false });
                    break;
                case 'videoPlaybackRate':
                    // updateState({ playbackRate });
                    modifyVideoState({ playbackRate });
                    break;
                case 'videoStartBuffer':
                    // updateState({ others_buffering: true, seekTime });                    console.log("ME FINISH BUFFER");
                    modifyVideoState({ others_buffering: true, seekTime });
                // console.log("ME FINISH BUFFER");
                case 'videoFinishBuffer':
                    updateState({ others_buffering: false })
                // modifyVideoState({ others_buffering: false })
                default:
                    break;
            }
        });
    }, []);

    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
        // videoProps = Object.assign(videoProps, paramsToChange);
    }
    const modifyVideoState = (paramsToChange) => {
        if (player.current != null) {
            const { playing, seekTime, playbackRate, others_buffering } = paramsToChange;
            let internalPlayer = player.current.internalPlayer;
            if (playing !== undefined) {
                if (playing) {
                    internalPlayer.seekTo(seekTime);
                    if (videoProps.last_YT_state != 1)
                        internalPlayer.playVideo();
                } else {
                    internalPlayer.pauseVideo();
                }
            } else if (playbackRate !== undefined) {
                internalPlayer.setPlaybackRate(playbackRate);
            }
        }
    }
    // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    const youtube_parser = (url) => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }

    const playYTVideoURL = (url) => {
        updateState({currVideoId: youtube_parser(url)})
    }

    return (
        <div className="videoContainer">
            <VideoPlayer
                videoProps={videoProps}
                sendVideoState={sendVideoState}
                updateState={updateState}
                player={player}
            />
            <VideoSelect playYTVideoURL={playYTVideoURL} />
        </div>
    );
}

export default Video;