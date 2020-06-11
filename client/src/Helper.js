// https://github.com/onury/invert-color
const invertColor = (hex, bw = true) => {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '000000'
            : 'FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return padZero(r) + padZero(g) + padZero(b);
}

const padZero = (str, len) => {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const getAvatarUrl = ({ name, background, color,
    fontsize = 0.33, size = 30, format = 'svg',
    bold, rounded, length, uppercase }) => {
    const resolveSettings = (key, setting) => {
        if (!setting) return "";
        return `${key}=${setting}&`;
    }
    let apiURL = `https://ui-avatars.com/api/?`;
    apiURL += resolveSettings("name", name);
    apiURL += resolveSettings("background", background);
    apiURL += resolveSettings("color", color);
    apiURL += resolveSettings("size", size);
    apiURL += resolveSettings("font-size", fontsize);
    apiURL += resolveSettings("length", length);
    apiURL += resolveSettings("rounded", rounded);
    apiURL += resolveSettings("bold", bold);
    apiURL += resolveSettings("uppercase", uppercase);
    apiURL += resolveSettings("format", format);
    return apiURL;
}

export { invertColor, getRandomColor, getAvatarUrl }