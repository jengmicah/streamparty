import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import ChatMessage from './ChatMessage/ChatMessage';

import './ChatMessages.css';

const ChatMessages = ({ messages, name, colors }) => (
    <ScrollToBottom className="messages">
        {
            messages.map((message, i) =>
                <div className="messageOuterContainer" key={i}>
                    <ChatMessage message={message} self={{name, colors}} />
                </div>
            )
        }
    </ScrollToBottom>
);

export default ChatMessages;