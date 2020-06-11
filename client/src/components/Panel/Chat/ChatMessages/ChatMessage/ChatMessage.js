import React from 'react';

import './ChatMessage.css';

import ReactEmoji from 'react-emoji';
import { getAvatarUrl } from '../../../../../Helper';

const ChatMessage = ({ message: { user, text }, self }) => {
    let isSentByCurrentUser = false;
    const trimmedName = self.name.trim().toLowerCase();

    if (user.name === trimmedName) {
        isSentByCurrentUser = true;
    }
    return (
        isSentByCurrentUser
            ? (
                <div className='messageContainer justifyEnd'>
                    {/* <p className='sentText pr-10'>{trimmedName}</p> */}
                    <div className='messageBox backgroundBlue'>
                        <p className='messageText colorWhite'>{ReactEmoji.emojify(text)}</p>
                    </div>
                    <section>
                        <img src={getAvatarUrl({
                            name: self.name,
                            background: self.colors.bg,
                            color: self.colors.txt,
                        })} />
                    </section>
                </div>
            ) : (
                user.name === 'admin' ? (
                    <div className='messageContainer justifyCenter mtb-14'>
                        <div className='messageBox fullWidth ptb-0 textCenter'>
                            <p className='messageText colorGray'>{text}</p>
                        </div>
                    </div>
                ) : (
                        <div className='messageContainer justifyStart'>
                            <section>
                                <img src={getAvatarUrl({
                                    name: user.name,
                                    background: user.colors.bg,
                                    color: user.colors.txt,
                                })} />
                            </section>
                            <div className='messageBox backgroundLight'>
                                <p className='messageText colorDark'>{ReactEmoji.emojify(text)}</p>
                            </div>
                            {/* <p className='sentText colorGray pl-10'>{user.name}</p> */}
                        </div>
                    )
            )
    );
};

export default ChatMessage;