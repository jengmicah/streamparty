import adjectives from './adjectives';
import nouns from './nouns';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const generateWords = ({ delimiter = ' ', shouldCap = true }) => {
    let adjective = adjectives[getRandomInt(0, adjectives.length + 1)];
    let noun = nouns[getRandomInt(0, nouns.length + 1)];
    if (shouldCap) {
        adjective = capitalize(adjective);
        noun = capitalize(noun);
    }
    return adjective + delimiter + noun;
}