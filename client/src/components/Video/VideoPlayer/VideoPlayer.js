import React from 'react';
import YouTube from 'react-youtube';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoPlayer.css';

const VideoPlayer = ({ videoId, sendVideoState, setPlayer }) => {

    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
        console.log(event.target);
        setPlayer(event.target);
    }

    const onPlay = () => {
        sendVideoState({ eventName: 'videoPlay' });
    }
    const onPause = () => {
        sendVideoState({ eventName: 'videoPause' });
    }
    const onEnd = () => {
        // Play next video
        console.log();
    }
    const onStateChange = (event) => {
        // State change
        console.log();
    }
    const onPlaybackRateChange = (event) => {
        let eventParams = {
            playbackRate: event.target.getPlaybackRate()
        };
        sendVideoState({ eventName: 'videoPlaybackRate', eventParams: eventParams });
    }
    const onPlaybackQualityChange = () => {
        // Do nothing
        console.log();
    }

    const opts = {
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div id="videoPlayer">
            <YouTube
                id='player'
                videoId={videoId}
                opts={opts}
                onReady={_onReady}
                onPause={onPause}
                onPlay={onPlay}
                onEnd={onEnd}
                onStateChange={onStateChange}
                onPlaybackRateChange={onPlaybackRateChange}
                onPlaybackQualityChange={onPlaybackQualityChange}
            />
        </div>
    )
};

export default VideoPlayer;