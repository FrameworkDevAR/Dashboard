import React                from "react";

// Core & Utils
import Utils                from "../Utils/Utils";



// The Submenu that keeps open while the mouse goes to it, as only one can be on the way at a time
let travelling = null;

// The time the mouse can stop on its way to a Submenu, and the time an Item waits to open its own
// while the mouse goes to the Submenu of another Item
const STOP_TIME = 400;
const WAIT_TIME = 100;



/**
 * Returns true if the Point is inside the Triangle
 * @param {{x: number, y: number}} p
 * @param {{x: number, y: number}} a
 * @param {{x: number, y: number}} b
 * @param {{x: number, y: number}} c
 * @returns {boolean}
 */
function inTriangle(p, a, b, c) {
    const side = (p1, p2, p3) => (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    const d1   = side(p, a, b);
    const d2   = side(p, b, c);
    const d3   = side(p, c, a);
    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
    return !(hasNeg && hasPos);
}



/**
 * Opens a Submenu while the mouse is over its Item or the Submenu, and keeps it open while the
 * mouse goes from the Item to the Submenu, even across the other Items on the way
 * @returns {object}
 */
function useSubmenu() {
    const menuRef  = React.useRef(null);
    const selfRef  = React.useRef({});
    const overRef  = React.useRef(false);
    const openRef  = React.useRef(null);
    const stopRef  = React.useRef(null);
    const moveRef  = React.useRef(null);

    const [ menuOpen, setMenuOpen ] = React.useState(false);


    // Stops keeping the Submenu open on the way to it
    const endTravel = () => {
        Utils.clearTimeout(stopRef);
        if (moveRef.current) {
            document.removeEventListener("mousemove", moveRef.current);
            moveRef.current = null;
        }
        if (travelling === selfRef.current) {
            travelling = null;
        }
    };

    // Closes the Submenu
    const closeMenu = () => {
        endTravel();
        setMenuOpen(false);
    };

    // Opens the Submenu once no other one is on the way
    const openMenu = () => {
        Utils.clearTimeout(openRef);
        if (!overRef.current) {
            return;
        }
        if (travelling && travelling !== selfRef.current) {
            Utils.setTimeout(openRef, openMenu, WAIT_TIME);
            return;
        }
        endTravel();
        setMenuOpen(true);
    };

    // Handles the Mouse Enter on the Item
    const handleItemEnter = () => {
        overRef.current = true;
        openMenu();
    };

    // Handles the Mouse Leave of the Item. The Submenu stays open while the mouse moves inside
    // the triangle from where it left to the near side of the Submenu, and does not stop
    const handleItemLeave = (e) => {
        overRef.current = false;
        Utils.clearTimeout(openRef);
        if (!menuOpen || !menuRef.current) {
            closeMenu();
            return;
        }

        const bounds = menuRef.current.getBoundingClientRect();
        const origin = { x : e.clientX, y : e.clientY };
        const edgeX  = bounds.left >= origin.x ? bounds.left : bounds.right;
        const top    = { x : edgeX, y : bounds.top    };
        const bottom = { x : edgeX, y : bounds.bottom };

        // The origin goes a bit back, so a move straight to the side stays inside
        origin.x += edgeX >= origin.x ? -4 : 4;

        endTravel();
        travelling = selfRef.current;
        moveRef.current = (ev) => {
            const point = { x : ev.clientX, y : ev.clientY };
            if (!inTriangle(point, origin, top, bottom)) {
                closeMenu();
            } else {
                Utils.setTimeout(stopRef, closeMenu, STOP_TIME);
            }
        };
        document.addEventListener("mousemove", moveRef.current);
        Utils.setTimeout(stopRef, closeMenu, STOP_TIME);
    };

    // Handles the Mouse Enter on the Submenu
    const handleMenuEnter = () => {
        endTravel();
        setMenuOpen(true);
    };

    // Handles the Mouse Leave of the Submenu
    const handleMenuLeave = () => {
        closeMenu();
    };


    // Remove the listeners and timers on Unmount
    React.useEffect(() => {
        return () => {
            endTravel();
            Utils.clearTimeout(openRef);
        };
    }, []);


    return {
        menuRef, menuOpen,
        handleItemEnter, handleItemLeave,
        handleMenuEnter, handleMenuLeave,
    };
}

export default useSubmenu;
