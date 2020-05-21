import React, { useState, useEffect, useRef } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import VideoSelect from './VideoSelect/VideoSelect';

import { sckt } from '../Socket';

const Video = ({ log, name, room }) => {
    const playerRef = useRef(null);
    // const [videoProps, setVideoProps] = useState({
    //     currVideoId: "ffyKY3Dj5ZE",
    //     queueVideoIds: [],
    //     playing: true,
    //     seekTime: 0,
    //     last_YT_state: -1,
    //     receiving: false,
    // });

    let videoProps = {
        currVideoId: "ffyKY3Dj5ZE",
        queueVideoIds: [],
        playing: true,
        seekTime: 0,
        last_YT_state: -1,
        receiving: false,
        sending: true
    }

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
        sckt.socket.on("getSync", ({ id }) => {
            log("New user needs videoProps to sync.", 'server');
            let player = playerRef.current.internalPlayer;
            player.getCurrentTime().then((currTime) => {
                let params = {
                    id: id,
                    ...videoProps,
                    seekTime: currTime,
                    receiving: true
                }
                sckt.socket.emit('sendSync', params, (error) => { });
            });
        });
        sckt.socket.on("startSync", (videoProps) => {
            log("I'm syncing.", 'server');
            console.log(videoProps);
            updateState({ ...videoProps });
            initVideoState({ ...videoProps });
        });
        sckt.socket.on("receiveVideoState", ({ name, room, eventName, eventParams = {} }) => {
            // console.log(name, eventName, eventParams);
            const { seekTime, playbackRate, videoId } = eventParams;
            updateState({ receiving: true });
            switch (eventName) {
                case 'videoPlay':
                    updateState({ playing: true, seekTime });
                    modifyVideoState({ playing: true, seekTime });
                    break;
                case 'videoPause':
                    updateState({ playing: false, seekTime });
                    modifyVideoState({ playing: false, seekTime });
                    break;
                case 'videoPlaybackRate':
                    updateState({ playbackRate });
                    modifyVideoState({ playbackRate });
                    break;
                case 'videoLoad':
                    updateState({ currVideoId: videoId });
                default:
                    break;
            }
        });
    }, []);

    const updateState = (paramsToChange) => {
        // setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
        videoProps = Object.assign(videoProps, paramsToChange);
    }

    const modifyVideoState = (paramsToChange) => {
        if (playerRef.current != null) {
            const { playing, seekTime, playbackRate, init } = paramsToChange;
            let player = playerRef.current.internalPlayer;
            if (playing !== undefined) {
                if (playing) {
                    player.seekTo(seekTime);
                    if (videoProps.last_YT_state != 1)
                        player.playVideo();
                } else {
                    player.pauseVideo();
                }
            } else if (playbackRate !== undefined) {
                player.setPlaybackRate(playbackRate);
            }
        }
    }
    // Same as modifyVideoState() but handles when existing user video is paused
    const initVideoState = (paramsToChange) => {
        if (playerRef.current != null) {
            const { playing, seekTime, playbackRate, init } = paramsToChange;
            let player = playerRef.current.internalPlayer;
            if (playing !== undefined) {
                if (playing) {
                    player.seekTo(seekTime);
                    if (videoProps.last_YT_state != 1)
                        player.playVideo();
                } else {
                    updateState({ receiving: false })
                    player.seekTo(seekTime);
                    player.pauseVideo();
                }
            }
        }
    }



    return (
        <div className="videoContainer">
            <VideoPlayer
                log={log}
                videoProps={videoProps}
                sendVideoState={sendVideoState}
                updateState={updateState}
                playerRef={playerRef}
            />
            <VideoSelect
                updateState={updateState}
                sendVideoState={sendVideoState}
            />
        </div>
    );
}

export default Video;