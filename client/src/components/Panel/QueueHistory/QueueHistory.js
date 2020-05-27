import React, { useEffect } from 'react';

import './QueueHistory.css';
import QueueList from './QueueList';

const QueueHistory = ({ isQueue, videoProps, name, room, updateState, playerRef, sendVideoState }) => {
    // Video.js
    const loadVideo = (searchItem, sync) => {
        if (playerRef.current != null && playerRef.current.internalPlayer != null) {
            const { playing, seekTime } = videoProps;
            let player = playerRef.current.internalPlayer;
            let videoId = searchItem.video.id;
            if (sync) {
                if (playing) {
                    player.cueVideoById({
                        videoId: videoId,
                        startSeconds: seekTime
                    });
                } else {
                    player.cueVideoById({
                        videoId: videoId,
                        startSeconds: seekTime
                    });
                    player.pauseVideo();
                    updateState({ receiving: false });
                }
            } else {
                player.cueVideoById({ videoId });
            }
            updateState({ history: [searchItem, ...videoProps.history] });
        }
    }
    const playVideoFromSearch = (searchItem) => {
        // Handle playing video immediately
        loadVideo(searchItem, false);
        sendVideoState({
            eventName: "syncLoad",
            eventParams: { videoId: searchItem.video.id }
        });
    }
    const handleRemoveFromQueue = (index) => {
        let { queue } = videoProps;
        queue.splice(index, 1);
        updateState({ queue });
    }
    const handlePlayFromList = (index) => {
        if (isQueue) {
            console.log(index, videoProps.queue);
            playVideoFromSearch(videoProps.queue[index]);
            handleRemoveFromQueue(index);
        } else {
            console.log(index, videoProps.history);
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
                            <span className="videoListText">Queue is empty ☹️</span>
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
                            <span className="videoListText">History is empty ☹️</span>
                        )
                    )
                    : null
            }
        </div>
    )
};

export default QueueHistory;