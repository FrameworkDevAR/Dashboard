import React                from "react";

// Core & Utils
import Store                from "../../Core/Store";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import Html                 from "../Common/Html";

// Styled
import Styled, {
    keyframes, css,
} from "styled-components";



// Animations
const open = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

// Styles
const Container = Styled(Html).attrs(({ variant, top, left, width, maxWidth, toLeft, delay, hasBreaks }) => ({ variant, top, left, width, maxWidth, toLeft, delay, hasBreaks }))`
    box-sizing: border-box;
    position: fixed;
    top: ${(props) => `${props.top}px`};
    left: ${(props) => `${props.left}px`};
    min-width: ${(props) => `${props.width}px`};
    max-width: ${(props) => props.maxWidth ? `${props.maxWidth}px` : "auto"};
    opacity: 0;
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

    ${(props) => css`animation: ${open} 0.3s ${props.delay}s ease-out forwards;`}

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
            ${props.toLeft ? "right: calc(6px + var(--border-radius) / 2);" : "left: calc(50% - 6px);"}
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
    const { open, targetRef, variant, message, maxWidth, delay, hasBreaks } = tooltip;


    // Variables
    const content    = NLS.get(message);
    const hasTooltip = open && !!content;


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
        }
        break;

    case "right":
        top  += bounds.height / 2;
        left += bounds.width + 8;
        break;
    default:
    }


    // Do the Render
    return <Container
        className="tooltip"
        variant={variant}
        top={top}
        left={left}
        width={width}
        maxWidth={maxWidth}
        toLeft={toLeft}
        delay={delay || 1}
        hasBreaks={hasBreaks}
        content={content}
    />;
}

export default Tooltip;
