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
        background: linear-gradient(to bottom, var(--fade-color, var(--content-color)), transparent);
        opacity: ${(props) => props.showTop ? 1 : 0};
    }
    &::after {
        bottom: var(--fade-bottom, 0px);
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


    // The Current State
    const [ showTop,    setShowTop    ] = React.useState(false);
    const [ showBottom, setShowBottom ] = React.useState(false);
    const [ topSpace,    setTopSpace    ] = React.useState(0);
    const [ bottomSpace, setBottomSpace ] = React.useState(0);


    // Returns the sticky element at the child, which can be the child itself or one
    // nested a few levels down, as in a Table with a sticky head or in a Step Content
    // with a sticky footer
    const getSticky = (child, atEnd) => {
        let elem = child;
        for (let index = 0; elem && index < 3; index += 1) {
            if (window.getComputedStyle(elem).position === "sticky") {
                return elem;
            }
            elem = atEnd ? elem.lastElementChild : elem.firstElementChild;
        }
        return null;
    };

    // Returns the space taken by the sticky elements at the start or the end. Several
    // children can stack their sticky elements, as in a Dashboard with a sticky header
    // followed by a chart with a sticky title, so the space ends where the last one does
    const getStickySpace = (node, atEnd) => {
        const children = [ ...node.children ];
        const nodeRect = node.getBoundingClientRect();
        let   space    = 0;

        if (atEnd) {
            children.reverse();
        }
        for (const child of children) {
            const sticky = getSticky(child, atEnd);
            if (!sticky || !sticky.offsetHeight) {
                break;
            }
            const rect = sticky.getBoundingClientRect();
            space = atEnd ? nodeRect.bottom - rect.top : rect.bottom - nodeRect.top;
        }
        return Math.max(0, Math.round(space));
    };

    // Shows a fade on each side that the content can be scrolled to. Each fade starts
    // next to the sticky element of its side, if there is one, so that stays visible
    const updateFades = () => {
        const node = passedRef.current;
        if (!node) {
            return;
        }

        setTopSpace(getStickySpace(node, false));
        setBottomSpace(getStickySpace(node, true));
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
