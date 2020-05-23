import React, { useState, useEffect, useRef } from "react";
import './Video.css';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import VideoSelect from './VideoSelect/VideoSelect';

import { sckt } from '../Socket';
import { insert } from './VideoHelper';

const Video = ({ log, name, room }) => {
    const playerRef = useRef(null);
    const [videoProps, setVideoProps] = useState({
        currVideoIndex: 0,
        insertIndex: 0,
        queueVideoIds: ["ffyKY3Dj5ZE"],
        playing: true,
        seekTime: 0,
        last_YT_state: -1,
        receiving: false,
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
            const { seekTime, playbackRate, videoId, queueVideoIds, currVideoIndex, insertIndex } = eventParams;
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
                    updateState({ currVideoIndex });
                    addVideoToQueue(videoId, queueVideoIds, insertIndex);
                    break;
                case 'videoLoadNextInQueue':
                    updateState({ currVideoIndex: currVideoIndex + 1 });
                    loadNextVideo(queueVideoIds, currVideoIndex);
                    break;
                default:
                    break;
            }
        });
    }, []);

    const loadVideoById = (videoId, sync) => {
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
    const loadNextVideo = (queueVideoIds, currVideoIndex) => {
        let nextVideoId = queueVideoIds[currVideoIndex + 1];
        if (nextVideoId !== undefined) {
            loadVideoById(nextVideoId, false);
        }
    }
    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
        // videoProps = Object.assign(videoProps, paramsToChange);
    }
    const modifyVideoState = (paramsToChange) => {
        if (playerRef.current != null) {
            const { last_YT_state } = videoProps;
            const { playing, seekTime, playbackRate, init } = paramsToChange;
            let player = playerRef.current.internalPlayer;
            if (playing !== undefined) {
                if (playing) {
                    player.seekTo(seekTime);
                    if (last_YT_state != 1 || last_YT_state != 3) // If not already playing
                        player.playVideo();
                } else {
                    if (last_YT_state != 2) // If not already paused
                        player.pauseVideo();
                }
            } else if (playbackRate !== undefined) {
                player.setPlaybackRate(playbackRate);
            }
        }
    }
    const addVideoToQueue = (videoId, queueVideoIds, currVideoIndex) => {
        let updatedQueue = insert(queueVideoIds, currVideoIndex + 1, videoId)
        updateState({ queueVideoIds: updatedQueue });
    }
    useEffect(() => {
        console.log(videoProps.currVideoIndex, videoProps.queueVideoIds);
    }, [videoProps.queueVideoIds])
    useEffect(() => {
        console.log(videoProps.currVideoIndex, videoProps.queueVideoIds);
    }, [videoProps.currVideoIndex])

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
                addVideoToQueue={addVideoToQueue}
            />
        </div>
    );
}

export default Video;