import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";



// Styles
const Container = Styled.ul.attrs(({ fillWidth, isMedium, isCentered, topSpace, bottomSpace, fadeLeft, fadeRight }) => ({ fillWidth, isMedium, isCentered, topSpace, bottomSpace, fadeLeft, fadeRight }))`
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    width: fit-content;
    max-width: 100%;
    gap: 2px;
    margin: 0;
    padding: var(--pills-space);
    list-style: none;
    border-radius: 9999px;
    background-color: var(--pills-background);
    overflow-x: auto;
    scrollbar-width: none;

    ${(props) => props.isMedium && `
        --pills-height: var(--pills-medium-height);
        --pills-padding: var(--pills-medium-padding);
        --pills-font-size: var(--pills-medium-font-size);
    `}

    ${(props) => props.fillWidth && "width: 100%;"}
    ${(props) => props.isCentered && `
        margin-left: auto;
        margin-right: auto;
    `}
    ${(props) => props.topSpace && `margin-top: ${props.topSpace}px;`}
    ${(props) => props.bottomSpace && `margin-bottom: ${props.bottomSpace}px;`}

    ${(props) => (props.fadeLeft || props.fadeRight) && `
        mask-image: linear-gradient(to right, ${props.fadeLeft ? "transparent, black 32px" : "black"}, ${props.fadeRight ? "black calc(100% - 32px), transparent" : "black"});
    `}
`;

const Sticky = Styled.div.attrs(({ isCentered, hasActions }) => ({ isCentered, hasActions }))`
    position: sticky;
    top: -4px;
    display: flex;
    justify-content: ${(props) => props.isCentered ? "center" : "flex-start"};
    margin-top: -4px;
    padding: 4px 0;
    background-color: var(--content-color);
    z-index: 4;

    ${(props) => props.hasActions && `
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    `}
`;

const Indicator = Styled.div.attrs(({ left, width }) => ({ left, width }))`
    position: absolute;
    top: var(--pills-space);
    bottom: var(--pills-space);
    left: 0;
    width: ${(props) => props.width}px;
    translate: ${(props) => props.left}px;
    border-radius: 9999px;
    background-color: var(--pills-selected-background);
    box-shadow: var(--pills-selected-shadow);
    transition: translate 320ms cubic-bezier(0.34, 1.4, 0.4, 1), width 320ms cubic-bezier(0.34, 1.4, 0.4, 1);
`;



/**
 * The Tab List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TabList(props) {
    const {
        isHidden, className, fillWidth, isFit, isMedium, isCentered, isSticky,
        topSpace, bottomSpace, selected, onClick, actions, children,
    } = props;


    // The References
    const contentRef = React.useRef(null);

    // The Current State
    const [ bounds, setBounds ] = React.useState({ left : 0, width : 0 });
    const [ clicked, setClicked ] = React.useState(null);


    // The Pill moves on the click, as the selected value can come after a load. Once
    // the selected value changes, it is the one shown again
    const current = clicked ?? selected;

    React.useEffect(() => {
        setClicked(null);
    }, [ selected ]);
    const [ fades,  setFades  ] = React.useState({ left : false, right : false });


    // Clone the Children
    const items = Utils.cloneChildren(children, (child, index) => {
        const { url, value } = child.props;
        const handleClick = (id) => {
            setClicked(url ? NLS.url(url) : (value ?? index));
            onClick(id);
        };
        return { index, selected : current, isFit, onClick : onClick ? handleClick : undefined };
    });


    // Moves the Indicator to the selected Pill. The hidden is a dependency as there is no
    // node to measure while the list is hidden, and the observer is used as the list can
    // also mount with a size of zero, when it is inside a closed section
    React.useEffect(() => {
        const node = contentRef.current;
        if (!node) {
            return () => {};
        }

        const update = () => {
            const item = node.querySelector(".pill-tab-selected");
            if (item && item.offsetWidth) {
                setBounds({ left : item.offsetLeft, width : item.offsetWidth });
            }
            // When the Pills do not fit they scroll, so the selected one is brought to the center
            if (item && node.scrollWidth > node.clientWidth) {
                const left = item.offsetLeft - (node.clientWidth - item.offsetWidth) / 2;
                node.scrollTo({ left, behavior : "smooth" });
            }
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, [ isHidden, current, items.length ]);

    // When the Pills scroll, the side that has more of them fades, so it is known there are more
    React.useEffect(() => {
        const node = contentRef.current;
        if (!node) {
            return () => {};
        }
        const update = () => {
            const canScroll = node.scrollWidth > node.clientWidth + 1;
            setFades({
                left  : canScroll && node.scrollLeft > 1,
                right : canScroll && node.scrollLeft + node.clientWidth < node.scrollWidth - 1,
            });
        };
        update();
        node.addEventListener("scroll", update, { passive : true });
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => {
            node.removeEventListener("scroll", update);
            observer.disconnect();
        };
    }, [ isHidden, items.length ]);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    const content = <Container
        ref={contentRef}
        className={`pills ${className}`}
        fillWidth={fillWidth}
        isMedium={isMedium}
        isCentered={isCentered}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
        fadeLeft={fades.left}
        fadeRight={fades.right}
    >
        <Indicator
            left={bounds.left}
            width={bounds.width}
        />
        {items}
    </Container>;

    // What goes next to the Pills shares their bar, so it stays at the top with them
    if (isSticky) {
        return <Sticky
            className="pills-sticky"
            isCentered={isCentered}
            hasActions={Boolean(actions)}
        >
            {content}
            {actions}
        </Sticky>;
    }
    return content;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TabList.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    fillWidth   : PropTypes.bool,
    isFit       : PropTypes.bool,
    isMedium    : PropTypes.bool,
    isCentered  : PropTypes.bool,
    isSticky    : PropTypes.bool,
    topSpace    : PropTypes.number,
    bottomSpace : PropTypes.number,
    selected    : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    onClick     : PropTypes.func,
    actions     : PropTypes.node,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TabList.defaultProps = {
    isHidden   : false,
    className  : "",
    fillWidth  : false,
    isFit      : false,
    isMedium   : false,
    isCentered : false,
    isSticky   : false,
};

export default TabList;
