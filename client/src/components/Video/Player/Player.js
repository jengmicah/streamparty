import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import screenful from "screenfull";
import Controls from "./Controls";

import './Player.scss';

let count = 0;

function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function Player({ videoProps, sendVideoState, updateVideoProps, loadVideo, loadFromQueue, playerRef }) {
    const [isVideoStarted, setIsVideoStarted] = useState(false);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [state, setState] = useState({
        pip: false,
        playing: false,
        light: false,
        muted: false,
        played: 0,
        duration: 0,
        playbackRate: 1.0,
        volume: 1.0,
        seeking: false,
        isFullscreen: false,
        jumpedTime: 0
    });

    const playerContainerRef = useRef(null);
    const controlsRef = useRef(null);

    const currentTime = (playerRef && playerRef.current) ? playerRef.current.getCurrentTime() : 0;
    const duration = (playerRef && playerRef.current) ? playerRef.current.getDuration() : 0;
    // const elapsedTime = timeDisplayFormat == "normal" ? format(currentTime) : `-${format(duration - currentTime)}`;
    // const totalDuration = format(duration);

    const {
        light,
        muted,
        playbackRate,
        pip,
        seeking,
        volume,
        isFullscreen,
        jumpedTime
    } = state;

    const {
        queue,
        history,
        playing,
        seekTime,
        receiving,
        initVideo,
        videoType
    } = videoProps;

    const handlePlayPause = () => {
        const seekTime = playerRef.current.getCurrentTime();
        if (playing) {
            // Going to pause
            updateVideoProps({
                playing: false,
                seekTime,
                receiving: false
            });
            sendVideoState({
                eventName: 'syncPause',
                eventParams: { seekTime }
            });
            if (isVideoEnded) playerRef.current.seekTo(0);
            // console.log("PAUSING")
        } else {
            // Going to play
            updateVideoProps({
                playing: true,
                seekTime,
                receiving: false
            });
            sendVideoState({
                eventName: 'syncPlay',
                eventParams: { seekTime }
            });
            // console.log("PLAYING")
        }
    };

    const handleRewind = () => {
        let newTime = playerRef.current.getCurrentTime() - 10;
        if (newTime < 0) newTime = 0;
        playerRef.current.seekTo(newTime);
        setState({ ...state, seeking: true, jumpedTime: newTime });
        sendVideoState({
            eventName: 'syncPlay',
            eventParams: { seekTime: newTime }
        });
    };

    const handleFastForward = () => {
        let newTime = playerRef.current.getCurrentTime() + 10;
        if (duration && newTime > duration) newTime = duration;
        playerRef.current.seekTo(newTime);
        setState({ ...state, seeking: true, jumpedTime: newTime });
        sendVideoState({
            eventName: 'syncPlay',
            eventParams: { seekTime: newTime }
        });
    };

    const handleProgress = (changeState) => {
        if (count > 1) {
            hideControls();
            count = 0;
        }
        if (controlsRef.current.style.opacity === 1) {
            count += 1;
        }
        if (!seeking) {
            setState({ ...state, ...changeState });
        }
    };
    const handleSeekMouseDown = (newTime) => {
        // // const newTime = getProgressBarTime(e);
        // newTime = newTime[0]
        console.log("DOWN", newTime);
        // // setState({ ...state, seeking: true, played: parseFloat(newTime / 100) });
        // playerRef.current.seekTo(newTime, "seconds");
        // sendVideoState({
        //     eventName: 'syncSeek',
        //     eventParams: { seekTime: newTime }
        // });
    };
    const handleSeek = (newTime) => {
        newTime = newTime[0];
        if (newTime < 0) newTime = 0;
        else if (duration && newTime > duration) newTime = duration;
        setState({ ...state, seeking: true, jumpedTime: newTime });
        playerRef.current.seekTo(newTime, "seconds");
        sendVideoState({
            eventName: 'syncSeek',
            eventParams: { seekTime: newTime }
        });
    }
    const handleVolumeChange = (newValue) => {
        newValue = newValue[0];
        if (newValue < 0) newValue = 0;
        else if (newValue > 1) newValue = 1;
        setState({
            ...state,
            volume: parseFloat(newValue),
            muted: newValue === 0 ? true : false,
        });
    };

    const toggleFullScreen = () => {
        screenful.toggle(playerContainerRef.current);
    }
    const handleMouseMove = () => {
        showControls();
        count = 0;
    };

    const handleMouseLeave = () => {
        setTimeout(function () {
            hideControls();
            count = 0;
        }, 200);
    };

    const handlePlaybackRate = (rate) => {
        if (rate === 0) rate = 0.5;
        setState({ ...state, playbackRate: rate });
        updateVideoProps({ receiving: false });
        let eventParams = { playbackRate: rate };
        sendVideoState({
            eventName: 'syncRateChange',
            eventParams: eventParams
        });
    };

    const handleMute = () => {
        setState({ ...state, muted: !muted });
    };

    useEffect(() => {
        if (!iOS())
            screenful.on('change', () => setState({ ...state, isFullscreen: screenful.isFullscreen }));
    }, [])

    const showControls = () => {
        if (isVideoStarted || iOS()) {
            controlsRef.current.style.opacity = 1;
            controlsRef.current.style.pointerEvents = "auto";
            controlsRef.current.style.cursor = "auto";
            playerContainerRef.current.style.cursor = "auto";
        }
    }
    const hideControls = () => {
        controlsRef.current.style.opacity = 0;
        controlsRef.current.style.pointerEvents = "none";
        controlsRef.current.style.cursor = "none";
        playerContainerRef.current.style.cursor = "none";
    }
    const handleVideoClick = (e) => {
        if (e.target === e.currentTarget && (isVideoStarted || iOS())) handlePlayPause()
    }
    const onPlay = () => {
        setIsVideoEnded(false);
        setState({ ...state, seeking: false });
    }
    const onPause = () => {
        setState({ ...state, seeking: false });
    }
    const onEnded = () => {
        updateVideoProps({ playing: false });
        setIsVideoEnded(true);
        if (receiving) {
            updateVideoProps({ receiving: false });
        } else {
            // log("ENDING", 'me');
            if (queue.length > 0) {
                updateVideoProps({ playing: true });
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
    const onReady = () => {
        if (receiving) {
            loadVideo(history[0], true);
            if (!playing) setIsVideoStarted(true);
            else setIsVideoStarted(false);
        }
    }
    const onStart = () => {
        if (!receiving)
            setIsVideoStarted(true);
    }

    const code = (e) => {
        e = e || window.event;
        return (e.key || e.keyCode || e.which);
    }
    const setKeyboardShortcuts = (e) => {
        e.preventDefault();
        let key = code(e);
        // console.log(key);
        switch (key) {
            // case ' ':
            // case 'k':
            //     handlePlayPause()
            //     break;
            // case 'm':
            //     handleMute();
            //     break;
            case 'ArrowLeft':
            case 'j':
                handleRewind();
                break;
            case 'ArrowRight':
            case 'l':
                handleFastForward();
                break;
            case 'f':
                toggleFullScreen();
                break;
            // case 'i':
            //     // enablePip();
            //     break;
            // case 'c':
            //     // enable captions
            //     break;
            // case 'ArrowUp':
            //     handleVolumeChange([volume + 0.2]);
            //     break;
            // case 'ArrowDown':
            //     handleVolumeChange([volume - 0.2]);
            //     break;
            default:
                break
            // // Is a number
            // if (isFinite(key)) {
            // }
        }
    }
    useEffect(() => {
        // let clickCount = 0;
        // let singleClickTimer;
        const handleClickFocus = (e) => {
            let player = playerContainerRef.current;
            if (!player) return;
            if (!player.contains(e.target)) {
                document.removeEventListener('keydown', setKeyboardShortcuts);
            } else if (e.target.classList.contains('videoPlayerContainer')) {
                document.addEventListener('keydown', setKeyboardShortcuts);
                // clickCount++;
                // if (clickCount === 1) {
                //     singleClickTimer = setTimeout(function () {
                //         clickCount = 0;
                //         // handleVideoClick();
                //     }, 300);
                // } else if (clickCount === 2) {
                //     clearTimeout(singleClickTimer);
                //     clickCount = 0;
                //     toggleFullScreen();
                // }
            }
        }
        document.addEventListener('click', handleClickFocus);
        return () => {
            document.removeEventListener('click', handleClickFocus);
        }
    }, []);

    return (
        <>
            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                ref={playerContainerRef}
                className='videoPlayerContainer'
                style={{ display: initVideo ? 'block' : 'none' }}
                onClick={handleVideoClick}
            >
                <ReactPlayer
                    ref={playerRef}
                    className='videoPlayer'
                    width="100%"
                    height="100%"
                    url={history[0] ? history[0].video.url : ''}
                    pip={pip}
                    playing={playing}
                    controls={false}
                    light={light}
                    loop={false}
                    playbackRate={playbackRate}
                    volume={volume}
                    muted={muted}
                    onProgress={handleProgress}
                    onEnded={onEnded}
                    onReady={onReady}
                    onStart={onStart}
                    onPlay={onPlay}
                    onPause={onPause}
                    config={{
                        file: {
                            attributes: {
                                crossOrigin: "anonymous",
                            },
                        },
                        vimeo: { playerOptions: { controls: false } },
                        soundcloud: {
                            options: {
                                buying: false,
                                sharing: false,
                                download: false,
                            }
                        }
                    }}
                />
                <Controls
                    ref={controlsRef}
                    onSeekMouseDown={handleSeekMouseDown}
                    onSeekMouseUp={handleSeek}
                    onRewind={handleRewind}
                    onPlayPause={handlePlayPause}
                    onFastForward={handleFastForward}
                    playing={playing}
                    onMute={handleMute}
                    muted={muted}
                    onVolumeChange={handleVolumeChange}
                    playbackRate={playbackRate}
                    onPlaybackRateChange={handlePlaybackRate}
                    onToggleFullScreen={toggleFullScreen}
                    volume={volume}
                    currentTime={currentTime}
                    duration={duration}
                    seekTime={seekTime}
                    seeking={seeking}
                    isFullscreen={isFullscreen}
                    jumpedTime={jumpedTime}
                    videoType={videoType}
                />
            </div>
        </>
    );
}

export default Player;