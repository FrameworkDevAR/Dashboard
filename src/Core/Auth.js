import { jwtDecode }        from "jwt-decode";
import NLS                  from "../Core/NLS";

// Module Variables
let setCurrentUser = null;
let userLanguage   = "";



/**
 * Initialize the API
 * @param {Function} onUserChange
 * @returns {void}
 */
function init(onUserChange) {
    setCurrentUser = onUserChange;
    setUser();
}

/**
 * Unsets all the Data
 * @returns {void}
 */
function unsetAll() {
    unsetAccessToken();
    unsetRefreshToken();
    unsetUser();
}



/**
 * Returns the Access Token
 * @returns {string}
 */
function getAccessToken() {
    return localStorage.getItem("accessToken");
}

/**
 * Returns the Data of the Access Token
 * @returns {{exp: number, data: object}}
 */
function getAccessTokenData() {
    return jwtDecode(getAccessToken());
}

/**
 * Sets the Access Token
 * @param {string} accessToken
 * @returns {void}
 */
function setAccessToken(accessToken) {
    localStorage.setItem("accessToken", accessToken);
    setUser();
}

/**
 * Unsets the Access Token
 * @returns {void}
 */
function unsetAccessToken() {
    localStorage.removeItem("accessToken");
}



/**
 * Returns the Refresh Token
 * @returns {string}
 */
function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

/**
 * Sets the Refresh Token
 * @param {string} refreshToken
 * @returns {void}
 */
function setRefreshToken(refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
}

/**
 * Unsets the Refresh Token
 * @returns {void}
 */
function unsetRefreshToken() {
    localStorage.removeItem("refreshToken");
}



/**
 * Returns the User
 * @returns {?object}
 */
function getUser() {
    if (getAccessToken()) {
        const token = getAccessTokenData();
        return token.data;
    }
    return null;
}

/**
 * Sets the User
 * @returns {boolean}
 */
function setUser() {
    try {
        const token = getAccessTokenData();
        const time  = Math.floor(Date.now() / 1000);
        if (token.exp < time) {
            unsetAccessToken();
            unsetUser();
            return false;
        }

        setCurrentUser(token.data);
        if (token.data.language) {
            const oldLanguage = userLanguage;
            userLanguage = token.data.language;
            NLS.setLang(token.data.language);

            // The Urls are translated, so when the language changes in the middle of a session
            // the current one is translated too, or the Router finds no route and redirects
            if (oldLanguage && oldLanguage !== userLanguage) {
                translateLocation(oldLanguage, userLanguage);
            }
        }
        if (token.data.appearance) {
            setAppearance(token.data.appearance);
        }
        return true;

    } catch (e) {
        unsetAccessToken();
        unsetUser();
        return false;
    }
}

/**
 * Unsets the User
 * @returns {void}
 */
function unsetUser() {
    setCurrentUser({});
}

/**
 * Translates the current Location from one language to the other
 * @param {string} fromLang
 * @param {string} toLang
 * @returns {void}
 */
function translateLocation(fromLang, toLang) {
    const { pathname, search, hash } = window.location;
    const newPath = NLS.translateUrl(pathname, fromLang, toLang);
    if (newPath === pathname) {
        return;
    }

    // The Router only reads the Location again on a popstate, so one is sent after the
    // change, and it renders the new route together with the new language
    window.history.replaceState(window.history.state, "", `${newPath}${search}${hash}`);
    window.dispatchEvent(new PopStateEvent("popstate", { state : window.history.state }));
}



/**
 * Returns the Language
 * @returns {string}
 */
function getLanguage() {
    const language = NLS.getLang();
    return String(language);
}

/**
 * Returns the Timezone
 * @returns {string}
 */
function getTimezone() {
    const timezone = new Date().getTimezoneOffset();
    return String(-timezone);
}

/**
 * Sets the Appearance
 * @param {string} appearance
 * @returns {void}
 */
function setAppearance(appearance) {
    document.querySelector("body").className = `${appearance}-mode`;

    const meta  = document.querySelector('meta[name="theme-color"]');
    const color = meta.getAttribute(`${appearance}-mode`);
    if (color) {
        meta.setAttribute("content", color);
    }
}



// The public API
export default {
    init,
    unsetAll,

    getAccessToken,
    setAccessToken,

    getRefreshToken,
    setRefreshToken,

    getUser,
    setUser,

    getLanguage,
    getTimezone,
    setAppearance,
};
