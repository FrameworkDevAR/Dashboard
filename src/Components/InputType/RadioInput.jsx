import React                 from "react";
import PropTypes             from "prop-types";
import Styled, { keyframes } from "styled-components";

// Core
import NLS                   from "../../Core/NLS";
import InputType             from "../../Core/InputType";

// Components
import InputContent          from "../Input/InputContent";
import InputBase             from "../Input/InputBase";
import Icon                  from "../Common/Icon";
import Html                  from "../Common/Html";



// Animations
const tick = keyframes`
    from { transform: scale(0); }
    to   { transform: scale(1); }
`;

// Styles
const Container = Styled.div.attrs(({ columns }) => ({ columns }))`
    --radio-outer: var(--input-radio-outer, 20px);
    --radio-inner: var(--input-radio-inner, 12px);

    display: grid;
    grid-template-columns: ${(props) => `repeat(${props.columns}, 1fr)`};
    gap: 8px;
    margin-top: 4px;
    margin-bottom: 4px;
    width: 100%;

    @media (max-width: 400px) {
        display: flex;
        flex-direction: column;
    }
`;

const Label = Styled.label.attrs(({ isDisabled }) => ({ isDisabled }))`
    display: flex;
    align-items: center;
    font-size: var(--input-font);
    ${(props) => !props.isDisabled && "cursor: pointer;"}
`;

const Radio = Styled.input`
    flex-shrink: 0;
    width: var(--radio-outer);
    height: var(--radio-outer);
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    opacity: 0;

    &:focus + span {
        border-color: var(--border-color-dark);
        outline: none;
    }

    &:checked + span {
        border-color: var(--input-radio-normal);
    }
    &:checked + span::before {
        content: "";
        display: block;
        position: absolute;
        top: calc(50% - var(--radio-inner) / 2);
        left: calc(50% - var(--radio-inner) / 2);
        width: var(--radio-inner);
        height: var(--radio-inner);
        border-radius: 50%;
        border-color: var(--border-color-dark);
        background-color: var(--input-radio-normal);
        animation: ${tick} 0.4s cubic-bezier(0.175, 0.885, 0.320, 1.275);
    }

    &:disabled + span {
        background-color: rgb(245, 245, 245);
        color: rgb(175, 175, 175);
        cursor: not-allowed;
    }
    &:disabled:checked + span {
        border-color: var(--input-radio-disabled);
    }
    &:disabled:checked + span::before {
        background-color: var(--input-radio-disabled);
    }
`;

const Span = Styled.span`
    flex-shrink: 0;
    position: relative;
    box-sizing: border-box;
    display: block;
    height: var(--radio-outer);
    width: var(--radio-outer);
    margin: 0 8px 0 calc(0px - var(--radio-outer));
    border: 2px solid var(--border-color-light);
    border-radius: 50%;
    transition: all 0.2s;
`;

const Iconography = Styled(Icon)`
    flex-shrink: 0;
    margin-right: 8px;
`;

const Text = Styled(Html)`
    flex-shrink: 0;
    max-width: calc(100% - 20px);
`;

const Input = Styled(InputBase)`
    padding: 2px 8px;
    border-bottom: 1px solid var(--input-border);
`;



/**
 * The Radio Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function RadioInput(props) {
    const {
        className, isFocused, isDisabled, withLabel, noBorder,
        name, value, options, withIcons, iconSize,
        withCustom, customText, columns,
        onChange, onFocus, onBlur,
    } = props;


    // The References
    const inputRef  = React.useRef(null);

    // Variables
    const valString = String(value);
    const isSelect  = !Array.isArray(options);
    const items     = InputType.useOptions(props);
    const valParts  = valString.split("|");
    const radioVal  = valParts.length > 1 ? valParts[0] : valString;
    const customVal = valParts.length > 1 ? valParts[1] : "";
    const customKey = props.customKey || "custom";


    // Handles the Radio Change
    const handleCheck = (e, newValue) => {
        if (withCustom) {
            if (e.target.checked) {
                onChange(name, `${newValue}|${customVal}`);
            } else {
                onChange(name, `|${customVal}`);
            }
        } else {
            onChange(name, e.target.checked ? newValue : "");
        }
    };

    // Handles the Custom Radio Change
    const handleCustom = (e) => {
        handleCheck(e, customKey);
        const node = inputRef.current;
        if (e.target.checked && node) {
            // @ts-ignore
            node.focus();
        }
    };

    // Handles the Custom Input Change
    const handleChange = (e) => {
        onChange(name, `${customKey}|${e.target.value}`);
    };


    // Do the Render
    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withBorder={!noBorder}
        withPadding={!noBorder}
        withLabel={withLabel}
    >
        <Container columns={columns}>
            {items.map(({ key, value }) => <Label
                key={key}
                isDisabled={isDisabled}
            >
                <Radio
                    type="radio"
                    name={`${name}-${key}`}
                    value={isSelect ? key : value}
                    checked={radioVal === String(key)}
                    onChange={(e) => handleCheck(e, key)}
                    disabled={isDisabled}
                />
                <Span />
                {withIcons && <Iconography
                    icon={key.toLowerCase()}
                    size={iconSize}
                />}
                <Text>{NLS.get(value)}</Text>
            </Label>)}
            {withCustom && <Label>
                <Radio
                    type="radio"
                    name={`${name}-${customKey}`}
                    value={customKey}
                    checked={radioVal === customKey}
                    onChange={handleCustom}
                    disabled={isDisabled}
                />
                <Span />
                <Text>{NLS.get(customText || "GENERAL_OTHER")}</Text>
                <Input
                    inputRef={inputRef}
                    type="text"
                    name={`${name}-${customKey}-value`}
                    value={customVal}
                    isDisabled={isDisabled}
                    onChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </Label>}
        </Container>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
RadioInput.propTypes = {
    className  : PropTypes.string,
    isFocused  : PropTypes.bool,
    isDisabled : PropTypes.bool,
    withLabel  : PropTypes.bool,
    noBorder   : PropTypes.bool,
    name       : PropTypes.string.isRequired,
    value      : PropTypes.any,
    options    : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    onChange   : PropTypes.func.isRequired,
    onFocus    : PropTypes.func.isRequired,
    onBlur     : PropTypes.func.isRequired,
    withIcons  : PropTypes.bool,
    iconSize   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withCustom : PropTypes.bool,
    customText : PropTypes.string,
    customKey  : PropTypes.string,
    columns    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
RadioInput.defaultProps = {
    className  : "",
    isFocused  : false,
    isDisabled : false,
    withIcons  : false,
    iconSize   : 16,
    customText : "",
    customKey  : "",
    withCustom : false,
    columns    : 1,
};

export default RadioInput;
