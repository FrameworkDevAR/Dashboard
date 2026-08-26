import React                from "react";

// Utils
import Utils                from "../Utils/Utils";



// Constants
const GHOST_OFFSET = 14;



/**
 * The Media Drag Hook, used to move a File into a Directory
 * @param {object[]} items
 * @param {boolean}  isGrid
 * @param {boolean}  canDrag
 * @param {Function} onDrop
 * @returns {object}
 */
function useMediaDrag(items, isGrid, canDrag, onDrop) {

    // The Current State
    const [ isDragging, setDragging   ] = React.useState(false);
    const [ isMoving,   setMoving     ] = React.useState(false);
    const [ dragIndex,  setDragIndex  ] = React.useState(0);
    const [ startX,     setStartX     ] = React.useState(0);
    const [ startY,     setStartY     ] = React.useState(0);
    const [ diffX,      setDiffX      ] = React.useState(0);
    const [ diffY,      setDiffY      ] = React.useState(0);
    const [ posX,       setPosX       ] = React.useState(0);
    const [ posY,       setPosY       ] = React.useState(0);
    const [ width,      setWidth      ] = React.useState(0);
    const [ requestRAF, setRequestRAF ] = React.useState(false);
    const [ dropIndex,  setDropIndex  ] = React.useState(-1);
    const [ movedIndex, setMovedIndex ] = React.useState(-1);


    // Handles the Grab
    const handleGrab = (e, elem, index) => {
        if (!canDrag || isDragging || elem.isBack || elem.isDir || e.nativeEvent.which !== 1) {
            return;
        }
        setDragging(true);
        setRequestRAF(true);
        setDragIndex(index);
        setStartX(e.clientX);
        setStartY(e.clientY);
    };

    // Handles the Drag
    const handleDrag = (e) => {
        if (!isDragging) {
            return;
        }
        if (!isMoving) {
            startDrag(e);
            return;
        }
        animateDrag(e);
        if (requestRAF) {
            setRequestRAF(false);
        }
    };

    // Handles the Drag Start
    const startDrag = (e) => {
        const currX = e.clientX - startX;
        const currY = e.clientY - startY;
        const dist  = currX * currX + currY * currY;

        if (dist <= 25) {
            return;
        }

        const node = document.querySelector(`.media-item-${dragIndex}`);
        if (!node) {
            return;
        }

        const bounds = node.getBoundingClientRect();

        setMoving(true);

        // The list drags a small box that follows the cursor, the grid lifts the item itself
        if (!isGrid) {
            setDiffX(-GHOST_OFFSET);
            setDiffY(-GHOST_OFFSET);
            setPosX(e.clientX + GHOST_OFFSET);
            setPosY(e.clientY + GHOST_OFFSET);
            return;
        }

        setWidth(bounds.width);
        setDiffX(startX - bounds.left);
        setDiffY(startY - bounds.top);
        setPosX(e.clientX - startX + bounds.left);
        setPosY(e.clientY - startY + bounds.top);
    };

    // Handles the Drag Animated
    const animateDrag = (e) => {
        setPosX(e.clientX - diffX);
        setPosY(e.clientY - diffY);
        setRequestRAF(true);

        const index = findTarget(e);
        if (index !== dropIndex) {
            setDropIndex(index);
        }

        e.preventDefault();
        e.stopPropagation();
        Utils.unselectAll();
    };

    // Returns the index of the Directory under the given position
    const findTarget = (e) => {
        for (const [ index, elem ] of items.entries()) {
            if (!elem.isBack && !elem.isDir) {
                continue;
            }
            const node = document.querySelector(`.media-item-${index}`);
            if (node && Utils.inBounds(e.clientX, e.clientY, node.getBoundingClientRect())) {
                return index;
            }
        }
        return -1;
    };

    // Handles the Drop
    const handleDrop = (e) => {
        if (!isDragging) {
            return;
        }
        setDragging(false);
        if (!isMoving) {
            return;
        }
        setMoving(false);
        setDropIndex(-1);

        // The File is hidden while it is moved
        const index = findTarget(e);
        if (index >= 0) {
            setMovedIndex(dragIndex);
            onDrop(items[dragIndex], items[index]);
        }
    };

    // Restores the moved File, once the new content is fetched
    const resetDrag = () => {
        setMovedIndex(-1);
    };

    // Adds the Listeners
    React.useEffect(() => {
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup",   handleDrop);
        return () => {
            window.removeEventListener("mousemove", handleDrag);
            window.removeEventListener("mouseup",   handleDrop);
        };
    });


    // The Style of the Item that is dragged in the grid and of the Ghost of the list
    const dragStyle  = isMoving ? {
        position : "fixed",
        width    : `${width}px`,
        top      : `${posY}px`,
        left     : `${posX}px`,
        zIndex   : 1000,
    } : null;

    const ghostStyle = { top : `${posY}px`, left : `${posX}px` };


    // The public API
    return {
        isMoving, dragIndex, dropIndex, movedIndex,
        dragStyle, ghostStyle, handleGrab, resetDrag,
    };
}

export default useMediaDrag;
