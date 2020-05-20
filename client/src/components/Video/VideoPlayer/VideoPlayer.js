import React, { useState, useEffect, useRef } from "react";
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoPlayer.css';

const VideoPlayer = ({ videoProps, sendVideoState, updateState, player }) => {

    const onPlay = (seekTime) => {
        console.log(videoProps);
        updateState({ last_YT_state: 1 });
        // if (videoProps.others_buffering) {
        //     let internalPlayer = player.current.internalPlayer;
        //     internalPlayer.pauseVideo();
        // } else {
        if (!videoProps.receiving) {
            console.log("SENDING PLAY");
            sendVideoState({
                eventName: 'videoPlay',
                eventParams: { seekTime }
            });
        } else {
            // console.log("RECEIVING PLAY");
            updateState({ receiving: false });
        }
        // }
    }
    const onPause = (seekTime) => {
        updateState({ last_YT_state: 2 });
        if (!videoProps.receiving) {
            console.log("SENDING PAUSE");
            sendVideoState({
                eventName: 'videoPause',
                // eventParams: { seekTime }
            });
        } else {
            // console.log("RECEIVING PAUSE");
            updateState({ receiving: false });
        }
    }
    const onBuffer = (seekTime) => {
        updateState({ last_YT_state: 3 });
        // if (!videoProps.receiving) {
        //     console.log("START BUFFER");
        //     sendVideoState({
        //         eventName: 'videoStartBuffer',
        //         eventParams: { seekTime }
        //     });
        // } else {
        //     console.log("FORCED BUFFER");
        //     updateState({ receiving: false });
        // }
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


    /** Youtube */
    const YTPlayerState = {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        VIDEO_CUED: 5
    };
    const onYTStateChange = (event) => {
        // console.log("STATE CHANGE");
        let playerState = event.data;
        // console.log(event);
        const currTime = event.target.getCurrentTime();
        switch (playerState) {
            case YTPlayerState.UNSTARTED:
                break;
            case YTPlayerState.ENDED:
                onEnded();
                break;
            case YTPlayerState.PLAYING:
                onPlay(currTime);
                break;
            case YTPlayerState.PAUSED:
                onPause();
                break;
            case YTPlayerState.BUFFERING:
                onBuffer(currTime);
                break;
            case YTPlayerState.VIDEO_CUED:
                break;
        }
        // console.log("==================================")
    }
    const onYTReady = (event) => {
        // event.target.pauseVideo();
        console.log("READY");
        // let videoPlayers = document.querySelector('.react-player');
        // console.log(videoPlayers);
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