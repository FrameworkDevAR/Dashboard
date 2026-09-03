import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Dashboard
import AccordionList        from "../Accordion/AccordionList";
import ScrollFade           from "../Common/ScrollFade";



// Styles
const Container = Styled(AccordionList).attrs(({ withSpacing }) => ({ withSpacing }))`
    flex-grow: 2;
    min-height: 0;
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
        withSpacing, hideAside, header, children,
    } = props;


    // The References
    const contentRef = React.useRef(null);


    // Do the Render
    return <ScrollFade passedRef={contentRef}>
        <Container
            passedRef={contentRef}
            initial={initial}
            selected={selected}
            onChange={onChange}
            maxWidth={maxWidth}
            noClose={noClose}
            withSpacing={withSpacing}
            hideAside={hideAside}
            header={header}
        >
            {children}
        </Container>
    </ScrollFade>;
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
    header      : PropTypes.any,
    children    : PropTypes.any,
};

export default PageAccordion;
