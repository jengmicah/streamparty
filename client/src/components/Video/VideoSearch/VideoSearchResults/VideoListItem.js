import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VideoListItem = ({ searchItem, onVideoPlay, onVideoAddToQueue }) => {
  return (
    <li className="list-group-item">
      <div className="search-item-container">
        <div onClick={() => onVideoPlay(searchItem)} className="search-item-thumb">
          <img src={searchItem.video.thumbnail} />
        </div>
        <div className="search-item-body">
          <h3 onClick={() => onVideoPlay(searchItem)} className="search-item-video-title">
            {searchItem.video.title}
          </h3>
          <a href={searchItem.channel.url} target="_blank" className="search-item-channel-title">
            {searchItem.channel.username}
            {
              searchItem.channel.verified &&
              <FontAwesomeIcon id='verifiedIcon' icon="check-circle" size="sm" />
            }
          </a>
          <div className="search-item-channel-date">
            <div>{searchItem.video.views} • {searchItem.video.upload_date}</div>
            <div><FontAwesomeIcon onClick={() => onVideoAddToQueue(searchItem)} className='videoIcons plusIcon' icon="plus" /></div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default VideoListItem;