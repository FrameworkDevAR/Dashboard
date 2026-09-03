import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import InputType            from "../../Core/InputType";

// Components
import InputContent         from "../Input/InputContent";



// Constants
const MAX_CHIPS = 20;

// Styles
const Container = Styled.div.attrs(({ isBigger }) => ({ isBigger }))`
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    margin-bottom: ${(props) => props.isBigger ? "0" : "-2px"};
`;

const Chip = Styled.button.attrs(({ isSelected, isBigger }) => ({ type : "button", isSelected, isBigger }))`
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    min-width: 28px;
    padding: 0 8px;
    border: 1px solid var(--input-border-color);
    border-radius: var(--border-radius);
    background-color: var(--content-color);
    color: var(--font-light);
    font-family: var(--main-font);
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: var(--input-border-hover);
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    ${(props) => props.isBigger && `
        height: 32px;
        min-width: 36px;
        padding: 0 12px;
        font-size: 13px;
    `}
    ${(props) => props.isSelected && `
        border-color: var(--border-color-medium);
        background-color: var(--lighter-gray);
    `}
`;

const DashedChip = Styled(Chip)`
    border-style: dashed;
    color: var(--font-lighter);
`;

const Stepper = Styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const Step = Styled.button.attrs(({ isBigger }) => ({ type : "button", isBigger }))`
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 22px;
    height: 24px;
    padding: 0;

    ${(props) => props.isBigger && `
        width: 28px;
        height: 32px;
    `}
    border: 1px solid var(--input-border-color);
    border-radius: var(--border-radius);
    background-color: var(--content-color);
    color: var(--font-light);
    font-family: var(--main-font);
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: var(--input-border-hover);
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const Amount = Styled.div`
    min-width: 16px;
    color: var(--title-color);
    font-size: 12.5px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: center;
`;



/**
 * The Chips Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ChipsInput(props) {
    const {
        className, isFocused, isDisabled, isMultiple, withBorder, withCustom,
        name, value, minValue, maxValue, onChange,
    } = props;


    // Variables
    const items     = InputType.useOptions(props);
    const amount    = Number(value) || 0;

    // The Options replace the amounts when given, so the Chips pick one of them or many
    const hasItems  = items.length > 0;
    const hasCustom = withCustom && !hasItems;

    // Any amount over the last Chip is a custom one, so the state of the
    // Stepper is read from the value and there is nothing else to store
    const isCustom  = hasCustom && amount > maxValue;

    const chips     = [];
    if (hasItems) {
        for (const item of items) {
            chips.push({ key : item.key, text : NLS.get(item.value) });
        }
    } else {
        // The maximum can come from an Input that never set one, and that amount of Chips
        // is not something that can be shown, so the last one is capped
        const lastValue = Math.min(maxValue, minValue + MAX_CHIPS);
        for (let i = minValue; i <= lastValue; i += 1) {
            chips.push({ key : i, text : String(i) });
        }
    }

    // The value of a multiple is the json of the list, as in the other inputs that pick many
    const parts = React.useMemo(() => {
        let result = [];
        if (!isMultiple) {
            return result;
        }
        try {
            result = Array.isArray(value) ? value : JSON.parse(String(value));
        } catch (e) {
            result = [];
        }
        return result.map((item) => String(item));
    }, [ isMultiple, JSON.stringify(value) ]);


    // Returns true if the given Chip is selected
    const isSelected = (key) => {
        if (isMultiple) {
            return parts.includes(String(key));
        }
        if (hasItems) {
            return String(value) === String(key);
        }
        return amount === key;
    };

    // Handles the Click of a Chip
    const handleClick = (key) => {
        if (!isMultiple) {
            onChange(name, key);
            return;
        }

        const newKey = String(key);
        const keys   = parts.includes(newKey)
            ? parts.filter((elem) => elem !== newKey)
            : [ ...parts, newKey ];

        // The result keeps the order of the Chips, so any click order gives the same value
        onChange(name, JSON.stringify(chips
            .map((chip) => String(chip.key))
            .filter((elem) => keys.includes(elem))));
    };

    // Handles the Step of the custom amount
    const handleStep = (step) => {
        onChange(name, Math.max(maxValue + 1, amount + step));
    };

    // Handles the Custom, which starts over the last Chip
    const handleCustom = () => {
        onChange(name, Math.max(maxValue + 1, amount));
    };

    // Handles the Back, which returns to the Chips
    const handleBack = () => {
        onChange(name, Math.min(maxValue, amount || minValue));
    };


    // Do the Render
    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withBorder={withBorder}
        withPadding={withBorder}
        withLabel={withBorder}
    >
        <Container isBigger={!withBorder}>
            {!isCustom && chips.map((chip) => <Chip
                key={chip.key}
                isSelected={isSelected(chip.key)}
                isBigger={!withBorder}
                disabled={isDisabled}
                onClick={() => handleClick(chip.key)}
            >{chip.text}</Chip>)}

            {isCustom && <DashedChip
                isBigger={!withBorder}
                disabled={isDisabled}
                onClick={handleBack}
            >{`${minValue}–${maxValue}`}</DashedChip>}

            {hasCustom && (isCustom ? <Chip
                isSelected
                isBigger={!withBorder}
                disabled={isDisabled}
                onClick={handleBack}
            >{`${maxValue}+`}</Chip> : <DashedChip
                isBigger={!withBorder}
                disabled={isDisabled}
                onClick={handleCustom}
            >{`${maxValue}+`}</DashedChip>)}

            {isCustom && <Stepper>
                <Step
                    isBigger={!withBorder}
                    disabled={isDisabled || amount <= maxValue + 1}
                    onClick={() => handleStep(-1)}
                >−</Step>
                <Amount>{amount}</Amount>
                <Step
                    isBigger={!withBorder}
                    disabled={isDisabled}
                    onClick={() => handleStep(1)}
                >+</Step>
            </Stepper>}
        </Container>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ChipsInput.propTypes = {
    className  : PropTypes.string,
    isFocused  : PropTypes.bool,
    isDisabled : PropTypes.bool,
    isMultiple : PropTypes.bool,
    withBorder : PropTypes.bool,
    withCustom : PropTypes.bool,
    name       : PropTypes.string.isRequired,
    value      : PropTypes.any,
    options    : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    minValue   : PropTypes.number,
    maxValue   : PropTypes.number,
    onChange   : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ChipsInput.defaultProps = {
    className  : "",
    isFocused  : false,
    isDisabled : false,
    isMultiple : false,
    withBorder : true,
    withCustom : false,
    minValue   : 0,
    maxValue   : 5,
};

export default ChipsInput;
