import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Pill                 from "./Pill";



// Styles
const Container = Styled(Pill)`
    gap: 7px;
    border-color: color-mix(in srgb, currentColor 40%, transparent);
    font-weight: 600;

    ${(props) => !props.isSmall && `
        padding: 5px 12px;
        font-size: 12px;
    `}
`;



/**
 * The Status Pill Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StatusPill(props) {
    const { isHidden, className, message, color, isSmall } = props;


    // Do the Render. The name comes already translated from the Backend, so it is
    // given as the content and not as the message, which would look it up
    return <Container
        isHidden={isHidden || !message}
        className={className}
        variant={color || "gray"}
        isSmall={isSmall}
        withDot
    >
        {message}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
StatusPill.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    message   : PropTypes.string,
    color     : PropTypes.string,
    isSmall   : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
StatusPill.defaultProps = {
    isHidden  : false,
    className : "",
    isSmall   : false,
};

export default StatusPill;
