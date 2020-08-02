# Stream Party

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

An online video synchronization platform to watch videos with your friends and family.

Written with React, Socket.io, and Express.

<p align="center">
  <img src="https://github.com/jengmicah/streamparty/blob/master/images/demo.gif?raw=true" alt="demo gif">
</p>

## Features

- Supported services:
  - YouTube
  - Vimeo
  - Twitch
- Sync video playback with other users in your room
  - `play`, `pause`, `seek`, `video change`, `queues`
- Search YouTube videos directly inside the site
- Chat with your friends
- Add videos to a queue
- Track your video watching history
- User customization

## Potential Features

- Potentially supported services:
  - Facebook
  - Wistia
  - DailyMotion
  - SoundCloud
  - Mixcloud
- Public and private rooms (browse public rooms)
- Video and audio chat support
- Search videos by channel
- Change panel size
- User progress bar
- Dark mode

## Quick Start

- Clone this repo: `git clone https://github.com/jengmicah/streamparty.git`
- In `/server`, install packages and start the server.
  - Install packages: `npm install`
  - Start the server: `npm start` (defaults to port `5000` but is customizable by adding `PORT` to `.env`)
  - Duplicate `.env.example` and rename to `.env`
- In `/client`, install packages and start the React application.
  - Install packages: `npm install`
  - Start the app: `npm start` (defaults to port `3000`)
  - Duplicate `.env.example` and rename to `.env`
- Update `.env` files in `/server` and `/client` with the correct URLs (i.e. `http://localhost:5000`, `http://localhost:3000`)
- Video API used is hosted at `https://video-meta.herokuapp.com/`
  - Responds to multiple endpoints
    - `/ytsearch`: get YouTube search results
      - `query`: string
      - `page`: number
      - `limit`: number
    - `/ytvideo`: get YouTube video data based on videoId
      - `videoId`: string
    - `/vimeovideo`: get Vimeo video data based on URL
      - `vimeoUrl`: string
    - `/twitchvideo`: get Twitch video data based on URL (currently doesn't return real data)
      - `twitchUrl`: string
  - Example of how this is used can be found in the [Search component](https://github.com/jengmicah/streamparty/blob/master/client/src/components/Video/Search/Search.js)
