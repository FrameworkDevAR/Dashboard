import React                 from "react";
import PropTypes             from "prop-types";
import Styled, { keyframes } from "styled-components";

// Core
import NLS                   from "../../Core/NLS";
import Utils                 from "../../Utils/Utils";
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
const Container = Styled.div.attrs(({ columns, withSplit }) => ({ columns, withSplit }))`
    --radio-outer: var(--input-radio-outer, 20px);
    --radio-inner: var(--input-radio-inner, 12px);

    display: grid;
    grid-template-columns: ${(props) => `repeat(${props.columns}, 1fr)`};
    gap: 8px;
    margin-top: 4px;
    margin-bottom: 4px;
    width: 100%;

    ${(props) => props.withSplit && `
        margin-top: 0;
        margin-bottom: 0;
    `}

    @media (max-width: 400px) {
        display: flex;
        flex-direction: column;
    }
`;

const Item = Styled.div.attrs(({ isDisabled, isSelected, withSplit }) => ({ isDisabled, isSelected, withSplit }))`
    ${(props) => props.withSplit && `
        padding: var(--input-padding);
        border: 1px solid var(--input-border);
        border-radius: var(--input-border-radius, var(--border-radius));
        background-color: var(--content-color);
    `}
    ${(props) => (props.withSplit && props.isSelected) && `
        --input-border: var(--input-border-focus);
    `}
    ${(props) => (props.withSplit && !props.isDisabled && !props.isSelected) && `
        &:hover {
            --input-border: var(--input-border-hover);
        }
    `}
`;

const Label = Styled.label.attrs(({ isDisabled }) => ({ isDisabled }))`
    display: flex;
    align-items: center;
    font-size: var(--input-font);
    ${(props) => !props.isDisabled && "cursor: pointer;"}
`;

const Extra = Styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--main-gap);
    margin-top: var(--main-gap);
    margin-left: calc(var(--radio-outer) + 10px);
    padding-top: var(--main-gap);
    border-top: 1px solid var(--border-color-light);

    &:empty {
        display: none;
    }
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
    margin: 0 10px 0 calc(0px - var(--radio-outer));
    border: 2px solid var(--border-color-light);
    border-radius: 50%;
    transition: all 0.2s;
`;

const Iconography = Styled(Icon)`
    flex-shrink: 0;
    margin-right: 8px;
`;

const Content = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

const Text = Styled(Html)`
    flex-shrink: 0;
`;

const Description = Styled(Html)`
    color: var(--darkest-gray);
    font-size: var(--font-size-small);
    line-height: 1.4;
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
        className, isFocused, isDisabled, withLabel, withBorder,
        name, value, options, descriptions, withIcons, iconSize,
        withCustom, customText, columns, withSplit, getContent,
        onChange, onFocus, onBlur,
    } = props;


    // The References
    const inputRef  = React.useRef(null);

    // Variables
    const valString = String(value);
    const isSelect  = !Array.isArray(options);
    const items     = InputType.useOptions(props);
    const descItems = Array.isArray(descriptions) ? descriptions : NLS.select(descriptions);
    const valParts  = valString.split("|");
    const radioVal  = valParts.length > 1 ? valParts[0] : valString;
    const customVal = valParts.length > 1 ? valParts[1] : "";
    const customKey = props.customKey || "custom";


    // Returns the Description of an Option, from the Option itself or from the list
    // of descriptions that is given apart, the same as the Select does
    const getDescription = (key, description) => {
        if (description) {
            return description;
        }
        return Utils.getValue(descItems, "key", key, "value");
    };


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
        withBorder={withBorder && !withSplit}
        withPadding={withBorder && !withSplit}
        withLabel={withLabel}
    >
        <Container columns={columns} withSplit={withSplit}>
            {items.map(({ key, value, icon, description }) => <Item
                key={key}
                isDisabled={isDisabled}
                isSelected={radioVal === String(key)}
                withSplit={withSplit}
            >
                <Label isDisabled={isDisabled}>
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
                        icon={icon || key.toLowerCase()}
                        size={iconSize}
                    />}
                    <Content>
                        <Text>{NLS.get(value)}</Text>
                        <Description
                            isHidden={!getDescription(key, description)}
                            message={getDescription(key, description)}
                        />
                    </Content>
                </Label>
                {!!getContent && <Extra>
                    {getContent(key)}
                </Extra>}
            </Item>)}
            {withCustom && <Item
                isSelected={radioVal === customKey}
                withSplit={withSplit}
            >
                <Label>
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
                </Label>
            </Item>}
        </Container>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
RadioInput.propTypes = {
    className    : PropTypes.string,
    isFocused    : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    withLabel    : PropTypes.bool,
    withBorder   : PropTypes.bool,
    name         : PropTypes.string.isRequired,
    value        : PropTypes.any,
    options      : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    descriptions : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    onChange     : PropTypes.func.isRequired,
    onFocus      : PropTypes.func.isRequired,
    onBlur       : PropTypes.func.isRequired,
    withIcons    : PropTypes.bool,
    iconSize     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withCustom   : PropTypes.bool,
    withSplit    : PropTypes.bool,
    getContent   : PropTypes.func,
    customText   : PropTypes.string,
    customKey    : PropTypes.string,
    columns      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
RadioInput.defaultProps = {
    className  : "",
    isFocused  : false,
    isDisabled : false,
    withBorder : true,
    withIcons  : false,
    iconSize   : 16,
    customText : "",
    customKey  : "",
    withCustom : false,
    withSplit  : false,
    columns    : 1,
};

export default RadioInput;
