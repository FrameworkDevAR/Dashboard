import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";

// Components
import Icon                 from "../Common/Icon";
import Html                 from "../Common/Html";
import Amount               from "../Common/Amount";
import Badge                from "../Common/Badge";

// Variants
const Variant = {
    NONE     : "none",
    LIGHT    : "light",
    DARK     : "dark",
    OUTLINED : "outlined",
};



// Styles
const Link = Styled.a.attrs(({ isSelected, isDisabled, isSmall }) => ({ isSelected, isDisabled, isSmall }))`
    --link-gap: 8px;

    position: relative;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: var(--border-radius);
    background: transparent;
    text-decoration: none;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
    color: var(--link-color, black);
    cursor: pointer;

    ${(props) => props.isSmall && `
        --link-gap: 4px;
        border-radius: var(--border-radius-small);
        font-size: 12px;
    `}

    &:hover, &:focus {
        outline: none;
    }
`;

const NavLink = Styled(Link).attrs(({ isSmall }) => ({ isSmall }))`
    padding: ${(props) => props.isSmall ? "2px 6px 2px 2px" : "9px 12px"};
    transition: all 0.2s ease-in-out;

    &:hover {
        color: var(--link-hover);
        background-color: var(--link-background, transparent);
    }

    .link-preicon {
        font-size: 1.4em;
        height: 1em;
        margin-right: var(--link-gap);
    }
    .link-aftericon {
        font-size: 1.4em;
        height: 1em;
        margin-left: var(--link-gap);
    }
`;

const LightLink = Styled(NavLink)`
    --link-color: var(--title-color);
    --link-hover: var(--title-color);
    --link-background: rgba(0, 0, 0, 0.07);
    --link-selected-bg: rgba(0, 0, 0, 0.07);
    --link-selected-color: var(--link-color);

    ${(props) => props.isSelected && `
        color: var(--link-selected-color);
        background-color: var(--link-selected-bg);
    `}
    ${(props) => props.isDisabled && `
        cursor: not-allowed;
        --link-color: rgba(63, 87, 100, 0.7);
        --link-hover: rgba(63, 87, 100, 0.7);
        --link-background: transparent;
    `}
`;

const DarkLink = Styled(NavLink)`
    --link-color: var(--darker-gray);
    --link-hover: white;
    --link-background: var(--primary-color);

    ${(props) => props.isSelected && `
        color: white;
        background-color: var(--primary-color);
    `}
    ${(props) => props.isDisabled && `
        cursor: not-allowed;
        --link-color: rgba(255, 255, 255, 0.3);
        --link-hover: rgba(255, 255, 255, 0.3);
        --link-background: transparent;
    `}
`;

const OutlinedLink = Styled(Link)`
    --link-color: white;

    padding: 4px 16px;
    border: 1px solid transparent;
    text-transform: uppercase;
    font-size: 12px;

    &:hover {
        border-color: white;
    }
    .link-preicon {
        font-size: 1.7em;
        margin-right: var(--link-gap);
    }
    .link-aftericon {
        font-size: 1.7em;
        margin-left: var(--link-gap);
    }

    ${(props) => props.isSelected && "border-color: white;"}
`;

const Content = Styled.div.attrs(({ onlyIcon }) => ({ onlyIcon }))`
    display: flex;
    align-items: center;
    flex: 1;

    ${(props) => props.onlyIcon && `
        .link-preicon {
            margin-right: 0;
        }
        .link-emoji {
            margin-right: 0;
        }
    `}
`;

const Emoji = Styled.div`
    font-size: 1.4em;
    line-height: 1em;
    margin-right: 8px;
`;

const MenuBadge = Styled(Badge)`
    top: 0;
    right: 0;
`;

// Components
const Components = {
    [Variant.NONE]     : Link,
    [Variant.LIGHT]    : LightLink,
    [Variant.DARK]     : DarkLink,
    [Variant.OUTLINED] : OutlinedLink,
};



/**
 * The MenuLink Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MenuLink(props) {
    const {
        isHidden, passedRef, variant, className,
        isSelected, isDisabled, onlyIcon, isSmall, isButton,
        target, message, emoji, html, icon, iconColor, afterIcon, amount, badge,
        tooltip, tooltipVariant, tooltipWidth, tooltipDelay,
        onMouseEnter, onMouseLeave, children,
    } = props;

    const defaultRef = React.useRef(null);
    const elementRef = passedRef || defaultRef;

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Handles the Mouse Enter
    const handleMouseEnter = (e) => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip, tooltipWidth, tooltipDelay);
        }
        if (onMouseEnter) {
            onMouseEnter(e);
        }
    };

    // Handles the Mouse Leave
    const handleMouseLeave = (e) => {
        if (tooltip) {
            hideTooltip();
        }
        if (onMouseLeave) {
            onMouseLeave(e);
        }
    };


    // Variables
    const Component    = Components[variant] || Link;
    const content      = children || NLS.get(message);
    const hasHtml      = Boolean(!onlyIcon && html);
    const hasContent   = Boolean(!onlyIcon && content && !html);
    const hasAmount    = Boolean(!onlyIcon && amount !== undefined);
    const hasAfterIcon = Boolean(!onlyIcon && afterIcon);
    const onClick      = Navigate.useLink(props);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Component
        ref={elementRef}
        as={isButton ? "button" : undefined}
        type={isButton ? "button" : undefined}
        className={`link ${className}`}
        isSelected={isSelected}
        isDisabled={isDisabled}
        isSmall={isSmall}
        href={isButton ? undefined : Navigate.getUrl(props)}
        target={target}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <Content onlyIcon={onlyIcon}>
            {!!icon && <Icon
                className="link-preicon"
                icon={icon}
                color={iconColor}
            />}
            {!!emoji && <Emoji className="link-emoji">
                {emoji}
            </Emoji>}
            {hasHtml && <Html
                className="link-content"
                variant="span"
                content={html}
            />}
            {hasContent && <span className="link-content">
                {content}
            </span>}
            {hasAmount && <Amount className="link-amount" value={amount} />}
        </Content>

        {hasAfterIcon && <Icon
            className="link-aftericon"
            icon={afterIcon}
        />}
        <MenuBadge value={badge} />
    </Component>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MenuLink.propTypes = {
    isHidden       : PropTypes.bool,
    passedRef      : PropTypes.any,
    className      : PropTypes.string,
    variant        : PropTypes.string,
    message        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    emoji          : PropTypes.string,
    icon           : PropTypes.string,
    iconColor      : PropTypes.string,
    afterIcon      : PropTypes.string,
    amount         : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    badge          : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    html           : PropTypes.string,
    href           : PropTypes.string,
    url            : PropTypes.string,
    target         : PropTypes.string,
    useBase        : PropTypes.bool,
    isEmail        : PropTypes.bool,
    isPhone        : PropTypes.bool,
    isWhatsApp     : PropTypes.bool,
    onClick        : PropTypes.func,
    onMouseEnter   : PropTypes.func,
    onMouseLeave   : PropTypes.func,
    isSelected     : PropTypes.bool,
    isDisabled     : PropTypes.bool,
    onlyIcon       : PropTypes.bool,
    isButton       : PropTypes.bool,
    isSmall        : PropTypes.bool,
    dontStop       : PropTypes.bool,
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    tooltipDelay   : PropTypes.number,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MenuLink.defaultProps = {
    isHidden       : false,
    className      : "",
    variant        : Variant.NONE,
    href           : "#",
    url            : "",
    target         : "_self",
    useBase        : false,
    isEmail        : false,
    isPhone        : false,
    isWhatsApp     : false,
    badge          : 0,
    isSelected     : false,
    isDisabled     : false,
    onlyIcon       : false,
    isSmall        : false,
    dontStop       : false,
    tooltip        : "",
    tooltipVariant : "bottom",
    tooltipWidth   : 0,
    tooltipDelay   : 1,
};

export default MenuLink;
