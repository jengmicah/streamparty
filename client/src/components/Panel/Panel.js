import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Chat from './Chat/Chat';
import Users from './Users/Users';
import QueueHistory from './QueueHistory/QueueHistory';
// import Settings from './Settings/Settings';
import ReactTooltip from "react-tooltip";

import { sckt } from '../Socket';

import './Panel.css';

const Panel = ({ log, name, room, history, videoProps, updateState, playerRef, sendVideoState, playVideoFromSearch }) => {

    const [users, setUsers] = useState('');

    useEffect(() => {
        sckt.socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);
    
    return (
        <div className="panelContainer">
            <ReactTooltip effect="solid" data-place="bottom" />
            <Tabs forceRenderTabPanel={true}>
                <TabList>
                    <Tab data-tip="Chat"><FontAwesomeIcon icon="comment" /></Tab>
                    <Tab data-tip="Queue"><FontAwesomeIcon icon="stream" /></Tab>
                    <Tab data-tip="History"><FontAwesomeIcon icon="history" /></Tab>
                    <Tab data-tip="Users"><FontAwesomeIcon icon="users" /><sub>{users.length}</sub></Tab>
                    {/* <Tab data-tip="Settings"><FontAwesomeIcon icon="cog" /></Tab> */}
                </TabList>

                <TabPanel>
                    <Chat
                        log={log}
                        name={name}
                        room={room}
                        users={users}
                    />
                </TabPanel>
                <TabPanel>
                    <QueueHistory
                        name={name}
                        room={room}
                        videoProps={videoProps}
                        updateState={updateState}
                        playerRef={playerRef}
                        isQueue={true}
                        sendVideoState={sendVideoState}
                        playVideoFromSearch={playVideoFromSearch}
                    />
                </TabPanel>
                <TabPanel>
                    <QueueHistory
                        name={name}
                        room={room}
                        videoProps={videoProps}
                        updateState={updateState}
                        playerRef={playerRef}
                        isQueue={false}
                        sendVideoState={sendVideoState}
                        playVideoFromSearch={playVideoFromSearch}
                    />
                </TabPanel>
                <TabPanel>
                    <Users users={users}
                        room={room}
                        history={history} />
                </TabPanel>
                {/* <TabPanel>
                    <Settings
                        room={room}
                        history={history}
                    />
                </TabPanel> */}
            </Tabs>
        </div>
    );
}

export default Panel;