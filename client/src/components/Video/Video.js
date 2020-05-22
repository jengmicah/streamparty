import React, { useState, useEffect, useRef } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import VideoSelect from './VideoSelect/VideoSelect';

import { sckt } from '../Socket';

const Video = ({ log, name, room }) => {
    const playerRef = useRef(null);
    const [videoProps, setVideoProps] = useState({
        currVideoId: "ffyKY3Dj5ZE",
        queueVideoIds: [],
        playing: true,
        seekTime: 0,
        last_YT_state: -1,
        receiving: false,
    });

    // let videoProps = {
    //     currVideoId: "ffyKY3Dj5ZE",
    //     queueVideoIds: [],
    //     playing: true,
    //     seekTime: 0,
    //     last_YT_state: -1,
    //     receiving: false,
    //     sending: true
    // }

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
                // if (!params.playing) {
                //     params.receiving = false;
                // }
                sckt.socket.emit('sendSync', params, (error) => { });
            });
        });
    });
    useEffect(() => {
        sckt.socket.on("startSync", (videoProps) => {
            log("I'm syncing.", 'server');
            updateState({ ...videoProps });
            modifyVideoState({ ...videoProps });
        });
        sckt.socket.on("receiveVideoState", ({ name, room, eventName, eventParams = {} }) => {
            // console.log(name, eventName, eventParams);
            const { seekTime, playbackRate, videoId, queueVideoIds } = eventParams;
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
                    loadVideoById(videoId, false);
                    break;
                case 'videoAddToQueue':
                    updateState({ queueVideoIds });
                    break;
                case 'videoLoadNextInQueue':
                    loadVideoById(videoId, false);
                    // updateState({
                    //     queueVideoIds: queueVideoIds,
                    //     currVideoId: videoId
                    // });
                    break;
                default:
                    break;
            }
        });
    }, []);

    const loadVideoById = (videoId, sync) => {
        let player = playerRef.current.internalPlayer;
        if (sync) {
            if (videoProps.playing) {
                player.loadVideoById({
                    videoId: videoId,
                    startSeconds: videoProps.seekTime
                });
            } else {
                player.loadVideoById({
                    videoId: videoId,
                    startSeconds: videoProps.seekTime
                });
                player.pauseVideo();
                updateState({ receiving: false });
            }
        } else {
            player.loadVideoById({ videoId });
        }
        updateState({ currVideoId: videoId });
    }
    const loadNextVideo = (queueVideoIds) => {
        console.log(queueVideoIds);
        let nextVideoId = queueVideoIds[0];
        if (nextVideoId !== undefined) {
            loadVideoById(nextVideoId, false);
            updateState({
                queueVideoIds: queueVideoIds.slice(1),
                currVideoId: nextVideoId
            });
            sendVideoState({
                eventName: 'videoLoadNextInQueue',
                evenParams: {
                    queueVideoIds: queueVideoIds,
                    videoId: nextVideoId
                }
            });
        }
    }
    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
        // videoProps = Object.assign(videoProps, paramsToChange);
    }
    const modifyVideoState = (paramsToChange) => {
        if (playerRef.current != null) {
            const { playing, seekTime, playbackRate, init } = paramsToChange;
            let player = playerRef.current.internalPlayer;
            if (playing !== undefined) {
                if (playing) {
                    player.seekTo(seekTime);
                    if (videoProps.last_YT_state != 1 || videoProps.last_YT_state != 3) // If not already playing
                        player.playVideo();
                } else {
                    if (videoProps.last_YT_state != 2) // If not already paused
                        player.pauseVideo();
                }
            } else if (playbackRate !== undefined) {
                player.setPlaybackRate(playbackRate);
            }
        }
    }

    useEffect(() => {
        console.log(videoProps.queueVideoIds);
    }, [videoProps.queueVideoIds])

    return (
        <div className="videoContainer">
            <VideoPlayer
                log={log}
                videoProps={videoProps}
                sendVideoState={sendVideoState}
                updateState={updateState}
                playerRef={playerRef}
                loadNextVideo={loadNextVideo}
                loadVideoById={loadVideoById}
            />
            <VideoSelect
                updateState={updateState}
                sendVideoState={sendVideoState}
                videoProps={videoProps}
                loadVideoById={loadVideoById}
                loadNextVideo={loadNextVideo}
            />
        </div>
    );
}

export default Video;