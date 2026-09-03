import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";



// Constants
const PIN_TIME     = 400;
const SCROLL_SPACE = 16;

// Styles
const Spacer = Styled.div`
    height: 0;
`;



/**
 * The Accordion List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function AccordionList(props) {
    const {
        isHidden, className, passedRef, initial, selected,
        maxWidth, hideAside, noClose, onChange, header, children,
    } = props;


    // The References
    const listRef   = React.useRef(null);
    const spacerRef = React.useRef(null);
    const scrollRef = React.useRef(0);
    const pinRef    = React.useRef(null);
    const timerRef  = React.useRef(null);

    // The Current State
    const [ selection, setSelection ] = React.useState(selected || initial);

    // Handle the Initial change
    React.useEffect(() => {
        if (initial) {
            setSelection(initial);
        }
    }, [ initial ]);

    // Handle the Selected change
    React.useEffect(() => {
        if (selected) {
            setSelection(selected);
        }
    }, [ selected ]);


    // Keeps the scroll position when an Item opens or closes. Closing a tall
    // item makes the content shorter than the list, so the browser would move
    // the scroll to the top, and the space it lost is added at the end instead
    React.useEffect(() => {
        const node     = listRef.current;
        const scroller = getScroller(node);
        if (!scroller) {
            return () => {};
        }

        // The browser moves the scroll to the end when the content shrinks,
        // and it fires this before the observer, so the space is added here.
        // While the user scrolls the space can only shrink, as growing it
        // would add more of it each time they reach the end of the one there
        const handleScroll = () => {
            const maxScroll = scroller.scrollHeight - scroller.clientHeight;
            if (scroller.scrollTop < scrollRef.current && scroller.scrollTop >= maxScroll) {
                updateSpacer(scroller, true);
                return;
            }

            scrollRef.current = scroller.scrollTop;
            updateSpacer(scroller, false);
        };
        const handleResize = () => {
            updateSpacer(scroller, true);
        };

        // The Items are observed and not the List, as the List can be the
        // element that scrolls, and then its own size never changes
        scrollRef.current = scroller.scrollTop;
        const observer = new ResizeObserver(handleResize);
        for (const child of node.children) {
            observer.observe(child);
        }
        scroller.addEventListener("scroll", handleScroll, { passive : true });

        return () => {
            observer.disconnect();
            scroller.removeEventListener("scroll", handleScroll);
        };
    }, [ selection, React.Children.count(children) ]);

    // Returns the element that scrolls the List
    const getScroller = (node) => {
        let elem = node;
        while (elem) {
            const overflow = window.getComputedStyle(elem).overflowY;
            if (overflow === "auto" || overflow === "scroll") {
                return elem;
            }
            elem = elem.parentElement;
        }
        return null;
    };

    // Keeps the Header that was clicked in the same place while the content
    // of the Items grows and shrinks, as the one that closes can be over it
    const pinHeader = (elem, isOpening) => {
        const scroller = getScroller(listRef.current);
        if (!scroller) {
            return;
        }

        const offset = elem.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        const item   = elem.closest("section") || elem;
        pinRef.current = { elem, item, offset, isOpening };
        Utils.setTimeout(timerRef, () => {
            pinRef.current = null;
        }, PIN_TIME);
    };

    // Moves the scroll to keep the pinned Header in the same place, and to
    // show the content of the Item that opened when it does not fit under it
    const updateScroll = (scroller) => {
        const pin = pinRef.current;
        if (!pin || !pin.elem.isConnected) {
            return;
        }

        const scrollTop   = scroller.scrollTop;
        const scrollerTop = scroller.getBoundingClientRect().top;
        const offset      = pin.elem.getBoundingClientRect().top - scrollerTop;
        let   desired     = scrollTop + offset - pin.offset;

        if (pin.isOpening) {
            const bounds = pin.item.getBoundingClientRect();
            const itemTop = scrollTop + bounds.top - scrollerTop - SCROLL_SPACE;
            const minimum = itemTop + bounds.height + SCROLL_SPACE - scroller.clientHeight;
            desired = minimum > itemTop ? itemTop : Math.min(Math.max(desired, minimum), itemTop);
        }
        scrollRef.current = Math.max(0, Math.round(desired));
    };

    // Sets the space at the end of the List that the scroll position needs.
    // The height is set on the node, as the browser moves the scroll while it
    // lays out the change, and the state would only restore it a frame later
    const updateSpacer = (scroller, canGrow) => {
        const spacer  = spacerRef.current;
        if (!spacer) {
            return;
        }
        if (canGrow) {
            updateScroll(scroller);
        }
        const scroll  = scrollRef.current;
        const current = spacer.offsetHeight;
        const content = scroller.scrollHeight - current;
        const needed  = scroll > 0 ? Math.max(0, Math.ceil(scroll + scroller.clientHeight - content)) : 0;
        const height  = canGrow ? needed : Math.min(current, needed);

        if (height !== current) {
            spacer.style.height = `${height}px`;
        }
        if (canGrow && scroller.scrollTop !== scrollRef.current) {
            scroller.scrollTop = scrollRef.current;
        }
    };


    // Handle the Click
    const handleClick = (id, isDisabled) => (e) => {
        if (isDisabled) {
            return;
        }

        let newID = id;
        if (!noClose && id === selection) {
            newID = "";
        }
        if (newID === selection) {
            return;
        }
        if (e && e.currentTarget) {
            pinHeader(e.currentTarget, Boolean(newID));
        }

        setSelection(newID);
        if (onChange) {
            onChange(newID);
        }
    };

    // Generate the Items
    const hasSelection = selection !== "" && selection !== undefined && selection !== null;
    const items = Utils.cloneChildren(children, (child, index) => {
        const id = child.props.value || index;
        return {
            maxWidth, hideAside, hasSelection,
            number     : index + 1,
            isSelected : id === selection,
            onClick    : handleClick(id, child.props.isDisabled),
        };
    });


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <div
        className={`accordion ${className}`}
        ref={(node) => {
            listRef.current = node;
            if (passedRef) {
                passedRef.current = node;
            }
        }}
    >
        {header}
        {items}
        <Spacer ref={spacerRef} />
    </div>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
AccordionList.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    passedRef : PropTypes.object,
    initial   : PropTypes.string,
    selected  : PropTypes.string,
    maxWidth  : PropTypes.number,
    hideAside : PropTypes.bool,
    noClose   : PropTypes.bool,
    onChange  : PropTypes.func,
    header    : PropTypes.any,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
AccordionList.defaultProps = {
    isHidden  : false,
    className : "",
    initial   : "",
    selected  : "",
    noClose   : false,
};

export default AccordionList;
