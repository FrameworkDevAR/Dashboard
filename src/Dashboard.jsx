import React                from "react";
import PropTypes            from "prop-types";
import { BrowserRouter }    from "react-router-dom";

// Core
import Store                from "./Core/Store";
import Initializer          from "./Core/Initializer";

// Components
import Result               from "./Components/Core/Result";
import Tooltip              from "./Components/Core/Tooltip";
import Unsaved              from "./Components/Core/Unsaved";
import Error                from "./Components/Core/Error";



/**
 * The Dashboard Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Dashboard(props) {
    const { baseUrl, store, children } = props;


    // Do the Render
    return <BrowserRouter basename={baseUrl}>
        <Store.Provider config={store}>
            <Initializer {...props} />
            <Result />
            <Tooltip />
            <Unsaved />
            {children}
            <Error />
        </Store.Provider>
    </BrowserRouter>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Dashboard.propTypes = {
    store    : PropTypes.object.isRequired,
    url      : PropTypes.string,
    baseUrl  : PropTypes.string,
    apiUrl   : PropTypes.string,
    routeUrl : PropTypes.string,
    actions  : PropTypes.array,
    params   : PropTypes.object,
    children : PropTypes.any,
};

export default Dashboard;
