import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";

// Components
import Icon                 from "../Common/Icon";



// Constants. The Backend gives the color of a state with a name, and each one has a variant
const STATE_VARIANTS = {
    green  : "success",
    yellow : "warning",
    orange : "error-low",
    red    : "error",
    blue   : "primary",
    gray   : "gray",
};

// Styles
const Container = Styled.span.attrs(({ variant, isOutlined, isSmall, withDot, smallRadius }) => ({ variant, isOutlined, isSmall, withDot, smallRadius }))`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-sizing: border-box;
    padding: var(--pill-padding, 3px 10px);
    border: 1px solid transparent;
    border-radius: var(--pill-radius, 9999px);
    font-size: var(--pill-font-size, 13px);
    font-weight: 500;
    line-height: 1.4;
    white-space: nowrap;
    transition: all 0.2s;

    ${(props) => props.variant === "gray" ? `
        color: var(--font-lighter);
        background-color: var(--lighter-gray);
    ` : `
        color: var(--${props.variant}-color);
        background-color: color-mix(in srgb, currentColor 12%, transparent);
    `}

    ${(props) => props.isOutlined && `
        border-color: ${props.variant === "gray" ? "var(--light-gray)" : "currentColor"};
    `}
    ${(props) => props.isSmall && `
        --pill-padding: 2px 8px;
        --pill-font-size: 12px;
    `}
    ${(props) => props.smallRadius && `
        border-radius: var(--border-radius-small);
    `}
    ${(props) => props.withDot && `
        padding-left: 8px;

        &::before {
            content: "";
            flex-shrink: 0;
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background-color: ${props.variant === "gray" ? "var(--darker-gray)" : "currentColor"};
        }
    `}
`;

const PillIcon = Styled(Icon)`
    font-size: 1.2em;
`;



/**
 * The Pill Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Pill(props) {
    const {
        isHidden, className, variant, isOutlined, isSmall, withDot, smallRadius,
        icon, message, tooltip, tooltipVariant, tooltipWidth, tooltipDelay, tooltipBreaks,
        children,
    } = props;

    const elementRef = React.useRef(null);

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip, tooltipWidth, tooltipDelay, tooltipBreaks);
        }
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={elementRef}
        onMouseEnter={tooltip ? handleTooltip : undefined}
        onMouseLeave={tooltip ? hideTooltip : undefined}
        className={`pill ${className}`}
        variant={STATE_VARIANTS[variant] || variant || "gray"}
        isOutlined={isOutlined}
        isSmall={isSmall}
        withDot={withDot}
        smallRadius={smallRadius}
    >
        {!!icon && <PillIcon icon={icon} />}
        {message ? NLS.get(message) : children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Pill.propTypes = {
    isHidden       : PropTypes.bool,
    className      : PropTypes.string,
    variant        : PropTypes.string,
    isOutlined     : PropTypes.bool,
    isSmall        : PropTypes.bool,
    withDot        : PropTypes.bool,
    smallRadius    : PropTypes.bool,
    icon           : PropTypes.string,
    message        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    tooltipDelay   : PropTypes.number,
    tooltipBreaks  : PropTypes.bool,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Pill.defaultProps = {
    className : "",
    variant   : "gray",
};

export default Pill;
