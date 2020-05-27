import _ from 'lodash';
import React from 'react';
import VideoList from './VideoList';
import './VideoSearchResults.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BeatLoader from "react-spinners/BeatLoader";

const VideoSearchResults = ({ searchResults, playVideoFromSearch, addVideoFromSearch, page, search, searchInput, searching }) => {
    const handlePrevPage = (event) => {
        if (page - 1 >= 1) {
            search({ term: searchInput, page: page - 1 })
        }
    }
    const handleNextPage = (event) => {
        search({ term: searchInput, page: page + 1 })
    }
    return (
        <div>
            <div className="loading">
                <BeatLoader
                    size={25}
                    color={"#43a3f0"}
                    loading={searching}
                />
            </div>
            <VideoList
                onVideoPlay={selectedVideo => playVideoFromSearch(selectedVideo)}
                onVideoAddToQueue={selectedVideo => addVideoFromSearch(selectedVideo)}
                searchResults={searchResults}
            />
            {
                searchResults && searchResults.length > 0 &&
                <div className='navIcons'>
                    <div onClick={(event) => handlePrevPage(event)}>
                        <FontAwesomeIcon id='prevPageIcon' icon="caret-left" size="2x" />
                    </div>
                    <span>{page}</span>
                    <div onClick={(event) => handleNextPage(event)}>
                        <FontAwesomeIcon id='nextPageIcon' icon="caret-right" size="2x" />
                    </div>
                </div>
            }
        </div >
    );
}

export default VideoSearchResults;