// Utils
import Utils                from "../Utils/Utils";



// Constants
const MIN_DISTANCE = 5;
const LINE_HEIGHT  = 2;
const GHOST_OFFSET = 12;
const SCROLL_EDGE  = 48;
const SCROLL_SPEED = 12;



/**
 * Returns the function to Grab an Item of a Navigation, which is dropped in its List or in another
 * @param {Function}  onDrop
 * @param {Function=} canDrop
 * @returns {Function}
 */
function useNavigationDrag(onDrop, canDrop) {
    // The Item is not moved while it is dragged: a copy of it follows the mouse and a line
    // shows where it would go. The Lists say their ID and their Items their own in the DOM, as
    // the Items of a Menu are in a List inside of its Item
    let state = null;


    // Grabs an Item
    const grab = (e, itemID) => {
        if (e.button !== 0) {
            return;
        }
        const node = e.currentTarget.closest("li");
        state = {
            itemID, node,
            startX     : e.clientX,
            startY     : e.clientY,
            isDragging : false,
            mouseX     : e.clientX,
            mouseY     : e.clientY,
            scroller   : getScroller(node),
            frame      : 0,
            cover      : null,
            ghost      : null,
            line       : null,
            target     : null,
            origListID : node.parentElement.dataset.navList,
            origIndex  : getItems(node.parentElement, null).indexOf(node),
        };
        window.addEventListener("mousemove", drag);
        window.addEventListener("mouseup",   drop);
        window.addEventListener("keydown",   cancel);
    };

    // Starts the Drag once the mouse moved a bit, so a click on the handle does nothing
    const start = (e) => {
        const posX = e.clientX - state.startX;
        const posY = e.clientY - state.startY;
        if (posX * posX + posY * posY < MIN_DISTANCE * MIN_DISTANCE) {
            return false;
        }

        // The copy is out of the Navigation, so it takes the font that the Item inherits from it
        const link   = state.node.querySelector(".link");
        const bounds = link.getBoundingClientRect();
        const styles = window.getComputedStyle(link);
        const ghost  = link.cloneNode(true);
        Object.assign(ghost.style, {
            fontFamily      : styles.fontFamily,
            fontSize        : styles.fontSize,
            color           : styles.color,
            position        : "fixed",
            top             : "0",
            left            : "0",
            width           : `${bounds.width}px`,
            pointerEvents   : "none",
            zIndex          : "10001",
            transition      : "none",
            opacity         : "0.95",
            backgroundColor : "var(--content-color)",
            boxShadow       : "var(--box-shadow)",
            borderRadius    : "var(--border-radius)",
        });
        document.body.appendChild(ghost);

        const line = document.createElement("div");
        Object.assign(line.style, {
            display         : "none",
            position        : "fixed",
            height          : `${LINE_HEIGHT}px`,
            pointerEvents   : "none",
            zIndex          : "10001",
            backgroundColor : "var(--primary-color)",
            borderRadius    : `${LINE_HEIGHT}px`,
        });
        document.body.appendChild(line);

        // A layer over the page keeps the cursor and stops the hover of what is below it
        const cover = document.createElement("div");
        Object.assign(cover.style, {
            position : "fixed",
            inset    : "0",
            zIndex   : "10000",
            cursor   : "grabbing",
        });
        document.body.appendChild(cover);

        state.node.style.opacity = "0.4";
        state.cover      = cover;
        state.ghost      = ghost;
        state.line       = line;
        state.isDragging = true;
        return true;
    };

    // Drags the Item
    const drag = (e) => {
        if (!state.isDragging && !start(e)) {
            return;
        }
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        state.ghost.style.transform = `translate(${e.clientX + GHOST_OFFSET}px, ${e.clientY + GHOST_OFFSET}px)`;
        update();

        Utils.unselectAll();
        e.preventDefault();
    };

    // Shows where the Item would go, which is asked again while the Navigation scrolls, as the
    // Items move under the mouse
    const update = () => {
        state.target = getTarget(state.mouseX, state.mouseY);
        showLine(state.target);
        if (!state.frame) {
            state.frame = window.requestAnimationFrame(scroll);
        }
    };

    // Scrolls the Navigation while the mouse is near its top or its bottom, faster the closer
    // it is to the edge
    const scroll = () => {
        state.frame = 0;
        const { scroller, mouseY, isDragging } = state;
        if (!scroller || !isDragging) {
            return;
        }

        const bounds = scroller.getBoundingClientRect();
        let   amount = 0;
        if (mouseY > bounds.bottom - SCROLL_EDGE) {
            amount = Math.min(1, (mouseY - bounds.bottom + SCROLL_EDGE) / SCROLL_EDGE);
        } else if (mouseY < bounds.top + SCROLL_EDGE) {
            amount = -Math.min(1, (bounds.top + SCROLL_EDGE - mouseY) / SCROLL_EDGE);
        }
        const before = scroller.scrollTop;
        scroller.scrollTop += Math.round(amount * SCROLL_SPEED);
        if (scroller.scrollTop !== before) {
            update();
        }
    };

    // Drops the Item, which only does something when it goes to another place
    const drop = () => {
        const { isDragging, itemID, target, origListID, origIndex } = state;
        finish();
        if (isDragging && target && (target.listID !== origListID || target.index !== origIndex)) {
            onDrop(itemID, target.listID, target.index);
        }
    };

    // Cancels the Drag with the Escape, leaving the Item where it was
    const cancel = (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            finish();
        }
    };

    // Ends the Drag, removing what it added
    const finish = () => {
        const { isDragging, cover, ghost, line, node, frame } = state;
        window.removeEventListener("mousemove", drag);
        window.removeEventListener("mouseup",   drop);
        window.removeEventListener("keydown",   cancel);
        window.cancelAnimationFrame(frame);
        state.isDragging = false;
        if (isDragging) {
            cover.remove();
            ghost.remove();
            line.remove();
            node.style.opacity = "";
        }
    };



    // Returns the closest element that scrolls the given one
    const getScroller = (node) => {
        let elem = node.parentElement;
        while (elem && elem !== document.body) {
            const { overflowY } = window.getComputedStyle(elem);
            if ((overflowY === "auto" || overflowY === "scroll") && elem.scrollHeight > elem.clientHeight) {
                return elem;
            }
            elem = elem.parentElement;
        }
        return null;
    };

    // Returns the Items of the given List, without the one being dragged
    const getItems = (list, node) => {
        return [ ...list.children ].filter((child) => (
            child.dataset.navItem !== undefined && child !== node
        ));
    };

    // Returns the List and the position where the Item would go if dropped at the given Point
    const getTarget = (x, y) => {
        const elem = document.elementsFromPoint(x, y).find((child) => child !== state.cover);
        const list = elem ? elem.closest("[data-nav-list]") : null;
        if (!list || state.node.contains(list)) {
            return null;
        }

        // Over the row of an Item, the Item goes before or after it, and the lower half of one
        // that has a List of its own, like a Menu, puts it first in that List when it can go there
        const items = getItems(list, state.node);
        const li    = items.find((item) => item.firstElementChild.contains(elem));
        if (li) {
            const row     = li.firstElementChild.getBoundingClientRect();
            const isAfter = y > row.top + row.height / 2;
            const inner   = getInner(li);
            if (isAfter && inner) {
                const result = getAllowed(inner, 0);
                if (result) {
                    return result;
                }
            }
            return getAllowed(list, items.indexOf(li) + (isAfter ? 1 : 0));
        }

        // The space between the row of a Menu and its List is the start of that List too
        const owner = items.find((item) => item.contains(elem));
        const inner = owner ? getInner(owner) : null;
        if (inner && y < inner.getBoundingClientRect().top) {
            const result = getAllowed(inner, 0);
            if (result) {
                return result;
            }
        }

        // Anywhere else of the List, like the space between the Items or the element that ends
        // it, the Item goes after the rows that are above the mouse
        const index = items.filter((item) => {
            const row = item.firstElementChild.getBoundingClientRect();
            return row.top + row.height / 2 < y;
        }).length;
        return getAllowed(list, index);
    };

    // Returns the List that the given Item has of its own, like the one of a Menu
    const getInner = (item) => {
        return [ ...item.children ].find((child) => child.dataset.navList !== undefined);
    };

    // Returns the Target in the given List, if the Item can go there
    const getAllowed = (list, index) => {
        const listID = list.dataset.navList;
        if (canDrop && !canDrop(state.itemID, listID)) {
            return null;
        }
        return { list, listID, index };
    };

    // Shows the Line where the Item would go, which is above the Item that would follow it, or
    // above the element that ends the List
    const showLine = (target) => {
        const { line, node } = state;
        if (!target) {
            line.style.display = "none";
            return;
        }

        const items = getItems(target.list, node);
        const after = items[target.index] || [ ...target.list.children ].find((child) => (
            child.dataset.navItem === undefined
        ));
        let top    = 0;
        let bounds = null;
        if (after) {
            bounds = after.firstElementChild.getBoundingClientRect();
            top    = bounds.top - LINE_HEIGHT - 1;
        } else if (items.length) {
            bounds = items[items.length - 1].firstElementChild.getBoundingClientRect();
            top    = items[items.length - 1].getBoundingClientRect().bottom - LINE_HEIGHT - 1;
        } else {
            bounds = target.list.getBoundingClientRect();
            top    = bounds.top;
        }
        Object.assign(line.style, {
            display : "block",
            top     : `${top}px`,
            left    : `${bounds.left}px`,
            width   : `${bounds.width}px`,
        });
    };


    return grab;
}

export default useNavigationDrag;
