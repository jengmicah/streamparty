import React from 'react';
import VideoListItem from './VideoListItem';

const VideoList = ({ onVideoPlay, onVideoAddToQueue, searchResults }) => {

  const videoItems = searchResults.map((searchItem) => {
    return (
      <VideoListItem
        onVideoPlay={onVideoPlay}
        onVideoAddToQueue={onVideoAddToQueue}
        key={searchItem.video.id}
        searchItem={searchItem} />
    );
  });
  return (
    <ul className="videoList col-md-4 abridged">{videoItems}</ul>
  );
};

export default VideoList;