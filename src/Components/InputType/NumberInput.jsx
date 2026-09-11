import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import KeyCode              from "../../Utils/KeyCode";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import IconLink             from "../Link/IconLink";



// Styles
const Step = Styled(IconLink).attrs(({ isLast }) => ({ isLast }))`
    flex-shrink: 0;
    align-self: stretch;
    height: auto;
    margin: 0;

    ${(props) => props.isLast ? `
        margin-right: calc(var(--input-vert-padding) - var(--input-horiz-padding));
    ` : `
        margin-left: calc(var(--input-vert-padding) - var(--input-horiz-padding));
    `}
`;

const Suffix = Styled.p`
    flex-shrink: 0;
    margin: 0;
    font-size: 12px;
    color: var(--input-label-color);
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
        id, name, value, step, decimals, minValue, maxValue, placeholder, withSteps,
        onChange, onInput, onPaste, onClear,
        onFocus, onBlur, onKeyDown, onKeyUp, onSubmit,
    } = props;

    // Variables
    const minNumber = minValue === undefined || minValue === null ? Number.MIN_SAFE_INTEGER : Number(minValue);
    const maxNumber = maxValue === undefined || maxValue === null ? Number.MAX_SAFE_INTEGER : Number(maxValue);

    // With steps the suffix is drawn here and not by the Input Content, as that one adds it
    // after the children and the plus has to be the last thing of the field
    const hasStepSuffix = Boolean(withSteps && suffixText);

    // A step with decimals adds up with the errors of the floats, so every value that a step
    // makes is rounded to the decimals that the field takes, which are those of the step
    // unless the field says that it takes more
    const stepDecimals = (String(step).split(".")[1] || "").length;
    const maxDecimals  = decimals === undefined || decimals === null ? stepDecimals : Math.max(Number(decimals), stepDecimals);


    // Returns the Value where a step starts. An empty field starts at the number of the
    // placeholder, as that is the value it shows, and at zero when it is not a number.
    // The placeholder can be written with a decimal comma, as the field shows its value so
    const getBaseValue = () => {
        if (value !== "" && value !== null && value !== undefined) {
            return Number(value);
        }
        const holder = Number(String(placeholder).replace(",", "."));
        return placeholder && !isNaN(holder) ? holder : 0;
    };

    // Returns the size of a step with the modifiers of the Event: a tenth of it with Alt, only
    // when the field takes more decimals than its step, and a hundred or ten times it with
    // Cmd or Ctrl and with Shift, so a big value does not have to be reached one at a time
    const getStepSize = (e) => {
        if (e.altKey && maxDecimals > stepDecimals) {
            return Number(step) / 10;
        }
        if (e.metaKey || e.ctrlKey) {
            return Number(step) * 100;
        }
        return Number(step) * (e.shiftKey ? 10 : 1);
    };

    // The steps fill the height of the field and pull themselves out by the difference of the
    // two paddings, so the two buttons end up with the same space on their four sides


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
            const amount = e.keyCode === KeyCode.DOM_VK_UP ? 1 : -1;
            val          = getBaseValue() + amount * getStepSize(e);

            if (isNaN(val) || val < minNumber) {
                val = minNumber;
            } else if (maxNumber !== 0 && val > maxNumber) {
                val = maxNumber;
            }
            onChange(name, maxDecimals ? Number(val.toFixed(maxDecimals)) : val);
            e.preventDefault();
            e.stopPropagation();
        }
        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    // Handles the Step, which adds or removes the amount of a step, with the same modifiers
    // as the arrow keys
    const handleStep = (e, amount) => {
        let val = getBaseValue() + amount * getStepSize(e);
        if (isNaN(val) || val < minNumber) {
            val = minNumber;
        } else if (maxNumber !== 0 && val > maxNumber) {
            val = maxNumber;
        }
        onChange(name, maxDecimals ? Number(val.toFixed(maxDecimals)) : val);
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
        suffixText={hasStepSuffix ? "" : suffixText}
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
            onClick={(e) => handleStep(e, -1)}
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
        {hasStepSuffix && <Suffix>{NLS.get(suffixText)}</Suffix>}
        {withSteps && <Step
            variant="black"
            icon="plus"
            onClick={(e) => handleStep(e, 1)}
            isDisabled={isDisabled}
            isLast
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
    decimals    : PropTypes.number,
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
    minValue    : 0,
    withSteps   : false,
};

export default NumberInput;
