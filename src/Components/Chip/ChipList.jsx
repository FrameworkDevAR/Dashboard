import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.ul`
    display: flex;
    flex-grow: 2;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4px;
    width: 100%;
`;



/**
 * The Chip List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ChipList(props) {
    const { passedRef, isHidden, className, children } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container ref={passedRef} className={`chips ${className}`}>
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ChipList.propTypes = {
    passedRef : PropTypes.any,
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ChipList.defaultProps = {
    isHidden  : false,
    className : "",
};

export default ChipList;
