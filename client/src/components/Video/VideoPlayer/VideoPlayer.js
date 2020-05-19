import React, { useState, useEffect } from "react";
// import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoPlayer.css';

const VideoPlayer = ({ videoProps, sendVideoState, update }) => {

    const onPlay = () => {
        // console.log("PLAY");
        update({ playing: true });
        sendVideoState({ eventName: 'videoPlay' });
    }
    const onPause = () => {
        // console.log("PAUSE");
        update({ playing: false });
        sendVideoState({ eventName: 'videoPause' });
    }
    const onSeek = (currTime) => {
        // console.log("SEEK");
        let eventParams = { currTime };
        update({ seekTime: currTime });
        sendVideoState({ eventName: 'videoSeek', eventParams });
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
    let prevTime = 0;
    let player;
    const isSeek = (event) => {
        const currTime = event.target.getCurrentTime();
        // console.log(Math.abs(prevTime - currTime));
        let timeDelta = Math.abs(prevTime - currTime);
        prevTime = currTime;
        if (timeDelta > 1) {
            onSeek(currTime);
            return true;
        } else {
            return false;
        }
    }
    const onYTStateChange = (event) => {
        // console.log("STATE CHANGE");
        let playerState = event.data;
        // console.log(event);
        let seek = isSeek(event);
        switch (playerState) {
            case YTPlayerState.UNSTARTED:
                break;
            case YTPlayerState.ENDED:
                onEnded();
                break;
            case YTPlayerState.PLAYING:
                // While paused, seek
                onPlay();
                break;
            case YTPlayerState.PAUSED:
                // While playing, seek with mouse
                onPause();
                break;
            case YTPlayerState.BUFFERING:
                // While playing, seek with arrows
                onBuffer();
                break;
            case YTPlayerState.VIDEO_CUED:
                break;
        }

        console.log("==================================")
    }
    const onYTPlaybackRateChange = (event) => {
        console.log("PLAYBACK RATE CHANGE");
        let eventParams = {
            playbackRate: event.target.getPlaybackRate()
        };
        // setVideoProps({ ...videoProps, playbackRate: event.target.getPlaybackRate() });
        sendVideoState({ eventName: 'videoPlaybackRate', eventParams: eventParams });
    }
    const onYTReady = (event) => {
        // event.target.pauseVideo();
        console.log("READY");
        // setPlayer(player);
    }

    const changeStuff = () => {
        update();
    }

    useEffect(() => {
        console.log(videoProps);
    }, [videoProps.playing]);

    // useEffect(() => {
    //     console.log(player);
    //     // if (player !== undefined) {
    //     //     player.seekTo(videoProps.seekTime, "seconds");
    //     // }
    //     console.log(videoProps.seekTime);
    // }, [videoProps.seekTime]);

    return (
        <div id="videoPlayer">
            <ReactPlayer
                ref={p => { player = p }}
                className='react-player'
                width='100%'
                height='100%'

                url={videoProps.url}
                playing={videoProps.playing}
                playbackRate={videoProps.playbackRate}
                volume={0.8}
                loop={false}
                controls={true}
                light={false}
                muted={false}
                pip={false}

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
            />
            <button
                style={{ position: 'absolute', 'bottom': 0 }}
                onClick={() => changeStuff()}>{videoProps.playing.toString()}</button>
        </div>
    );
};

export default VideoPlayer;