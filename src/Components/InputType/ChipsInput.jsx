import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import InputContent         from "../Input/InputContent";



// Styles
const Container = Styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    margin-bottom: -2px;
`;

const Chip = Styled.button.attrs(({ isSelected }) => ({ type : "button", isSelected }))`
    box-sizing: border-box;
    height: 24px;
    min-width: 28px;
    padding: 0 8px;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-small);
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
        border-color: var(--primary-color);
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    ${(props) => props.isSelected && `
        border-color: var(--primary-color);
        background-color: var(--accent-light, var(--lightest-gray));
        color: var(--primary-color);
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

const Step = Styled.button.attrs(() => ({ type : "button" }))`
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 22px;
    height: 24px;
    padding: 0;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-small);
    background-color: var(--content-color);
    color: var(--font-light);
    font-family: var(--main-font);
    font-size: 13px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: var(--primary-color);
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
        className, isFocused, isDisabled, withCustom,
        name, value, minValue, maxValue, onChange,
    } = props;


    // Variables
    const amount = Number(value) || 0;

    // Any amount over the last Chip is a custom one, so the state of the
    // Stepper is read from the value and there is nothing else to store
    const isCustom = withCustom && amount > maxValue;

    const chips    = [];
    for (let i = minValue; i <= maxValue; i += 1) {
        chips.push(i);
    }


    // Handles the Click of a Chip
    const handleClick = (newAmount) => {
        onChange(name, newAmount);
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
        withBorder
        withPadding
        withLabel
    >
        <Container>
            {!isCustom && chips.map((chip) => <Chip
                key={chip}
                isSelected={amount === chip}
                disabled={isDisabled}
                onClick={() => handleClick(chip)}
            >{chip}</Chip>)}

            {isCustom && <DashedChip
                disabled={isDisabled}
                onClick={handleBack}
            >{`${minValue}–${maxValue}`}</DashedChip>}

            {withCustom && (isCustom ? <Chip
                isSelected
                disabled={isDisabled}
                onClick={handleBack}
            >{`${maxValue}+`}</Chip> : <DashedChip
                disabled={isDisabled}
                onClick={handleCustom}
            >{`${maxValue}+`}</DashedChip>)}

            {isCustom && <Stepper>
                <Step
                    disabled={isDisabled || amount <= maxValue + 1}
                    onClick={() => handleStep(-1)}
                >−</Step>
                <Amount>{amount}</Amount>
                <Step
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
    withCustom : PropTypes.bool,
    name       : PropTypes.string.isRequired,
    value      : PropTypes.any,
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
    withCustom : false,
    minValue   : 0,
    maxValue   : 5,
};

export default ChipsInput;
