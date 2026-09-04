import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import CircularLoader       from "../Loader/CircularLoader";
import ScrollFade           from "../Common/ScrollFade";



// Styles
const Container = Styled.main.attrs(({ isLoading, isCentered, isNarrow, withSpacing, bigSpacing, minHeight, fullHeight, hideFooter, noOverflow }) => ({ isLoading, isCentered, withSpacing, bigSpacing, isNarrow, minHeight, fullHeight, hideFooter, noOverflow }))`
    --dialog-content: var(--dialog-body);

    box-sizing: border-box;
    flex-grow: 2;
    max-height: var(--dialog-body);
    overscroll-behavior-y: none;

    ${(props) => (props.isLoading || props.isCentered) && `
        display: flex;
        justify-content: center;
        align-items: center;
    `}
    ${(props) => props.isLoading && `
        padding: 32px;
        --dialog-content: calc(var(--dialog-body) - 2 * 32px);
    `}
    ${(props) => props.withSpacing && `
        padding: 4px var(--dialog-padding);
        --dialog-content: calc(var(--dialog-body) - 2 * 4px);
    `}
    ${(props) => props.bigSpacing && `
        padding: var(--dialog-padding);
        --dialog-content: calc(var(--dialog-body) - 2 * var(--dialog-padding));
    `}
    ${(props) => ((props.withSpacing || props.bigSpacing) && props.hideFooter) && `
        padding-bottom: var(--dialog-padding);
    `}
    ${(props) => props.minHeight && `
        min-height: min(var(--dialog-body), ${props.minHeight}px);
    `}
    ${(props) => props.fullHeight && `
        height: var(--dialog-body);
    `}
    ${(props) => !props.noOverflow && `
        overflow: auto;
    `}

    @media (max-width: 500px) {
        --dialog-padding: 16px;

        ${(props) => props.hideFooter && "--dialog-footer: 0;"}
        ${(props) => !props.isNarrow && `
            height: calc(var(--full-height) - var(--dialog-header) - var(--dialog-footer));
            max-height: none;
        `}
    }
`;



/**
 * The Dialog Body Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogBody(props) {
    const {
        className, isLoading, loadingMessage,
        isCentered, isNarrow, bigSpacing, withSpacing,
        noOverflow, minHeight, fullHeight, hideFooter,
        withFade, passedRef, onScroll, children,
    } = props;

    // The References
    const defaultRef = React.useRef(null);
    const elementRef = passedRef || defaultRef;


    // Handle the Scroll
    const handleScroll = () => {
        if (onScroll && elementRef.current) {
            onScroll(elementRef.current);
        }
    };


    // Do the Render
    const content = <Container
        ref={elementRef}
        className={className}
        isLoading={isLoading}
        isCentered={isCentered}
        isNarrow={isNarrow}
        withSpacing={withSpacing}
        bigSpacing={bigSpacing}
        minHeight={minHeight}
        fullHeight={fullHeight}
        hideFooter={hideFooter}
        noOverflow={noOverflow}
        onScroll={handleScroll}
    >
        {isLoading ? <CircularLoader
            message={loadingMessage}
        /> : children}
    </Container>;

    if (withFade) {
        return <ScrollFade passedRef={elementRef}>
            {content}
        </ScrollFade>;
    }
    return content;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DialogBody.propTypes = {
    passedRef      : PropTypes.any,
    className      : PropTypes.string,
    isLoading      : PropTypes.bool,
    loadingMessage : PropTypes.string,
    isCentered     : PropTypes.bool,
    isNarrow       : PropTypes.bool,
    withSpacing    : PropTypes.bool,
    bigSpacing     : PropTypes.bool,
    minHeight      : PropTypes.number,
    fullHeight     : PropTypes.bool,
    noOverflow     : PropTypes.bool,
    hideFooter     : PropTypes.bool,
    withFade       : PropTypes.bool,
    onScroll       : PropTypes.func,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DialogBody.defaultProps = {
    className   : "",
    isLoading   : false,
    isCentered  : false,
    isNarrow    : false,
    withSpacing : false,
    bigSpacing  : false,
    fullHeight  : false,
    noOverflow  : false,
    hideFooter  : false,
    withFade    : false,
};

export default DialogBody;
