import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message/Message';
import './Messages.scss';

const Messages = ({ messages, currUser, users }) => {
    return (
        <ScrollToBottom className="messages">
            {
                messages.map((message, i) =>
                    <div className="messageOuterContainer" key={i}>
                        <Message message={message} currUser={currUser} users={users} />
                    </div>
                )
            }
        </ScrollToBottom>
    )
};

export default Messages;