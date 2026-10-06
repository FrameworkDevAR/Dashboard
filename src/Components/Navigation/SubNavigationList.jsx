import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";



// Styles
const Ul = Styled.ul.attrs(({ isSmallNav }) => ({ isSmallNav }))`
    list-style: none;
    margin: 0;
    padding-left: ${(props) => props.isSmallNav ? "0" : "16px"};
    padding-bottom: 8px;
`;



/**
 * The Navigation List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SubNavigationList(props) {
    const { isHidden, className, listID, onGrab, onAction, onClose, children } = props;

    const { smallNav } = Store.useState("core");
    const isForMenu    = Responsive.useIsForMenu();
    const isSmallNav   = smallNav && !isForMenu;


    // Clone the Children. When the Items can be dragged, the ones with an ID can be grabbed,
    // and the List says its ID, so they can be dropped in it or taken from it
    const canDrag = Boolean(onGrab) && listID !== undefined && !isSmallNav;
    const items   = Utils.cloneChildren(children, (child) => ({
        onAction, onClose,
        ...(canDrag && child.props.elemID !== undefined && { onGrab }),
    }));


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Ul
        className={className}
        isSmallNav={isSmallNav}
        data-nav-list={canDrag ? listID : undefined}
    >
        {items}
    </Ul>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SubNavigationList.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    listID    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onGrab    : PropTypes.func,
    onAction  : PropTypes.func,
    onClose   : PropTypes.func,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SubNavigationList.defaultProps = {
    isHidden  : false,
    className : "",
};

export default SubNavigationList;
