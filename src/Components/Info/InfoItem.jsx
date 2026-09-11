import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";



// Styles
const Container = Styled.section`
    font-size: 13px;
    color: var(--font-light);
`;

const Title = Styled.h3`
    margin: 0;
    color: var(--title-color);
    font-size: 13px;
`;



/**
 * The Info Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InfoItem(props) {
    const { className, label, message, textColor, children } = props;


    // Do the Render
    if (!message && !children) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        <Title>{NLS.get(label)}</Title>
        {children || <span className={`${textColor ? `text-${textColor}` : ""}`}>{NLS.get(message)}</span>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InfoItem.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    label     : PropTypes.string.isRequired,
    message   : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    textColor : PropTypes.string,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InfoItem.defaultProps = {
    isHidden : false,
};

export default InfoItem;
