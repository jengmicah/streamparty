import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoSelect.css';
import { youtube_parser, validateYouTubeUrl } from '../VideoHelper';

const VideoSelect = ({ updateState, sendVideoState, videoProps, loadVideoById, loadNewVideo, addVideoToQueue }) => {
    const [url, setUrl] = useState('');

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
        let next = document.getElementById('nextVidIcon');
        let prev = document.getElementById('prevVidIcon');
        let { queueVideoIds, currVideoIndex } = videoProps;
        if (queueVideoIds !== undefined) {
            if (currVideoIndex + 1 <= queueVideoIds.length - 1) next.classList.add('readyToPress');
            else next.classList.remove('readyToPress');
            if (currVideoIndex - 1 >= 0) prev.classList.add('readyToPress');
            else prev.classList.remove('readyToPress');
        }
    }, [videoProps.queueVideoIds, videoProps.currVideoIndex])

    const handleSubmit = (event, type) => {
        const { queueVideoIds, currVideoIndex } = videoProps;
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
                addVideoToQueue(videoId, queueVideoIds, currVideoIndex);
                sendVideoState({
                    eventName: "videoAddToQueue",
                    eventParams: {
                        videoId: videoId,
                        queueVideoIds: queueVideoIds,
                        insertIndex: currVideoIndex + 1,
                        currVideoIndex: currVideoIndex + 1
                    }
                });
                // updateState({ currVideoId: videoId });
                loadVideoById(videoId, false);
                // addVideoToQueue(videoId);
                sendVideoState({
                    eventName: "videoLoad",
                    eventParams: { videoId }
                });
                updateState({ currVideoIndex: currVideoIndex + 1 });
            } else if (type === 2) {
                addVideoToQueue(videoId, queueVideoIds, queueVideoIds.length - 1);
                sendVideoState({
                    eventName: "videoAddToQueue",
                    eventParams: {
                        videoId: videoId,
                        queueVideoIds: queueVideoIds,
                        insertIndex: queueVideoIds.length - 1,
                        currVideoIndex: currVideoIndex
                    }
                });
            }
        }
    };

    const handleNextVideo = (event) => {
        event.preventDefault();
        const { queueVideoIds, currVideoIndex } = videoProps;
        if (queueVideoIds !== undefined) {
            if (currVideoIndex + 1 <= queueVideoIds.length - 1) {
                loadNewVideo(queueVideoIds, currVideoIndex + 1);
                updateState({ currVideoIndex: currVideoIndex + 1 });
                sendVideoState({
                    eventName: 'videoLoadNextInQueue',
                    eventParams: {
                        queueVideoIds: queueVideoIds,
                        currVideoIndex: currVideoIndex + 1
                    }
                });
            }
        }
    }
    const handlePrevVideo = (event) => {
        event.preventDefault();
        const { queueVideoIds, currVideoIndex } = videoProps;
        if (queueVideoIds !== undefined) {
            if (currVideoIndex - 1 >= 0) {
                loadNewVideo(queueVideoIds, currVideoIndex - 1);
                updateState({ currVideoIndex: currVideoIndex - 1 });
                sendVideoState({
                    eventName: 'videoLoadNextInQueue',
                    eventParams: {
                        queueVideoIds: queueVideoIds,
                        currVideoIndex: currVideoIndex - 1
                    }
                });
            }
        }
    }
    return (
        <div className="videoSelectContainer">
            <form className='form'>
                <button className='sendUrlButton' onClick={(event) => handlePrevVideo(event)}>
                    <FontAwesomeIcon id='prevVidIcon' icon="angle-double-left" size="2x" />
                </button>
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
                    <FontAwesomeIcon id='nextVidIcon' icon="angle-double-right" size="2x" />
                </button>
            </form>
        </div>
    )
};

export default VideoSelect;