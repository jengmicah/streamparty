import React, { useState, useEffect, useRef } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import VideoSelect from './VideoSelect/VideoSelect';

import { sckt } from '../Socket';
import { insert } from './VideoHelper';

const Video = ({ log, name, room }) => {
    const playerRef = useRef(null);
    const [videoProps, setVideoProps] = useState({
        queueIndex: 0,
        queue: ["ffyKY3Dj5ZE"],
        playing: true,
        seekTime: 0,
        lastStateYT: -1,
        receiving: false,
    });
    useEffect(() => {
        // Send videoProps to new user
        sckt.socket.on("getSync", ({ id }) => {
            log("New user needs videoProps to sync.", 'server');
            if (playerRef.current != null && playerRef.current.internalPlayer != null) {
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
            }
        });
    });
    useEffect(() => {
        // Sync other user's videoProps to our state
        sckt.socket.on("startSync", (videoProps) => {
            log("I'm syncing.", 'server');
            updateState({ ...videoProps });
            modifyVideoState({ ...videoProps });
        });
        // Update single value in videoProps from other user
        sckt.socket.on("receiveVideoState", ({ name, room, eventName, eventParams = {} }) => {
            const { seekTime, playbackRate, videoId, queue, queueIndex, insertIndex } = eventParams;
            updateState({ receiving: true });
            switch (eventName) {
                case 'syncPlay':
                    updateState({ playing: true, seekTime });
                    modifyVideoState({ playing: true, seekTime });
                    break;
                case 'syncPause':
                    updateState({ playing: false, seekTime });
                    modifyVideoState({ playing: false, seekTime });
                    break;
                case 'syncRateChange':
                    updateState({ playbackRate });
                    modifyVideoState({ playbackRate });
                    break;
                case 'syncLoad':
                    loadVideo(videoId, false);
                    break;
                case 'syncAddToQueue':
                    updateState({ queueIndex });
                    addVideoToQueue(videoId, queue, insertIndex);
                    break;
                case 'syncLoadFromQueue':
                    updateState({ queueIndex });
                    loadFromQueue(queue, queueIndex);
                    break;
                default:
                    break;
            }
        });
    }, []);
    const sendVideoState = ({ eventName, eventParams }) => {
        let params = {
            name: name,
            room: room,
            eventName: eventName,
            eventParams: eventParams
        };
        sckt.socket.emit('sendVideoState', params, (error) => { });
    };
    const loadVideo = (videoId, sync) => {
        if (playerRef.current != null && playerRef.current.internalPlayer != null) {
            const { playing, seekTime } = videoProps;
            let player = playerRef.current.internalPlayer;
            if (sync) {
                if (playing) {
                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: seekTime
                    });
                } else {
                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: seekTime
                    });
                    player.pauseVideo();
                    updateState({ receiving: false });
                }
            } else {
                player.loadVideoById({ videoId });
            }
        }
    }
    const loadFromQueue = (queue, nextVideoIndex) => {
        let nextVideoId = queue[nextVideoIndex];
        if (nextVideoId !== undefined) {
            loadVideo(nextVideoId, false);
        }
    }
    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
    }
    const modifyVideoState = (paramsToChange) => {
        if (playerRef.current != null && playerRef.current.internalPlayer != null) {
            const { lastStateYT } = videoProps;
            const { playing, seekTime, playbackRate } = paramsToChange;
            let player = playerRef.current.internalPlayer;
            if (playing !== undefined) {
                if (playing) {
                    player.seekTo(seekTime);
                    // If not already playing
                    if (lastStateYT != 1 || lastStateYT != 3)
                        player.playVideo();
                } else {
                    // If not already paused
                    if (lastStateYT != 2)
                        player.pauseVideo();
                }
            } else if (playbackRate !== undefined) {
                player.setPlaybackRate(playbackRate);
            }
        }
    }
    const addVideoToQueue = (videoId, queue, queueIndex) => {
        let updatedQueue = insert(queue, queueIndex, videoId)
        updateState({ queue: updatedQueue });
    }
    // Debugging
    useEffect(() => {
        console.log(videoProps.queueIndex, videoProps.queue);
    }, [videoProps.queue])
    useEffect(() => {
        console.log(videoProps.queueIndex, videoProps.queue);
    }, [videoProps.queueIndex])

    return (
        <div className="videoContainer">
            <VideoPlayer
                log={log}
                videoProps={videoProps}
                sendVideoState={sendVideoState}
                updateState={updateState}
                playerRef={playerRef}
                loadFromQueue={loadFromQueue}
                loadVideo={loadVideo}
            />
            <VideoSelect
                updateState={updateState}
                sendVideoState={sendVideoState}
                videoProps={videoProps}
                loadVideo={loadVideo}
                loadFromQueue={loadFromQueue}
                addVideoToQueue={addVideoToQueue}
            />
        </div>
    );
}

export default Video;