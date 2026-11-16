import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Banner               from "../Common/Banner";



// Styles
const Container = Styled.section.attrs(({ withMaxWidth, hasTabs, hasPills, withBorder }) => ({ withMaxWidth, hasTabs, hasPills, withBorder }))`
    box-sizing: border-box;
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    height: var(--page-height);

    ${(props) => props.hasTabs && "height: var(--page-height-tabs);"}
    ${(props) => props.hasPills && "height: var(--page-height-pills);"}
    ${(props) => props.withMaxWidth && "max-width: var(--page-max-width);"}

    ${(props) => props.withBorder && `
        border: var(--border-width) solid var(--border-color-light);
        border-radius: var(--border-radius);
    `}
`;



/**
 * The Page Container. With the max width it is as wide as the --page-max-width, so its content,
 * like an Accordion, and the buttons of the Page end at the same place
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageContainer(props) {
    const { className, withMaxWidth, hasTabs, hasPills, withBorder, error, children } = props;


    // Do the Render
    return <Container
        className={className}
        withMaxWidth={withMaxWidth}
        hasTabs={hasTabs}
        hasPills={hasPills}
        withBorder={withBorder}
    >
        <Banner
            variant="error"
            message={error}
            bottomSpace={12}
            isTight
        />

        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PageContainer.propTypes = {
    className    : PropTypes.string,
    withMaxWidth : PropTypes.bool,
    hasTabs      : PropTypes.bool,
    hasPills     : PropTypes.bool,
    withBorder   : PropTypes.bool,
    error        : PropTypes.string,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PageContainer.defaultProps = {
    className    : "",
    withMaxWidth : false,
    hasTabs      : false,
    hasPills     : false,
    withBorder   : false,
    error        : "",
};

export default PageContainer;
