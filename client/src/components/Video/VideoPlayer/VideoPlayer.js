import React, { useState, useEffect } from "react";
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
        updateState({ receiving: false });
        // if (receiving) {
        //     log("Got PLAY", 'others');
        // }
    }
    const onYTPause = (seekTime) => {
        const { receiving } = videoProps;
        updateState({
            lastStateYT: 2,
            playing: false,
            seekTime
        });
        updateState({ receiving: false });
        // if (receiving) {
        //     log("Got PAUSE", 'others');
        // }
    }
    const onYTBuffer = (seekTime) => {
        // log("BUFFER", 'me');
        updateState({ lastStateYT: 3 });
    }
    const onYTPlaybackRateChange = (event) => {
        const { receiving } = videoProps;
        if (receiving) {
            // log("Got PLAYBACK RATE change", 'others');
            updateState({ receiving: false });
        } else {
            // log("Sending PLAYBACK RATE change", 'me');
            let eventParams = {
                playbackRate: event.target.getPlaybackRate()
            };
            sendVideoState({
                eventName: 'syncRateChange',
                eventParams: eventParams
            });
            updateState({ ...eventParams, receiving: false });
        }
    }
    const onYTEnded = () => {
        const { receiving, queue } = videoProps;
        if (receiving) {
            updateState({ receiving: false });
        } else {
            // log("ENDING", 'me');
            if (queue.length > 0) {
                sendVideoState({
                    eventName: 'syncLoadFromQueue',
                    eventParams: {
                        queue: queue,
                    }
                });
                loadFromQueue(queue);
            }
        }
    }
    const onYTCue = (seekTime) => {
        // log("CUED", 'me');
        updateState({
            lastStateYT: 5,
            playing: false
        });
    }

    const YTPlayerState = {
        UNSTARTED: -1,
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        VIDEO_CUED: 5
    };
    const [sequence, setSequence] = useState([]);
    const [timer, setTimer] = useState(null);

    // Check if sub exists at end of full array
    const isSubArrayEnd = (A, B) => {
        if (A.length < B.length) return false;
        let i = 0;
        while (i < B.length) {
            if (A[A.length - i - 1] !== B[B.length - i - 1])
                return false;
            i++;
        }
        return true;
    }
    // Seek Mouse: pause + buffer + play: 2 + 3 + 1
    // Seek Arrow Keys: buffer + play: 3 + 1
    const handleVideoSync = ({ type, event, seekTime }) => {
        const { receiving } = videoProps;
        if (!receiving) {
            setSequence([...sequence, type]);
            // if (type == 1 && isSubArrayEnd(sequence, [2, 3])) {
            //     // console.log(sequence, [2, 3], isSubArrayEnd(sequence, [2, 3]));
            //     sendVideoState({
            //         eventName: 'syncSeek',
            //         eventParams: { seekTime }
            //     });
            //     log("Sending SEEK", 'me');
            //     setSequence([]);
            if (type == 1 && isSubArrayEnd(sequence, [3])) {
                sendVideoState({
                    eventName: 'syncSeek',
                    eventParams: { seekTime }
                });
                // log("Sending SEEK", 'me');
                setSequence([]);
            } else {
                clearTimeout(timer);
                if (type !== 3) {
                    let timeout = setTimeout(function () {
                        if (type == 1) {
                            sendVideoState({
                                eventName: 'syncPlay',
                                eventParams: { seekTime }
                            });
                            // log("Sending PLAY", 'me');
                        } else if (type == 2) {
                            sendVideoState({ eventName: 'syncPause' });
                            // log("Sending PAUSE", 'me');
                        }
                        setSequence([]);
                    }, 250);
                    setTimer(timeout);
                }
            }
        }
    }

    const onYTStateChange = (event) => {
        let playerState = event.data;
        const currTime = event.target.getCurrentTime();
        switch (playerState) {
            case YTPlayerState.UNSTARTED:
                handleVideoSync({ type: -1, event: "UNSTARTED" });
                break;
            case YTPlayerState.ENDED:
                onYTEnded();
                break;
            case YTPlayerState.PLAYING:
                onYTPlay(currTime);
                handleVideoSync({ type: 1, event: "PLAY", seekTime: currTime });
                break;
            case YTPlayerState.PAUSED:
                onYTPause(currTime);
                handleVideoSync({ type: 2, event: "PAUSE", seekTime: currTime });
                break;
            case YTPlayerState.BUFFERING:
                onYTBuffer(currTime);
                handleVideoSync({ type: 3, event: "BUFFER" });
                break;
            case YTPlayerState.VIDEO_CUED:
                onYTCue(currTime);
                break;
        }
    }
    const onYTReady = (event) => {
        // log("STARTING", 'me');
        const { queue, history, receiving } = videoProps;
        if (receiving) {
            loadVideo(history[0], true);
        } else {
            loadFromQueue(queue, false);
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