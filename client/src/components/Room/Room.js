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
        id: '',
        name: JSON.parse(localStorage.getItem('name')),
        colors: JSON.parse(localStorage.getItem('colors'))
    });
    const [room, setRoom] = useState('');
    const [videoProps, setVideoProps] = useState({
        queue: [
            // {
            //     "video": {
            //         "id": "Y-JQ-RCyPpQ",
            //         "title": "Relaxing Bossa Nova & Jazz Music For Study - Smooth Jazz Music - Background Music",
            //         "url": "https://www.youtube.com/watch?v=Y-JQ-RCyPpQ",
            //         "upload_date": "1 year ago",
            //         "thumbnail": "https://i.ytimg.com/vi/Y-JQ-RCyPpQ/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCnRdFecEZI55Bfh5oRhOQqs_lm_Q",
            //         "views": "14.6M views"
            //     },
            //     "channel": {
            //         "username": "Cafe Music BGM channel",
            //         "url": "https://youtube.com/channel/UCJhjE7wbdYAae1G25m0tHAA",
            //         "verified": true
            //     }
            // }
        ],
        history: [],
        playing: true,
        seekTime: 0,
        lastStateYT: -1,
        receiving: false,
        initVideo: false,
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        localStorage.setItem('name', JSON.stringify(currUser.name));
    }, [currUser.name])
    useEffect(() => {
        localStorage.setItem('colors', JSON.stringify(currUser.colors));
    }, [currUser.colors])

    useEffect(() => {
        const handler = ({ users }) => setUsers(users);
        sckt.socket.on("roomData", handler);
        return () => sckt.socket.off('roomData', handler);
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
        if (playerRef.current != null && playerRef.current.internalPlayer != null && searchItem) {
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
        const { initVideo, history } = videoProps;
        if (!initVideo) updateVideoProps({ initVideo: true });
        loadVideo(searchItem, false);
        sendVideoState({
            eventName: "syncLoad",
            eventParams: { searchItem, history: [searchItem, ...history] }
        });
        updateVideoProps({ history: [searchItem, ...history] });
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
        const room = match.params.roomName.trim();
        if (room.length > 0) {
            setRoom(room);
            let name = currUser.name;
            if (!name) { // If no name in localStorage
                const adj = Sentencer.make("{{ adjective }}");
                const noun = Sentencer.make("{{ noun }}");
                name = `${cap(adj)} ${cap(noun)}`;
                updateCurrUser({ name });
            }
            let colors = currUser.colors;
            // if (!colors) { // If no colors in localStorage
            //     const bg = getRandomColor();
            //     const txt = invertColor(bg);
            //     colors = { bg, txt };
            //     updateCurrUser({ colors });
            // }
            const bg = getRandomColor();
            const txt = invertColor(bg);
            colors = { bg, txt };
            updateCurrUser({ colors });

            sckt.socket.emit('join', { name, room, colors }, ({ id }) => {
                updateCurrUser({ id });
            });
        }
        // sckt.socket.emit('createRoom', { room }, () => {});
        // sckt.socket.on("roomData", ({ users }) => {
        //     setUsers(users);
        // });
    }, [location.pathname, history]);

    return (
        <div>
            <div>
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
            </div>
        </div >
    );
}

export default Room;