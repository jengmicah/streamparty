import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import './QueueItem.scss';

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
                <Label className="verifiedIcon">
                  <Icon name='check circle' />
                </Label>
              }
            </div>
            {
              isQueue &&
              <div>
                <Button onClick={() => handleRemoveFromQueue(searchItem)} className='videoIcon' icon='times' size='big' />
              </div>
            }
          </div>
        </div>
      </div>
    </li>
  );
};

export default QueueItem;