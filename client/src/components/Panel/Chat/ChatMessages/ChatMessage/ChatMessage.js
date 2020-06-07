import React from 'react';

import './ChatMessage.css';

import ReactEmoji from 'react-emoji';

const ChatMessage = ({ message: { user, text }, name }) => {
    let isSentByCurrentUser = false;
    const trimmedName = name.trim().toLowerCase();

    if (user === trimmedName) {
        isSentByCurrentUser = true;
    }
    return (
        isSentByCurrentUser
            ? (
                <div className='messageContainer justifyEnd'>
                    <p className='sentText pr-10'>{trimmedName}</p>
                    <div className='messageBox backgroundBlue'>
                        <p className='messageText colorWhite'>{ReactEmoji.emojify(text)}</p>
                    </div>
                </div>
            ) : (
                user === 'admin' ? (
                    <div className='messageContainer justifyCenter'>
                        <div className='messageBox fullWidth pb-0 textCenter'>
                            <p className='messageText colorGray'>{text}</p>
                        </div>
                    </div>
                ) : (
                        <div className='messageContainer justifyStart'>
                            <div className='messageBox backgroundLight'>
                                <p className='messageText colorDark'>{ReactEmoji.emojify(text)}</p>
                            </div>
                            <p className='sentText pl-10'>{user}</p>
                        </div>
                    )
            )
    );
};

export default ChatMessage;