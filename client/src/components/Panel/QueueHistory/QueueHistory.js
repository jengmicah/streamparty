import React from 'react';
import './QueueHistory.scss';
import QueueList from './QueueList';

const QueueHistory = ({ isQueue, videoProps, room, updateVideoProps, playerRef, sendVideoState, playVideoFromSearch }) => {
    const handleRemoveFromQueue = (index) => {
        let { queue } = videoProps;
        queue.splice(index, 1);
        sendVideoState({
            eventName: "syncQueue",
            eventParams: {
                queue: queue,
                type: "remove"
            }
        });
        updateVideoProps({ queue });
    }
    const handlePlayFromList = (index) => {
        if (isQueue) {
            playVideoFromSearch(videoProps.queue[index]);
            handleRemoveFromQueue(index);
        } else {
            playVideoFromSearch(videoProps.history[index]);
        }
    }

    return (
        <div className="infoContainer" id="infoContainer">
            {
                isQueue ?
                    (videoProps.queue.length > 0
                        ? (
                            <div>
                                <QueueList
                                    handlePlayFromList={index => handlePlayFromList(index)}
                                    handleRemoveFromQueue={index => handleRemoveFromQueue(index)}
                                    videoList={videoProps.queue}
                                    isQueue={isQueue}
                                />
                            </div>
                        ) : (
                            <span className="videoListText">Queue is empty <span role="img" aria-label="frown">☹️</span></span>
                        )
                    )
                    : null
            }
            {
                !isQueue ?
                    (videoProps.history.length > 0
                        ? (
                            <div>
                                <QueueList
                                    handlePlayFromList={index => handlePlayFromList(index)}
                                    handleRemoveFromQueue={index => handleRemoveFromQueue(index)}
                                    videoList={videoProps.history}
                                    isQueue={isQueue}
                                />
                            </div>
                        ) : (
                            <span className="videoListText">History is empty <span role="img" aria-label="frown">☹️</span></span>
                        )
                    )
                    : null
            }
        </div>
    )
};

export default QueueHistory;