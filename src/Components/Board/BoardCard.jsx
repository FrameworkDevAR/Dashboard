import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import BoardContext         from "./BoardContext";



// Styles
const Container = Styled.div.attrs(({ isSelected }) => ({ isSelected }))`
    position: relative;
    box-sizing: border-box;
    margin-bottom: 8px;
    padding: 10px;
    scroll-margin-left: 24px;
    background-color: var(--content-color);
    border-radius: var(--border-radius-medium);
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
        background-color: var(--lightest-gray);
    }

    ${(props) => props.isSelected && `
        &, &:hover {
            background-color: color-mix(in srgb, var(--primary-color) 8%, transparent);
        }
    `}

    &.dragging {
        position: fixed;
        top: 0;
        left: 0;
        opacity: 0.9;
        pointer-events: none;
        z-index: 1000;
    }
    &.drop-before::before {
        content: "";
        position: absolute;
        top: -5px;
        left: 0;
        right: 0;
        height: 2px;
        border-radius: 2px;
        background-color: var(--primary-color);
    }
`;



/**
 * The Board Card Component, which is dragged from anywhere but the elements that
 * have the "board-menu" class
 * @param {object} props
 * @returns {React.ReactElement}
 */
function BoardCard(props) {
    const {
        passedRef, className, elemID, columnID, isSelected,
        onClick, onContextMenu, children,
    } = props;

    const { startDrag } = React.useContext(BoardContext);


    // Handles the Mouse Down
    const handleMouseDown = (e) => {
        if (e.button !== 0 || e.target.closest(".board-menu")) {
            return;
        }
        startDrag(e, elemID, columnID);
    };


    // Do the Render
    return <Container
        ref={passedRef}
        className={`board-card ${isSelected ? "board-selected" : ""} ${className}`}
        isSelected={isSelected}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseDown={handleMouseDown}
    >
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
BoardCard.propTypes = {
    passedRef     : PropTypes.any,
    className     : PropTypes.string,
    elemID        : PropTypes.number.isRequired,
    columnID      : PropTypes.number.isRequired,
    isSelected    : PropTypes.bool,
    onClick       : PropTypes.func,
    onContextMenu : PropTypes.func,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
BoardCard.defaultProps = {
    className  : "",
    isSelected : false,
};

export default BoardCard;
