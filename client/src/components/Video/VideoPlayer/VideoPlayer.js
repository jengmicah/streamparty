import React from "react";
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';

import './VideoPlayer.css';

const VideoPlayer = ({ log, videoProps, sendVideoState, updateState, playerRef, loadVideo, loadFromQueue }) => {

    const onYTPlay = (seekTime) => {
        const { receiving } = videoProps;
        updateState({
            lastStateYT: 1,
            playing: true,
            seekTime
        });
        if (receiving) {
            log("Got PLAY", 'others');
            updateState({ receiving: false });
        } else {
            log("Sending PLAY", 'me');
            sendVideoState({
                eventName: 'syncPlay',
                eventParams: { seekTime }
            });
        }
    }
    const onYTPause = (seekTime) => {
        const { receiving } = videoProps;
        updateState({
            lastStateYT: 2,
            playing: false,
            seekTime
        });
        if (receiving) {
            log("Got PAUSE", 'others');
            updateState({ receiving: false });
        } else {
            log("Sending PAUSE", 'me');
            sendVideoState({
                eventName: 'syncPause',
                eventParams: { seekTime }
            });
        }
    }
    const onYTBuffer = (seekTime) => {
        updateState({ lastStateYT: 3 });
    }
    const onYTPlaybackRateChange = (event) => {
        const { receiving } = videoProps;
        if (receiving) {
            log("Got PLAYBACK RATE change", 'others');
            updateState({ receiving: false });
        } else {
            log("Sending PLAYBACK RATE change", 'me');
            let eventParams = {
                playbackRate: event.target.getPlaybackRate()
            };
            updateState({ ...eventParams, receiving: false });
            sendVideoState({
                eventName: 'syncRateChange',
                eventParams: eventParams
            });
        }
    }
    const onYTEnded = () => {
        const { receiving, queue, queueIndex } = videoProps;
        if (receiving) {
            updateState({ receiving: false });
        } else {
            log("ENDING", 'me');
            if (queueIndex + 1 <= queue.length - 1) {
                loadFromQueue(queue, queueIndex + 1);
                updateState({ queueIndex: queueIndex + 1 });
                sendVideoState({
                    eventName: 'syncLoadFromQueue',
                    eventParams: {
                        queue: queue,
                        queueIndex: queueIndex + 1
                    }
                });
            }
        }
    }
    const onYTCue = () => {
        log("CUED", 'me');
    }
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
        switch (playerState) {
            case YTPlayerState.UNSTARTED:
                // onYTLoadVideo();
                break;
            case YTPlayerState.ENDED:
                onYTEnded();
                break;
            case YTPlayerState.PLAYING:
                onYTPlay(currTime);
                break;
            case YTPlayerState.PAUSED:
                onYTPause(currTime);
                break;
            case YTPlayerState.BUFFERING:
                onYTBuffer(currTime);
                break;
            case YTPlayerState.VIDEO_CUED:
                onYTCue();
                break;
        }
    }
    const onYTReady = (event) => {
        log("STARTING", 'me');
        const { queue, queueIndex, receiving } = videoProps;
        if (receiving) {
            loadVideo(queue[queueIndex], true);
        } else {
            loadVideo(queue[queueIndex], false);
        }
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
                ref={playerRef}
                className='react-player'
                // videoId={videoProps.currVideoId}
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