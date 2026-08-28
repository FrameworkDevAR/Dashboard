// The initial State
const initialState = {
    loaders     : {},
    section     : "",
    redirect    : "/",
    showMenu    : false,
    smallNav    : false,
    hasDetails  : false,
    showDetails : false,
    result      : {
        open    : false,
        variant : "",
        message : "",
        param   : "",
    },
    tooltip     : {
        open      : false,
        targetRef : null,
        variant   : "",
        message   : "",
        maxWidth  : 0,
        delay     : 0,
        hasBreaks : false,
        isDark    : false,
    },
    error       : {
        open    : false,
        url     : "",
        method  : "",
        payload : {},
        message : "",
    },
};



// The Actions
const actions = {
    /**
     * Starts the Loader
     * @param {Function} dispatch
     * @param {string}   slice
     * @returns {void}
     */
    startLoader(dispatch, slice) {
        return dispatch({ type : "CORE_LOADING", slice, loading : true });
    },

    /**
     * Ends the Loader
     * @param {Function} dispatch
     * @param {string}   slice
     * @returns {void}
     */
    endLoader(dispatch, slice) {
        return dispatch({ type : "CORE_LOADING", slice, loading : false });
    },

    /**
     * Sets the Redirect
     * @param {Function} dispatch
     * @param {string}   redirect
     * @returns {void}
     */
    setRedirect(dispatch, redirect) {
        return dispatch({ type : "CORE_REDIRECT", redirect });
    },

    /**
     * Sets the Section
     * @param {Function} dispatch
     * @param {string}   section
     * @returns {void}
     */
    setSection(dispatch, section) {
        return dispatch({ type : "CORE_SECTION", section });
    },

    /**
     * Shows the Result
     * @param {Function} dispatch
     * @param {string}   variant
     * @param {string}   message
     * @param {string}   param
     * @returns {void}
     */
    showResult(dispatch, variant, message, param) {
        const result = { open : true, variant, message, param };
        dispatch({ type : "CORE_RESULT", result });
    },

    /**
     * Hides the Result
     * @param {Function} dispatch
     * @returns {void}
     */
    hideResult(dispatch) {
        const result = { ...initialState.result };
        return dispatch({ type : "CORE_RESULT", result });
    },

    /**
     * Shows the Tooltip
     * @param {Function} dispatch
     * @param {object}   targetRef
     * @param {string}   variant
     * @param {string}   message
     * @param {number}   maxWidth
     * @param {number}   delay
     * @param {boolean=} hasBreaks
     * @param {boolean=} isDark
     * @returns {void}
     */
    showTooltip(dispatch, targetRef, variant, message, maxWidth, delay, hasBreaks, isDark) {
        const tooltip = { open : true, targetRef, variant, message, maxWidth, delay, hasBreaks, isDark };
        return dispatch({ type : "CORE_TOOLTIP", tooltip });
    },

    /**
     * Hide the Tooltip
     * @param {Function} dispatch
     * @returns {void}
     */
    hideTooltip(dispatch) {
        const tooltip = { ...initialState.tooltip };
        return dispatch({ type : "CORE_TOOLTIP", tooltip });
    },

    /**
     * Shows the Error
     * @param {Function} dispatch
     * @param {string}   url
     * @param {string}   method
     * @param {object}   payload
     * @param {string}   message
     * @returns {void}
     */
    showError(dispatch, url, method, payload, message) {
        const error = { open : true, url, method, payload, message };
        dispatch({ type : "CORE_ERROR", error });
    },

    /**
     * Hides the Error
     * @param {Function} dispatch
     * @returns {void}
     */
    hideError(dispatch) {
        const error = { ...initialState.error };
        return dispatch({ type : "CORE_ERROR", error });
    },

    /**
     * Opens the Menu
     * @param {Function} dispatch
     * @returns {void}
     */
    openMenu(dispatch) {
        return dispatch({ type : "CORE_MENU_OPEN" });
    },

    /**
     * Closes the Menu
     * @param {Function} dispatch
     * @returns {void}
     */
    closeMenu(dispatch) {
        return dispatch({ type : "CORE_MENU_CLOSE" });
    },

    /**
     * Sets the Small Nav
     * @param {Function} dispatch
     * @param {boolean}  smallNav
     * @returns {void}
     */
    setSmallNav(dispatch, smallNav) {
        return dispatch({ type : "CORE_SMALL_NAV", smallNav });
    },

    /**
     * Sets the Details
     * @param {Function} dispatch
     * @param {boolean}  hasDetails
     * @returns {void}
     */
    setDetails(dispatch, hasDetails) {
        dispatch({ type : "CORE_DETAILS_SET", hasDetails });
    },

    /**
     * Opens the Details
     * @param {Function} dispatch
     * @returns {void}
     */
    openDetails(dispatch) {
        return dispatch({ type : "CORE_DETAILS_OPEN" });
    },

    /**
     * Closes the Details
     * @param {Function} dispatch
     * @returns {void}
     */
    closeDetails(dispatch) {
        return dispatch({ type : "CORE_DETAILS_CLOSE" });
    },
};



/**
 * The Reducer
 * @param {object=} state
 * @param {object=} action
 * @returns {object}
 */
const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
    case "CORE_LOADING":
        return {
            ...state,
            loaders  : {
                ...state.loaders,
                [action.slice] : action.loading,
            },
        };
    case "CORE_REDIRECT":
        return {
            ...state,
            redirect : action.redirect,
        };
    case "CORE_SECTION":
        return {
            ...state,
            section  : action.section,
        };
    case "CORE_RESULT":
        return {
            ...state,
            result   : action.result,
        };
    case "CORE_TOOLTIP":
        return {
            ...state,
            tooltip  : action.tooltip,
        };
    case "CORE_ERROR":
        return {
            ...state,
            error    : action.error,
        };


    // The Menu Actions
    case "CORE_MENU_OPEN":
        return {
            ...state,
            showMenu : true,
        };
    case "CORE_MENU_CLOSE":
        return {
            ...state,
            showMenu : false,
        };

    // The Navigation Actions
    case "CORE_SMALL_NAV":
        return {
            ...state,
            smallNav : action.smallNav,
        };

    // The Details Actions
    case "CORE_DETAILS_SET":
        return {
            ...state,
            hasDetails : action.hasDetails,
        };
    case "CORE_DETAILS_OPEN":
        return {
            ...state,
            showDetails : true,
        };
    case "CORE_DETAILS_CLOSE":
        return {
            ...state,
            showDetails : false,
        };

    default:
        return state;
    }
};




// The public API
export default { initialState, actions, reducer };
