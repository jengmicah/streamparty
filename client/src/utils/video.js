const insert = (arr, index, newItem) => [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index)
];

// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
const youtube_parser = (url) => {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
}
// https://stackoverflow.com/questions/28735459 how-to-validate-youtube-url-in-client-side-in-text-box
const validateYouTubeUrl = (url) => {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
        return matches[1];
    }
    return false;
}
// Very general URL validation
const validateVimeoUrl = (url) => {
    return /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)/.test(url);
}
const validateTwitchUrl = (url) => {
    return /^(http\:\/\/|https\:\/\/)?(www\.)?(twitch\.tv\/)/.test(url);
}
const validateSoundCloudUrl = (url) => {
    return /((https:\/\/)|(http:\/\/)|(www.)|(m\.)|(\s))+(soundcloud.com\/)+[a-zA-Z0-9\-\.]+(\/)+[a-zA-Z0-9\-\.]+/.test(url);
}
// function formatTimestamp(input) {
//     if (
//         input === null ||
//         input === undefined ||
//         input === false ||
//         Number.isNaN(input) ||
//         input === Infinity
//     ) {
//         return '';
//     }
//     let minutes = Math.floor(Number(input) / 60);
//     let seconds = Math.floor(Number(input) % 60)
//         .toString()
//         .padStart(2, '0');
//     return `${minutes}:${seconds}`;
// }
const formatTimestamp = (seconds) => {
    if (isNaN(seconds)) {
        return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
};
function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

const getVideoType = (url) => {
    if (validateYouTubeUrl(url)) {
        return 'yt';
    } else if (validateVimeoUrl(url)) {
        return 'vimeo';
    } else if (validateTwitchUrl(url)) {
        return 'twitch';
        // } else if (validateSoundCloudUrl(url)) {
        //     return 'soundcloud';
    } else {
        return null;
    }
}
export {
    insert,
    youtube_parser,
    getVideoType,
    isValidURL,
    formatTimestamp
}