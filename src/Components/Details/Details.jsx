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
const Container = Styled.section.attrs(({ isInside, isWide, isLarge, hasExternalTabs, hasInternalTabs, withBorder, stickyBottom, atTop, atBottom }) => ({ isInside, isWide, isLarge, hasExternalTabs, hasInternalTabs, withBorder, stickyBottom, atTop, atBottom }))`
    --details-title-top: ${(props) => props.hasInternalTabs ? "var(--details-sticky-top)" : "0px"};
    --details-fade: 16px;
    --details-fade-top: ${(props) => props.atTop ? 0 : 1};
    --details-fade-bottom: ${(props) => props.atBottom ? 0 : 1};

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

    ${(props) => !props.stickyBottom && `
        &::after {
            content: "";
            position: sticky;
            bottom: calc(-1 * var(--details-spacing));
            flex-shrink: 0;
            height: var(--details-fade);
            margin-top: calc(-1 * var(--details-fade));
            margin-bottom: calc(-1 * var(--details-spacing));
            background: linear-gradient(transparent, var(--content-color));
            opacity: var(--details-fade-bottom);
            transition: opacity 0.2s;
            pointer-events: none;
        }
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

            ${(props) => props.stickyBottom && "padding-bottom: 0px;"}
        }
        z-index: var(--z-details);
    }
`;

const Dragger = Styled.div`
    position: sticky;
    top: 0;
    flex-shrink: 0;
    height: 0;
    z-index: 2;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: calc(-1 * var(--details-spacing));
        width: 6px;
        height: var(--details-height);
        cursor: col-resize;
    }
    &:hover::before {
        background-color: var(--primary-color);
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
        canEdit, onAction, collapsible, canCollapse, stickyBottom,
        resizable, resizeWidth, minWidth, maxWidth, children,
    } = props;

    const { isCollapsed } = Store.useState("core");
    const { setDetails, setCanCollapse } = Store.useAction("core");

    // Under the width of the details the panel floats over the page and is opened from
    // the Top Bar, so the collapse does not take it away
    const isForDetails = Responsive.useIsForDetails();
    const isShown      = !isHidden && (!canCollapse || !isCollapsed || isForDetails);


    // The References
    const ownRef     = React.useRef(null);
    const contentRef = passedRef || ownRef;
    const widthRef   = React.useRef(resizeWidth);
    const startRef   = React.useRef(0);

    // The Current State
    const [ atTop,    setAtTop    ] = React.useState(true);
    const [ atBottom, setAtBottom ] = React.useState(true);


    // A fade only makes sense while there is something to scroll to on that side, or it
    // washes out the content that is already at the end
    const updateFades = () => {
        const node = contentRef.current;
        if (node) {
            setAtTop(node.scrollTop <= 1);
            setAtBottom(node.scrollHeight - node.scrollTop - node.clientHeight <= 1);
        }
    };
    Utils.useScrollUpdate(contentRef, updateFades, [ isShown ]);


    // The width is the variable of the body that the panel and the main area share, so a
    // resize moves both, and the variable is removed when the panel goes away
    const widthVar = isLarge ? "--details-width-large" : (isWide ? "--details-width-wide" : "--details-width");
    const setWidth = (width) => {
        widthRef.current = width;
        document.body.style.setProperty(widthVar, `${width}px`);
    };

    React.useEffect(() => {
        if (!resizable || !isShown) {
            return undefined;
        }
        setWidth(widthRef.current);
        return () => document.body.style.removeProperty(widthVar);
    }, [ resizable, isShown, widthVar ]);


    // Handles the Grab
    const handleGrab = (e) => {
        Utils.unselectAll();
        startRef.current = e.clientX + widthRef.current;
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup",   handleDrop);
    };

    // Handles the Drag. The panel is at the right, so it grows when the mouse goes left
    const handleDrag = (e) => {
        Utils.unselectAll();
        const width = Math.min(maxWidth, Math.max(minWidth, startRef.current - e.clientX));
        setWidth(width);
    };

    // Handles the Drop
    const handleDrop = () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup",   handleDrop);
    };


    // Set/Unset the Details on Load/Unload, and if they can be collapsed from the Top Bar
    React.useEffect(() => {
        if (!isHidden) {
            setDetails(true);
            setCanCollapse(canCollapse, collapsible);
        }
        return () => {
            setDetails(false);
            setCanCollapse(false);
        };
    }, [ isHidden, canCollapse, collapsible ]);


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
    if (!isShown) {
        return <React.Fragment />;
    }
    return <Container
        ref={contentRef}
        className={`details ${className}`}
        atTop={atTop}
        atBottom={atBottom}
        isInside={isInside}
        isWide={isWide}
        isLarge={isLarge}
        hasExternalTabs={hasExternalTabs}
        hasInternalTabs={hasInternalTabs}
        withBorder={withBorder}
        stickyBottom={stickyBottom}
    >
        {resizable   && <Dragger onMouseDown={handleGrab} />}
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
    canCollapse     : PropTypes.bool,
    stickyBottom    : PropTypes.bool,
    resizable       : PropTypes.bool,
    resizeWidth     : PropTypes.number,
    minWidth        : PropTypes.number,
    maxWidth        : PropTypes.number,
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
    canCollapse     : false,
    stickyBottom    : false,
    resizable       : false,
    resizeWidth     : 440,
    minWidth        : 300,
    maxWidth        : 900,
};

export default Details;
