import React                from "react";
import PropTypes            from "prop-types";
import Styled, { keyframes } from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Dashboard
import Icon                 from "../Common/Icon";



// Styles
const appear = keyframes`
    from { opacity: 0; transform: translate(-50%, 4px); }
    to   { opacity: 1; transform: translate(-50%, 0); }
`;

const Container = Styled.span`
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    font-family: var(--main-font);
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    color: var(--tooltip-color);
    background-color: var(--tooltip-background);
    border-radius: var(--border-radius-small);
    transform: translate(-50%, 0);
    animation: ${appear} 0.15s ease-out;
    pointer-events: none;
    z-index: 1;
`;



/**
 * The Floating Tip, a small label with the colors of the Tooltip that floats above its
 * parent, which needs a relative position, to confirm an action like a copy
 * @param {object} props
 * @returns {React.ReactElement}
 */
function FloatingTip(props) {
    const { isHidden, className, icon, message } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        {!!icon && <Icon icon={icon} size="14" />}
        {NLS.get(message)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FloatingTip.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    icon      : PropTypes.string,
    message   : PropTypes.string.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
FloatingTip.defaultProps = {
    isHidden  : false,
    className : "",
};

export default FloatingTip;
