import React, { useState } from "react";
// import Vimeo from '@u-wave/react-vimeo';
import ReactPlayer from 'react-player';
import './VideoPlayer.scss';

const VideoPlayer = ({ currUrl, log, videoProps, sendVideoState, updateVideoProps, playerRef, loadVideo, loadFromQueue }) => {

    const onReady = () => {
        const { history, receiving } = videoProps;
        if (receiving) {
            loadVideo(history[0], true);
        }
    }
    const onPlay = (seekTime) => {
        updateVideoProps({
            lastStateYT: 1,
            playing: true,
            receiving: false,
            seekTime
        });
    }
    const onPause = (seekTime) => {
        updateVideoProps({
            lastStateYT: 2,
            playing: false,
            receiving: false,
            seekTime
        });
    }
    const onBuffer = () => {
        updateVideoProps({ lastStateYT: 3 });
    }
    const onSeeked = () => {
        log("SEND SEEK", "me")
    }
    const PlayerState = {
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
            // setSequence([...sequence, type]);
            // if (type === 1 && isSubArrayEnd(sequence, [3]) && !sequence.includes(-1)) {
            //     sendVideoState({
            //         eventName: 'syncPlay',
            //         eventParams: { seekTime }
            //     });
            //     // log("Sending SEEK", 'me');
            //     setSequence([]);
            // } else {
            //     clearTimeout(timer);
            //     if (type !== 3) {
            //         let timeout = setTimeout(function () {
            if (type === 1 && !sequence.includes(-1)) {
                sendVideoState({
                    eventName: 'syncPlay',
                    eventParams: { seekTime }
                });
                // log("Sending PLAY", 'me');
            } else if (type === 2) {
                sendVideoState({ eventName: 'syncPause' });
                // log("Sending PAUSE", 'me');
            }
            // setSequence([]);
            // }, 50);
            // setTimer(timeout);
            // }
            // }
        }
    }

    const onStateChange = (playerState) => {
        if (playerRef.current != null) {
            // let player = playerRef.current.player;
            let player = playerRef.current.getInternalPlayer();
            if (player !== null) {
                const currTime = playerRef.current.getCurrentTime();
                switch (playerState) {
                    case PlayerState.UNSTARTED:
                        handleVideoSync({ type: -1, event: "UNSTARTED" });
                        break;
                    // case PlayerState.ENDED:
                    //     onEnded();
                    //     break;
                    case PlayerState.PLAYING:
                        onPlay(currTime);
                        handleVideoSync({ type: 1, event: "PLAY", seekTime: currTime });
                        break;
                    case PlayerState.PAUSED:
                        onPause(currTime);
                        handleVideoSync({ type: 2, event: "PAUSE", seekTime: currTime });
                        break;
                    case PlayerState.BUFFERING:
                        onBuffer();
                        handleVideoSync({ type: 3, event: "BUFFER" });
                        break;
                    // case PlayerState.VIDEO_CUED:
                    //     onCue(currTime);
                    //     break;
                    default:
                        break;
                }
            }
        }
    }

    return (
        <div className="videoPlayerContainer">
            <ReactPlayer
                ref={playerRef}
                className='videoPlayer'
                width='100%'
                height='100%'
                controls
                playing={videoProps.shouldPlay}
                // url='https://www.youtube.com/watch?v=UGFCbmvk0vo'
                // url='https://vimeo.com/81633670'
                url={currUrl.current}
                onReady={() => onReady()}
                onPlay={() => onStateChange(1)}
                onPause={() => onStateChange(2)}
                onBuffer={() => onStateChange(3)}
            // onLoaded={onLoaded}
            // onSeeked={onSeeked}
            />
        </div>
    );
};

export default VideoPlayer;