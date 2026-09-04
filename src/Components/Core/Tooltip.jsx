import React                from "react";

// Core & Utils
import Store                from "../../Core/Store";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import Html                 from "../Common/Html";

// Styled
import Styled              from "styled-components";



// Constants
const MOVE_TIME  = 0.3;
const OPEN_TIME  = 0.3;
const CLOSE_TIME = 0.2;

// Styles
const Container = Styled(Html).attrs(({ variant, width, maxWidth, toLeft, arrow, hasBreaks, isDark, isVisible, showDelay }) => ({ variant, width, maxWidth, toLeft, arrow, hasBreaks, isDark, isVisible, showDelay }))`
    box-sizing: border-box;
    position: fixed;
    min-width: ${(props) => `${props.width}px`};
    max-width: ${(props) => props.maxWidth ? `${props.maxWidth}px` : "auto"};
    opacity: ${(props) => props.isVisible ? 1 : 0};
    padding: 5px 8px;
    font-size: 12px;
    line-height: 1.5em;
    white-space: ${(props) => props.hasBreaks ? "pre-wrap" : "normal"};
    word-wrap: break-word;
    text-align: ${(props) => props.hasBreaks ? "left" : "center"};
    color: var(--tooltip-color);
    background-color: var(--tooltip-background);
    border-radius: var(--border-radius);
    pointer-events: none;
    z-index: var(--z-tooltip);
    transition:
        opacity ${(props) => props.isVisible ? `${OPEN_TIME}s ease-out ${props.showDelay}s` : `${CLOSE_TIME}s ease-out`},
        top ${MOVE_TIME}s ease-out,
        left ${MOVE_TIME}s ease-out;

    ${(props) => props.isDark && `
        --tooltip-color: white;
        --tooltip-background: rgba(0, 0, 0, 0.8);
    `}

    ${(props) => props.variant === "top" && `
        transform: translateX(-50%) translateY(-100%);
    `}
    ${(props) => props.variant === "bottom" && `
        transform: translateX(-50%);
    `}
    ${(props) => (props.variant === "left" || props.variant === "right") && `
        transform: translateY(-50%);
    `}

    &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-width: 6px;
        border-style: solid;
        transform: translateY(-50%);
        pointer-events: none;
        z-index: var(--z-tooltip);

        ${(props) => props.variant === "top" && `
            bottom: -18px;
            left: calc(50% - 6px);
            border-color: var(--tooltip-background) transparent transparent transparent;
        `}

        ${(props) => props.variant === "bottom" && `
            top: -6px;
            ${props.toLeft ? `right: ${props.arrow}px;` : "left: calc(50% - 6px);"}
            border-color: transparent transparent var(--tooltip-background) transparent;
        `}

        ${(props) => props.variant === "left" && `
            top: 50%;
            right: -12px;
            border-color: transparent transparent transparent var(--tooltip-background);
        `}

        ${(props) => props.variant === "right" && `
            top: 50%;
            left: -12px;
            border-color: transparent var(--tooltip-background) transparent transparent;
        `}
    }
`;



/**
 * The Tooltip Component
 * @returns {React.ReactElement}
 */
function Tooltip() {
    const { tooltip } = Store.useState("core");


    // The References
    const closeRef  = React.useRef(0);
    const shownRef  = React.useRef(false);

    // The Current State
    const [ current,   setCurrent   ] = React.useState(tooltip);
    const [ isVisible, setIsVisible ] = React.useState(false);
    const [ showDelay, setShowDelay ] = React.useState(0);


    // The one that closes is kept while it fades out, so it does not leave the screen on the
    // same frame the pointer does, and one that opens again in the meanwhile takes its place
    // instead of a new one, which is what lets it move and fade from where it was
    React.useEffect(() => {
        window.clearTimeout(closeRef.current);
        if (tooltip.open) {
            setCurrent(tooltip);
        } else {
            closeRef.current = window.setTimeout(() => setCurrent(tooltip), CLOSE_TIME * 1000);
        }
        return () => window.clearTimeout(closeRef.current);
    }, [ tooltip ]);

    // The fade is a transition and not an animation, so it goes on from where it is when it
    // is cut in the middle. A transition needs the browser to have painted the element hidden
    // before it is shown, and React runs an effect and the render it causes in the same frame,
    // so showing it waits for a frame of its own
    React.useEffect(() => {
        if (!current.open || !tooltip.open) {
            setIsVisible(false);
            return undefined;
        }

        // The delay is there to ignore a pointer that only passes by, so one that is already
        // on the screen, even if it is fading out, comes back without waiting again
        const nextDelay = shownRef.current ? 0 : (tooltip.delay || 1);
        const frame     = window.requestAnimationFrame(() => {
            setShowDelay(nextDelay);
            setIsVisible(true);
        });
        return () => window.cancelAnimationFrame(frame);
    }, [ current, tooltip.open ]);

    // Keep whether it is on the screen, which is what the delay above is decided with
    React.useEffect(() => {
        shownRef.current = current.open;
    });


    // Variables
    const { targetRef, variant, message, maxWidth, hasBreaks, isDark } = current;

    const content    = NLS.get(message);
    const hasTooltip = current.open && !!content;


    // Nothing to Show
    if (!hasTooltip) {
        return <React.Fragment />;
    }


    // Get the Position
    const bounds = Utils.getBounds(targetRef);
    let   top    = bounds.top;
    let   left   = bounds.left;
    let   width  = 0;
    let   toLeft = false;
    let   arrow  = 0;


    // Nothing to Show
    if (!top || !left) {
        return <React.Fragment />;
    }


    // Calculate the Position
    switch (variant) {
    case "top":
        top  -= 8;
        left += bounds.width / 2;
        width = bounds.width;
        break;

    case "bottom":
        top  += bounds.height + 8;
        left += bounds.width / 2;
        if (maxWidth && bounds.left + Number(maxWidth) > window.innerWidth) {
            left   = bounds.left - Number(maxWidth) / 2 + bounds.width + 6;
            width  = maxWidth;
            toLeft = true;
            arrow  = bounds.width / 2;
        }
        break;

    case "right":
        top  += bounds.height / 2;
        left += bounds.width + 8;
        break;
    default:
    }


    // The place is given as a style and not as a rule of its own, so the element keeps the
    // same class while it moves. It then slides from where it was to where it goes, which
    // only happens when it is already open, as a transition does not run on the first render
    const style = { top : `${top}px`, left : `${left}px` };


    // Do the Render
    return <Container
        className="tooltip"
        style={style}
        variant={variant}
        width={width}
        maxWidth={maxWidth}
        toLeft={toLeft}
        arrow={arrow}
        hasBreaks={hasBreaks}
        isDark={isDark}
        isVisible={isVisible}
        showDelay={showDelay}
        content={content}
    />;
}

export default Tooltip;
