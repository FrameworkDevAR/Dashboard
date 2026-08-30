import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import CircularLoader       from "../Loader/CircularLoader";



// Styles
const Container = Styled.section.attrs(({ isInside, isWide, isLarge, hasExternalTabs, hasInternalTabs, withBorder, stickyBottom }) => ({ isInside, isWide, isLarge, hasExternalTabs, hasInternalTabs, withBorder, stickyBottom }))`
    --details-title-top: ${(props) => props.hasInternalTabs ? "var(--details-sticky-top)" : "0px"};
    --details-fade: 16px;

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: ${(props) => props.isLarge ? "var(--details-width-large)" : (props.isWide ? "var(--details-width-wide)" : "var(--details-width)")};
    height: var(--details-height);
    padding: var(--details-spacing);
    padding-top: 0px;
    background-color: var(--content-color);
    overflow: auto;

    ${(props) => props.isInside ? `
        --details-height: ${props.hasExternalTabs ? "var(--page-height-tabs)" : "var(--page-height)"};
    ` : `
        --details-height: var(--main-height);

        margin-right: var(--main-margin);
        border-radius: var(--main-radius);
    `}

    ${(props) => props.withBorder && `
        border-radius: var(--border-radius);
        border: 1px solid var(--details-border-color);
    `}

    ${(props) => props.stickyBottom && `
        padding-bottom: 0px;
    `}

    @media (max-width: ${Responsive.WIDTH_FOR_DETAILS}px) {
        & {
            display: none;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            height: auto;
            max-width: 90%;
            padding: var(--details-spacing);
            padding-top: 0px;
            margin-right: 0;
            border-radius: 0;
        }
        z-index: var(--z-details);
    }
`;

const Loading = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    background-color: var(--content-color);
    border-radius: var(--border-radius);
    overflow: hidden;
`;

const Error = Styled.div`
    margin: 0;
    padding: 16px;
    color: var(--error-color);
    text-align: center;
    background-color: var(--content-color);
    border-radius: 3px;
`;



/**
 * The Details Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Details(props) {
    const {
        passedRef, className, isHidden, isInside, isWide, isLarge,
        hasInternalTabs, hasExternalTabs, withBorder,
        isLoading, isEmpty, hasError, error,
        canEdit, onAction, collapsible, stickyBottom, children,
    } = props;

    const { setDetails } = Store.useAction("core");


    // Set/Unset the Details on Load/Unload
    React.useEffect(() => {
        if (!isHidden) {
            setDetails(true);
        }
        return () => setDetails(false);
    }, [ isHidden ]);


    // Parse the Items
    const showError   = !isLoading && hasError;
    const showContent = !isLoading && !hasError && !isEmpty;

    let items = children;
    if (collapsible || canEdit || onAction) {
        items = Utils.cloneChildren(children, (child) => ({
            collapsible, onAction,
            canEdit : canEdit || child.props.canEdit,
        }));
    }


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={passedRef}
        className={`details ${className}`}
        isInside={isInside}
        isWide={isWide}
        isLarge={isLarge}
        hasExternalTabs={hasExternalTabs}
        hasInternalTabs={hasInternalTabs}
        withBorder={withBorder}
        stickyBottom={stickyBottom}
    >
        {isLoading   && <Loading><CircularLoader /></Loading>}
        {showError   && <Error>{NLS.get(error)}</Error>}
        {showContent && items}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Details.propTypes = {
    passedRef       : PropTypes.any,
    className       : PropTypes.string,
    isHidden        : PropTypes.bool,
    isInside        : PropTypes.bool,
    isWide          : PropTypes.bool,
    isLarge         : PropTypes.bool,
    hasExternalTabs : PropTypes.bool,
    hasInternalTabs : PropTypes.bool,
    withBorder      : PropTypes.bool,
    isLoading       : PropTypes.bool,
    isEmpty         : PropTypes.bool,
    hasError        : PropTypes.bool,
    error           : PropTypes.string,
    canEdit         : PropTypes.bool,
    onAction        : PropTypes.func,
    collapsible     : PropTypes.string,
    stickyBottom    : PropTypes.bool,
    children        : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Details.defaultProps = {
    className       : "",
    isHidden        : false,
    isInside        : false,
    isWide          : false,
    isLarge         : false,
    hasExternalTabs : false,
    hasInternalTabs : false,
    withBorder      : false,
    isLoading       : false,
    isEmpty         : false,
    hasError        : false,
    stickyBottom    : false,
};

export default Details;
