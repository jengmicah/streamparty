import React from 'react';
import VideoList from './VideoList';
import './VideoSearchResults.css';
import { Button } from 'semantic-ui-react'

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
            <VideoList
                onVideoPlay={selectedVideo => playVideoFromSearch(selectedVideo)}
                onVideoAddToQueue={selectedVideo => addVideoToQueue(selectedVideo)}
                searchResults={searchResults}
            />
            {
                searchResults && searchResults.length > 0 &&
                <div className='navIcons'>
                    <Button.Group>
                        <Button onClick={handlePrevPage} disabled={page - 1 < 1}>Prev</Button>
                        <Button.Or text={page} />
                        <Button onClick={handleNextPage} disabled={searchResults.length < 8}>Next</Button>
                    </Button.Group>
                </div>
            }
        </div >
    );
}

export default VideoSearchResults;