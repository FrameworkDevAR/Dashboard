import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import KeyCode              from "../../Utils/KeyCode";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import IconLink             from "../Link/IconLink";



// Styles
const InputIcon = Styled(IconLink)`
    margin-top: -4px;
    margin-right: -6px;
`;



/**
 * The Password Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PasswordInput(props) {
    const {
        inputRef, icon, postIcon, className, isFocused, isDisabled, isSmall,
        withBorder, withLabel,
        id, type, name, value, placeholder,
        autoComplete, spellCheck, generateCode, codeLength, codeSets,
        onChange, onClear, onInput, onFocus, onBlur,
        onKeyDown, onKeyUp, onSubmit, children,
    } = props;

    // The Current State
    const [ showPassword, setPassword ] = React.useState(false);

    const inputType = showPassword ? "text" : type;


    // Handles the Change
    const handleChange = (e) => {
        onChange(name, e.target.value);
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

    // Handles the Generate Code
    const handleGenerateCode = (e) => {
        onChange(name, Utils.generatePassword(codeLength, codeSets));
        e.preventDefault();
    };


    // Do the Render
    return <InputContent
        inputRef={inputRef}
        className={className}
        icon={icon}
        postIcon={postIcon}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isSmall={isSmall}
        onClear={onClear}
        showButton={generateCode}
        buttonMessage="GENERAL_GENERATE"
        onButton={handleGenerateCode}
        withBorder={withBorder}
        withLabel={withLabel}
        withPadding
    >
        <InputBase
            inputRef={inputRef}
            id={id}
            type={inputType}
            name={name}
            value={value}
            placeholder={placeholder}
            isDisabled={isDisabled}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            onChange={handleChange}
            onInput={onInput}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onKeyUp={handleKeyUp}
        />

        {children}
        <InputIcon
            variant="black"
            icon={showPassword ? "hide" : "view"}
            onClick={() => setPassword(!showPassword)}
            isSmall
        />
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PasswordInput.propTypes = {
    inputRef     : PropTypes.object,
    className    : PropTypes.string,
    icon         : PropTypes.string,
    postIcon     : PropTypes.string,
    isFocused    : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    isSmall      : PropTypes.bool,
    withBorder   : PropTypes.bool,
    withLabel    : PropTypes.bool,
    id           : PropTypes.string,
    type         : PropTypes.string.isRequired,
    name         : PropTypes.string,
    value        : PropTypes.any,
    placeholder  : PropTypes.string,
    autoComplete : PropTypes.string,
    spellCheck   : PropTypes.string,
    generateCode : PropTypes.bool,
    codeSets     : PropTypes.string,
    codeLength   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onChange     : PropTypes.func,
    onClear      : PropTypes.func,
    onInput      : PropTypes.func,
    onFocus      : PropTypes.func,
    onBlur       : PropTypes.func,
    onKeyDown    : PropTypes.func,
    onKeyUp      : PropTypes.func,
    onSubmit     : PropTypes.func,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PasswordInput.defaultProps = {
    className    : "",
    isFocused    : false,
    isDisabled   : false,
    isSmall      : false,
    withBorder   : true,
    withLabel    : true,
    placeholder  : "",
    autoComplete : "off",
};

export default PasswordInput;
