import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import KeyCode              from "../../Utils/KeyCode";
import Utils                from "../../Utils/Utils";

// Components
import DialogFooter         from "./DialogFooter";
import Backdrop             from "../Common/Backdrop";
import TabList              from "../Tab/TabList";

// Module Variables
let dialogLevel = 0;



// Styles
const Container = Styled(Backdrop).attrs(({ zIndex, hasFooter }) => ({ zIndex, hasFooter }))`
    ${(props) => !props.hasFooter && "--dialog-footer: 0px;"}

    --dialog-tabs: 0px;
    --dialog-height: calc(var(--full-height) - var(--dialog-spacing) * 2);
    --dialog-body: calc(var(--dialog-height) - var(--dialog-header) - var(--dialog-tabs) - var(--dialog-footer));

    padding: var(--dialog-spacing);
    z-index: ${(props) => props.zIndex ? props.zIndex : "var(--z-dialog)"};

    @media (max-width: 500px) {
        padding: 0;
    }
`;

const Content = Styled.dialog.attrs(({ width, isWide, isNarrow, hasTabs, isClosing }) => ({ width, isWide, isNarrow, hasTabs, isClosing }))`
    position: static;
    display: block;
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 600px;
    min-height: calc(var(--dialog-header) + var(--dialog-footer) + 20px);
    max-height: var(--full-height);
    border: none;
    border-radius: var(--dialog-radius);
    background-color: var(--content-color);
    color: var(--black-color);
    transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1);

    &[open]:not(:focus-within) {
        background-color: var(--content-color);
        transition: background-color 0.01s;
    }

    ${(props) => props.width    ?  `max-width: ${props.width}px;` : ""}
    ${(props) => props.isWide   && "max-width: 1000px;"}
    ${(props) => props.isNarrow && "max-width: 400px;"}
    ${(props) => props.hasTabs  && "--dialog-tabs: var(--tabs-dialog);"}

    @media (max-width: 500px) {
        ${(props) => props.isNarrow ? `
            width: 95vw;
            max-width: none;
        ` : `
            --dialog-spacing: 0;
            --dialog-radius: 0;

            width: 100%;
            height: var(--full-height);
            max-width: none;
            max-height: none;
        `}
    }
`;



/**
 * The Dialog Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Dialog(props) {
    const {
        open, className, isLoading, loadingMessage,
        width, isWide, isNarrow, noTab, zIndex, aside,
        dontClose, dontBackClose, onClose, hasFooter, children,
    } = props;


    // The References
    const contentRef   = React.useRef(null);
    const savedHandler = React.useRef(null);

    // The Current State
    const [ level,     setLevel   ] = React.useState(0);
    const [ opened,    setOpened  ] = React.useState(false);
    const [ isClosing, setClosing ] = React.useState(false);


    // Handles the Dialog Close from the Backdrop
    const handleBackClose = () => {
        if (dontBackClose) {
            return;
        }
        handleClose();
    };

    // Handles the Dialog Close
    const handleClose = () => {
        if (dontClose || isClosing || dialogLevel !== level) {
            return;
        }

        // setOpened(false);
        setClosing(true);
        window.setTimeout(() => {
            setClosing(false);
            onClose();
        }, 200);
    };

    // Handle the Key
    const handleKey = (e) => {
        if (!open || isClosing || dialogLevel !== level) {
            return;
        }

        if (!noTab && e.which === KeyCode.DOM_VK_TAB) {
            if (e.target.closest(".dialog") === null) {
                const focusable = contentRef.current.querySelectorAll("input, a, button");
                const backward  = e.shiftKey;
                const target    = backward ? focusable[focusable.length - 1] : focusable[0];
                target.focus();
                e.preventDefault();
            }
        } else if (e.which === KeyCode.DOM_VK_ESCAPE) {
            handleClose();
            e.preventDefault();
        }
    };

    // Handles the Mouse Down
    const handleMouseDown = (e) => {
        e.stopPropagation();
    };


    // Update the Handler if the function changes
    React.useEffect(() => {
        // @ts-ignore
        savedHandler.current = handleKey;
    }, [ handleKey ]);

    // Handle the Level and Key event when open changes
    React.useEffect(() => {
        // @ts-ignore
        const eventListener = (e) => savedHandler.current(e);

        if (open) {
            dialogLevel += 1;
            setLevel(dialogLevel);
            setOpened(true);
            window.addEventListener("keyup", eventListener);
        } else if (opened) {
            dialogLevel -= 1;
            setOpened(false);
            setLevel(0);
            window.removeEventListener("keyup", eventListener);
        }
        return () => window.removeEventListener("keyup", eventListener);
    }, [ open ]);



    // No need to continue
    if (!open) {
        return <React.Fragment />;
    }


    // Variables
    const showAside  = open && !isClosing && !isLoading;
    const items      = [];
    let   hasTabs    = false;
    let   withFooter = Boolean(hasFooter);

    for (const [ key, child ] of Utils.getChildren(children).entries()) {
        if (child.type === TabList) {
            hasTabs = true;
        } else if (child.type === DialogFooter) {
            withFooter = true;
        }
        items.push(React.cloneElement(child, {
            key, isLoading, loadingMessage, isNarrow, dontClose,
            onClose : handleClose,
        }));
    }


    // Do the Render
    return <Container
        open={open}
        contentRef={contentRef}
        zIndex={zIndex}
        hasFooter={withFooter}
        isClosing={isClosing}
        onClose={handleBackClose}
    >
        <Content
            ref={contentRef}
            className={`dialog ${className}`}
            onMouseDown={handleMouseDown}
            width={width}
            isWide={isWide}
            isNarrow={isNarrow}
            hasTabs={hasTabs}
            isClosing={isClosing}
            open
        >
            {items}
        </Content>

        {showAside && <div onMouseDown={handleMouseDown}>
            {aside}
        </div>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Dialog.propTypes = {
    open           : PropTypes.bool,
    className      : PropTypes.string,
    dontClose      : PropTypes.bool,
    dontBackClose  : PropTypes.bool,
    onClose        : PropTypes.func.isRequired,
    zIndex         : PropTypes.number,
    width          : PropTypes.number,
    isWide         : PropTypes.bool,
    isNarrow       : PropTypes.bool,
    noTab          : PropTypes.bool,
    isLoading      : PropTypes.bool,
    loadingMessage : PropTypes.string,
    hasFooter      : PropTypes.bool,
    aside          : PropTypes.any,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Dialog.defaultProps = {
    className     : "",
    open          : false,
    dontClose     : false,
    dontBackClose : false,
    zIndex        : 0,
    isWide        : false,
    isNarrow      : false,
    noTab         : false,
    isLoading     : false,
};

export default Dialog;
