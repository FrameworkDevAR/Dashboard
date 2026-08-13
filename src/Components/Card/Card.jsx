import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";



// Styles
const Container = Styled.section`
    padding: 16px 18px;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-medium);
`;

const Title = Styled.h3`
    margin: 0 0 6px 0;
    font-size: var(--font-size-small);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--title-color);
`;



/**
 * The Card Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Card(props) {
    const { isHidden, className, message, children } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        {!!message && <Title>{NLS.get(message)}</Title>}
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Card.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    message   : PropTypes.string,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Card.defaultProps = {
    isHidden  : false,
    className : "",
};

export default Card;
