import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Dashboard
import AccordionList        from "../Accordion/AccordionList";



// Styles
const Container = Styled(AccordionList).attrs(({ withSpacing }) => ({ withSpacing }))`
    flex-grow: 2;
    overflow: auto;

    ${(props) => props.withSpacing && "padding: 16px;"}
`;



/**
 * The Page Accordion
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageAccordion(props) {
    const {
        initial, selected, onChange, maxWidth, noClose,
        withSpacing, hideAside, children,
    } = props;


    // Do the Render
    return <Container
        initial={initial}
        selected={selected}
        onChange={onChange}
        maxWidth={maxWidth}
        noClose={noClose}
        withSpacing={withSpacing}
        hideAside={hideAside}
    >
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PageAccordion.propTypes = {
    initial     : PropTypes.string,
    selected    : PropTypes.string,
    onChange    : PropTypes.func,
    maxWidth    : PropTypes.number,
    noClose     : PropTypes.bool,
    withSpacing : PropTypes.bool,
    hideAside   : PropTypes.bool,
    children    : PropTypes.any,
};

export default PageAccordion;
