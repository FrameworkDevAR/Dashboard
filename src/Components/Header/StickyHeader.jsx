import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Backdrop = Styled.div`
    position: sticky;
    top: 0;
    background-color: var(--background-color);
    z-index: var(--z-input);
`;

const Container = Styled.header.attrs(({ isConnected }) => ({ isConnected }))`
    margin-bottom: var(--main-margin);
    padding: 0 var(--main-padding) var(--main-padding);
    border-radius: var(--main-radius);
    background-color: var(--content-color);

    & > header {
        padding-left: 0;
        padding-right: 0;
    }
    & > header:last-child,
    & > header:has(+ .backdrop:last-child) {
        height: calc(var(--header-height) - var(--main-padding) / 2);
        padding-bottom: 0;
    }
    & > :last-child,
    & > :has(+ .backdrop:last-child) {
        margin-bottom: 0;
    }

    ${(props) => props.isConnected && `
        margin-bottom: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    `}
`;



/**
 * The Sticky Header
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StickyHeader(props) {
    const { className, isConnected, children } = props;


    // Do the Render
    return <Backdrop className={className}>
        <Container isConnected={isConnected}>
            {children}
        </Container>
    </Backdrop>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
StickyHeader.propTypes = {
    className   : PropTypes.string,
    isConnected : PropTypes.bool,
    children    : PropTypes.any,
};

export default StickyHeader;
