import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoSelect.css';
import { useState } from 'react';

const VideoSelect = ({ updateState, sendVideoState, videoProps, loadVideoById, loadNextVideo }) => {
    const [url, setUrl] = useState('');

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

    const handleInputChange = (event) => {
        let currUrlInput = event.target.value.trim();
        setUrl(currUrlInput);
        let sendButtons = Array.from(document.getElementsByClassName('sendUrlIcon'));
        if (event.target.value !== '') {
            if (validateYouTubeUrl(currUrlInput)) {
                sendButtons.map(button => {
                    button.classList.add('readyToPress');
                    button.classList.remove('notReadyToPress');
                });
            } else {
                sendButtons.map(button => {
                    button.classList.remove('readyToPress');
                    button.classList.add('notReadyToPress');
                });
            }
        } else {
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                button.classList.remove('notReadyToPress');
            });
        }
    }

    useEffect(() => {
        let nextVidIcon = document.getElementById('nextVidIcon');
        let queue = videoProps.queueVideoIds;
        if (queue !== undefined) {
            if (queue.length === 0) {
                nextVidIcon.classList.remove('readyToPress');
            } else {
                nextVidIcon.classList.add('readyToPress');
            }
        }
    }, [videoProps.queueVideoIds])

    const handleSubmit = (event, type) => {
        event.preventDefault();
        if (validateYouTubeUrl(url)) {
            let sendButtons = Array.from(document.getElementsByClassName('sendUrlIcon'));
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                button.classList.remove('notReadyToPress');
            });
            setUrl('')
            let videoId = youtube_parser(url);
            if (type === 1) {
                updateState({ currVideoId: videoId });
                loadVideoById(videoId, false);
                sendVideoState({
                    eventName: "videoLoad",
                    eventParams: { videoId }
                });
            } else if (type === 2) {
                let queueVideoIds = [...videoProps.queueVideoIds, videoId];
                updateState({ queueVideoIds });
                sendVideoState({
                    eventName: "videoAddToQueue",
                    eventParams: { queueVideoIds }
                });
                // console.log(queueVideoIds);
            }
        }
    };

    const handleNextVideo = (event) => {
        event.preventDefault();
        let queue = videoProps.queueVideoIds;
        if (queue !== undefined && queue.length !== 0) {
            loadNextVideo(queue);
        }
    }
    return (
        <div className="videoSelectContainer">
            <form className='form'>
                <input
                    className='input'
                    type='text'
                    value={url}
                    placeholder="Paste a video URL..."
                    onChange={event => handleInputChange(event)}
                    onKeyPress={event => event.key === 'Enter' ? handleSubmit(event, 1) : null}
                />
                <button className='sendUrlButton' onClick={(event) => handleSubmit(event, 1)}>
                    <FontAwesomeIcon className='sendUrlIcon' icon="paper-plane" size="2x" />
                </button>
                <button className='sendUrlButton' onClick={(event) => handleSubmit(event, 2)}>
                    <FontAwesomeIcon className='sendUrlIcon' icon="plus" size="2x" />
                </button>
                <button className='sendUrlButton' onClick={(event) => handleNextVideo(event)}>
                    <FontAwesomeIcon id='nextVidIcon' icon="caret-right" size="2x" />
                </button>
            </form>
        </div>
    )
};

export default VideoSelect;