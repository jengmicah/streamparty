import React, { useState, useEffect, useRef } from "react";
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoPlayer.css';

const VideoPlayer = ({ videoProps, sendVideoState, updateState }) => {
    const player = useRef(null);

    useEffect(() => {
        if (videoProps.receiving) {
            let internalPlayer = player.current.internalPlayer;
            // Play Video
            if (videoProps.playing) {
                internalPlayer.seekTo(videoProps.seekTime);
                internalPlayer.playVideo()
                // Pause Video
            } else {
                internalPlayer.pauseVideo()
            }
        }
        // if (typeof player.current.getInternalPlayer() !== undefined && typeof player.current.getInternalPlayer().playVideo == 'function')
        //     player.current.getInternalPlayer().playVideo();
    }, [videoProps.playing]);

    useEffect(() => {
        if (videoProps.receiving) {
            let internalPlayer = player.current.internalPlayer;
            // Change Playback Rate
            internalPlayer.setPlaybackRate(videoProps.playbackRate);
        }
    }, [videoProps.playbackRate]);

    const onPlay = (seekTime) => {
        if (!videoProps.receiving) {
            console.log("PLAY");
            updateState({ playing: true });
            let eventParams = { seekTime };
            sendVideoState({ eventName: 'videoPlay', eventParams });
        } else {
            updateState({ receiving: false });
        }
    }
    const onPause = () => {
        if (!videoProps.receiving) {
            console.log("PAUSE");
            updateState({ playing: false });
            sendVideoState({ eventName: 'videoPause' });
        } else {
            updateState({ receiving: false });
        }
    }
    const onYTPlaybackRateChange = (event) => {
        if (!videoProps.receiving) {
            console.log("PLAYBACK RATE CHANGE");
            let eventParams = {
                playbackRate: event.target.getPlaybackRate()
            };
            sendVideoState({
                eventName: 'videoPlaybackRate',
                eventParams: eventParams
            });
        } else {
            updateState({ receiving: false });
        }
    }
    const onEnded = () => {
        // console.log("END");
    }
    const onBuffer = () => {
        // console.log("BUFFER");
    }


    /** Youtube */
    const YTPlayerState = {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        VIDEO_CUED: 5
    };
    // let prevTime = 0;
    // let player;
    // const isSeek = (event) => {
    //     const currTime = event.target.getCurrentTime();
    //     // console.log(Math.abs(prevTime - currTime));
    //     let timeDelta = Math.abs(prevTime - currTime);
    //     prevTime = currTime;
    //     if (timeDelta > 1) {
    //         onSeek(currTime);
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    const onYTStateChange = (event) => {
        // console.log("STATE CHANGE");
        let playerState = event.data;
        // console.log(event);
        // let seek = isSeek(event);
        switch (playerState) {
            case YTPlayerState.UNSTARTED:
                break;
            case YTPlayerState.ENDED:
                onEnded();
                break;
            case YTPlayerState.PLAYING:
                onPlay(event.target.getCurrentTime());
                break;
            case YTPlayerState.PAUSED:
                onPause();
                break;
            case YTPlayerState.BUFFERING:
                onBuffer();
                break;
            case YTPlayerState.VIDEO_CUED:
                break;
        }
        console.log("==================================")
    }
    const onYTReady = (event) => {
        // event.target.pauseVideo();
        console.log("READY");
        // setPlayer(event.target);
    }

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div id="videoPlayer">
            <YouTube
                ref={player}
                className='react-player'
                videoId={videoProps.url}
                opts={opts}
                // onPlay={onPlay}
                // onPause={onPause}
                // onEnd={onEnd}
                // onError={onError}
                onReady={onYTReady}
                onStateChange={onYTStateChange}
                onPlaybackRateChange={onYTPlaybackRateChange}
            />
            {/* <ReactPlayer
                // ref={p => { player = p }}
                ref={player}
                className='react-player'
                width='100%'
                height='100%'

                url={videoProps.url}
                playing={videoProps.playing}
                // playbackRate={videoProps.playbackRate}
                // volume={0.8}
                // loop={false}
                controls={true}
                // light={false}
                // muted={false}
                // pip={false}

                onPlay={onPlay}
                onPause={onPause}
                onSeek={onSeek}
                // onReady={onReady}
                onEnded={onEnded}
                onBuffer={onBuffer}
                config={{
                    youtube: {
                        // playerVars: {
                        //     controls: 1
                        // },
                        embedOptions: {
                            events: {
                                'onReady': onYTReady,
                                'onPlaybackRateChange': onYTPlaybackRateChange,
                                'onStateChange': onYTStateChange,
                            }
                        }
                    }
                }}
            /> */}
        </div>
    );
};

export default VideoPlayer;