import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Store                from "../../Core/Store";



// Styles
const Container = Styled.span.attrs(({ color }) => ({ color }))`
    flex-shrink: 0;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-top: -3px;
    margin-right: 8px;
    border: 1px solid ${(props) => `color-mix(in srgb, ${props.color} 75%, black)`};
    border-radius: 50%;
    background-color: ${(props) => props.color};
    vertical-align: middle;
`;



/**
 * The Circle Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Circle(props) {
    const {
        isHidden, className, color,
        tooltip, tooltipVariant, tooltipWidth, tooltipDelay,
    } = props;

    const elementRef = React.useRef(null);

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip, tooltipWidth, tooltipDelay);
        }
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={elementRef}
        className={`circle ${className}`}
        color={color}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Circle.propTypes = {
    isHidden       : PropTypes.bool,
    className      : PropTypes.string,
    color          : PropTypes.string.isRequired,
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    tooltipDelay   : PropTypes.number,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Circle.defaultProps = {
    isHidden  : false,
    className : "",
};

export default Circle;
