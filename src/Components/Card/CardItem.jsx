import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";



// Styles
const Container = Styled.div`
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 6px 0;
`;

const Label = Styled.div`
    flex: none;
    width: 150px;
    font-size: var(--font-size-small);
    color: var(--font-lighter);
`;

const Value = Styled.div`
    flex: 1;
    font-weight: 500;
    color: var(--title-color);
    overflow-wrap: anywhere;
`;



/**
 * The Card Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function CardItem(props) {
    const { isHidden, className, label, message, children } = props;


    // Do the Render
    if (isHidden || (!message && !children)) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        <Label>{NLS.get(label)}</Label>
        <Value>{message ? NLS.get(String(message)) : children}</Value>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
CardItem.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    label     : PropTypes.string,
    message   : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
CardItem.defaultProps = {
    isHidden  : false,
    className : "",
};

export default CardItem;
