import React                 from "react";
import PropTypes             from "prop-types";
import Styled, { keyframes } from "styled-components";

// Components
import ReportBar             from "../Reports/ReportBar";



// Animations
const slide = keyframes`
    from { transform: translateX(-100%); }
    to   { transform: translateX(250%); }
`;

// Styles
const WaitingBar = Styled(ReportBar)`
    > * {
        animation: ${slide} 1.2s ease-in-out infinite;
    }
`;



/**
 * The Linear Loader Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function LinearLoader(props) {
    const { isHidden, className, percent, isWaiting } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }

    // While there is no percent to show, a part of the bar slides along it
    if (isWaiting) {
        return <WaitingBar
            className={className}
            percent={40}
        />;
    }
    return <ReportBar
        className={className}
        percent={percent}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
LinearLoader.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    percent   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isWaiting : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
LinearLoader.defaultProps = {
    isHidden  : false,
    className : "",
    percent   : 0,
    isWaiting : false,
};

export default LinearLoader;
