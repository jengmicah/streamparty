import _ from 'lodash';
import React, { Component } from 'react';
import VideoList from './VideoList';
import './VideoSearchResults.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VideoSearchResults = ({ searchResults, playVideoFromSearch, addVideoFromSearch, page, setPage, search, searchInput }) => {
    const handlePrevPage = (event) => {
        if (page - 1 >= 0) {
            setPage(page - 1);
            search(searchInput, page - 1)
        }
    }
    const handleNextPage = (event) => {
        setPage(page + 1);
        search(searchInput, page + 1)
    }
    return (
        <div>
            <VideoList
                onVideoPlay={selectedVideo => playVideoFromSearch(selectedVideo)}
                onVideoAddToQueue={selectedVideo => addVideoFromSearch(selectedVideo)}
                searchResults={searchResults}
            />
            {
                searchResults.length > 15 &&
                <div className='navIcons'>
                    <div onClick={(event) => handlePrevPage(event)}>
                        <FontAwesomeIcon id='prevPageIcon' icon="caret-left" size="2x" />
                    </div>
                    <span>{page + 1}</span>
                    <div onClick={(event) => handleNextPage(event)}>
                        <FontAwesomeIcon id='nextPageIcon' icon="caret-right" size="2x" />
                    </div>
                </div>
            }
        </div>
    );
}

export default VideoSearchResults;