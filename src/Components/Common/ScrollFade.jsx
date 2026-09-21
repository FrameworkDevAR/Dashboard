import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.div.attrs(({ showTop, showBottom }) => ({ showTop, showBottom }))`
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    min-height: 0;

    &::before, &::after {
        content: "";
        position: absolute;
        left: 0;
        right: var(--fade-right, 0px);
        height: var(--fade-height, 20px);
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 1;
    }
    &::before {
        top: var(--fade-top, 0px);
        border-radius: var(--fade-radius, 0px) var(--fade-radius, 0px) 0 0;
        background: linear-gradient(to bottom, var(--fade-color, var(--content-color)), transparent);
        opacity: ${(props) => props.showTop ? 1 : 0};
    }
    &::after {
        bottom: var(--fade-bottom, 0px);
        border-radius: 0 0 var(--fade-radius, 0px) var(--fade-radius, 0px);
        background: linear-gradient(to top, var(--fade-color, var(--content-color)), transparent);
        opacity: ${(props) => props.showBottom ? 1 : 0};
    }
`;



/**
 * The Scroll Fade Component, which fades the content that can be scrolled to
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ScrollFade(props) {
    const { className, passedRef, children } = props;

    const containerRef = React.useRef(null);


    // The Current State
    const [ showTop,    setShowTop    ] = React.useState(false);
    const [ showBottom, setShowBottom ] = React.useState(false);
    const [ topSpace,    setTopSpace    ] = React.useState(0);
    const [ bottomSpace, setBottomSpace ] = React.useState(0);


    // Returns the sticky element at the child, which can be the child itself or one
    // nested a few levels down, as in a Table with a sticky head or in a Step Content
    // with a sticky footer. Only the ones pinned to that side count, and only when they
    // span their parent, as a column that sticks next to the content covers neither side
    const getSticky = (child, atEnd) => {
        let elem = child;
        for (let index = 0; elem && index < 3; index += 1) {
            const style = window.getComputedStyle(elem);
            if (style.position === "sticky" && style[atEnd ? "bottom" : "top"] !== "auto") {
                const isColumn = elem.offsetWidth < (elem.parentElement?.clientWidth ?? 0) - 1;
                return isColumn ? null : elem;
            }
            elem = atEnd ? elem.lastElementChild : elem.firstElementChild;
        }
        return null;
    };

    // Returns the space taken by the sticky elements at the start or the end, or null
    // when there is none. Several children can stack their sticky elements, as in a
    // Dashboard with a sticky header followed by a chart with a sticky title, so the
    // space ends where the last one does. It is measured from the container, as the
    // node can start outside of it
    const getStickySpace = (node, atEnd) => {
        const container = containerRef.current;
        if (!container) {
            return null;
        }
        const children      = [ ...node.children ];
        const containerRect = container.getBoundingClientRect();
        let   space         = null;

        if (atEnd) {
            children.reverse();
        }
        for (const child of children) {
            const sticky = getSticky(child, atEnd);
            if (!sticky || !sticky.offsetHeight) {
                break;
            }
            const rect = sticky.getBoundingClientRect();
            space = atEnd ? containerRect.bottom - rect.top : rect.bottom - containerRect.top;
        }
        return space === null ? null : Math.max(0, Math.round(space));
    };

    // Returns the space between the node and the start or the end of the container, as
    // the node can have a margin that leaves it shorter than the container, or a
    // negative one that takes it past the container, which gives a negative space
    const getNodeSpace = (node, atEnd) => {
        const container = containerRef.current;
        if (!container) {
            return 0;
        }
        const nodeRect      = node.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const space         = atEnd ? containerRect.bottom - nodeRect.bottom : nodeRect.top - containerRect.top;
        return Math.round(space);
    };

    // Shows a fade on each side that the content can be scrolled to. Each fade starts at
    // the edge of the node, next to the sticky element of its side if there is one, so
    // the fade covers the content and the sticky element stays visible
    const updateFades = () => {
        const node = passedRef.current;
        if (!node) {
            return;
        }

        setTopSpace(getStickySpace(node, false) ?? getNodeSpace(node, false));
        setBottomSpace(getStickySpace(node, true) ?? getNodeSpace(node, true));
        setShowTop(node.scrollTop > 1);
        setShowBottom(node.scrollHeight - node.scrollTop - node.clientHeight > 1);
    };

    React.useEffect(() => {
        const node = passedRef.current;
        if (!node) {
            return undefined;
        }
        node.addEventListener("scroll", updateFades);
        const observer = new ResizeObserver(updateFades);
        observer.observe(node);
        return () => {
            node.removeEventListener("scroll", updateFades);
            observer.disconnect();
        };
    }, []);

    // The content can change without resizing the node, so this runs on every render
    React.useEffect(() => {
        updateFades();
    });


    // Do the Render
    return <Container
        ref={containerRef}
        className={className}
        style={{
            "--fade-top"    : `${topSpace}px`,
            "--fade-bottom" : `${bottomSpace}px`,
        }}
        showTop={showTop}
        showBottom={showBottom}
    >
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ScrollFade.propTypes = {
    className : PropTypes.string,
    passedRef : PropTypes.object.isRequired,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ScrollFade.defaultProps = {
    className : "",
};

export default ScrollFade;
