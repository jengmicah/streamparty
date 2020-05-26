import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoSearch.css';
import { youtube_parser, validateYouTubeUrl } from '../VideoHelper';
import VideoSearchResults from './VideoSearchResults/VideoSearchResults';
import axios from 'axios';
import _ from 'lodash';

const VideoSearch = ({ updateState, sendVideoState, videoProps, loadVideo, loadFromQueue, addVideoToQueue }) => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const baseURL = 'https://youtube-search-scraper.herokuapp.com';

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
        let trimInput = searchInput.trim();
        let sendButtons = Array.from(document.getElementsByClassName('videoNavIcon'));
        // Update play/add to queue button color
        if (trimInput !== '') {
            if (validateYouTubeUrl(trimInput)) {
                sendButtons.map(button => {
                    button.classList.add('readyToPress');
                    // button.classList.remove('notReadyToPress');
                });
            } else {
                sendButtons.map(button => {
                    button.classList.remove('readyToPress');
                    // button.classList.add('notReadyToPress');
                });
            }
        } else {
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                // button.classList.remove('notReadyToPress');
            });
        }
    }, [searchInput]);
    const addVideoFromSearch = (searchItem) => {
        let { queue, queueIndex } = videoProps;
        // Handle adding to queue
        addVideoToQueue(searchItem, queue, queue.length);
        sendVideoState({
            eventName: "syncAddToQueue",
            eventParams: {
                searchItem: searchItem,
                queue: queue,
                insertIndex: queue.length,
                queueIndex: queueIndex
            }
        });
    }
    const playVideoFromSearch = (searchItem) => {
        let { queue, queueIndex } = videoProps;
        // Handle playing video immediately
        addVideoToQueue(searchItem, queue, queueIndex + 1);
        sendVideoState({
            eventName: "syncAddToQueue",
            eventParams: {
                searchItem: searchItem,
                queue: queue,
                insertIndex: queueIndex + 1,
                queueIndex: queueIndex + 1
            }
        });
        updateState({ queueIndex: queueIndex + 1 });
        loadVideo(searchItem, false);
        sendVideoState({
            eventName: "syncLoad",
            eventParams: { videoId: searchItem.video.id }
        });
    }
    const handlePlay = (event) => {        
        let trimInput = searchInput.trim();
        const { queue, queueIndex } = videoProps;
        event.preventDefault();
        console.log(trimInput);
        if (validateYouTubeUrl(trimInput)) {
            // Reset the color after playing
            let sendButtons = Array.from(document.getElementsByClassName('videoNavIcon'));
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                // button.classList.remove('notReadyToPress');
            });
            setSearchInput('')
            let videoId = youtube_parser(trimInput);

            // // Handle playing video immediately
            // addVideoToQueue(videoId, queue, queueIndex + 1);
            // sendVideoState({
            //     eventName: "syncAddToQueue",
            //     eventParams: {
            //         videoId: videoId,
            //         queue: queue,
            //         insertIndex: queueIndex + 1,
            //         queueIndex: queueIndex
            //     }
            // });
            // updateState({ queueIndex: queueIndex + 1 });
            // loadVideo(videoId, false);
            // sendVideoState({
            //     eventName: "syncLoad",
            //     eventParams: { videoId }
            // });
            search({ videoId });
        } else {
            // Search phrase on Youtube
            search({ term: trimInput, page: 0 });
        }
    };
    const handleAddToQueue = (event) => {
        let trimInput = searchInput.trim();
        const { queue, queueIndex } = videoProps;
        event.preventDefault();
        if (validateYouTubeUrl(trimInput)) {
            // Reset the color after playing
            let sendButtons = Array.from(document.getElementsByClassName('videoNavIcon'));
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                // button.classList.remove('notReadyToPress');
            });
            // setSearchInput('')
            let videoId = youtube_parser(trimInput);

            // // Handle adding to queue
            // addVideoToQueue(videoId, queue, queue.length);
            // sendVideoState({
            //     eventName: "syncAddToQueue",
            //     eventParams: {
            //         videoId: videoId,
            //         queue: queue,
            //         insertIndex: queue.length,
            //         queueIndex: queueIndex
            //     }
            // });
            search({ videoId });
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
    const videoSearch = async (term, page) => {
        axios.get(`${baseURL}/search`, {
            params: {
                q: term,
                page: page
            }
        }).then(response => {
            setSearchResults(response.data.results);
            console.log(response.data.results, term);
        });
    }
    const videoShow = async (videoId) => {
        axios.get(`${baseURL}/watch`, {
            params: { videoId }
        }).then(response => {
            setSearchResults(response.data.results);
            console.log(response.data.results);
        });
    }
    const search = _.debounce(({ term, page, videoId }) => {
        if (videoId === undefined) videoSearch(term, page)
        else videoShow(videoId);
    }, 500);

    return (
        <div className="VideoSearchContainer">
            <div className='form'>
                <div className='videoNavButton' onClick={(event) => handlePrevVideo(event)}>
                    <FontAwesomeIcon id='prevVidIcon' icon="angle-double-left" size="2x" />
                </div>
                <input
                    className='input'
                    type='text'
                    value={searchInput}
                    placeholder="Search a video or paste a video link..."
                    onChange={event => setSearchInput(event.target.value)}
                    onKeyPress={event => event.key === 'Enter' ? handlePlay(event) : null}
                />
                {/* <div className='videoNavButton' onClick={(event) => handlePlay(event)}>
                    <FontAwesomeIcon className='videoNavIcon' icon="play" size="2x" />
                </div>
                <div className='videoNavButton' onClick={(event) => handleAddToQueue(event)}>
                    <FontAwesomeIcon className='videoNavIcon' icon="plus" size="2x" />
                </div> */}
                <div className='videoNavButton' onClick={(event) => handleNextVideo(event)}>
                    <FontAwesomeIcon id='nextVidIcon' icon="angle-double-right" size="2x" />
                </div>
            </div>
            <VideoSearchResults
                searchResults={searchResults}
                playVideoFromSearch={playVideoFromSearch}
                addVideoFromSearch={addVideoFromSearch}
                page={page}
                setPage={setPage}
                search={search}
                searchInput={searchInput}
            />
        </div>
    )
};

export default VideoSearch;