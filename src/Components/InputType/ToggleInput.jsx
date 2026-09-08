import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import Html                 from "../Common/Html";



// Styles
const Label = Styled.label.attrs(({ isDisabled, rightToggle }) => ({ isDisabled, rightToggle }))`
    position: relative;
    display: flex;
    align-items: center;

    --toggle-size: 16px;
    --toggle-spacing: 3px;

    ${(props) => !props.isDisabled && "cursor: pointer;"}

    ${(props) => props.rightToggle && `
        width: 100%;
        justify-content: space-between;
    `}
`;

const Input = Styled.input`
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;

    &:checked + span {
        background: var(--input-toggle-checked);
    }
    &:checked + span::after {
        transform: translateX(var(--toggle-size));
    }
    &:disabled + span {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Span = Styled.span.attrs(({ rightToggle }) => ({ rightToggle }))`
    position: relative;
    box-sizing: border-box;
    flex-shrink: 0;
    display: block;
    margin-right: 12px;
    background: var(--input-toggle-bg);
    width: calc(var(--toggle-size) * 2 + var(--toggle-spacing) * 2);
    height: calc(var(--toggle-size) + var(--toggle-spacing) * 2);
    border-radius: var(--toggle-size);
    cursor: pointer;

    &::after {
        content: "";
        position: absolute;
        top: var(--toggle-spacing);
        left: var(--toggle-spacing);
        width: var(--toggle-size);
        height: var(--toggle-size);
        border-radius: 50%;
        background: var(--input-toggle-circle);
        transition: all .2s;
    }

    ${(props) => props.rightToggle && `
        order: 1;
        margin-right: 0;
        margin-left: 12px;
    `}
`;



const Content = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

const Text = Styled(Html).attrs(({ rightToggle }) => ({ rightToggle }))`
    ${(props) => props.rightToggle && `
        color: var(--black-color);
        font-size: 13px;
        font-weight: 500;
    `}
`;

const Helper = Styled(Html)`
    color: var(--darkest-gray);
    font-size: var(--font-size-small);
`;



/**
 * The Toggle Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ToggleInput(props) {
    const {
        inputRef, className, isFocused, isDisabled, withBorder, rightToggle,
        name, value, label, helperText, onChange, onFocus, onBlur,
    } = props;

    // Handles the Checkbox Change
    const handleChange = (e) => {
        onChange(name, e.target.checked ? 1 : 0);
    };

    // Handles the Click
    const handleClick = (e) => {
        if (withBorder) {
            Utils.triggerClick(inputRef);
            e.preventDefault();
            e.stopPropagation();
        }
    };


    // Do the Render
    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        onClick={handleClick}
        withBorder={withBorder}
        withClick={withBorder}
        withPadding
    >
        <Label isDisabled={isDisabled} rightToggle={rightToggle}>
            <Input
                ref={inputRef}
                type="checkbox"
                name={name}
                value="1"
                checked={value}
                disabled={isDisabled}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <Span rightToggle={rightToggle} />
            {!!label && <Content>
                <Text variant="span" rightToggle={rightToggle}>
                    {NLS.get(label)}
                </Text>
                {(!!helperText && rightToggle) && <Helper variant="span">
                    {NLS.get(helperText)}
                </Helper>}
            </Content>}
        </Label>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ToggleInput.propTypes = {
    inputRef    : PropTypes.any,
    className   : PropTypes.string,
    isFocused   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    withBorder  : PropTypes.bool,
    rightToggle : PropTypes.bool,
    name        : PropTypes.string,
    value       : PropTypes.any,
    label       : PropTypes.string,
    helperText  : PropTypes.string,
    onChange    : PropTypes.func.isRequired,
    onFocus     : PropTypes.func.isRequired,
    onBlur      : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ToggleInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    withBorder  : false,
    rightToggle : false,
};

export default ToggleInput;
