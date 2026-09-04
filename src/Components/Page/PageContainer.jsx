import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Alert                from "../Form/Alert";



// Styles
const Container = Styled.section.attrs(({ hasTabs, hasPills, withBorder }) => ({ hasTabs, hasPills, withBorder }))`
    box-sizing: border-box;
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    height: var(--page-height);

    ${(props) => props.hasTabs && "height: var(--page-height-tabs);"}
    ${(props) => props.hasPills && "height: var(--page-height-pills);"}

    ${(props) => props.withBorder && `
        border: var(--border-width) solid var(--border-color-light);
        border-radius: var(--border-radius);
    `}
`;

const AlertText = Styled(Alert)`
    margin-bottom: 12px;
`;



/**
 * The Page Container
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageContainer(props) {
    const { className, hasTabs, hasPills, withBorder, error, children } = props;


    // Do the Render
    return <Container
        className={className}
        hasTabs={hasTabs}
        hasPills={hasPills}
        withBorder={withBorder}
    >
        <AlertText variant="error" message={error} />

        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PageContainer.propTypes = {
    className  : PropTypes.string,
    hasTabs    : PropTypes.bool,
    hasPills   : PropTypes.bool,
    withBorder : PropTypes.bool,
    error      : PropTypes.string,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PageContainer.defaultProps = {
    className  : "",
    hasTabs    : false,
    hasPills   : false,
    withBorder : false,
    error      : "",
};

export default PageContainer;
