import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './QueueHistory.css';
import QueueList from './QueueList';

const QueueHistory = ({ queue, updateState }) => (
    <div className="infoContainer" id="infoContainer">
        {
            queue.length > 0
                ? (
                    <div>
                        <QueueList
                            onVideoPlay={selectedVideo => console.log(selectedVideo)}
                            // onVideoAddToQueue={selectedVideo => addVideoFromSearch(selectedVideo)}
                            searchResults={queue}
                        />
                    </div>
                )
                : null
        }
    </div>
);

export default QueueHistory;