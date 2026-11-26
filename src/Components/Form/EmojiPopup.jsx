import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Utils                from "../../Utils/Utils";

// Components
import EmojiPicker          from "./EmojiPicker";



// Constants
const POPUP_HEIGHT = 400;
const TEST_HEIGHT  = 410;
const POPUP_WIDTH  = 350;
const TEST_WIDTH   = 360;

// Styles
const Backdrop = Styled.div`
    display: block;
    box-sizing: border-box;
    position: fixed;
    inset: 0;
    z-index: var(--z-menu);
`;

const Emoji = Styled.div.attrs(({ top, left }) => ({ top, left }))`
    position: absolute;
    top: ${(props) => `${props.top}px`};
    left: ${(props) => `${props.left}px`};
    z-index: var(--z-menu);
`;


/**
 * The Emoji Popup
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EmojiPopup(props) {
    const {
        open, targetRef, direction, gap,
        top, left, onClick, onClose,
    } = props;

    const contentRef = React.useRef(null);


    // Handle the Close
    const handleClose = (e) => {
        if (open && !Utils.inRef(e.clientX, e.clientY, contentRef)) {
            onClose();
        }
        e.preventDefault();
        e.stopPropagation();
    };

    // The Escape closes it too, like the menus
    React.useEffect(() => {
        if (!open) {
            return undefined;
        }
        const handleKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [ open ]);


    // Return early
    if (!open) {
        return <React.Fragment />;
    }


    // Set the position
    const toTop  = direction.includes("top");
    const toLeft = direction.includes("left");

    let posTop  = top  || 0;
    let posLeft = left || 0;

    if (targetRef) {
        const bounds = Utils.getBounds(targetRef);
        if (toTop) {
            posTop = bounds.top - POPUP_HEIGHT - gap;
        } else {
            posTop = bounds.bottom + gap;
        }
        if (toLeft) {
            posLeft = bounds.right - POPUP_WIDTH;
        } else {
            posLeft = bounds.left;
        }
    } else {
        if (top && toTop) {
            posTop = top - POPUP_HEIGHT;
        }
        if (left && toLeft) {
            posLeft = left - POPUP_WIDTH;
        }
    }

    if (toTop && posTop < 0) {
        posTop = 10;
    } else if (!toTop && posTop + TEST_HEIGHT > window.innerHeight) {
        posTop -= (posTop + TEST_HEIGHT) - window.innerHeight;
    }
    if (posLeft < 0) {
        posLeft = 10;
    } else if (posLeft + TEST_WIDTH > window.innerWidth) {
        posLeft -= (posLeft + TEST_WIDTH) - window.innerWidth;
    }


    // Do the Render
    if (!open) {
        return <React.Fragment />;
    }
    return <Backdrop onMouseDown={handleClose}>
        <Emoji ref={contentRef} top={posTop} left={posLeft}>
            <EmojiPicker
                width={POPUP_WIDTH}
                height={POPUP_HEIGHT}
                onClick={onClick}
            />
        </Emoji>
    </Backdrop>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EmojiPopup.propTypes = {
    open      : PropTypes.bool,
    targetRef : PropTypes.any,
    direction : PropTypes.string,
    top       : PropTypes.number,
    left      : PropTypes.number,
    gap       : PropTypes.number,
    onClick   : PropTypes.func.isRequired,
    onClose   : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EmojiPopup.defaultProps = {
    open      : false,
    direction : "",
    top       : 0,
    left      : 0,
    gap       : 0,
};

export default EmojiPopup;
