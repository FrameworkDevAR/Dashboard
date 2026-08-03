import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";



// Styles
const Backdrop = Styled.div.attrs(({ hide }) => ({ hide }))`
    display: block;
    position: fixed;
    inset: 0;
    z-index: var(--z-menu);

    ${(props) => props.hide && "pointer-events: none;"}
`;

const Container = Styled.ul.attrs(({ top, bottom, left, gap, width, minWidth, maxHeight, opacity }) => ({ top, bottom, left, gap, width, minWidth, maxHeight, opacity }))`
    box-sizing: border-box;
    display: block;
    position: fixed;
    left: ${(props) => `${props.left}px`};
    width: ${(props) => `${props.width}px`};
    opacity: ${(props) => props.opacity};
    min-width: 200px;
    margin: 0;
    padding: 8px;
    list-style: none;
    background-color: var(--white-color);
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius-medium);
    z-index: var(--z-input, 3);
    pointer-events: all;
    overflow: auto;

    ${(props) => props.top && `top: ${props.top + props.gap}px`};
    ${(props) => props.bottom && `bottom: ${props.bottom - props.gap}px`};
    ${(props) => props.minWidth && `min-width: ${props.minWidth}px`};
    ${(props) => props.maxHeight && `max-height: ${props.maxHeight}px`};
`;



/**
 * The Input Options Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputOptions(props) {
    const {
        passedRef, inputRef, withBackdrop,
        top, bottom, left, gap, width, minWidth, maxHeight,
        opacity, onClose, children,
    } = props;


    // Handles the Options Close
    const handleClose = (e) => {
        if (!withBackdrop) {
            return;
        }
        const inOptions = Utils.inRef(e.clientX, e.clientY, passedRef);
        const inInput   = Utils.inRef(e.clientX, e.clientY, inputRef);

        if (inOptions || inInput) {
            return;
        }
        if (onClose) {
            onClose();
        } else if (inputRef.current) {
            inputRef.current.blur();
        }
        e.stopPropagation();
        e.preventDefault();
    };


    // Do the Render
    return <Backdrop
        className="backdrop"
        onMouseDown={handleClose}
        hide={!onClose}
    >
        <Container
            ref={passedRef}
            top={top}
            bottom={bottom}
            left={left}
            gap={gap}
            width={width}
            minWidth={minWidth}
            maxHeight={maxHeight}
            opacity={opacity}
            // @ts-ignore
            tabIndex="-1"
        >
            {children}
        </Container>
    </Backdrop>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputOptions.propTypes = {
    passedRef    : PropTypes.object.isRequired,
    inputRef     : PropTypes.object.isRequired,
    withBackdrop : PropTypes.bool,
    top          : PropTypes.number,
    bottom       : PropTypes.number,
    left         : PropTypes.number,
    gap          : PropTypes.number,
    width        : PropTypes.number,
    minWidth     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxHeight    : PropTypes.number,
    opacity      : PropTypes.number,
    onClose      : PropTypes.func,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputOptions.defaultProps = {
    withBackdrop : true,
    left         : 0,
    gap          : 2,
    width        : 0,
    maxHeight    : 0,
    opacity      : 1,
};

export default InputOptions;
