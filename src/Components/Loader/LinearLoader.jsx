import React                 from "react";
import PropTypes             from "prop-types";
import Styled, { keyframes } from "styled-components";

// Variants
const Variant = {
    PRIMARY : "primary",
    ERROR   : "error",
};



// Animations
const slide = keyframes`
    from { transform: translateX(-100%); }
    to   { transform: translateX(250%); }
`;

// Styles
const Track = Styled.div`
    flex-shrink: 0;
    height: 8px;
    border-radius: 4px;
    background-color: var(--lighter-gray);
    overflow: hidden;
`;

const Fill = Styled.div.attrs(({ variant }) => ({ variant }))`
    height: 100%;
    border-radius: 4px;
    background-color: ${(props) => props.variant === Variant.ERROR ? "var(--error-color)" : "var(--primary-color)"};
    transition: width 0.2s;
`;

const WaitingFill = Styled(Fill)`
    width: 40%;
    animation: ${slide} 1.2s ease-in-out infinite;
`;



/**
 * The Linear Loader Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function LinearLoader(props) {
    const { isHidden, className, variant, percent, isWaiting } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }

    // A percent outside of the bar would draw past its ends
    const width = Math.min(100, Math.max(0, Number(percent) || 0));
    return <Track className={className}>
        {isWaiting ? <WaitingFill variant={variant} /> : <Fill
            variant={variant}
            style={{ width : `${width}%` }}
        />}
    </Track>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
LinearLoader.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    variant   : PropTypes.string,
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
    variant   : Variant.PRIMARY,
    percent   : 0,
    isWaiting : false,
};

export default LinearLoader;
