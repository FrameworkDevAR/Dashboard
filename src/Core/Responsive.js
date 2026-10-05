import React                from "react";



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
 * Hook that answers if the given Media Query matches, which updates when it stops or starts matching
 * @param {string} query
 * @returns {boolean}
 */
function useMediaQuery(query) {
    // It only renders again when the width crosses the query, and not on every pixel of a resize
    const subscribe = React.useCallback((onChange) => {
        const media = window.matchMedia(query);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, [ query ]);

    return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
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
};
