import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import { Brightness }       from "../../Core/Variants";
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";

// Components
import Icon                 from "../Common/Icon";



// Styles
const Link = Styled.a.attrs(({ variant, isDisabled, isSmall, isTiny, size, withMark }) => ({ variant, isDisabled, isSmall, isTiny, size, withMark }))`
    --link-size: 32px;
    --link-font: 20px;
    --link-radius: var(--border-radius);

    ${(props) => props.isSmall && `
        --link-size: 24px;
        --link-font: 18px;
        --link-radius: var(--border-radius-small);
    `}
    ${(props) => props.isTiny && `
        --link-size: 20px;
        --link-font: 14px;
        --link-radius: var(--border-radius-small);
    `}
    ${(props) => props.size && `
        --link-size: ${props.size}px;
    `}

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--link-size);
    height: var(--link-size);
    padding: 0;
    font-size: var(--link-font);
    border-radius: var(--link-radius);
    text-decoration: none;
    transition: background-color 0.2s ease-in-out;
    color: var(--link-color, black);
    flex-shrink: 0;
    cursor: pointer;

    &:focus {
        background-color: var(--link-background, transparent);
        outline: none;
    }
    &:hover {
        outline: none;
        background-color: var(--link-background, transparent);
    }

    ${(props) => props.variant === Brightness.PRIMARY && `
        color: white;
        background-color: var(--primary-color);
        --link-color: white;
        --link-background: var(--secondary-color);
    `}
    ${(props) => props.variant === Brightness.LIGHT && `
        --link-color: var(--primary-color);
        --link-background: var(--hover-overlay, rgba(0, 0, 0, 0.1));
    `}
    ${(props) => props.variant === Brightness.DARK && `
        --link-color: white;
        --link-background: var(--primary-color);
    `}
    ${(props) => props.variant === Brightness.DARKER && `
        --link-color: white;
        --link-background: var(--secondary-color);
    `}
    ${(props) => props.variant === Brightness.WHITE && `
        --link-color: var(--white-color);
        --link-background: rgba(255, 255, 255, 0.1);
    `}
    ${(props) => props.variant === Brightness.BLACK && `
        --link-color: var(--black-color);
        --link-background: var(--hover-overlay, rgba(0, 0, 0, 0.1));
    `}
    ${(props) => props.variant === Brightness.ERROR && `
        --link-color: var(--error-color);
        --link-background: var(--hover-overlay, rgba(0, 0, 0, 0.1));
    `}

    ${(props) => props.isDisabled && `
        cursor: not-allowed;
    `}

    ${(props) => props.withMark && `
        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: -2px;
            width: 11px;
            height: 11px;
            border-radius: 100%;
            background-color: red;
        }
    `}
`;



/**
 * The IconLink Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function IconLink(props) {
    const {
        isHidden, passedRef, variant, className, isDisabled,
        target, icon, isSmall, isTiny, size, withMark,
        tooltip, tooltipVariant, tooltipWidth, tooltipDelay, shortcut,
        onMouseDown, onMouseUp, onTouchEnd,
    } = props;

    const defaultRef = React.useRef(null);
    const elementRef = passedRef || defaultRef;

    const onClick    = Navigate.useLink(props);
    const { showTooltip, hideTooltip } = Store.useAction("core");

    // The Shortcut is added to the Tooltip, as there is no room for it in the Icon
    const tooltipText = shortcut
        ? `${NLS.get(tooltip)} (${Utils.getShortcutText(shortcut)})`
        : tooltip;

    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltipText, tooltipWidth, tooltipDelay);
        }
    };

    // Handles the Click. The tooltip is hidden, as the link can be removed
    // with the click and then it never leaves it with the mouse
    const handleClick = (e) => {
        hideTooltip();
        onClick(e);
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Link
        ref={elementRef}
        className={`link ${className}`}
        variant={variant}
        isDisabled={isDisabled}
        isSmall={isSmall}
        isTiny={isTiny}
        size={size}
        withMark={withMark}
        href={Navigate.getUrl(props)}
        target={target}
        onClick={handleClick}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        <Icon icon={icon} />
    </Link>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
IconLink.propTypes = {
    isHidden       : PropTypes.bool,
    passedRef      : PropTypes.any,
    className      : PropTypes.string,
    variant        : PropTypes.string,
    icon           : PropTypes.string,
    tooltip        : PropTypes.string,
    shortcut       : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    tooltipDelay   : PropTypes.number,
    href           : PropTypes.string,
    url            : PropTypes.string,
    target         : PropTypes.string,
    isEmail        : PropTypes.bool,
    isPhone        : PropTypes.bool,
    isWhatsApp     : PropTypes.bool,
    onClick        : PropTypes.func,
    onTouchEnd     : PropTypes.func,
    onMouseDown    : PropTypes.func,
    onMouseUp      : PropTypes.func,
    isDisabled     : PropTypes.bool,
    isSmall        : PropTypes.bool,
    isTiny         : PropTypes.bool,
    size           : PropTypes.string,
    withMark       : PropTypes.bool,
    dontStop       : PropTypes.bool,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
IconLink.defaultProps = {
    isHidden       : false,
    className      : "",
    variant        : Brightness.LIGHT,
    tooltip        : "",
    tooltipVariant : "bottom",
    tooltipWidth   : 0,
    tooltipDelay   : 1,
    href           : "#",
    url            : "",
    target         : "_self",
    isEmail        : false,
    isPhone        : false,
    isWhatsApp     : false,
    isDisabled     : false,
    isSmall        : false,
    isTiny         : false,
    withMark       : false,
    dontStop       : false,
};

export default IconLink;
