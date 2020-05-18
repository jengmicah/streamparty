import React from "react";
import './Video.css';

const Video = ({ location, ENDPOINT }) => {

    return (
        <div className="videoContainer">
            <div id="videoPlayer"></div>
        </div>
    );
}

export default Video;