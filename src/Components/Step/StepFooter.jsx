import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.footer`
    position: sticky;
    bottom: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 16px;
    background-color: var(--content-color);
`;



/**
 * The Step Footer Component, which stays at the bottom while the content scrolls
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StepFooter(props) {
    const { isHidden, className, children } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
StepFooter.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
StepFooter.defaultProps = {
    isHidden  : false,
    className : "",
};

export default StepFooter;
