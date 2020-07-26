import React from 'react';
import { Label, Icon, Button } from 'semantic-ui-react'

const ListItem = ({ searchItem, onVideoPlay, onVideoAddToQueue }) => {
  const changeQueueIcon = (target) => {
    target.setAttribute("class", "check icon");
    setTimeout(() => {
      target.setAttribute("class", "plus icon");
    }, 3000)
  }
  return (
    <li className="list-group-item">
      <div className="search-item-container">
        <div onClick={() => onVideoPlay(searchItem)} className="search-item-thumb">
          <img src={searchItem.video.thumbnail} alt="video thumbnail" />
        </div>
        <div className="search-item-body">
          <h3 onClick={() => onVideoPlay(searchItem)} className="search-item-video-title">
            {searchItem.video.title}
          </h3>
          <div className="search-item-channel-title">
            {searchItem.channel.username}
            {
              searchItem.channel.verified &&
              <Label className="verifiedIcon">
                <Icon name='check circle' />
              </Label>
            }
          </div>
          <div className="search-item-channel-date">
            <div>{searchItem.video.views} • {searchItem.video.upload_date}</div>
            <div><Button onClick={(e) => { changeQueueIcon(e.target); onVideoAddToQueue(searchItem) }} className='videoIcon' icon='plus' size='big' /></div>

          </div>
        </div>
      </div>
    </li>
  );
};

export default ListItem;