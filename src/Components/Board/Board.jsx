import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Utils                from "../../Utils/Utils";

// Components
import BoardContext         from "./BoardContext";



// Constants
const DRAG_DISTANCE  = 10;
const SCROLL_MARGIN  = 30;
const SCROLL_AMOUNT  = 5;
const COLLAPSED_SIZE = "50px";

// Styles
const Container = Styled.div.attrs(({ atStart, atEnd }) => ({ atStart, atEnd }))`
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    min-width: 0;
    min-height: 0;

    &::before, &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        width: 24px;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 2;
    }
    &::before {
        left: 0;
        background: linear-gradient(to right, var(--background-color), transparent);
        opacity: ${(props) => props.atStart ? 0 : 1};
    }
    &::after {
        right: 0;
        background: linear-gradient(to left, var(--background-color), transparent);
        opacity: ${(props) => props.atEnd ? 0 : 1};
    }
`;

const Columns = Styled.section.attrs(({ grid }) => ({ grid }))`
    --header-padding: var(--details-spacing);

    display: grid;
    grid-template-columns: ${(props) => props.grid};
    grid-template-rows: minmax(0, 1fr);
    gap: var(--main-margin);
    flex-grow: 2;
    min-height: 0;
    overflow: auto;

    &.dragging .board-card:not(.dragging) {
        pointer-events: none;
    }
`;

const Filler = Styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    padding: 24px;
    overflow: hidden;
    background-color: var(--content-color);
    border-radius: var(--main-radius);
`;



/**
 * The Board Component, with Columns of Cards that can be dragged between them
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Board(props) {
    const {
        className, storageKey, columnWidth, canDrag, withOrder,
        filler, fillerMinWidth, keepFiller, onSelect, onMove, children,
    } = props;


    // References
    const containerRef = React.useRef(null);

    // The Current State
    const [ collapsed, setCollapsed ] = React.useState([]);
    const [ atStart,   setAtStart   ] = React.useState(true);
    const [ atEnd,     setAtEnd     ] = React.useState(true);
    const [ hasFiller, setHasFiller ] = React.useState(false);

    // The Initial State
    const initialState = {
        isMoving      : false,
        isDragging    : false,
        elemID        : 0,
        columnID      : 0,
        startPosition : 0,
        startX        : 0,
        startY        : 0,
        diffX         : 0,
        diffY         : 0,
        scrollX       : 0,
        scrollY       : 0,
        dragElement   : null,
        dropElement   : null,
        dropCard      : null,
        dropPosition  : 0,
        dragBounds    : {},
        bodyBounds    : {},
        timer         : 0,
    };
    const stateRef = React.useRef({ ...initialState });


    // Variables
    const columnIDs = React.Children.toArray(children).map((child) => child.props.columnID);
    const columnKey = columnIDs.join(",");


    // Restore the collapsed Columns from the local storage
    React.useEffect(() => {
        const savedCollapsed = storageKey ? Utils.restoreItem(storageKey) : "";
        if (savedCollapsed) {
            setCollapsed(JSON.parse(savedCollapsed));
        }
    }, [ storageKey ]);

    // Check for scroll when the Columns change and whenever the container resizes
    React.useEffect(() => {
        checkScroll();

        const observer = new ResizeObserver(() => checkScroll());
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [ columnKey, collapsed.length ]);

    // Checks the Scroll, with a fade only on the side that can still be scrolled to. The
    // Filler only goes when the Columns leave enough space, which is measured with the last
    // Column instead of the scroll, as the Filler takes part of it
    const checkScroll = () => {
        const el = containerRef.current;
        if (el) {
            const columns = [ ...el.children ].filter((child) => child.classList.contains("board-column"));
            const last    = columns[columns.length - 1];
            const space   = last ? el.clientWidth - last.offsetLeft - last.offsetWidth : 0;

            setAtStart(el.scrollLeft <= 1);
            setAtEnd(el.scrollWidth - el.scrollLeft - el.clientWidth <= 1);
            setHasFiller(Boolean(filler) && (keepFiller || space >= fillerMinWidth));
        }
    };


    // Handles the Collapse
    const handleCollapse = (columnID) => {
        setCollapsed((prev) => {
            let newCollapsed;
            if (prev.includes(columnID)) {
                newCollapsed = prev.filter((id) => id !== columnID);
            } else {
                newCollapsed = [ ...prev, columnID ];
            }
            if (storageKey) {
                Utils.storeItem(storageKey, JSON.stringify(newCollapsed));
            }
            return newCollapsed;
        });
    };

    // Starts the Drag
    const startDrag = (e, elemID, columnID) => {
        const dragElement = e.target.closest(".board-card");
        const dragBounds  = dragElement.getBoundingClientRect();
        const column      = dragElement.closest(".board-column");
        const cards       = column ? [ ...column.querySelectorAll(".board-card") ] : [];

        stateRef.current = {
            ...initialState,
            dragElement, dragBounds, elemID, columnID,
            isMoving      : true,
            startPosition : cards.indexOf(dragElement) + 1,
            startX        : e.clientX,
            startY        : e.clientY,
            diffX         : e.clientX - dragBounds.left,
            diffY         : e.clientY - dragBounds.top,
            scrollX       : containerRef.current.scrollLeft,
            scrollY       : containerRef.current.scrollTop,
            bodyBounds    : containerRef.current.getBoundingClientRect(),
        };

        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup",   handleDrop);
    };

    // Handles the Drag
    const handleDrag = (e) => {
        const {
            isMoving, isDragging, startX, startY, diffX, diffY,
            dragElement, dragBounds, bodyBounds, timer,
        } = stateRef.current;
        if (!isMoving) {
            return;
        }

        // Start dragging after moving a certain distance
        if (!isDragging) {
            const xDist = e.clientX - startX;
            const yDist = e.clientY - startY;
            const dist  = xDist * xDist + yDist * yDist;
            if (dist > DRAG_DISTANCE && canDrag) {
                dragElement.classList.add("dragging");
                containerRef.current.classList.add("dragging");
                dragElement.style.width     = `${dragBounds.width}px`;
                dragElement.style.transform = `translate(${dragBounds.left}px, ${dragBounds.top}px)`;
                stateRef.current.isDragging = true;
            }
            return;
        }

        // Move the drag element with the cursor
        const posX = e.clientX - diffX;
        const posY = e.clientY - diffY;
        dragElement.style.transform = `translate(${posX}px, ${posY}px)`;

        if (timer) {
            window.clearInterval(timer);
        }
        if (containerRef.current && Utils.inBounds(e.clientX, e.clientY, bodyBounds)) {
            stateRef.current.timer = startAutoScroll(e.clientX, e.clientY);
        }

        // Highlight the Column under the cursor, and the place among its Cards
        const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
        const dropTarget    = elementsBelow.find((el) => el.classList.contains("board-column"));
        if (dropTarget) {
            clearDrop();
            setDrop(dropTarget, e.clientY);
        }

        Utils.unselectAll();
        e.preventDefault();
    };

    // Sets the drop target. The position is counted among the Cards that are not the
    // dragged one, as that is the place it ends up with once it leaves its own
    const setDrop = (dropTarget, clientY) => {
        stateRef.current.dropElement = dropTarget;
        dropTarget.classList.add("drop");
        if (!withOrder) {
            return;
        }

        const cards = [ ...dropTarget.querySelectorAll(".board-card:not(.dragging)") ];
        const index = cards.findIndex((card) => {
            const bounds = card.getBoundingClientRect();
            return clientY < bounds.top + bounds.height / 2;
        });
        const dropCard = index > -1 ? cards[index] : null;

        if (dropCard) {
            dropCard.classList.add("drop-before");
        } else {
            dropTarget.classList.add("drop-last");
        }
        // A collapsed Column shows no Cards, so the position is left for the last place
        const isCollapsed = dropTarget.classList.contains("board-collapsed");
        stateRef.current.dropCard     = dropCard;
        stateRef.current.dropPosition = isCollapsed ? 0 : (index > -1 ? index : cards.length) + 1;
    };

    // Clears the drop target
    const clearDrop = () => {
        const { dropElement, dropCard } = stateRef.current;
        if (dropElement) {
            dropElement.classList.remove("drop", "drop-last");
        }
        if (dropCard) {
            dropCard.classList.remove("drop-before");
        }
    };

    // Handles the Drop
    const handleDrop = (e) => {
        const {
            isMoving, isDragging, elemID, columnID, startPosition,
            dragElement, dropElement, dropPosition, timer,
        } = stateRef.current;
        if (!isMoving) {
            return;
        }
        if (timer) {
            window.clearInterval(timer);
        }
        stateRef.current.isMoving = false;

        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup",   handleDrop);

        // Select the Card if it was not dragged
        if (!isDragging) {
            if (onSelect) {
                onSelect(elemID, e);
            }
            return;
        }

        // Remove the drag element styles
        containerRef.current?.classList.remove("dragging");
        if (dragElement) {
            dragElement.classList.remove("dragging");
            dragElement.style.width     = "";
            dragElement.style.transform = "";
        }
        clearDrop();

        const newColumnID = dropElement ? Number(dropElement.getAttribute("data-id")) : 0;
        if (!newColumnID || !onMove) {
            return;
        }
        const samePlace = withOrder ? dropPosition === startPosition : true;
        if (newColumnID !== columnID || !samePlace) {
            onMove(elemID, columnID, newColumnID, dropPosition);
        }
    };

    // Starts scrolling the container while the cursor stays close to one of its edges
    const startAutoScroll = (clientX, clientY) => {
        const { bodyBounds, scrollX, scrollY } = stateRef.current;

        let scrollDeltaX = 0;
        if (scrollX > SCROLL_MARGIN && clientX < bodyBounds.left + SCROLL_MARGIN) {
            scrollDeltaX = -1;
        } else if (clientX > bodyBounds.right - SCROLL_MARGIN) {
            scrollDeltaX = 1;
        }

        let scrollDeltaY = 0;
        if (scrollY > SCROLL_MARGIN && clientY < bodyBounds.top + SCROLL_MARGIN) {
            scrollDeltaY = -1;
        } else if (clientY > bodyBounds.bottom - SCROLL_MARGIN) {
            scrollDeltaY = 1;
        }

        if (!scrollDeltaX && !scrollDeltaY) {
            return 0;
        }
        return window.setInterval(() => {
            stateRef.current.scrollX += scrollDeltaX * SCROLL_AMOUNT;
            stateRef.current.scrollY += scrollDeltaY * SCROLL_AMOUNT;
            containerRef.current.scrollTo(stateRef.current.scrollX, stateRef.current.scrollY);
        }, 10);
    };


    // Generates the Grid
    // The last track takes the width that the Columns leave, for a Filler
    const grid = React.useMemo(() => {
        const columns = columnIDs.map((columnID) => {
            return collapsed.includes(columnID) ? COLLAPSED_SIZE : columnWidth;
        });
        // The Filler takes the space the Columns leave. One that is kept goes after them
        // with its minimum width when there is no space left, and it is reached by scrolling
        if (hasFiller) {
            columns.push(keepFiller ? `minmax(${fillerMinWidth}px, 1fr)` : "minmax(0, 1fr)");
        }
        return columns.join(" ");
    }, [ columnKey, collapsed.length, hasFiller, columnWidth, keepFiller, fillerMinWidth ]);

    // The Columns and the Cards only depend on these, so the same value is kept
    const context = React.useMemo(() => ({
        collapsed, startDrag,
        onCollapse : handleCollapse,
    }), [ collapsed, canDrag, withOrder, onSelect, onMove ]);


    // Do the Render
    return <BoardContext.Provider value={context}>
        <Container
            className={className}
            atStart={atStart}
            atEnd={atEnd}
        >
            <Columns
                ref={containerRef}
                grid={grid}
                onScroll={checkScroll}
            >
                {children}
                {hasFiller && <Filler className="board-filler">
                    {filler}
                </Filler>}
            </Columns>
        </Container>
    </BoardContext.Provider>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Board.propTypes = {
    className      : PropTypes.string,
    storageKey     : PropTypes.string,
    columnWidth    : PropTypes.string,
    canDrag        : PropTypes.bool,
    withOrder      : PropTypes.bool,
    filler         : PropTypes.any,
    fillerMinWidth : PropTypes.number,
    keepFiller     : PropTypes.bool,
    onSelect       : PropTypes.func,
    onMove         : PropTypes.func,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Board.defaultProps = {
    className      : "",
    storageKey     : "",
    columnWidth    : "320px",
    canDrag        : true,
    withOrder      : false,
    fillerMinWidth : 280,
    keepFiller     : false,
};

export default Board;
