import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import Action               from "../../Core/Action";
import Utils                from "../../Utils/Utils";

// Components
import Button               from "../Form/Button";
import ActionOption         from "./ActionOption";
import Menu                 from "../Menu/Menu";
import MenuItem             from "../Menu/MenuItem";
import MenuLine             from "../Menu/MenuLine";



/**
 * The Action Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ActionItem(props) {
    const {
        action, variant, isSmall, isLoading,
        withMark, message, icon, onlyIcon, badge,
        onClick, onAction, direction, menuGap,
        tooltip, tooltipVariant, children,
    } = props;

    // The References
    const buttonRef = React.useRef(null);
    const actionRef = React.useRef(null);

    // The Current State
    const [ menuOpen, setMenuOpen ] = React.useState(false);


    // Menu Actions
    const actions = [];
    for (const child of Utils.toArray(children)) {
        if (!child) {
            continue;
        }
        if (child.type === ActionOption) {
            const action = { ...child.props };
            action.act = Action.get(action.action);
            if (!action.isHidden) {
                actions.push(action);
            }
        } else if (child.type === MenuLine) {
            const action = { ...child.props, isLine : true };
            if (!action.isHidden) {
                actions.push(action);
            }
        }
    }
    const showMenu = actions.length > 0;


    // Handles the Click
    const handleClick = () => {
        if (showMenu) {
            setMenuOpen(!menuOpen);
        } else if (onClick) {
            onClick();
        } else if (onAction) {
            onAction(act);
        }
    };

    // Handles the Menu Click
    const handleMenuClick = (elem) => {
        if (elem.onClick) {
            elem.onClick();
        } else if (elem.onAction) {
            elem.onAction(elem.act);
        } else if (onClick) {
            onClick(elem.value);
        } else if (onAction) {
            onAction(elem.act);
        }
    };

    // Handles the Menu Close
    const handleMenuClose = () => {
        setMenuOpen(false);
    };


    // Generates the Message
    const buttonMessage = React.useMemo(() => {
        if (onlyIcon) {
            return "";
        }
        if (message) {
            return message;
        }
        const act = Action.get(action);
        return act.message;
    }, [ message, action, onlyIcon ]);


    // Do the Render
    if (!showMenu && !action && !onClick) {
        return <React.Fragment />;
    }
    const act = Action.get(action);

    return <li ref={actionRef}>
        <Button
            passedRef={buttonRef}
            variant={variant}
            message={buttonMessage}
            tooltip={tooltip}
            tooltipVariant={tooltipVariant}
            icon={icon || act.icon}
            onClick={() => handleClick()}
            isSmall={isSmall}
            isLoading={isLoading}
            badge={badge}
            withMark={withMark}
            propagate
        />

        {showMenu && <Menu
            open={menuOpen}
            targetRef={buttonRef}
            direction={direction}
            gap={menuGap}
            onClose={handleMenuClose}
        >
            {actions.map((elem, index) => elem.isLine ? <MenuLine
                key={index}
            /> : <MenuItem
                key={index}
                icon={elem.icon || elem.act.icon}
                message={elem.message || elem.act.message}
                direction={elem.direction}
                onClick={() => handleMenuClick(elem)}
            >{elem.children}</MenuItem>)}
        </Menu>}
    </li>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ActionItem.propTypes = {
    isHidden       : PropTypes.bool,
    variant        : PropTypes.string,
    isSmall        : PropTypes.bool,
    isLoading      : PropTypes.bool,
    withMark       : PropTypes.bool,
    action         : PropTypes.string,
    message        : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    icon           : PropTypes.string,
    onlyIcon       : PropTypes.bool,
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    onClick        : PropTypes.func,
    onAction       : PropTypes.func,
    direction      : PropTypes.string,
    menuGap        : PropTypes.number,
    badge          : PropTypes.number,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ActionItem.defaultProps = {
    isHidden  : false,
    variant   : "outlined",
    isSmall   : false,
    isLoading : false,
    withMark  : false,
    direction : "bottom left",
    menuGap   : 4,
    badge     : 0,
};

export default ActionItem;
