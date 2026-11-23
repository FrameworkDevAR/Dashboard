import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";



// Styles
const Container = Styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;

    & + & {
        margin-top: 32px;
    }
`;

const Title = Styled.li.attrs(({ smallNav }) => ({ smallNav }))`
    padding: 0 8px;
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--font-lighter);

    ${(props) => props.smallNav && `
        position: relative;
        padding: 0;
        font-size: 10px;
        white-space: nowrap;
        overflow: hidden;
    `}
`;



/**
 * The Navigation List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function NavigationList(props) {
    const { isHidden, className, message, listID, onGrab, useExact, onAction, smallNav, children } = props;


    const { showTooltip, hideTooltip } = Store.useAction("core");


    // The References
    const titleRef = React.useRef(null);

    // The Current State
    const [ label, setLabel ] = React.useState("");


    // The browsers cut a text in the middle of a letter, so the Title is cut by hand to the
    // most letters that fit followed by an ellipsis, measured in a hidden copy. The width
    // of the Navigation is animated, so it is measured again each time the Title resizes
    React.useLayoutEffect(() => {
        const text = NLS.get(message);
        const elem = titleRef.current;
        if (!smallNav || !elem) {
            setLabel(text);
            return undefined;
        }

        const measure = () => {
            const probe = document.createElement("span");
            probe.style.position   = "absolute";
            probe.style.visibility = "hidden";
            elem.appendChild(probe);

            let result = text;
            for (let length = text.length; length > 0; length -= 1) {
                result = length === text.length ? text : `${text.slice(0, length).trim()}…`;
                probe.textContent = result;
                if (probe.offsetWidth <= elem.clientWidth) {
                    break;
                }
            }
            elem.removeChild(probe);
            setLabel(result);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(elem);
        return () => observer.disconnect();
    }, [ smallNav, message, isHidden ]);


    // Handles the Tooltip, which shows the whole Title when it is cut
    const handleTooltip = () => {
        if (smallNav && label !== NLS.get(message)) {
            showTooltip(titleRef, "right", message, 0, 0.2);
        }
    };


    // Clone the Children. When the Items can be dragged, the ones with an ID can be grabbed,
    // and the List says its ID, so they can be dropped in it
    const canDrag = Boolean(onGrab) && listID !== undefined && !smallNav;
    const items   = Utils.cloneChildren(children, (child) => ({
        useExact, onAction,
        ...(canDrag && child.props.elemID !== undefined && { onGrab }),
    }));


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className} data-nav-list={canDrag ? listID : undefined}>
        {!!message && <Title
            ref={titleRef}
            smallNav={smallNav}
            onMouseEnter={handleTooltip}
            onMouseLeave={hideTooltip}
        >
            {label}
        </Title>}
        {items}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
NavigationList.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    message   : PropTypes.string,
    listID    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onGrab    : PropTypes.func,
    variant   : PropTypes.string,
    useExact  : PropTypes.bool,
    onAction  : PropTypes.func,
    smallNav  : PropTypes.bool,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
NavigationList.defaultProps = {
    isHidden  : false,
    className : "",
    message   : "",
    smallNav  : false,
};

export default NavigationList;
