import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";
import InputType            from "../../Core/InputType";

// Components
import InputContent         from "../Input/InputContent";
import Icon                 from "../Common/Icon";



// Constants
const TOOLTIP_DELAY = 0.2;

// Styles
const Content = Styled(InputContent)`
    --buttons-padding: 4px;
    --buttons-height: 38px;

    && {
        padding: var(--buttons-padding);
    }
`;

const Container = Styled.div`
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    gap: 4px;
`;

const Indicator = Styled.div.attrs(({ left, width, color }) => ({ left, width, color }))`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${(props) => props.width}px;
    translate: ${(props) => props.left}px;
    border-radius: calc(var(--input-border-radius, var(--border-radius)) - var(--buttons-padding));
    background: ${(props) => props.color ? `color-mix(in srgb, var(--${props.color}-color) 12%, transparent)` : "rgb(237, 241, 250)"};
    transition: translate 320ms cubic-bezier(0.34, 1.4, 0.4, 1), width 320ms cubic-bezier(0.34, 1.4, 0.4, 1);
`;

const Item = Styled.div.attrs(({ withTexts, isDisabled, isSelected, color }) => ({ withTexts, isDisabled, isSelected, color }))`
    box-sizing: border-box;
    position: relative;
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    min-height: calc(var(--buttons-height) - var(--buttons-padding) * 2 - 2px);
    padding: 4px 8px;
    font-size: 12px;
    color: var(--input-label-color);
    border-radius: calc(var(--input-border-radius, var(--border-radius)) - var(--buttons-padding));
    transition: all 0.2s;

    ${(props) => props.withTexts && `
        flex-grow: 2;
    `}

    ${(props) => props.isDisabled && `
        cursor: not-allowed;
        opacity: 0.5;
    `}
    ${(props) => (!props.isDisabled && !props.isSelected) && `
        cursor: pointer;
        &:hover {
            background: var(--lighter-gray);
        }
    `}

    ${(props) => props.isSelected && `
        color: ${props.color ? `var(--${props.color}-color)` : "var(--black-color)"};
        font-weight: 500;
        .icon {
            color: ${props.color ? `var(--${props.color}-color)` : "var(--black-color)"};
        }
    `}
`;

const Iconography = Styled(Icon).attrs(({ isSelected }) => ({ isSelected }))`
    flex-shrink: 0;
    color: var(--font-color);
`;



/**
 * The Buttons Input Item
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ButtonsItem(props) {
    const { icon, message, color, isSelected, isDisabled, withTexts, onClick } = props;

    const elementRef = React.useRef(null);

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Only the Items without a text need the Tooltip, as the icon alone does not name them,
    // and it opens sooner than the default second, as the name is what makes the Item usable
    const handleTooltip = () => {
        if (!withTexts) {
            showTooltip(elementRef, "top", message, 0, TOOLTIP_DELAY);
        }
    };


    // Do the Render
    return <Item
        ref={elementRef}
        className={isSelected ? "buttons-selected" : ""}
        color={color}
        isSelected={isSelected}
        isDisabled={isDisabled}
        withTexts={withTexts}
        onClick={onClick}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        {!!icon && <Iconography
            icon={icon}
            size="18"
            isSelected={isSelected}
        />}
        {withTexts && NLS.get(message)}
    </Item>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ButtonsItem.propTypes = {
    icon       : PropTypes.string,
    message    : PropTypes.string.isRequired,
    color      : PropTypes.string,
    isSelected : PropTypes.bool.isRequired,
    isDisabled : PropTypes.bool,
    withTexts  : PropTypes.bool,
    onClick    : PropTypes.func.isRequired,
};



/**
 * The Buttons Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ButtonsInput(props) {
    const {
        className, isFocused, isDisabled, withTexts, withLabel,
        name, value, onChange,
    } = props;


    // The References
    const containerRef = React.useRef(null);

    // The Current State
    const [ bounds, setBounds ] = React.useState({ left : 0, width : 0 });

    // Variables
    const items    = InputType.useOptions(props);
    const val      = String(value);
    const selected = items.find(({ key }) => String(key) === val);


    // Moves the Indicator to the selected Button, using the observer as the input can
    // mount with a size of zero, when it is inside a section that is closed
    React.useEffect(() => {
        const node = containerRef.current;
        if (!node) {
            return () => {};
        }

        const update = () => {
            const item = node.querySelector(".buttons-selected");
            if (item && item.offsetWidth) {
                setBounds({ left : item.offsetLeft, width : item.offsetWidth });
            }
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, [ val, items.length ]);


    // Handles the Radio Change
    const handleClick = (newValue) => {
        onChange(name, newValue);
    };


    // Do the Render
    return <Content
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withBorder
        withPadding
        withLabel={withLabel}
    >
        <Container ref={containerRef}>
            <Indicator
                left={bounds.left}
                width={bounds.width}
                color={selected?.color}
            />
            {items.map(({ key, value, icon, color }) => <ButtonsItem
                key={key}
                icon={icon || (withTexts ? "" : String(key).toLowerCase())}
                message={value}
                color={color}
                isSelected={val === String(key)}
                isDisabled={isDisabled}
                withTexts={withTexts}
                onClick={() => handleClick(key)}
            />)}
        </Container>
    </Content>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ButtonsInput.propTypes = {
    className  : PropTypes.string,
    isFocused  : PropTypes.bool,
    isDisabled : PropTypes.bool,
    withTexts  : PropTypes.bool,
    withLabel  : PropTypes.bool,
    name       : PropTypes.string.isRequired,
    value      : PropTypes.any,
    options    : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    onChange   : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ButtonsInput.defaultProps = {
    className  : "",
    withTexts  : false,
    withLabel  : false,
    isFocused  : false,
    isDisabled : false,
};

export default ButtonsInput;
