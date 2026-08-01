import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Action               from "../../Core/Action";
import Navigate             from "../../Core/Navigate";

// Components
import MenuLink             from "../Link/MenuLink";
import IconLink             from "../Link/IconLink";



// Styles
const Content = Styled.div.attrs(({ hideActions }) => ({ hideActions }))`
    position: relative;
    margin-bottom: 4px;

    ${(props) => props.hideActions && `
        &:hover > .subnav-actions {
            display: flex;
            background-color: var(--navigation-hover, rgba(0, 0, 0, 0.1));
        }
    `}
`;

const NavMenu = Styled(MenuLink)`
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
        amount, badge, onAction, onClick, onClose,
        hideActions, canEdit, canDelete, elemID, children,
    } = props;


    // Variables
    const act     = Action.get(action);
    const icn     = icon    || act.icon;
    const cnt     = message || act.message;
    const menuUrl = Navigate.useMenuUrl(url || "");


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


    // Variables
    const hasActions = canEdit || canDelete;


    // Do the Render
    return <li>
        <Content hideActions={hideActions}>
            <NavMenu
                variant="light"
                isSelected={isSelected}
                message={cnt}
                href={url ? menuUrl : href}
                emoji={emoji}
                icon={icn}
                iconColor={iconColor}
                afterIcon={afterIcon}
                onClick={handleClick}
                amount={amount}
                badge={badge}
            />

            {hasActions && <NavActions
                className="subnav-actions"
                hideActions={hideActions}
            >
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
        {children}
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
    isSelected  : PropTypes.bool,
    hideActions : PropTypes.bool,
    canEdit     : PropTypes.bool,
    canDelete   : PropTypes.bool,
    elemID      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
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
