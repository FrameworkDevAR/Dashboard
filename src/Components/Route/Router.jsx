import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Router
import {
    Routes, Route, Navigate, useParams,
} from "react-router-dom";



/**
 * The Redirect of the Router, which goes to its first Route
 * @param {object} props
 * @returns {React.ReactElement}
 */
function RouterRedirect(props) {
    const { to, isQuiet } = props;

    const params = useParams();
    const rest   = params["*"] || "";

    // Only the base Url is meant to land here, so a rest is a link that no Route matches,
    // which would otherwise go to the first Route without a word
    React.useEffect(() => {
        if (rest && !isQuiet && import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn(`No Route matches "${rest}", so it went to "${to}"`);
        }
    }, [ rest ]);

    return <Navigate to={to} replace />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
RouterRedirect.propTypes = {
    to      : PropTypes.string.isRequired,
    isQuiet : PropTypes.bool,
};



/**
 * The Router Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Router(props) {
    const { initialUrl, type, noFirst, quietRedirect, children } = props;


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
            element={<RouterRedirect to={firstPath} isQuiet={quietRedirect} />}
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
    initialUrl    : PropTypes.string,
    type          : PropTypes.string,
    noFirst       : PropTypes.bool,
    quietRedirect : PropTypes.bool,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Router.defaultProps = {
    initialUrl    : "",
    type          : "",
    noFirst       : false,
    quietRedirect : false,
};

export default Router;
