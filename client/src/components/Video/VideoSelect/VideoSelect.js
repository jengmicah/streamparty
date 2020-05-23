import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoSelect.css';
import { youtube_parser, validateYouTubeUrl } from '../VideoHelper';

const VideoSelect = ({ updateState, sendVideoState, videoProps, loadVideo, loadFromQueue, addVideoToQueue }) => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        let next = document.getElementById('nextVidIcon');
        let prev = document.getElementById('prevVidIcon');
        let { queue, queueIndex } = videoProps;
        if (queue !== undefined) {
            // Update next button color
            if (queueIndex + 1 <= queue.length - 1) next.classList.add('readyToPress');
            else next.classList.remove('readyToPress');
            // Update prev button color
            if (queueIndex - 1 >= 0) prev.classList.add('readyToPress');
            else prev.classList.remove('readyToPress');
        }
    }, [videoProps.queue, videoProps.queueIndex]);

    useEffect(() => {
        let trimUrl = url.trim();
        let sendButtons = Array.from(document.getElementsByClassName('sendUrlIcon'));
        // Update play/add to queue button color
        if (trimUrl !== '') {
            if (validateYouTubeUrl(trimUrl)) {
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
    }, [url]);

    const handlePlay = (event) => {
        let trimUrl = url.trim();
        const { queue, queueIndex } = videoProps;
        event.preventDefault();
        if (validateYouTubeUrl(trimUrl)) {
            // Reset the color after playing
            let sendButtons = Array.from(document.getElementsByClassName('sendUrlIcon'));
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                button.classList.remove('notReadyToPress');
            });
            setUrl('')
            let videoId = youtube_parser(trimUrl);

            // Handle playing video immediately
            addVideoToQueue(videoId, queue, queueIndex + 1);
            sendVideoState({
                eventName: "syncAddToQueue",
                eventParams: {
                    videoId: videoId,
                    queue: queue,
                    insertIndex: queueIndex + 1,
                    queueIndex: queueIndex + 1
                }
            });
            updateState({ queueIndex: queueIndex + 1 });
            loadVideo(videoId, false);
            sendVideoState({
                eventName: "syncLoad",
                eventParams: { videoId }
            });
        }
    };
    const handleAddToQueue = (event) => {
        let trimUrl = url.trim();
        const { queue, queueIndex } = videoProps;
        event.preventDefault();
        if (validateYouTubeUrl(trimUrl)) {
            // Reset the color after playing
            let sendButtons = Array.from(document.getElementsByClassName('sendUrlIcon'));
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                button.classList.remove('notReadyToPress');
            });
            setUrl('')
            let videoId = youtube_parser(trimUrl);
            
            // Handle adding to queue
            addVideoToQueue(videoId, queue, queue.length);
            sendVideoState({
                eventName: "syncAddToQueue",
                eventParams: {
                    videoId: videoId,
                    queue: queue,
                    insertIndex: queue.length,
                    queueIndex: queueIndex
                }
            });
        }
    }
    const handleNextVideo = (event) => {
        event.preventDefault();
        const { queue, queueIndex } = videoProps;
        if (queue !== undefined) {
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
    const handlePrevVideo = (event) => {
        event.preventDefault();
        const { queue, queueIndex } = videoProps;
        if (queue !== undefined) {
            if (queueIndex - 1 >= 0) {
                loadFromQueue(queue, queueIndex - 1);
                updateState({ queueIndex: queueIndex - 1 });
                sendVideoState({
                    eventName: 'syncLoadFromQueue',
                    eventParams: {
                        queue: queue,
                        queueIndex: queueIndex - 1
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
                    onChange={event => setUrl(event.target.value)}
                    onKeyPress={event => event.key === 'Enter' ? handlePlay(event) : null}
                />
                <button className='sendUrlButton' onClick={(event) => handlePlay(event)}>
                    <FontAwesomeIcon className='sendUrlIcon' icon="play" size="2x" />
                </button>
                <button className='sendUrlButton' onClick={(event) => handleAddToQueue(event)}>
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