import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import CircularLoader       from "../Loader/CircularLoader";



// Styles
const Container = Styled.div`
    flex-grow: 2;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--main-radius);
    background-color: var(--content-color);
`;



/**
 * The Page Loader Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageLoader(props) {
    const { className, variant } = props;

    return <Container className={className}>
        <CircularLoader variant={variant} />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PageLoader.propTypes = {
    className : PropTypes.string,
    variant   : PropTypes.string,
};

export default PageLoader;
