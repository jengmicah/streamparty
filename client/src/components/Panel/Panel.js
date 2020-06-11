import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Chat from './Chat/Chat';
import Users from './Users/Users';
import QueueHistory from './QueueHistory/QueueHistory';
import Settings from './Settings/Settings';
import ReactTooltip from "react-tooltip";

import { sckt } from '../Socket';

import './Panel.css';

const Panel = ({
    log,
    name,
    room,
    history,
    videoProps,
    updateVideoProps,
    playerRef,
    sendVideoState,
    playVideoFromSearch,
    colors
}) => {
    const [users, setUsers] = useState('');

    useEffect(() => {
        sckt.socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    return (
        <div className="panelContainer">
            <Tabs forceRenderTabPanel={true}>
                <TabList>
                    <Tab data-tip="Chat"><FontAwesomeIcon icon="comment" /></Tab>
                    <Tab data-tip="Videos"><FontAwesomeIcon icon="stream" /></Tab>
                    <Tab data-tip="Users"><FontAwesomeIcon icon="users" /><sub>{users.length}</sub></Tab>
                    <Tab data-tip="Settings"><FontAwesomeIcon icon="cog" /></Tab>
                </TabList>

                <TabPanel>
                    <Chat
                        name={name}
                        colors={colors}
                    />
                </TabPanel>
                <TabPanel>
                    <Tabs forceRenderTabPanel={true} className="subTabs">
                        <TabList>
                            <Tab>Queue</Tab>
                            <Tab>History</Tab>
                        </TabList>
                        <TabPanel>
                            <QueueHistory
                                name={name}
                                room={room}
                                videoProps={videoProps}
                                updateVideoProps={updateVideoProps}
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
                                updateVideoProps={updateVideoProps}
                                playerRef={playerRef}
                                isQueue={false}
                                sendVideoState={sendVideoState}
                                playVideoFromSearch={playVideoFromSearch}
                            />
                        </TabPanel>
                    </Tabs>
                </TabPanel>
                <TabPanel>
                    <Users
                        users={users}
                    />
                </TabPanel>
                <TabPanel>
                    <Settings
                        name={name}
                        room={room}
                        history={history}
                    />
                </TabPanel>
            </Tabs>
            <ReactTooltip effect="solid" place="bottom" />
        </div>
    );
}

export default Panel;