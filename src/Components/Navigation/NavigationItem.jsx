import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Action               from "../../Core/Action";
import Navigate             from "../../Core/Navigate";
import Store                from "../../Core/Store";

// Components
import MenuLink             from "../Link/MenuLink";
import IconLink             from "../Link/IconLink";



// Styles
const Content = Styled.div.attrs(({ hideActions }) => ({ hideActions }))`
    position: relative;
    margin-bottom: 4px;

    ${(props) => props.hideActions && `
        &:hover > .nav-actions {
            display: flex;
            background-color: var(--navigation-hover, rgba(0, 0, 0, 0.1));
        }
    `}
`;

const NavMenu = Styled(MenuLink)`
    --link-icon: 20px;
    --link-color: var(--navigation-color, var(--title-color));
    --link-hover: var(--navigation-hover-color, var(--title-color));
    --link-background: var(--navigation-hover, rgba(0, 0, 0, 0.1));
    --link-selected-bg: var(--navigation-selected-bg, rgba(0, 0, 0, 0.1));
    --link-selected-color: var(--navigation-selected-color, var(--link-color));
`;

const NavActions = Styled.div.attrs(({ hideActions }) => ({ hideActions }))`
    display: ${(props) => props.hideActions ? "none" : "flex"};
    justify-content: center;
    position: absolute;
    top: 50%;
    right: 4px;
    border-radius: var(--border-radius);
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
        hideActions, canEdit, canDelete,
        canCollapse, isCollapsed, collapseOnSelect, children,
    } = props;

    const isSelect   = Navigate.useSelect();
    const elementRef = React.useRef(null);

    const { closeMenu, showTooltip, hideTooltip } = Store.useAction("core");


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

    // Handles the Tooltip
    const handleTooltip = () => {
        if (smallNav) {
            showTooltip(elementRef, "right", message);
        }
    };


    // Variables
    const hasActions   = canEdit || canDelete || canCollapse || collapseOnSelect;
    const selected     = shouldSelect();
    const showChildren = collapseOnSelect ? selected : (canCollapse ? !isCollapsed : true);
    const menuUrl      = Navigate.useMenuUrl(url || "");


    // Do the Render
    return <li>
        <Content hideActions={hideActions}>
            <NavMenu
                passedRef={elementRef}
                variant="light"
                className={className}
                isSelected={selected}
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
                onlyIcon={smallNav}
                onMouseEnter={handleTooltip}
                onMouseLeave={hideTooltip}
            />

            {hasActions && <NavActions
                className="nav-actions"
                hideActions={hideActions}
            >
                {canCollapse && <IconLink
                    variant="black"
                    icon={isCollapsed ? "closed" : "open"}
                    onClick={(e) => handleAction(e, "COLLAPSE")}
                    isSmall
                />}
                {collapseOnSelect && <IconLink
                    variant="black"
                    icon={selected ? "closed" : "open"}
                    onClick={handleClick}
                    isSmall
                />}
                {canEdit && <IconLink
                    variant="black"
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
        {showChildren && children}
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
    canCollapse      : PropTypes.bool,
    isCollapsed      : PropTypes.bool,
    collapseOnSelect : PropTypes.bool,
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
    isSelected       : false,
    isDisabled       : false,
    smallNav         : false,
};

export default NavigationItem;
