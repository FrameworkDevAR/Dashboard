import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Utils                from "../../Utils/Utils";



// Styles
const Container = Styled.ul.attrs(({ fillWidth, isMedium, isCentered, topSpace, bottomSpace }) => ({ fillWidth, isMedium, isCentered, topSpace, bottomSpace }))`
    position: relative;
    box-sizing: border-box;
    display: flex;
    width: fit-content;
    max-width: 100%;
    gap: 2px;
    margin: 0;
    padding: var(--pills-space);
    list-style: none;
    border-radius: 9999px;
    background-color: var(--pills-background);

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
 * The Pill Tabs Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PillTabs(props) {
    const {
        isHidden, className, fillWidth, isFit, isMedium, isCentered, topSpace, bottomSpace,
        selected, onClick, children,
    } = props;


    // The References
    const contentRef = React.useRef(null);

    // The Current State
    const [ bounds, setBounds ] = React.useState({ left : 0, width : 0 });


    // Clone the Children
    const items = Utils.cloneChildren(children, (child, index) => {
        return { index, selected, isFit, onClick };
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
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, [ isHidden, selected, items.length ]);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={contentRef}
        className={`pills ${className}`}
        fillWidth={fillWidth}
        isMedium={isMedium}
        isCentered={isCentered}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
    >
        <Indicator
            left={bounds.left}
            width={bounds.width}
        />
        {items}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PillTabs.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    fillWidth   : PropTypes.bool,
    isFit       : PropTypes.bool,
    isMedium    : PropTypes.bool,
    isCentered  : PropTypes.bool,
    topSpace    : PropTypes.number,
    bottomSpace : PropTypes.number,
    selected    : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    onClick     : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PillTabs.defaultProps = {
    isHidden   : false,
    className  : "",
    fillWidth  : false,
    isFit      : false,
    isMedium   : false,
    isCentered : false,
};

export default PillTabs;
