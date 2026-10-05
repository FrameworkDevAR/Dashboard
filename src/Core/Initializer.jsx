import React                from "react";
import PropTypes            from "prop-types";

// Core
import Action               from "../Core/Action";
import Ajax                 from "../Core/Ajax";
import Auth                 from "../Core/Auth";
import Files                from "../Core/Files";
import Navigate             from "../Core/Navigate";
import NLS                  from "../Core/NLS";
import Store                from "../Core/Store";



/**
 * The Initializer
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Initializer(props) {
    const { url, apiUrl, routeUrl, actions, params, maxSize, maxVideoSize } = props;

    const { error } = Store.useState("core");

    const { showResult, showError } = Store.useAction("core");
    const { setCurrentUser } = Store.useAction("auth");


    // Show a Result
    const onResult = (variant, message, param) => {
        showResult(variant, message, param);
    };

    // Show an Error
    const onError = (url, method, payload, message) => {
        if (!error.open) {
            showError(url, method, payload, message);
        }
    };

    // Sets the Current User
    const onUserChange = (user) => {
        if (setCurrentUser) {
            setCurrentUser(user);
        }
    };

    // The sizes are set while rendering, as the pages below check them in their first render
    Files.init(maxSize, maxVideoSize);

    // Initialize the Modules once
    React.useEffect(() => {
        Ajax.init(apiUrl, routeUrl, onResult, onError);
        Action.init(actions);
        Navigate.init(url, params);
        Auth.init(onUserChange);
        NLS.init(url);
    }, []);


    // Do not Render anything
    return <React.Fragment />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Initializer.propTypes = {
    url          : PropTypes.string,
    apiUrl       : PropTypes.string,
    routeUrl     : PropTypes.string,
    actions      : PropTypes.array,
    params       : PropTypes.object,
    maxSize      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxVideoSize : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Initializer.defaultProps = {
    url          : "",
    apiUrl       : "",
    routeUrl     : "",
    actions      : [],
    params       : {},
    maxSize      : 0,
    maxVideoSize : 0,
};

export default Initializer;
