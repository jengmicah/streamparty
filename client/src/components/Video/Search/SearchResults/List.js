import React from 'react';
import ListItem from './ListItem';

const List = ({ onVideoPlay, onVideoAddToQueue, searchResults }) => {
  return (
    <ul className="videoList">
      {
        searchResults && searchResults.map((searchItem) => {
          return (
            <ListItem
              onVideoPlay={onVideoPlay}
              onVideoAddToQueue={onVideoAddToQueue}
              key={searchItem.video.id}
              searchItem={searchItem} />
          );
        })
      }
    </ul>
  );
};

export default List;