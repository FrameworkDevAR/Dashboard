import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";

// Components
import Icon                 from "../Common/Icon";
import Badge                from "../Common/Badge";



// Styles
const Container = Styled.div.attrs(({ hideMobile, hasContent, isSelected }) => ({ hideMobile, hasContent, isSelected }))`
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--bar-icon-size, 32px);
    width: ${(props) => props.hasContent ? "auto" : "var(--bar-icon-size, 32px)"};
    padding: ${(props) => props.hasContent ? "0 12px" : "0"};
    color: var(--bar-icon-color);
    background-color: var(--bar-icon-background);
    border-radius: var(--border-radius);
    font-size: var(--bar-icon-font, 16px);
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
        color: var(--bar-icon-hover-color, var(--bar-icon-color));
        background-color: var(--bar-icon-hover-bg);
    }

    .icon {
        display: inline-block;
        height: var(--bar-icon-font, 16px);
    }

    ${(props) => props.isSelected && `
        color: var(--bar-icon-sel-color, var(--bar-icon-hover-color, var(--bar-icon-color)));
        background-color: var(--bar-icon-sel-bg, var(--bar-icon-hover-bg));

        &:hover {
            color: var(--bar-icon-sel-color, var(--bar-icon-hover-color, var(--bar-icon-color)));
            background-color: var(--bar-icon-sel-bg, var(--bar-icon-hover-bg));
        }
    `}

    ${(props) => props.hideMobile && `
        @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
            display: none;
        }
    `}
`;

const Span = Styled.span`
    font-size: 13px;
    margin-left: 6px;
`;

const BarBadge = Styled(Badge)`
    top: -5px;
    right: -5px;
`;



/**
 * The Bar Icon Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function BarIcon(props) {
    const {
        passedRef, isHidden, hideMobile, className,
        isSelected, icon, withText, withTooltip, tooltipDelay,
        message, url, startsWith, badge,
    } = props;

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Variables
    const defaultRef = React.useRef();
    const elementRef = passedRef || defaultRef;

    const onClick    = Navigate.useClick(props);
    const isSelect   = Navigate.useSelect();
    const hasContent = withText && !!message;
    const content    = NLS.get(message);


    // Returns true if the Menu should be selected
    const shouldSelect = React.useMemo(() => {
        if (isSelected) {
            return isSelected;
        }
        if (url) {
            return isSelect(url, startsWith);
        }
        return false;
    }, [ isSelect, isSelected, url, startsWith ]);


    // Handles the Tooltip
    const handleTooltip = () => {
        if (withTooltip && window.innerWidth > 1000) {
            showTooltip(elementRef, "right", message, 0, tooltipDelay);
        }
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={elementRef}
        className={`baricon ${shouldSelect ? "selected" : ""} ${className}`}
        hideMobile={hideMobile}
        hasContent={hasContent}
        isSelected={shouldSelect}
        onClick={onClick}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        <Icon icon={icon} />
        {hasContent && <Span className="baricon-text">
            {content}
        </Span>}
        <BarBadge className="baricon-badge" value={badge} />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
BarIcon.propTypes = {
    passedRef    : PropTypes.any,
    isHidden     : PropTypes.bool,
    hideMobile   : PropTypes.bool,
    className    : PropTypes.string,
    isSelected   : PropTypes.bool,
    icon         : PropTypes.string.isRequired,
    message      : PropTypes.string,
    withText     : PropTypes.bool,
    withTooltip  : PropTypes.bool,
    tooltipDelay : PropTypes.number,
    href         : PropTypes.string,
    url          : PropTypes.string,
    target       : PropTypes.string,
    onClick      : PropTypes.func,
    startsWith   : PropTypes.bool,
    badge        : PropTypes.number,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
BarIcon.defaultProps = {
    isHidden     : false,
    hideMobile   : false,
    className    : "",
    isSelected   : false,
    withText     : false,
    withTooltip  : false,
    tooltipDelay : 1,
    href         : "",
    url          : "",
    target       : "_self",
    startsWith   : false,
};

export default BarIcon;
