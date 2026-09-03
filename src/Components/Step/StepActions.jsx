import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
`;



/**
 * The Step Actions Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StepActions(props) {
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
StepActions.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
StepActions.defaultProps = {
    isHidden  : false,
    className : "",
};

export default StepActions;
