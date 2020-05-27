import React from 'react';
import QueueItem from './QueueItem';

const QueueList = ({ handlePlayFromList, handleRemoveFromQueue, videoList, isQueue }) => {

  const videoItems = videoList.map((searchItem, index) => {
    return (
      <QueueItem
        handlePlayFromList={() => handlePlayFromList(index)}
        handleRemoveFromQueue={() => handleRemoveFromQueue(index)}
        key={searchItem.video.id + index}
        searchItem={searchItem}
        isQueue={isQueue}
      />
    );
  });
  return (
    <ul className="videoList single-col">{videoItems}</ul>
  );
};

export default QueueList;