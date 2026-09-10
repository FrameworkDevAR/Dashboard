// The Languages Data
const langsData   = {};
let   defaultLang = "";

// The Current Strings
let appUrl        = "";
let language      = null;
let stringData    = {};
let urlData       = {};
let actionData    = {};



/**
 * Initializes the NLS
 * @param {string} newAppUrl
 * @returns {void}
 */
function init(newAppUrl) {
    appUrl = newAppUrl;
}

/**
 * Initialize a Language
 * @param {string}  lang
 * @param {object=} strings
 * @param {object=} urls
 * @param {object=} actions
 * @returns {void}
 */
function initLang(lang, strings = {}, urls = {}, actions = {}) {
    langsData[lang] = { strings, urls, actions };
    if (!defaultLang) {
        defaultLang = lang;
    }
}

/**
 * Gets the Language
 * @returns {string}
 */
function getLang() {
    return (navigator.languages && navigator.languages[0]) || navigator.language || defaultLang;
}

/**
 * Gets the Language
 * @returns {string}
 */
function getCurrentLang() {
    return language;
}

/**
 * Sets the Language
 * @param {string=} langCode
 * @returns {void}
 */
function setLang(langCode) {
    language = langCode || getLang();

    stringData = loadLang("strings");
    urlData    = loadLang("urls");
    actionData = loadLang("actions");
}

/**
 * Returns the Data of the given Language, or of the default one when it has none
 * @param {string} langCode
 * @returns {object}
 */
function getLangData(langCode) {
    const langNoRegion = langCode.toLowerCase().split(/[_-]+/)[0];
    return langsData[langNoRegion] || langsData[langCode] || langsData[defaultLang];
}

/**
 * Loads the Language Strings
 * @param {string} key
 * @returns {object}
 */
function loadLang(key) {
    const data            = getLangData(language);
    const messages        = data?.[key] || {};
    const defaultMessages = langsData[defaultLang]?.[key] || {};

    for (const key of Object.keys(defaultMessages)) {
        if (!messages[key]) {
            messages[key] = defaultMessages[key];
        }
    }
    return messages;
}



/**
 * Returns a String from an ID and Language
 * @param {string} id
 * @param {string} langCode
 * @returns {string}
 */
function getForLang(id, langCode) {
    if (langsData[langCode]) {
        return langsData[langCode].strings[id] || id;
    }
    return stringData[id] || id;
}

/**
 * Returns a String from an ID
 * @param {string}           id
 * @param {(number|string)=} elem
 * @returns {string}
 */
function get(id, elem = null) {
    const message = stringData[id] || id;
    return elem !== null ? message[elem] : message;
}

/**
 * Returns a String from an ID
 * @param {string}          id
 * @param {(number|string)} elem
 * @returns {string}
 */
function getValue(id, elem) {
    for (const item of stringData[id] || []) {
        if (item.key === String(elem)) {
            return item.value;
        }
    }
    return "";
}

/**
 * Returns a String from an ID with the Class
 * @param {string}          id
 * @param {(number|string)} elem
 * @param {string}          className
 * @returns {string}
 */
function getClass(id, elem, className) {
    return `${className}-${get(id, elem)}`;
}

/**
 * Returns the Entries from the NLS Object
 * @param {string} id
 * @returns {[string, string][]}
 */
function entries(id) {
    return Object.entries(get(id) || {});
}

/**
 * Returns the Entries from the NLS Object as a Select
 * @param {string} id
 * @returns {object[]}
 */
function select(id) {
    const data   = entries(id);
    const result = [];
    for (const [ key, value ] of data) {
        result.push({ key, value });
    }
    return result;
}

/**
 * Format a string by replacing placeholder symbols with passed in arguments
 * @param {string}             id
 * @param {...(string|number)} args
 * @returns {string}
 */
function format(id, ...args) {
    const str = get(id);
    return (str || "").replace(/\{(\d+)\}/g, (match, num) => {
        return (args[num] !== undefined ? String(args[num]) : match);
    });
}

/**
 * Format a string by replacing placeholder symbols with passed in arguments
 * @param {string}             id
 * @param {string}             value
 * @param {...(string|number)} args
 * @returns {string}
 */
function formatIf(id, value, ...args) {
    if (value) {
        return format(id, value, ...args);
    }
    return "";
}

/**
 * Formats and Joins the given strings to form a sentence
 * @param {string}   id
 * @param {string[]} list
 * @param {boolean=} useOr
 * @returns {string}
 */
function formatJoin(id, list, useOr) {
    return format(id, join(list, useOr));
}

/**
 * Returns a formatted string using the correct plural string
 * @param {string}             id
 * @param {(number|string)}    amount
 * @param {...(string|number)} args
 * @returns {string}
 */
function pluralize(id, amount, ...args) {
    const suffix = Number(amount) === 1 ? "_SINGULAR" : "_PLURAL";
    return format(id + suffix, String(amount), ...args);
}

/**
 * Returns a formatted string using the correct plural string
 * @param {string}   id
 * @param {string[]} list
 * @returns {string}
 */
function pluralizeList(id, list) {
    const suffix = list.length === 1 ? "_SINGULAR" : "_PLURAL";
    return format(id + suffix, join(list));
}

/**
 * Joins the given strings to form a sentence
 * @param {string[]} list
 * @param {boolean=} useOr
 * @returns {string}
 */
function join(list, useOr) {
    let result = list[0];
    if (list.length > 1) {
        const and = " " + get(useOr ? "GENERAL_OR" : "GENERAL_AND") + " ";
        for (let i = 1; i < list.length; i++) {
            result += (i < list.length - 1 ? ", " : and) + list[i];
        }
    }
    return result;
}



/**
 * Returns the url with the given arguments
 * @param {...(string|number)} args
 * @returns {string}
 */
function url(...args) {
    const result = [];
    let   params = "";

    for (const arg of args) {
        if (String(arg).startsWith("?")) {
            params = String(arg);
            continue;
        }

        const url = urlData[arg] !== undefined ? urlData[arg] : arg;
        if (url) {
            result.push(url);
        }
    }
    return result.join("/") + params;
}

/**
 * Returns the base Url with the given arguments
 * @param {...(string|number)} args
 * @returns {string}
 */
function baseUrl(...args) {
    const result = url(...args);
    return result[0] !== "/" ? `/${result}` : result;
}

/**
 * Returns the full Url with the given arguments
 * @param {...(string|number)} args
 * @returns {string}
 */
function fullUrl(...args) {
    return appUrl + url(...args);
}

/**
 * Returns the Key of the given Url
 * @param {string}    currUrl
 * @param {...string} keys
 * @returns {string}
 */
function urlToKey(currUrl, ...keys) {
    for (const key of keys) {
        if (currUrl === url(key)) {
            return key;
        }
    }
    return "";
}

/**
 * Translates the given Url from one language to the other
 * @param {string} currUrl
 * @param {string} fromLang
 * @param {string} toLang
 * @returns {string}
 */
function translateUrl(currUrl, fromLang, toLang) {
    const fromUrls = getLangData(fromLang)?.urls || {};
    const toUrls   = getLangData(toLang)?.urls || {};
    if (fromUrls === toUrls) {
        return currUrl;
    }

    // Every Url has the same key in each language, so the parts of both are paired to know
    // what each word becomes. The params and the parts that are not words, like the IDs, are
    // kept as they are, and the first pair found for a word is the one that is used
    const words = {};
    for (const [ key, fromUrl ] of Object.entries(fromUrls)) {
        const toUrl = toUrls[key];
        if (typeof fromUrl !== "string" || typeof toUrl !== "string") {
            continue;
        }
        const fromParts = fromUrl.split("/");
        const toParts   = toUrl.split("/");
        if (fromParts.length !== toParts.length) {
            continue;
        }
        fromParts.forEach((part, index) => {
            if (part && !part.startsWith(":") && words[part] === undefined) {
                words[part] = toParts[index];
            }
        });
    }

    return currUrl.split("/").map((part) => words[part] ?? part).join("/");
}



/**
 * Returns the Module name
 * @param {string} module
 * @returns {string}
 */
function getModule(module) {
    if (actionData[module]) {
        return actionData[module].name;
    }
    return module;
}

/**
 * Returns the Action name
 * @param {string} module
 * @param {string} action
 * @returns {string}
 */
function getAction(module, action) {
    if (actionData[module] && actionData[module].actions[action]) {
        return actionData[module].actions[action];
    }
    return module + action;
}



// The Public API
export default {
    init,
    initLang,
    getLang,
    getCurrentLang,
    setLang,

    getForLang,
    get,
    getValue,
    getClass,
    entries,
    select,

    format,
    formatIf,
    formatJoin,
    pluralize,
    pluralizeList,
    join,

    url,
    baseUrl,
    fullUrl,
    urlToKey,
    translateUrl,

    getModule,
    getAction,
};
