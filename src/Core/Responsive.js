import React                from "react";

// Core
import Store                from "./Store";



/**
 * The width for Mobile
 * @constant {number}
 */
const WIDTH_FOR_MOBILE = 700;

/**
 * The width to hide the Menu
 * @constant {number}
 */
const WIDTH_FOR_MENU = 1000;

/**
 * The width to hide the Details
 * @constant {number}
 */
const WIDTH_FOR_DETAILS = 1200;

/**
 * The width to hide the Details
 * @constant {number}
 */
const WIDTH_FOR_WIDE_DETAILS = 1600;



/**
 * The Media Query Lists, shared by every component that uses the same query
 * @type {{[key: string]: MediaQueryList}}
 */
const mediaQueries = {};



/**
 * Returns the Media Query List of the given query, created the first time it is asked for
 * @param {string} query
 * @returns {MediaQueryList}
 */
function getMediaQuery(query) {
    if (!mediaQueries[query]) {
        mediaQueries[query] = window.matchMedia(query);
    }
    return mediaQueries[query];
}

/**
 * Hook that answers if the given Media Query matches, which updates when it stops or starts matching
 * @param {string} query
 * @returns {boolean}
 */
function useMediaQuery(query) {
    // It only renders again when the width crosses the query, and not on every pixel of a resize
    const subscribe = React.useCallback((onChange) => {
        const media = getMediaQuery(query);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, [ query ]);

    return React.useSyncExternalStore(subscribe, () => getMediaQuery(query).matches);
}

/**
 * Hook to determine if the current width is for the Mobile
 * @returns {boolean}
 */
function useIsForMobile() {
    return useMediaQuery(`(max-width: ${WIDTH_FOR_MOBILE}px)`);
}

/**
 * Hook to determine if the current width is for the Menu
 * @returns {boolean}
 */
function useIsForMenu() {
    return useMediaQuery(`(max-width: ${WIDTH_FOR_MENU}px)`);
}

/**
 * Hook to determine if the current width is for the Details
 * @returns {boolean}
 */
function useIsForDetails() {
    return useMediaQuery(`(max-width: ${WIDTH_FOR_DETAILS}px)`);
}

/**
 * Hook to determine if the current width is for the Wide Details
 * @param {number=} width
 * @returns {boolean}
 */
function useIsForWideDetails(width = WIDTH_FOR_WIDE_DETAILS) {
    return useMediaQuery(`(min-width: ${width}px)`);
}

/**
 * Hook to determine if the Details of the page take their space, as they can be collapsed
 * @param {boolean} withDetails
 * @returns {boolean}
 */
function useShowDetails(withDetails) {
    const { isCollapsed } = Store.useState("core");
    const isForDetails = useIsForDetails();

    // Under the width of the details they float over the page, so the collapse does not take them away
    return Boolean(withDetails && (!isCollapsed || isForDetails));
}



// The Public API
export default {
    WIDTH_FOR_MOBILE,
    WIDTH_FOR_MENU,
    WIDTH_FOR_DETAILS,
    WIDTH_FOR_WIDE_DETAILS,

    useMediaQuery,
    useIsForMobile,
    useIsForMenu,
    useIsForDetails,
    useIsForWideDetails,
    useShowDetails,
};
