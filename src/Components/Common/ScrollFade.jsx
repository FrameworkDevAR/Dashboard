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
        bottom: 0;
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
    const [ topSpace,   setTopSpace   ] = React.useState(0);


    // Shows a fade on each side that the content can be scrolled to. The top
    // fade starts under the first child when it is sticky, so it stays visible
    const updateFades = () => {
        const node = passedRef.current;
        if (!node) {
            return;
        }
        const child = node.firstElementChild;
        const isSticky = child && window.getComputedStyle(child).position === "sticky";

        setTopSpace(isSticky ? child.offsetHeight : 0);
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
        style={topSpace ? { "--fade-top" : `${topSpace}px` } : undefined}
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
