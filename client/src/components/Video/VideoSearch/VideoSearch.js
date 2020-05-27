import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './VideoSearch.css';
import { youtube_parser, validateYouTubeUrl } from '../VideoHelper';
import VideoSearchResults from './VideoSearchResults/VideoSearchResults';
import axios from 'axios';
import _ from 'lodash';

const VideoSearch = ({ updateState, sendVideoState, videoProps, loadVideo, loadFromQueue, addVideoToQueue }) => {
    const [searchInput, setSearchInput] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const baseURL = 'https://youtube-search-scraper.herokuapp.com';

    useEffect(() => {
        let trimInput = searchInput.trim();
        let sendButtons = Array.from(document.getElementsByClassName('videoNavIcon'));
        // Update play/add to queue button color
        if (trimInput !== '') {
            if (validateYouTubeUrl(trimInput)) {
                sendButtons.map(button => button.classList.add('validReadyToPress'));
                sendButtons.map(button => button.classList.remove('readyToPress'));
            } else {
                sendButtons.map(button => button.classList.add('readyToPress'));
                sendButtons.map(button => button.classList.remove('validReadyToPress'));
            }
        } else {
            sendButtons.map(button => button.classList.remove('readyToPress'));
            sendButtons.map(button => button.classList.remove('validReadyToPress'));
        }
    }, [searchInput]);
    
    const addVideoFromSearch = (searchItem) => {
        let { queue } = videoProps;
        // Handle adding to queue
        addVideoToQueue(searchItem, queue);
        sendVideoState({
            eventName: "syncAddToQueue",
            eventParams: {
                searchItem: searchItem,
                queue: queue,
            }
        });
    }
    const playVideoFromSearch = (searchItem) => {
        // Handle playing video immediately
        loadVideo(searchItem, false);
        sendVideoState({
            eventName: "syncLoad",
            eventParams: { videoId: searchItem.video.id }
        });
    }
    const handlePlay = (event) => {        
        let trimInput = searchInput.trim();
        event.preventDefault();
        console.log(trimInput);
        if (validateYouTubeUrl(trimInput)) {
            // Reset the color after playing
            let sendButtons = Array.from(document.getElementsByClassName('videoNavIcon'));
            sendButtons.map(button => {
                button.classList.remove('readyToPress');
                button.classList.remove('validReadyToPress');
            });
            setSearchInput('')
            let videoId = youtube_parser(trimInput);
            search({ videoId });
        } else {
            // Search phrase on Youtube
            search({ term: trimInput, page: 1 });
        }
    };

    const videoSearch = async (term, page) => {
        axios.get(`${baseURL}/search`, {
            params: {
                query: term,
                page: page
            }
        }).then(response => {
            setSearchResults(response.data.results);
            console.log(response.data.results, term);
            setPage(page);
            setSearching(false);
        });
    }
    const videoShow = async (videoId) => {
        axios.get(`${baseURL}/watch`, {
            params: { videoId }
        }).then(response => {
            setSearchResults(response.data.results);
            console.log(response.data.results);
            setSearching(false);
        });
    }
    const search = _.debounce(({ term, page, videoId }) => {
        setSearching(true);
        console.log(term, page, videoId);
        if (videoId === undefined) videoSearch(term, page)
        else videoShow(videoId);
    }, 5);

    return (
        <div className="VideoSearchContainer">
            <div className='form'>
                <input
                    className='input'
                    type='text'
                    value={searchInput}
                    placeholder="Search a video or paste a video link..."
                    onChange={event => setSearchInput(event.target.value)}
                    onKeyPress={event => event.key === 'Enter' ? handlePlay(event) : null}
                />
                <div className='videoNavButton' onClick={(event) => searchInput.trim() !== '' ? handlePlay(event) : null}>
                    <FontAwesomeIcon className='videoNavIcon' icon="search" size="2x" />
                </div>
            </div>
            <VideoSearchResults
                searchResults={searchResults}
                playVideoFromSearch={playVideoFromSearch}
                addVideoFromSearch={addVideoFromSearch}
                page={page}
                search={search}
                searchInput={searchInput}
                searching={searching}
            />
        </div>
    )
};

export default VideoSearch;