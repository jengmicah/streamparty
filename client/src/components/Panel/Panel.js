import React from "react";
// import ReactTooltip from "react-tooltip";
import { Icon, Menu, Tab } from 'semantic-ui-react';
import Chat from './Chat/Chat';
import './Panel.scss';
import QueueHistory from './QueueHistory/QueueHistory';
import Settings from './Settings/Settings';
import Users from './Users/Users';

const Panel = ({
    currUser,
    updateCurrUser,
    room,
    history,
    videoProps,
    updateVideoProps,
    playerRef,
    sendVideoState,
    playVideoFromSearch,
    users
}) => {

    const videoPanes = [
        {
            menuItem: { key: 'queue', content: 'Queue' },
            pane: (
                <Tab.Pane key='queue'>
                    <QueueHistory
                        currUser={currUser}
                        room={room}
                        videoProps={videoProps}
                        updateVideoProps={updateVideoProps}
                        playerRef={playerRef}
                        isQueue={true}
                        sendVideoState={sendVideoState}
                        playVideoFromSearch={playVideoFromSearch}
                    />
                </Tab.Pane>
            ),
        },
        {
            menuItem: { key: 'history', content: 'History' },
            pane: (
                <Tab.Pane key='history'>
                    <QueueHistory
                        currUser={currUser}
                        room={room}
                        videoProps={videoProps}
                        updateVideoProps={updateVideoProps}
                        playerRef={playerRef}
                        isQueue={false}
                        sendVideoState={sendVideoState}
                        playVideoFromSearch={playVideoFromSearch}
                    />
                </Tab.Pane>
            ),
        },
    ]
    const panes = [
        {
            menuItem: (
                <Menu.Item key='chat'>
                    <Icon name='chat' />
                </Menu.Item>
            ),
            pane: (
                <Tab.Pane key='chat'>
                    <Chat
                        currUser={currUser}
                        users={users}
                    />
                </Tab.Pane>
            ),
        },
        {
            menuItem: (
                <Menu.Item key='video'>
                    <Icon name='video' />
                </Menu.Item>
            ),
            pane: (
                <Tab.Pane key='videos'>
                    <Tab panes={videoPanes} renderActiveOnly={false} className="subTabs" />
                </Tab.Pane>
            ),
        },
        {
            menuItem: (
                <Menu.Item key='users'>
                    <Icon name='users' />{users.length}
                </Menu.Item>
            ),
            pane: (
                <Tab.Pane key='users'>
                    <Users
                        users={users}
                    />
                </Tab.Pane>
            ),
        },
        {
            menuItem: (
                <Menu.Item key='settings'>
                    <Icon name='cog' />
                </Menu.Item>
            ),
            pane: (
                <Tab.Pane key='settings'>
                    <Settings
                        currUser={currUser}
                        updateCurrUser={updateCurrUser}
                        room={room}
                        history={history}
                        users={users}
                    />
                </Tab.Pane>
            ),
        },
    ]

    return (
        <div className="panelContainer">
            <Tab panes={panes} renderActiveOnly={false} />
        </div>
    );
}

export default Panel;