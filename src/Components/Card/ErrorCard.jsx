import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Card                 from "./Card";



// Styles
const Container = Styled(Card)`
    border-color: var(--error-color);
    color: var(--error-text-color);

    h3 {
        margin-bottom: 12px;
    }
`;



/**
 * The Error Card Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ErrorCard(props) {
    const { isHidden, className, message, children } = props;


    // Do the Render
    if (isHidden || !children) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        message={message}
    >
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ErrorCard.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    message   : PropTypes.string,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ErrorCard.defaultProps = {
    isHidden  : false,
    className : "",
    message   : "GENERAL_ONE_ERROR",
};

export default ErrorCard;
