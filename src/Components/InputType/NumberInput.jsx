import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import KeyCode              from "../../Utils/KeyCode";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import IconLink             from "../Link/IconLink";



// Styles
const Step = Styled(IconLink)`
    flex-shrink: 0;
    margin: -4px 0;
`;

const Input = Styled(InputBase).attrs(({ withSteps }) => ({ withSteps }))`
    ${(props) => props.withSteps && `
        text-align: center;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            appearance: none;
            margin: 0;
        }
    `}
`;



/**
 * The Number Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function NumberInput(props) {
    const {
        inputRef, className, icon, postIcon, prefixText, suffixText,
        isFocused, isDisabled, isSmall, withBorder, withLabel,
        id, name, value, step, minValue, maxValue, placeholder, withSteps,
        onChange, onInput, onPaste, onClear,
        onFocus, onBlur, onKeyDown, onKeyUp, onSubmit,
    } = props;

    // Variables
    const minNumber = minValue === undefined || minValue === null ? Number.MIN_SAFE_INTEGER : Number(minValue);
    const maxNumber = maxValue === undefined || maxValue === null ? Number.MAX_SAFE_INTEGER : Number(maxValue);


    // Handles a Change
    const handleChange = (e) => {
        onChange(name, e.target.value);
    };

    // Handles the Input
    const handleInput = (e) => {
        if (onInput) {
            onInput(name, e.target.value);
        }
    };

    // Handles the Key Down
    const handleKeyDown = (e) => {
        let val = value;
        if (e.keyCode === KeyCode.DOM_VK_UP || e.keyCode === KeyCode.DOM_VK_DOWN) {
            const mult   = e.metaKey ? 100 : (e.shiftKey ? 10 : 1);
            const amount = e.keyCode === KeyCode.DOM_VK_UP ? 1 : -1;
            val          = Number(val) + amount * mult * Number(step);

            if (isNaN(value) || val < minNumber) {
                val = minNumber;
            } else if (maxNumber !== 0 && val > maxNumber) {
                val = maxNumber;
            }
            onChange(name, val);
            e.preventDefault();
            e.stopPropagation();
        }
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    // Handles the Step, which adds or removes the amount of a step
    const handleStep = (amount) => {
        let val = Number(value || 0) + amount * Number(step);
        if (isNaN(val) || val < minNumber) {
            val = minNumber;
        } else if (maxNumber !== 0 && val > maxNumber) {
            val = maxNumber;
        }
        onChange(name, val);
    };

    // Handles the Key Up
    const handleKeyUp = (e) => {
        if (e.keyCode === KeyCode.DOM_VK_RETURN && onSubmit) {
            onSubmit();
        }
        if (onKeyUp) {
            onKeyUp(e);
        }
    };


    // Do the Render
    return <InputContent
        inputRef={inputRef}
        className={className}
        icon={icon}
        postIcon={postIcon}
        prefixText={prefixText}
        suffixText={suffixText}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isSmall={isSmall}
        onClear={onClear}
        withBorder={withBorder}
        withLabel={withLabel}
        withPadding
    >
        {withSteps && <Step
            variant="black"
            icon="minus"
            onClick={() => handleStep(-1)}
            isDisabled={isDisabled}
            isSmall
        />}
        <Input
            inputRef={inputRef}
            withSteps={withSteps}
            type="number"
            id={id}
            name={name}
            value={value}
            step={step}
            minValue={minValue}
            maxValue={maxValue}
            placeholder={placeholder}
            isDisabled={isDisabled}
            onChange={handleChange}
            onInput={handleInput}
            onPaste={onPaste}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
        />
        {withSteps && <Step
            variant="black"
            icon="plus"
            onClick={() => handleStep(1)}
            isDisabled={isDisabled}
            isSmall
        />}
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
NumberInput.propTypes = {
    inputRef    : PropTypes.any,
    className   : PropTypes.string,
    icon        : PropTypes.string,
    postIcon    : PropTypes.string,
    prefixText  : PropTypes.string,
    suffixText  : PropTypes.string,
    isFocused   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    isSmall     : PropTypes.bool,
    withBorder  : PropTypes.bool,
    withLabel   : PropTypes.bool,
    id          : PropTypes.string,
    name        : PropTypes.string.isRequired,
    placeholder : PropTypes.string,
    value       : PropTypes.any,
    step        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minValue    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxValue    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withSteps   : PropTypes.bool,
    onChange    : PropTypes.func.isRequired,
    onInput     : PropTypes.func,
    onPaste     : PropTypes.func,
    onClear     : PropTypes.func,
    onFocus     : PropTypes.func,
    onBlur      : PropTypes.func,
    onKeyDown   : PropTypes.func,
    onKeyUp     : PropTypes.func,
    onSubmit    : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
NumberInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    isSmall     : false,
    withBorder  : true,
    withLabel   : true,
    placeholder : "",
    step        : "1",
    withSteps   : false,
};

export default NumberInput;
