import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.footer`
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    padding: 8px 0 0;
    gap: 8px;
`;



/**
 * The Page Footer
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageFooter(props) {
    const { isHidden, children } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container>
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PageFooter.propTypes = {
    isHidden : PropTypes.bool,
    children : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PageFooter.defaultProps = {
    isHidden : false,
};

export default PageFooter;
