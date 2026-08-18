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
    const { isHidden, className, onAction, onClose, children } = props;

    const { smallNav } = Store.useState("core");
    const isForMenu    = Responsive.useIsForMenu();
    const isSmallNav   = smallNav && !isForMenu;


    // Clone the Children
    const items = Utils.cloneChildren(children, () => ({
        onAction, onClose,
    }));


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Ul className={className} isSmallNav={isSmallNav}>
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
