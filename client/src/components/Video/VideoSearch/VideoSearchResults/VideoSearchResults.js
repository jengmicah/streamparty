import React from 'react';
import VideoList from './VideoList';
import './VideoSearchResults.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BeatLoader from "react-spinners/BeatLoader";

const VideoSearchResults = ({ searchResults, playVideoFromSearch, addVideoToQueue, page, search, searchInput, searching }) => {
    const handlePrevPage = () => {
        if (page - 1 >= 1) {
            search({ term: searchInput, page: page - 1 })
        }
    }
    const handleNextPage = () => {
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
                onVideoAddToQueue={selectedVideo => addVideoToQueue(selectedVideo)}
                searchResults={searchResults}
            />
            <div className="loading">
                <BeatLoader
                    size={25}
                    color={"#43a3f0"}
                    loading={searching}
                />
            </div>
            {
                searchResults && searchResults.length > 0 &&
                <div className='navIcons'>
                    {
                        page - 1 >= 1 &&
                        <div onClick={handlePrevPage}>
                            <FontAwesomeIcon id='prevPageIcon' icon="caret-left" size="2x" />
                        </div>
                    }
                    <span>{page}</span>
                    {
                        searchResults.length >= 9 &&
                        <div onClick={handleNextPage}>
                            <FontAwesomeIcon id='nextPageIcon' icon="caret-right" size="2x" />
                        </div>
                    }
                </div>
            }
        </div >
    );
}

export default VideoSearchResults;