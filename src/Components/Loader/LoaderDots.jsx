import React                from "react";
import PropTypes            from "prop-types";

// Styled
import Styled, {
    keyframes, css,
} from "styled-components";



// Animations
const dots = keyframes`
    0%, 20% {
        color: transparent;
        text-shadow: 0.25em 0 0 transparent, 0.5em 0 0 transparent;
    }
    40% {
        color: var(--dots-color);
        text-shadow: 0.25em 0 0 transparent, 0.5em 0 0 transparent;
    }
    60% {
        text-shadow: 0.25em 0 0 var(--dots-color), 0.5em 0 0 transparent;
    }
    80%, 100% {
        text-shadow: 0.25em 0 0 var(--dots-color), 0.5em 0 0 var(--dots-color);
    }
`;

// The Styles to animate the Dots after the content of an element, for the
// cases where the Component can't be used, like the ones with an html content
export const dotsStyle = css`
    &::after {
        content: " .";
        animation: ${dots} 1s steps(5, end) infinite;
    }
`;

// Styles
const Container = Styled.span`
    ${dotsStyle}
`;



/**
 * The Loader Dots Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function LoaderDots(props) {
    const { isHidden, className } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className} />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
LoaderDots.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
LoaderDots.defaultProps = {
    isHidden  : false,
    className : "",
};

export default LoaderDots;
