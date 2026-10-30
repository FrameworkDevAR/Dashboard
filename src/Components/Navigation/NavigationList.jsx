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

const Title = Styled.li`
    padding: 0 8px;
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--font-lighter);
`;



/**
 * The Navigation List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function NavigationList(props) {
    const { isHidden, className, message, listID, onGrab, useExact, onAction, onClose, children } = props;

    const { smallNav } = Store.useState("core");


    // Clone the Children. When the Items can be dragged, the ones with an ID can be grabbed,
    // and the List says its ID, so they can be dropped in it
    const canDrag = Boolean(onGrab) && listID !== undefined && !smallNav;
    const items   = Utils.cloneChildren(children, (child) => ({
        useExact, onAction, onClose,
        ...(canDrag && child.props.elemID !== undefined && { onGrab }),
    }));


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className} data-nav-list={canDrag ? listID : undefined}>
        {!!message && <Title>
            {NLS.get(message)}
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
    onClose   : PropTypes.func,
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
};

export default NavigationList;
