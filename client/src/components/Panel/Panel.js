import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Chat from './Chat/Chat';
import Users from './Users/Users';
import QueueHistory from './QueueHistory/QueueHistory';
// import JoinUser from './JoinUser';

import { sckt } from '../Socket';

import './Panel.css';

const Panel = ({ log, name, room, videoProps, updateState }) => {

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
                    <Tab><FontAwesomeIcon icon="comment" /></Tab>
                    <Tab><FontAwesomeIcon icon="stream" /></Tab>
                    <Tab><FontAwesomeIcon icon="users" /></Tab>
                    {/* <Tab><FontAwesomeIcon icon="cog" /></Tab> */}
                </TabList>

                <TabPanel>
                    <Chat log={log} name={name} room={room} users={users} />
                </TabPanel>
                <TabPanel>
                    <QueueHistory queue={videoProps.queue} updateState={updateState} />
                </TabPanel>
                <TabPanel>
                    <Users users={users} />
                </TabPanel>
                {/* <TabPanel>
                    <Settings />
                </TabPanel> */}
            </Tabs>
        </div>
    );
}

export default Panel;