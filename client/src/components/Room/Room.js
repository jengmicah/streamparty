import React, { useState, useEffect, useRef } from "react";
// import Chat from '../Chat/Chat';
import Video from '../Video/Video';
import JoinUser from './JoinUser';

import { sckt } from '../Socket';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './Room.css';
import Panel from "../Panel/Panel";

const Room = ({ location, history }) => {
    const playerRef = useRef(null);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [videoProps, setVideoProps] = useState({
        queue: [
            {
                "video": {
                    "id": "0wCC3aLXdOw",
                    "title": "4K Video 💚 Beauty of Nature UHD Time Lapse",
                    "url": "https://www.youtube.com/watch?v=0wCC3aLXdOw",
                    "upload_date": "5 years ago",
                    "thumbnail": "https://i.ytimg.com/vi/0wCC3aLXdOw/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBdnskP_3c1Mg8PEihoEl-_BbYSQA",
                    "views": "14.9M views"
                },
                "channel": {
                    "username": "LoungeV Films - Relaxing Music and Nature Sounds",
                    "url": "https://youtube.com/user/LoungeVstudio",
                    "verified": true
                }
            }
        ],
        history: [],
        playing: true,
        seekTime: 0,
        lastStateYT: -1,
        receiving: false,
    });
    const updateState = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
    }
    const sendVideoState = ({ eventName, eventParams }) => {
        let params = {
            name: name,
            room: room,
            eventName: eventName,
            eventParams: eventParams
        };
        sckt.socket.emit('sendVideoState', params, (error) => { });
    };
    // useEffect(() => {
    //     console.log(videoProps);
    // }, [videoProps.history])

    // Video.js
    const loadVideo = (searchItem, sync) => {
        if (playerRef.current != null && playerRef.current.internalPlayer != null) {
            const { playing, seekTime } = videoProps;
            let player = playerRef.current.internalPlayer;
            let videoId = searchItem.video.id;
            if (sync) {
                if (playing) {
                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: seekTime
                    });
                } else {
                    player.loadVideoById({
                        videoId: videoId,
                        startSeconds: seekTime
                    });
                    player.pauseVideo();
                    updateState({ receiving: false });
                }
            } else {
                player.loadVideoById({ videoId });
            }
            // sckt.socket.emit('updateRoomData', { video: searchItem }, (error) => { });
        }
    }
    const playVideoFromSearch = (searchItem) => {
        // Handle playing video immediately
        loadVideo(searchItem, false);
        sendVideoState({
            eventName: "syncLoad",
            eventParams: { searchItem, history: [searchItem, ...videoProps.history] }
        });
        updateState({ history: [searchItem, ...videoProps.history] });
    }
    const log = (msg, type) => {
        let baseStyles = [
            "color: #fff",
            "background-color: #444",
            "padding: 2px 4px",
            "border-radius: 2px"
        ].join(';');
        let serverStyles = [
            "background-color: gray"
        ].join(';');
        let otherStyles = [
            "color: #eee",
            "background-color: red"
        ].join(';');
        let meStyles = [
            "background-color: green"
        ].join(';');
        // Set style based on input type
        let style = baseStyles + ';';
        switch (type) {
            case "server": style += serverStyles; break;
            case "other": style += otherStyles; break;
            case "me": style += meStyles; break;
            case "none": style = ''; break;
            default: break;
        }
        console.log(`%c${msg}`, style);
    }

    // From JoinRoom.js 
    useEffect(() => {
        const room = encodeURIComponent(location.pathname.split('/').pop().trim());
        if (room.length > 0)
            setRoom(room);
        else {
            history.push('/');
        }
        // sckt.socket.emit('createRoom', { room }, () => {});
        // sckt.socket.on("roomData", ({ users }) => {
        //     setUsers(users);
        // });
    }, [location.pathname, history]);

    // From JoinUser.js
    const joinRoomAsUser = (name) => {
        setName(name);
        sckt.socket.emit('join', { name, room }, (error) => {
            if (error === 'DUPLICATE_USER') {
                setName('');
            }
        });
    }
    return (
        <div>
            {
                name && room
                    ? (
                        <div className="outerContainer">
                            <Video
                                log={log}
                                name={name}
                                room={room}
                                videoProps={videoProps}
                                updateState={updateState}
                                playerRef={playerRef}
                                sendVideoState={sendVideoState}
                                loadVideo={loadVideo}
                                playVideoFromSearch={playVideoFromSearch}
                            />
                            <Panel
                                log={log}
                                name={name}
                                room={room}
                                history={history}
                                videoProps={videoProps}
                                updateState={updateState}
                                playerRef={playerRef}
                                sendVideoState={sendVideoState}
                                playVideoFromSearch={playVideoFromSearch}
                            />
                            <ReactNotification />
                        </div>
                    ) : (
                        <JoinUser room={room} joinRoomAsUser={joinRoomAsUser} />
                    )
            }
        </div>
    );
}

export default Room;