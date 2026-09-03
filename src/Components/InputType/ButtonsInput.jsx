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
const Container = Styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100%;
    gap: 4px;
    margin-top: 0;
    margin-bottom: -4px;
`;

const Item = Styled.div.attrs(({ withTexts, isDisabled, isSelected }) => ({ withTexts, isDisabled, isSelected }))`
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    padding: 3px 6px;
    font-size: 12px;
    color: var(--input-label-color);
    border-radius: var(--border-radius);
    transition: all 0.2s;

    ${(props) => props.withTexts && `
        flex-grow: 2;
    `}

    ${(props) => props.isDisabled ? `
        cursor: not-allowed;
        opacity: 0.5;
    ` : `
        cursor: pointer;
        &:hover {
            background: var(--lighter-gray);
        }
    `}

    ${(props) => props.isSelected && `
        background: var(--lighter-gray);
        color: var(--primary-color);
        .icon {
            color: var(--primary-color);
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
    const { itemKey, message, isSelected, isDisabled, withTexts, onClick } = props;

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
        isSelected={isSelected}
        isDisabled={isDisabled}
        withTexts={withTexts}
        onClick={onClick}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        <Iconography
            icon={itemKey}
            size="18"
            isSelected={isSelected}
        />
        {withTexts && NLS.get(message)}
    </Item>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ButtonsItem.propTypes = {
    itemKey    : PropTypes.string.isRequired,
    message    : PropTypes.string.isRequired,
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


    // Variables
    const items = InputType.useOptions(props);
    const val   = String(value);


    // Handles the Radio Change
    const handleClick = (newValue) => {
        onChange(name, newValue);
    };


    // Do the Render
    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withBorder
        withPadding
        withLabel={withLabel}
    >
        <Container>
            {items.map(({ key, value }) => <ButtonsItem
                key={key}
                itemKey={String(key)}
                message={value}
                isSelected={val === String(key)}
                isDisabled={isDisabled}
                withTexts={withTexts}
                onClick={() => handleClick(key)}
            />)}
        </Container>
    </InputContent>;
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
