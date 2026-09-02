import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";

// Components
import Icon                 from "../Common/Icon";
import Badge                from "../Common/Badge";



// Styles
const Container = Styled.li.attrs(({ isSelected, isDisabled, isFit }) => ({ isSelected, isDisabled, isFit }))`
    box-sizing: border-box;
    position: relative;
    flex: ${(props) => props.isFit ? "0 0 auto" : "1"};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    min-height: calc(var(--pills-height) - var(--pills-space) * 2);
    padding: var(--pills-padding);
    border-radius: 9999px;
    color: var(--pills-color);
    font-size: var(--pills-font-size);
    font-weight: 500;
    letter-spacing: -0.005em;
    white-space: nowrap;
    overflow: hidden;
    transition: color 160ms ease, background-color 160ms ease;
    cursor: pointer;

    .icon {
        flex-shrink: 0;
        font-size: 16px;
    }

    ${(props) => props.isSelected && `
        color: var(--pills-selected-color);
        pointer-events: none;
    `}
    ${(props) => (!props.isSelected && !props.isDisabled) && `
        &:hover {
            color: var(--pills-selected-color);
            background-color: color-mix(in srgb, var(--pills-selected-background) 55%, transparent);
        }
        &:active {
            background-color: color-mix(in srgb, var(--pills-selected-background) 80%, transparent);
        }
    `}
    ${(props) => props.isDisabled && `
        opacity: 0.5;
        pointer-events: none;
    `}
`;

const PillBadge = Styled(Badge)`
    position: static;
    flex-shrink: 0;
`;



/**
 * The Pill Tab Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PillTab(props) {
    const {
        isHidden, className, icon, message, badge,
        tooltip, tooltipVariant, tooltipWidth,
        url, value, index, selected, isDisabled, isFit, onClick,
    } = props;


    // The References
    const elementRef = React.useRef(null);

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Variables
    const id         = url ? NLS.url(url) : (value ?? index);
    const isSelected = Boolean(selected !== undefined && String(selected) === String(id));


    // Handles the Click
    const handleClick = () => {
        if (!isDisabled && onClick) {
            onClick(url || value);
        }
    };

    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip, tooltipWidth);
        }
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={elementRef}
        className={`pill-tab pill-tab-${id} ${isSelected ? "pill-tab-selected" : ""} ${className}`}
        isSelected={isSelected}
        isFit={isFit}
        isDisabled={isDisabled}
        onClick={handleClick}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        {!!icon && <Icon icon={icon} />}
        {!!message && NLS.get(message)}
        <PillBadge value={badge} />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PillTab.propTypes = {
    isHidden   : PropTypes.bool,
    className  : PropTypes.string,
    icon       : PropTypes.string,
    message    : PropTypes.string,
    badge      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    url        : PropTypes.string,
    value      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    index      : PropTypes.number,
    selected   : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    isDisabled : PropTypes.bool,
    isFit      : PropTypes.bool,
    onClick    : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PillTab.defaultProps = {
    tooltipVariant : "bottom",
    isHidden   : false,
    className  : "",
    index      : 0,
    isDisabled : false,
    isFit      : false,
};

export default PillTab;
