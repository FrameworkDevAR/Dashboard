import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Action               from "../../Core/Action";
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import Menu                 from "./Menu";
import Icon                 from "../Common/Icon";
import Circle               from "../Common/Circle";
import Html                 from "../Common/Html";



// Styles
const ShortcutKey = Styled.span`
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    font-size: 11px;
    line-height: 1;
    color: var(--font-light);
    background-color: var(--lighter-gray);
    border: 1px solid var(--dark-gray);
    border-radius: var(--border-radius-small);
    transition: all 0.2s;
`;

const Container = Styled.li.attrs(({ isSelected, isDisabled, isSmall, leftSpace }) => ({ isSelected, isDisabled, isSmall, leftSpace }))`
    display: flex;
    align-items: center;
    gap: 10px;
    width: auto;
    min-width: 50px;
    margin: 0;
    padding: 10px;
    text-align: left;
    font-size: 14px;
    white-space: nowrap;
    color: var(--title-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
        background-color: var(--light-gray);
    }
    &:hover ${ShortcutKey} {
        background-color: var(--dark-gray);
        border-color: var(--darker-gray);
    }

    ${(props) => props.isSmall && `
        gap: 4px;
        padding: 4px 8px;
        font-size: 13px;
    `}
    ${(props) => props.leftSpace && `
        margin-left: 16px;
    `}
    ${(props) => props.isDisabled && `
        color: var(--darkest-gray);
        cursor: not-allowed;
        &:hover {
            background-color: transparent;
        }
    `}

    ${(props) => props.isSelected && `
        background-color: var(--primary-color);
        color: white;
        &:hover {
            background-color: var(--primary-color);
        }
    `}
`;

const MenuCircle = Styled(Circle)`
    width: 14px;
    height: 14px;
    margin: 0;
`;

const MenuContent = Styled.div`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

const MenuText = Styled(Html)`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const MenuDescription = Styled.span`
    font-size: 12px;
    white-space: nowrap;
`;

const MenuShortcut = Styled.span`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 24px;
`;



/**
 * The Menu Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MenuItem(props) {
    const {
        className, action, icon, circle, title, message, description, shortcut,
        url, href, target,
        isDisabled, isSelected, isSmall, leftSpace,
        onAction, onClick, dontClose, onClose,
        direction, index, selectedIdx, filter,
        trigger, setTrigger, children,
    } = props;


    // The References
    const itemRef = React.useRef(null);

    // The Current State
    const [ menuOpen, setMenuOpen ] = React.useState(false);


    // Variables
    const act         = Action.get(action);
    const icn         = icon || act.icon;
    const uri         = url ? NLS.baseUrl(url) : href;
    const navigate    = Navigate.useGotoUrl();
    const isSelection = !isDisabled && (isSelected || selectedIdx === index);
    const hasIcon     = Boolean(icon);
    const hasCircle   = Boolean(circle);
    const hasMenu     = Boolean(children && children.length);

    // Each key of the shortcut goes in its own square
    const shortcutKeys = shortcut ? Utils.getShortcutKeys(shortcut) : [];


    // Generates the Content
    const content = React.useMemo(() => {
        let result = NLS.get(message || act.message);
        if (filter && result) {
            result = Utils.underlineText(result, filter);
        }
        return result;
    }, [ message, act.message, filter ]);


    // Handles the Trigger
    React.useEffect(() => {
        if (trigger && isSelection) {
            handleAction();
            setTrigger(false);
        }
    }, [ trigger ]);

    // Handles the Click
    const handleClick = (e) => {
        if (!isDisabled) {
            handleAction();
        }
        e.preventDefault();
        e.stopPropagation();
    };

    // Handles the Action
    const handleAction = () => {
        if (url) {
            navigate(uri, target);
        }
        if (onClick) {
            onClick();
        } else if (onAction) {
            onAction(act);
        }
        if (!dontClose && !hasMenu && onClose) {
            onClose();
        }
    };


    // Do the Render
    return <>
        <Container
            ref={itemRef}
            className={`menu-item-${index} ${className}`}
            isSelected={isSelection}
            isDisabled={isDisabled}
            isSmall={isSmall}
            leftSpace={leftSpace}
            onMouseDown={handleClick}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
        >
            <Icon
                isHidden={!hasIcon}
                icon={icn}
                size="18"
            />
            <MenuCircle
                isHidden={!hasCircle}
                color={circle}
            />
            {!!title && <b>{NLS.get(title)}</b>}
            <MenuContent>
                <MenuText
                    variant="span"
                    content={content}
                />
                {!!description && <MenuDescription>
                    {NLS.get(description)}
                </MenuDescription>}
            </MenuContent>
            {shortcutKeys.length > 0 && <MenuShortcut>
                {shortcutKeys.map((key) => <ShortcutKey key={key}>{key}</ShortcutKey>)}
            </MenuShortcut>}
            <Icon
                isHidden={!hasMenu}
                icon="closed"
                size="18"
            />
        </Container>

        {hasMenu && <Menu
            open={menuOpen}
            targetRef={itemRef}
            direction={direction}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            onClose={onClose}
            isSubmenu
        >
            {children}
        </Menu>}
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MenuItem.propTypes = {
    className   : PropTypes.string,
    action      : PropTypes.string,
    icon        : PropTypes.string,
    circle      : PropTypes.string,
    title       : PropTypes.string,
    message     : PropTypes.string,
    description : PropTypes.string,
    shortcut    : PropTypes.string,
    url         : PropTypes.string,
    href        : PropTypes.string,
    target      : PropTypes.string,
    isDisabled  : PropTypes.bool,
    isSelected  : PropTypes.bool,
    isSmall     : PropTypes.bool,
    leftSpace   : PropTypes.bool,
    onAction    : PropTypes.func,
    onClick     : PropTypes.func,
    dontClose   : PropTypes.bool,
    onClose     : PropTypes.func,
    direction   : PropTypes.string,
    index       : PropTypes.number,
    selectedIdx : PropTypes.number,
    filter      : PropTypes.string,
    trigger     : PropTypes.bool,
    setTrigger  : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MenuItem.defaultProps = {
    className  : "",
    target     : "_self",
    isDisabled : false,
    isSelected : false,
    isSmall    : false,
    dontClose  : false,
    direction  : "right",
    circle     : "",
};

export default MenuItem;
