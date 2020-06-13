import React, { useState, useEffect, useRef } from "react";
import Video from '../Video/Video';
import JoinUser from './JoinUser';

import { sckt } from '../Socket';
import { store } from 'react-notifications-component';
import { invertColor, getRandomColor } from '../../Helper';

import './Room.css';
import Panel from "../Panel/Panel";

const Sentencer = require('sentencer');

const Room = ({ location, history, match }) => {
    const playerRef = useRef(null);
    const [currUser, setCurrUser] = useState({
        name: '', id: '',
        colors: { bg: '', txt: '' }
    });
    const [room, setRoom] = useState('');
    const [videoProps, setVideoProps] = useState({
        queue: [
            {
                "video": {
                    "id": "Y-JQ-RCyPpQ",
                    "title": "Relaxing Bossa Nova & Jazz Music For Study - Smooth Jazz Music - Background Music",
                    "url": "https://www.youtube.com/watch?v=Y-JQ-RCyPpQ",
                    "upload_date": "1 year ago",
                    "thumbnail": "https://i.ytimg.com/vi/Y-JQ-RCyPpQ/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCnRdFecEZI55Bfh5oRhOQqs_lm_Q",
                    "views": "14.6M views"
                },
                "channel": {
                    "username": "Cafe Music BGM channel",
                    "url": "https://youtube.com/channel/UCJhjE7wbdYAae1G25m0tHAA",
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
    const [users, setUsers] = useState([]);

    useEffect(() => {
        sckt.socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);
    const updateCurrUser = (paramsToChange) => {
        setCurrUser((prev) => ({ ...prev, ...paramsToChange }));
    }
    const updateVideoProps = (paramsToChange) => {
        setVideoProps((prev) => ({ ...prev, ...paramsToChange }));
    }
    const sendVideoState = ({ eventName, eventParams }) => {
        let params = {
            name: currUser.name,
            room: room,
            eventName: eventName,
            eventParams: eventParams
        };
        sckt.socket.emit('sendVideoState', params, (error) => { });
    };

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
                    updateVideoProps({ receiving: false });
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
        updateVideoProps({ history: [searchItem, ...videoProps.history] });
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
    const cap = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    // From JoinRoom.js 
    useEffect(() => {
        const currRoom = match.params.roomName;
        if (currRoom.length > 0) {
            setRoom(currRoom);
            // const adj = Sentencer.make("{{ adjective }}");
            // const noun = Sentencer.make("{{ noun }}");
            // const randomName = `${cap(adj)} ${cap(noun)}`;
            // setCurrUser(randomName)
            // sckt.socket.emit('join', { name: randomName, room }, () => {
            //     // console.log(`${name} joined room ${room}`);
            // });
        }
        // sckt.socket.emit('createRoom', { room }, () => {});
        // sckt.socket.on("roomData", ({ users }) => {
        //     setUsers(users);
        // });
    }, [location.pathname, history]);

    // From JoinUser.js
    const joinRoomAsUser = (name) => {
        sckt.socket.emit('checkUser', { name, room }, (error) => {
            if (error === 'DUPLICATE_USER') {
                console.log(error);
                store.addNotification({
                    title: "Uh oh!",
                    message: "User exists in this room already",
                    type: "warning",
                    insert: "top",
                    container: "bottom-right",
                    animationIn: ["animated", "fadeInUp"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: false
                    }
                });
            } else {
                updateCurrUser({ name });
                const bg = getRandomColor();
                const txt = invertColor(bg);
                const colors = { bg, txt };
                updateCurrUser({ colors });
                sckt.socket.emit('join', { name, room, colors }, ({ id }) => {
                    updateCurrUser({ id });
                });
            }
        })
    }

    return (
        <div>
            <div>
                {
                    currUser.name && room
                        ? (
                            <div className="outerContainer">
                                <Video
                                    log={log}
                                    currUser={currUser}
                                    room={room}
                                    videoProps={videoProps}
                                    updateVideoProps={updateVideoProps}
                                    playerRef={playerRef}
                                    sendVideoState={sendVideoState}
                                    loadVideo={loadVideo}
                                    playVideoFromSearch={playVideoFromSearch}
                                />
                                <Panel
                                    currUser={currUser}
                                    updateCurrUser={updateCurrUser}
                                    room={room}
                                    history={history}
                                    videoProps={videoProps}
                                    updateVideoProps={updateVideoProps}
                                    playerRef={playerRef}
                                    sendVideoState={sendVideoState}
                                    playVideoFromSearch={playVideoFromSearch}
                                    users={users}
                                    setUsers={setUsers}
                                />
                            </div>
                        ) : (
                            <JoinUser room={room} joinRoomAsUser={joinRoomAsUser} />
                        )
                }
            </div>
        </div >
    );
}

export default Room;