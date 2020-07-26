import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from 'semantic-ui-react';
import {
    youtube_parser,
    getVideoType,
    isValidURL
} from '../../../utils/video';
import './Search.scss';
import SearchResults from './SearchResults/SearchResults';
import { store } from 'react-notifications-component';

require('dotenv').config()

const VideoSearch = ({ addVideoToQueue, playVideoFromSearch, updateVideoProps }) => {
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const baseURL = process.env.REACT_APP_YT_API;
    const lastSearch = useRef('');

    const handlePlay = async (event) => {
        event.preventDefault();
        let trimInput = searchInput.trim();
        if (trimInput === '' || trimInput === lastSearch.current) return;
        lastSearch.current = trimInput;
        if (isValidURL(trimInput)) {
            const videoType = getVideoType(trimInput);
            updateVideoProps({ videoType });
            switch (videoType) {
                case 'yt': getYTVideo(trimInput); break;
                case 'vimeo': getVimeoVideo(trimInput); break
                case 'twitch': getTwitchVideo(trimInput); break;
                case 'soundcloud': getSoundCloudVideo(trimInput); break;
                default:
                    store.addNotification({
                        title: "Oh no!",
                        message: "We apologize. At the moment, only YouTube, Vimeo, and Twitch links are supported.",
                        type: "info",
                        insert: "top",
                        container: "bottom-right",
                        animationIn: ["animated", "fadeInUp"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: false
                        }
                    });
                    break;
            }
        } else {
            // Search phrase on Youtube 
            search({ term: trimInput, page: 1 });
            updateVideoProps({ videoType: 'yt' });
        }
    };
    const search = async ({ term, page = 1 }) => {
        const limit = (window.matchMedia('(max-width: 960px)').matches) ? 8 : 9;
        setLoading(true);
        axios.get(`${baseURL}/ytsearch`, {
            params: {
                query: term,
                page: page,
                limit: limit
            }
        }).then(response => {
            setSearchResults(response.data.results);
            setPage(page);
            setLoading(false);
        });
    };
    const getYTVideo = async (ytUrl) => {
        const videoId = youtube_parser(ytUrl);
        setLoading(true);
        axios.get(`${baseURL}/ytvideo`, {
            params: { videoId }
        }).then(response => {
            setLoading(false);
            const searchItem = response.data.results[0];
            playVideoFromSearch(searchItem);
        });
    }
    const getVimeoVideo = async (vimeoUrl) => {
        setLoading(true);
        axios.get(`${baseURL}/vimeovideo`, {
            params: { vimeoUrl }
        }).then(response => {
            setLoading(false);
            if (response.data.name !== "Error") {
                const searchItem = response.data;
                playVideoFromSearch(searchItem);
            } else {
                console.log("Invalid Vimeo URL")
            }
        });
    }
    const getTwitchVideo = async (twitchUrl) => {
        axios.get(`${baseURL}/twitchvideo`, {
            params: { twitchUrl }
        }).then(response => {
            setLoading(false);
            console.log(response);
            const searchItem = response.data;
            playVideoFromSearch(searchItem);
        });
    }
    const getSoundCloudVideo = async (scUrl) => {
        // axios.get(`${baseURL}/soundcloudvideo`, {
        //     params: { scUrl }
        // }).then(response => {
        //     setLoading(false);
        //     const searchItem = response.data;
        // });
        playVideoFromSearch({ video: { id: scUrl, url: scUrl }, channel: { username: '' } });
    }
    // Ping YT scraper without loading icon
    useEffect(() => { search('') }, []);

    return (
        <div className="videoSearchContainer">
            <Input
                fluid
                id='searchInput'
                size='large'
                placeholder='Search a YouTube video or paste a video link...'
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? handlePlay(e) : null}
                action={{
                    content: "Search",
                    loading,
                    onClick: (e) => searchInput.trim() !== '' ? handlePlay(e) : null
                }}
            />
            <SearchResults
                searchResults={searchResults}
                playVideoFromSearch={playVideoFromSearch}
                addVideoToQueue={addVideoToQueue}
                page={page}
                search={search}
                searchInput={searchInput}
                loading={loading}
            />
        </div>
    )
};

export default VideoSearch;