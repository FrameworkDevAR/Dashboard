import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Action               from "../../Core/Action";
import Navigate             from "../../Core/Navigate";
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";

// Components
import MenuLink             from "../Link/MenuLink";
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Styles
const Content = Styled.div.attrs(({ hideActions, canDrag }) => ({ hideActions, canDrag }))`
    position: relative;
    margin-bottom: 4px;

    ${(props) => props.canDrag && `
        &:hover > .subnav-drag {
            display: flex;
        }
        &:hover > .link .link-preicon {
            opacity: 0;
            cursor: grab;
        }
    `}

    ${(props) => props.hideActions && `
        &:hover > .subnav-actions {
            display: flex;
            background-color: var(--navigation-hover, rgba(0, 0, 0, 0.1));
        }
    `}
`;

const NavMenu = Styled(MenuLink).attrs(({ actionsAmount }) => ({ actionsAmount }))`
    --link-icon: 18px;
    --link-color: var(--navigation-color, var(--title-color));
    --link-background: var(--navigation-hover, rgba(0, 0, 0, 0.1));
    --link-selected-bg: var(--subnav-selected-bg, var(--navigation-selected-bg, rgba(0, 0, 0, 0.1)));
    --link-selected-color: var(--subnav-selected-color, var(--navigation-selected-color, var(--link-color)));

    padding: 5px 8px;
    font-size: 13px;

    & > .link-preicon {
        margin-right: 4px;
    }
    & > .link-aftericon {
        margin-left: 0;
        margin-right: -4px;
    }

    ${(props) => props.actionsAmount > 0 && `
        padding-right: calc(10px + ${props.actionsAmount} * 20px);
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
function SubNavigationItem(props) {
    const {
        action, isSelected, message, url, href, emoji, icon, iconColor, afterIcon,
        amount, badge, onAction, onClick, onClose, noClose,
        hideActions, canEdit, canDelete, canCollapse, isCollapsed, elemID, onGrab, children,
    } = props;


    // Variables
    const act        = Action.get(action);
    const icn        = icon    || act.icon;
    const cnt        = message || act.message;
    const menuUrl    = Navigate.useMenuUrl(url || "");
    const isForMenu  = Responsive.useIsForMenu();
    const elementRef = React.useRef(null);

    const { smallNav } = Store.useState("core");
    const { closeMenu, showTooltip, hideTooltip } = Store.useAction("core");

    const isSmallNav = smallNav && !isForMenu;


    // Handles the Click
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else if (onAction) {
            onAction(act);
        }
        if (onClose) {
            onClose(e);
        }
        if (!noClose) {
            closeMenu();
        }
        e.preventDefault();
        e.stopPropagation();
    };

    // Handles the Action
    const handleAction = (e, action) => {
        if (onAction) {
            onAction(Action.get(action), elemID);
        }
        e.stopPropagation();
        e.preventDefault();
    };

    // Handles the Grab of the Item, which can be taken from any place but its Actions. The drag
    // only starts once the mouse moves, so a click still opens it, and the default is prevented
    // so the browser does not drag the link or select its text instead
    const handleGrab = (e) => {
        if (e.target.closest(".subnav-actions")) {
            return;
        }
        e.preventDefault();
        onGrab(e, elemID);
    };

    // Handles the Tooltip
    const handleTooltip = () => {
        if (isSmallNav) {
            showTooltip(elementRef, "right", cnt, 0, 0.2);
        }
    };


    // Variables
    const hasActions = !isSmallNav && (canEdit || canDelete || canCollapse);
    const canDrag    = !isSmallNav && Boolean(onGrab);

    // The Actions are drawn over the end of the Link, so the After Icon is moved before them
    let actionsAmount = 0;
    if (hasActions && !hideActions && afterIcon) {
        actionsAmount = [ canCollapse, canEdit, canDelete ].filter(Boolean).length;
    }


    // Do the Render
    return <li data-nav-item={canDrag ? elemID : undefined}>
        <Content
            hideActions={hideActions}
            canDrag={canDrag}
            onMouseDown={canDrag ? handleGrab : undefined}
        >
            {canDrag && <DragHandle
                className="subnav-drag"
                icon="drag"
            />}
            <NavMenu
                passedRef={elementRef}
                variant="light"
                isSelected={isSelected}
                message={cnt}
                href={url ? menuUrl : href}
                emoji={emoji}
                icon={icn}
                iconColor={iconColor}
                afterIcon={afterIcon}
                actionsAmount={actionsAmount}
                onClick={handleClick}
                amount={amount}
                badge={badge}
                onlyIcon={isSmallNav}
                onMouseEnter={handleTooltip}
                onMouseLeave={hideTooltip}
            />

            {hasActions && <NavActions
                className="subnav-actions"
                hideActions={hideActions}
            >
                {canCollapse && <IconLink
                    variant="black"
                    icon={isCollapsed ? "closed" : "open"}
                    onClick={(e) => handleAction(e, "COLLAPSE")}
                    isTiny
                />}
                {canEdit && <IconLink
                    variant="black"
                    icon="edit"
                    onClick={(e) => handleAction(e, "EDIT")}
                    isTiny
                />}
                {canDelete && <IconLink
                    variant="error"
                    icon="delete"
                    onClick={(e) => handleAction(e, "DELETE")}
                    isTiny
                />}
            </NavActions>}
        </Content>
        {!(canCollapse && isCollapsed) && children}
    </li>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SubNavigationItem.propTypes = {
    isHidden    : PropTypes.bool,
    action      : PropTypes.string,
    message     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    url         : PropTypes.string,
    href        : PropTypes.string,
    emoji       : PropTypes.string,
    icon        : PropTypes.string,
    iconColor   : PropTypes.string,
    afterIcon   : PropTypes.string,
    amount      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    badge       : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    onAction    : PropTypes.func,
    onClick     : PropTypes.func,
    onClose     : PropTypes.func,
    noClose     : PropTypes.bool,
    isSelected  : PropTypes.bool,
    hideActions : PropTypes.bool,
    canEdit     : PropTypes.bool,
    canDelete   : PropTypes.bool,
    canCollapse : PropTypes.bool,
    isCollapsed : PropTypes.bool,
    elemID      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onGrab      : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SubNavigationItem.defaultProps = {
    isHidden   : false,
    isSelected : false,
};

export default SubNavigationItem;
