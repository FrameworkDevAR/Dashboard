import React                from "react";
import PropTypes            from "prop-types";

// Styled
import Styled, {
    keyframes, css,
} from "styled-components";



// Animations
const open = keyframes`
    from { opacity: 0; }
    50%  { opacity: 1; }
`;
const close = keyframes`
    50%  { opacity: 1; }
    to   { opacity: 0; }
`;

// Styles
const Div = Styled.div.attrs(({ isOpen, isClosing, zIndex }) => ({ isOpen, isClosing, zIndex }))`
    display: ${(props) => props.isOpen ? "flex" : "none"};
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--full-height);
    overflow: hidden;
    justify-content: center;
    align-items: center;
    background-color: var(--drop-color);
    -webkit-backdrop-filter: var(--drop-blur);
    backdrop-filter: var(--drop-blur);
    z-index: ${(props) => props.zIndex ? props.zIndex : "var(--z-backdrop)"};

    ${(props) => props.isClosing ?
        css`animation: ${close} 0.3s ease-out both;` :
        css`animation: ${open} 0.3s ease-in both;`};
`;



/**
 * The Drawer Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Backdrop(props) {
    const {
        className, open, isClosing, contentRef, zIndex,
        onClick, onClose, children,
    } = props;


    // Handles the Click
    const handleClick = (e) => {
        if (onClick) {
            onClick();
        }
        if (onClose && contentRef && contentRef.current) {
            const bounds = contentRef.current.getBoundingClientRect();
            if (e.clientX > 0 && e.clientY > 0 && (
                e.clientX < bounds.left || e.clientX > bounds.right ||
                e.clientY < bounds.top  || e.clientY > bounds.bottom
            )) {
                onClose();
            }
        }
    };


    // Do the Render
    return <Div
        className={`backdrop ${className}`}
        isOpen={open}
        isClosing={isClosing}
        zIndex={zIndex}
        onMouseDown={handleClick}
    >
        {children}
    </Div>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Backdrop.propTypes = {
    contentRef : PropTypes.object,
    className  : PropTypes.string,
    open       : PropTypes.bool,
    zIndex     : PropTypes.number,
    isClosing  : PropTypes.bool,
    onClick    : PropTypes.func,
    onClose    : PropTypes.func,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Backdrop.defaultProps = {
    className : "",
    open      : false,
    isClosing : false,
    zIndex    : 0,
};

export default Backdrop;
