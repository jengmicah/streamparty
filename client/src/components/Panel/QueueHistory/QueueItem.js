import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './QueueItem.css';

const QueueItem = ({ searchItem, handlePlayFromList, handleRemoveFromQueue, isQueue }) => {
  return (
    <li className="list-group-item single-col">
      <div className="search-item-container">
        <div onClick={handlePlayFromList} className="search-item-thumb">
          <img src={searchItem.video.thumbnail} alt="video thumbnail" />
        </div>
        <div className="search-item-body">
          <h3 onClick={handlePlayFromList} className="search-item-video-title">
            {searchItem.video.title}
          </h3>
          <div className="search-item-channel-date">
            <div className="search-item-channel-title">
              {searchItem.channel.username}
              {
                searchItem.channel.verified &&
                <FontAwesomeIcon id='verifiedIcon' icon="check-circle" size="sm" />
              }
            </div>
            {
              isQueue &&
              <div><FontAwesomeIcon onClick={() => handleRemoveFromQueue(searchItem)} className='videoIcons plusIcon' icon="times" /></div>
            }
          </div>
        </div>
      </div>
    </li>
  );
};

export default QueueItem;