import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoSelect.css';
import { useState } from 'react';

const VideoSelect = ({ updateState, sendVideoState }) => {
    // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
    const youtube_parser = (url) => {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        let match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
    // https://stackoverflow.com/questions/28735459 how-to-validate-youtube-url-in-client-side-in-text-box
    const validateYouTubeUrl = (url) => {
        var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var matches = url.match(p);
        if (matches) {
            return matches[1];
        }
        return false;
    }
    const handleInputSend = (event) => {
        event.preventDefault();
        if (event.target.value !== undefined) {
            if (validateYouTubeUrl(event.target.value)) {
                let videoId = youtube_parser(event.target.value);
                updateState({ currVideoId: videoId });
                sendVideoState({
                    eventName: "videoLoad",
                    eventParams: { videoId }
                });
            }
        }
    };
    return (
        <div className="videoSelectContainer">
            <form className='form'>
                <input
                    className='input'
                    type='text'
                    placeholder="Paste a video URL..."
                    onKeyPress={event => event.key === 'Enter' ? handleInputSend(event) : null}
                />
                <button id='sendUrlButton' onClick={(event) => handleInputSend(event)}>
                    <FontAwesomeIcon id='sendIcon' icon="paper-plane" size="2x" />
                </button>
            </form>
        </div>
    )
};

export default VideoSelect;