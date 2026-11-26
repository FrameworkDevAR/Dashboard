// Constants
const MAX_VERSION = 15;
const MAX_RECENT  = 24;
const RECENT_KEY  = "emojis-recent";

const LOADERS = {
    es : () => import("emojibase-data/es/data.json"),
    en : () => import("emojibase-data/en/data.json"),
};

const CATEGORIES = [
    { key : "smileys",    icon : "emoji-smileys",    text : "EMOJI_SMILEYS",    groups : [ 0, 1 ] },
    { key : "animals",    icon : "emoji-animals",    text : "EMOJI_ANIMALS",    groups : [ 3 ] },
    { key : "food",       icon : "emoji-food",       text : "EMOJI_FOOD",       groups : [ 4 ] },
    { key : "travel",     icon : "emoji-travel",     text : "EMOJI_TRAVEL",     groups : [ 5 ] },
    { key : "activities", icon : "emoji-activities", text : "EMOJI_ACTIVITIES", groups : [ 6 ] },
    { key : "objects",    icon : "emoji-objects",    text : "EMOJI_OBJECTS",    groups : [ 7 ] },
    { key : "symbols",    icon : "emoji-symbols",    text : "EMOJI_SYMBOLS",    groups : [ 8 ] },
    { key : "flags",      icon : "emoji-flags",      text : "EMOJI_FLAGS",      groups : [ 9 ] },
];

// Variables
const cache = {};



/**
 * Returns the given text without the accents and in lower case, so it can be searched
 * @param {string} text
 * @returns {string}
 */
function normalize(text) {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * Loads the Emojis of the given Language, grouped in their Categories
 * @param {string} language
 * @returns {Promise<{key: string, icon: string, text: string, emojis: object[]}[]>}
 */
async function load(language) {
    const code = LOADERS[language] ? language : "en";
    if (cache[code]) {
        return cache[code];
    }

    // The newest emojis are left out, as the devices that are not up to date show them as boxes,
    // and so are the components, like the skin tones, which are not used alone
    const module = await LOADERS[code]();
    const list   = module.default
        .filter((elem) => elem.group !== undefined && elem.group !== 2 && elem.version <= MAX_VERSION)
        .sort((a, b) => a.order - b.order)
        .map((elem) => ({
            emoji  : elem.emoji,
            search : normalize([ elem.label, ...(elem.tags || []) ].join(" ")),
            group  : elem.group,
        }));

    cache[code] = CATEGORIES.map((category) => ({
        ...category,
        emojis : list.filter((elem) => category.groups.includes(elem.group)),
    }));
    return cache[code];
}

/**
 * Returns the Emojis of the given Categories that match the given text
 * @param {object[]} categories
 * @param {string}   text
 * @returns {object[]}
 */
function search(categories, text) {
    const words = normalize(text).split(" ").filter(Boolean);
    const list  = categories.flatMap((category) => category.emojis);
    return list.filter((elem) => words.every((word) => elem.search.includes(word)));
}

/**
 * Returns the Emojis that were used last, which are kept in the device
 * @returns {string[]}
 */
function getRecent() {
    try {
        const list = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
        return Array.isArray(list) ? list : [];
    } catch {
        return [];
    }
}

/**
 * Adds the given Emoji first in the ones that were used last
 * @param {string} emoji
 * @returns {void}
 */
function addRecent(emoji) {
    const list = [ emoji, ...getRecent().filter((elem) => elem !== emoji) ].slice(0, MAX_RECENT);
    try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch {
        // The device may not let it keep them, and then they are not kept
    }
}



// The public API
export default {
    load,
    search,
    getRecent,
    addRecent,
};
