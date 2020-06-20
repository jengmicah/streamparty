import React, { useState, useEffect, useRef } from "react";
import Video from '../Video/Video';
// import JoinUser from './JoinUser';
import { sckt } from '../Socket';
import { store } from 'react-notifications-component';
import { invertColor, getRandomColor } from '../../utils/userInfo';

import './Room.css';
import Panel from "../Panel/Panel";
import { generateWords } from '../../utils/generateWords';
import { Dimmer, Loader, Transition } from 'semantic-ui-react'

const Room = ({ location, history, match }) => {
    const playerRef = useRef(null);
    const [currUser, setCurrUser] = useState({
        id: '',
        name: JSON.parse(localStorage.getItem('name')),
        colors: JSON.parse(localStorage.getItem('colors'))
    });
    const [room, setRoom] = useState('');
    const [videoProps, setVideoProps] = useState({
        queue: [],
        history: [],
        playing: true,
        seekTime: 0,
        lastStateYT: -1,
        receiving: false,
        initVideo: false,
    });
    const [users, setUsers] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    // const [mounted, setMounted] = useState(false);
    // useEffect(() => setMounted(true), []);

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
            const { playing, seekTime, initVideo } = videoProps;
            if (!initVideo) updateVideoProps({ initVideo: true });
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
        const { history } = videoProps;
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
    // From JoinRoom.js 
    useEffect(() => {
        const room = match.params.roomName.trim();
        if (room.length > 0) {
            sckt.socket.emit('checkRoomExists', { room }, (exists) => {
                // We set location.state in JoinRoom.js
                if (exists || location.state) {
                    setRoom(room);
                    let name = currUser.name;
                    if (!name) { // If no name in localStorage
                        name = generateWords({ delimiter: ' ', shouldCap: true })
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
                        setTimeout(() => {
                            setIsJoined(true);
                        }, 750);
                    });
                } else {
                    history.push('/');
                    store.addNotification({
                        title: "Oops!",
                        message: `It seems like the room "${room}" doesn't exist. Go ahead and create a new room!`,
                        type: "danger",
                        insert: "top",
                        container: "bottom-right",
                        animationIn: ["animated", "fadeInUp"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: false
                        }
                    });
                }
            });
        }
        // sckt.socket.emit('createRoom', { room }, () => {});
        // sckt.socket.on("roomData", ({ users }) => {
        //     setUsers(users);
        // });
    }, [location.pathname, history]);

    return (
        <div className="outerContainer">
            {room &&
                <div className="outerContainer">
                    <Transition visible={!isJoined} animation='fade' duration={500}>
                        <Dimmer active={!isJoined}>
                            <Loader>Joining Room...</Loader>
                        </Dimmer>
                    </Transition>
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
            }
        </div>
    );
}

export default Room;