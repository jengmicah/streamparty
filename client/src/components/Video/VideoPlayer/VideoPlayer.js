import React, { useState, useEffect, useRef } from "react";
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoPlayer.css';

const VideoPlayer = ({ videoProps, sendVideoState, updateState, player }) => {

    const onYTPlay = (seekTime) => {
        // console.log(videoProps);
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
            console.log("RECEIVING PLAY");
            updateState({ receiving: false });
        }
        // }
    }
    const onYTPause = (seekTime) => {
        updateState({ last_YT_state: 2 });
        if (!videoProps.receiving) {
            console.log("SENDING PAUSE");
            sendVideoState({
                eventName: 'videoPause',
                // eventParams: { seekTime }
            });
        } else {
            console.log("RECEIVING PAUSE");
            updateState({ receiving: false });
        }
    }
    const onYTBuffer = (seekTime) => {
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
    const onYTLoadVideo = () => {
        
    }
    const onYTEnded = () => {
        console.log("END");
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
        let playerState = event.data;
        const currTime = event.target.getCurrentTime();
        console.log(event.data);
        switch (playerState) {
            case YTPlayerState.UNSTARTED:
                onYTLoadVideo();
                break;
            case YTPlayerState.ENDED:
                onYTEnded();
                break;
            case YTPlayerState.PLAYING:
                onYTPlay(currTime);
                break;
            case YTPlayerState.PAUSED:
                onYTPause();
                break;
            case YTPlayerState.BUFFERING:
                onYTBuffer(currTime);
                break;
            case YTPlayerState.VIDEO_CUED:
                break;
        }
    }
    const onYTReady = (event) => {
        event.target.playVideo();
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
                videoId={videoProps.currVideoId}
                opts={opts}
                // onPlay={onPlay}
                // onPause={onPause}
                // onEnd={onEnd}
                // onError={onError}
                onReady={onYTReady}
                onStateChange={onYTStateChange}
                onPlaybackRateChange={onYTPlaybackRateChange}
            />
        </div>
    );
};

export default VideoPlayer;
