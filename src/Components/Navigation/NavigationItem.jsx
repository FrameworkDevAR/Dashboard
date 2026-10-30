import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Action               from "../../Core/Action";
import Navigate             from "../../Core/Navigate";
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";

// Components
import MenuLink             from "../Link/MenuLink";
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Styles
const Content = Styled.div.attrs(({ hideActions, isSelected, canDrag }) => ({ hideActions, isSelected, canDrag }))`
    position: relative;
    margin-bottom: 4px;

    ${(props) => props.canDrag && `
        &:hover > .nav-drag {
            display: flex;
        }
        &:hover > .link .link-preicon {
            opacity: 0;
            cursor: grab;
        }
    `}

    ${(props) => props.hideActions && `
        &:hover > .nav-actions {
            display: flex;
            background-color: ${props.isSelected ? "var(--navigation-selected-icon, rgba(0, 0, 0, 0.1))" : "var(--navigation-hover, rgba(0, 0, 0, 0.1))"};
        }
    `}
`;

const NavMenu = Styled(MenuLink).attrs(({ isExpanded }) => ({ isExpanded }))`
    --link-icon: 20px;
    --link-color: var(--navigation-color, var(--title-color));
    --link-hover: var(--navigation-hover-color, var(--title-color));
    --link-background: var(--navigation-hover, rgba(0, 0, 0, 0.1));
    --link-selected-bg: var(--navigation-selected-bg, rgba(0, 0, 0, 0.1));
    --link-selected-color: var(--navigation-selected-color, var(--link-color));

    ${(props) => props.isExpanded && "background-color: var(--link-background);"}
`;

const Children = Styled.div.attrs(({ isOpen }) => ({ isOpen }))`
    display: grid;
    grid-template-rows: ${(props) => (props.isOpen ? "1fr" : "0fr")};
    transition: grid-template-rows 0.2s ease-in-out;
`;

const ChildrenInside = Styled.div`
    min-height: 0;
    overflow: hidden;
`;

const NavIcon = Styled(IconLink).attrs(({ isSelected }) => ({ isSelected }))`
    ${(props) => props.isSelected && `
        --link-color: var(--navigation-selected-color, var(--title-color));
        --link-background: var(--navigation-selected-hover, rgba(0, 0, 0, 0.1));
    `}
`;

const DragHandle = Styled(Icon)`
    display: none;
    position: absolute;
    top: 50%;
    left: 8px;
    z-index: 1;
    pointer-events: none;
    color: var(--navigation-color, var(--title-color));
    font-size: 18px;
    transform: translateY(-50%);
`;

const NavActions = Styled.div.attrs(({ hideActions }) => ({ hideActions }))`
    display: ${(props) => props.hideActions ? "none" : "flex"};
    justify-content: center;
    position: absolute;
    top: 50%;
    right: 4px;
    border-radius: var(--border-radius-small);
    transform: translateY(-50%);

    .icon {
        padding: 2px;
    }
`;



/**
 * The Navigation Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function NavigationItem(props) {
    const {
        className, message, html, url, href, emoji,
        icon, iconColor, afterIcon, amount, badge,
        elemID, isSelected, useExact, isDisabled, smallNav,
        onAction, onClick, onClose, noClose,
        hideActions, canEdit, canDelete, actions, onGrab,
        canCollapse, isCollapsed, collapseOnSelect, markExpanded, children,
    } = props;

    const isSelect   = Navigate.useSelect();
    const isForMenu  = Responsive.useIsForMenu();
    const elementRef = React.useRef(null);

    const { smallNav : navSmallNav } = Store.useState("core");
    const { closeMenu, showTooltip, hideTooltip } = Store.useAction("core");

    const isSmallNav = smallNav || (navSmallNav && !isForMenu);


    // Returns true if the Menu should be selected
    const shouldSelect = () => {
        if (isSelected) {
            return isSelected;
        }
        if (url) {
            return isSelect(url, false, useExact);
        }
        return false;
    };

    // Handles the Click
    const handleClick = (e) => {
        if (isDisabled) {
            return;
        }
        if (onClose) {
            onClose(e);
        }
        if (onClick) {
            onClick(e);
        } else if (onAction) {
            handleAction(e, "VIEW");
        }
        if (!noClose) {
            closeMenu();
        }
    };

    // Handles the Action
    const handleAction = (e, action) => {
        if (!isDisabled && onAction) {
            onAction(Action.get(action), elemID);
        }
        e.stopPropagation();
        e.preventDefault();
    };

    // Handles the Grab of the Item, which can be taken from any place but its Actions. The drag
    // only starts once the mouse moves, so a click still opens it, and the default is prevented
    // so the browser does not drag the link or select its text instead
    const handleGrab = (e) => {
        if (e.target.closest(".nav-actions")) {
            return;
        }
        e.preventDefault();
        onGrab(e, elemID);
    };

    // Handles the Tooltip
    const handleTooltip = () => {
        if (isSmallNav) {
            showTooltip(elementRef, "right", message, 0, 0.2);
        }
    };


    // Variables
    const hasActions   = canEdit || canDelete || canCollapse || collapseOnSelect || (Boolean(actions) && !isSmallNav);
    const canDrag      = !isSmallNav && Boolean(onGrab);
    const selected     = shouldSelect();
    const showChildren = collapseOnSelect ? selected : (canCollapse ? !isCollapsed : true);
    const menuUrl      = Navigate.useMenuUrl(url || "");


    // Do the Render
    return <li data-nav-item={canDrag ? elemID : undefined}>
        <Content
            hideActions={hideActions}
            isSelected={selected}
            canDrag={canDrag}
            onMouseDown={canDrag ? handleGrab : undefined}
        >
            {canDrag && <DragHandle
                className="nav-drag"
                icon="drag"
            />}
            <NavMenu
                passedRef={elementRef}
                variant="light"
                className={className}
                isSelected={selected}
                isExpanded={markExpanded && canCollapse && !isCollapsed && !selected}
                isDisabled={isDisabled}
                message={message}
                html={html}
                href={url ? menuUrl : href}
                onClick={handleClick}
                emoji={emoji}
                icon={icon}
                iconColor={iconColor}
                afterIcon={afterIcon}
                amount={amount}
                badge={badge}
                onlyIcon={isSmallNav}
                onMouseEnter={handleTooltip}
                onMouseLeave={hideTooltip}
            />

            {hasActions && <NavActions
                className="nav-actions"
                hideActions={hideActions}
            >
                {!isSmallNav && actions}
                {(canCollapse && !isSmallNav) && <NavIcon
                    variant="black"
                    isSelected={selected}
                    icon={isCollapsed ? "closed" : "open"}
                    onClick={(e) => handleAction(e, "COLLAPSE")}
                    isSmall
                />}
                {collapseOnSelect && <NavIcon
                    variant="black"
                    isSelected={selected}
                    icon={selected ? "closed" : "open"}
                    onClick={handleClick}
                    isSmall
                />}
                {canEdit && <NavIcon
                    variant="black"
                    isSelected={selected}
                    icon="edit"
                    onClick={(e) => handleAction(e, "EDIT")}
                    isSmall
                />}
                {canDelete && <IconLink
                    variant="error"
                    icon="delete"
                    onClick={(e) => handleAction(e, "DELETE")}
                    isSmall
                />}
            </NavActions>}
        </Content>
        {!!children && <Children
            className={`nav-children ${showChildren ? "nav-open" : ""}`}
            isOpen={showChildren}
        >
            <ChildrenInside>
                {children}
            </ChildrenInside>
        </Children>}
    </li>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
NavigationItem.propTypes = {
    isHidden         : PropTypes.bool,
    variant          : PropTypes.string,
    className        : PropTypes.string,
    message          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    html             : PropTypes.string,
    url              : PropTypes.string,
    href             : PropTypes.string,
    emoji            : PropTypes.string,
    icon             : PropTypes.string,
    iconColor        : PropTypes.string,
    afterIcon        : PropTypes.string,
    amount           : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    badge            : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    elemID           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onClick          : PropTypes.func,
    onAction         : PropTypes.func,
    onClose          : PropTypes.func,
    noClose          : PropTypes.bool,
    hideActions      : PropTypes.bool,
    canEdit          : PropTypes.bool,
    canDelete        : PropTypes.bool,
    actions          : PropTypes.node,
    onGrab           : PropTypes.func,
    canCollapse      : PropTypes.bool,
    isCollapsed      : PropTypes.bool,
    collapseOnSelect : PropTypes.bool,
    markExpanded     : PropTypes.bool,
    isSelected       : PropTypes.bool,
    useExact         : PropTypes.bool,
    isDisabled       : PropTypes.bool,
    smallNav         : PropTypes.bool,
    children         : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
NavigationItem.defaultProps = {
    isHidden         : false,
    className        : "",
    hideActions      : false,
    canEdit          : false,
    canDelete        : false,
    canCollapse      : false,
    isCollapsed      : false,
    collapseOnSelect : false,
    markExpanded     : false,
    isSelected       : false,
    isDisabled       : false,
    smallNav         : false,
};

export default NavigationItem;
