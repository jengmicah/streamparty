import React from 'react';
import QueueItem from './QueueItem';

const QueueList = ({ onVideoPlay, onVideoAddToQueue, searchResults }) => {

  const videoItems = searchResults.map((searchItem) => {
    return (
      <QueueItem
        onVideoPlay={onVideoPlay}
        // onVideoAddToQueue={onVideoAddToQueue}
        key={searchItem.video.id}
        searchItem={searchItem} />
    );
  });
  return (
    <ul className="videoList single-col">{videoItems}</ul>
  );
};

export default QueueList;