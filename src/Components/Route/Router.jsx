import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Router
import {
    Routes, Route, Navigate,
} from "react-router-dom";



/**
 * The Router Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Router(props) {
    const { initialUrl, type, noFirst, children } = props;


    // Create the Routes
    const routes      = [];
    let   firstPath   = initialUrl ? NLS.url(initialUrl) : "";
    let   canRedirect = true;

    for (const [ key, child ] of Utils.getVisibleEntries(children)) {
        let paths = [];
        if (Array.isArray(child.props.url)) {
            paths = child.props.url.map((u) => NLS.url(u));
        } else {
            paths = [ NLS.url(child.props.url) ];
        }

        for (let path of paths) {
            if (path === "/") {
                canRedirect = false;
            }
            if (!firstPath && !noFirst) {
                firstPath = path;
            }
            if (!child.props.exact) {
                path += "/*";
            }

            routes.push(<Route
                key={key}
                path={path}
                element={React.cloneElement(child, { type })}
            />);
        }
    }

    if (canRedirect && firstPath) {
        routes.push(<Route
            key="redirect"
            path="*"
            element={<Navigate to={firstPath} replace />}
        />);
    }


    // Do the Render
    return <Routes>
        {routes}
    </Routes>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Router.propTypes = {
    initialUrl : PropTypes.string,
    type       : PropTypes.string,
    noFirst    : PropTypes.bool,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Router.defaultProps = {
    initialUrl : "",
    type       : "",
    noFirst    : false,
};

export default Router;
