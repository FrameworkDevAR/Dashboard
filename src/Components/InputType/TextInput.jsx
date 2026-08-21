import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import InputType            from "../../Core/InputType";
import KeyCode              from "../../Utils/KeyCode";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import InputOptions         from "../Input/InputOptions";
import InputOption          from "../Input/InputOption";
import IconLink             from "../Link/IconLink";



// Styles
const Children = Styled.div`
    display: flex;
    align-items: center;
    margin-top: -4px;
    margin-right: -6px;
`;

const Text = Styled.p.attrs(({ atMaxLength, hasButtons }) => ({ atMaxLength, hasButtons }))`
    margin: 0;
    margin-right: ${(props) => props.hasButtons ? "8px" : "0"};
    font-size: 12px;
    color: ${(props) => props.atMaxLength ? "var(--error-color)" : "var(--darkest-gray)"};
`;



/**
 * The Text Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TextInput(props) {
    const {
        inputRef, className, icon, postIcon, prefixText, suffixText,
        isFocused, isDisabled, isSmall, withBorder, withLabel, withInsideCnt,
        id, type, name, value, minValue, maxValue,
        placeholder, autoComplete, spellCheck,
        generateCode, codeLength, codeSets,
        onChange, onInput, onPaste, onClear,
        onFocus, onBlur, onKeyDown, onKeyUp, onSubmit,
        maxLength, children,
    } = props;


    // The References
    const containerRef   = React.useRef(null);
    const optionsRef     = React.useRef(null);
    const selectedIdxRef = React.useRef(-1);
    const selectedValRef = React.useRef("");

    // The Current State
    const [ showOptions, setShowOptions ] = React.useState(false);
    const [ timer,       setTimer       ] = React.useState(null);
    const [ bounds,      setBounds      ] = React.useState({ top : 0, left : 0, width : 0, maxHeight : 0 });
    const [ update,      setUpdate      ] = React.useState(0);


    // Clear the Timer
    React.useEffect(() => {
        return () => {
            if (timer) {
                window.clearTimeout(timer);
            }
        };
    }, [ timer ]);

    // Update the Selected Index on Value Change
    React.useEffect(() => {
        if (showOptions) {
            setSelectedIndex(value);
            setUpdate(update + 1);
        }
    }, [ value ]);

    // Sets the Selected Index
    const setSelectedIndex = (value) => {
        if (value) {
            selectedIdxRef.current = options.findIndex((option) => String(option.value) === String(value)) ?? -1;
            selectedValRef.current = options.find((option) => String(option.value) === String(value))?.value ?? "";
        } else {
            selectedIdxRef.current = -1;
            selectedValRef.current = "";
        }
    };


    // Returns the Value
    const getValue = (e) => {
        const text = String(e.target.value);
        if (maxLength && text.length > maxLength) {
            return text.substring(0, maxLength);
        }
        return e.target.value;
    };

    // Handles the Change
    const handleChange = (e) => {
        onChange(name, getValue(e));
    };

    // Handles the Input
    const handleInput = (e) => {
        if (onInput) {
            onInput(name, getValue(e));
        }
    };

    // Handles the Select
    const handleSelect = (e, value) => {
        e.stopPropagation();
        onChange(name, value);
    };

    // Handles the Click
    const handleClick = () => {
        if (!showOptions) {
            inputRef.current.focus();
            setShowOptions(true);
        }
    };

    // Handles the Focus
    const handleFocus = () => {
        const bounds = Utils.getBounds(containerRef);
        setBounds({
            top       : bounds.bottom,
            left      : bounds.left,
            width     : bounds.width,
            maxHeight : window.innerHeight - bounds.bottom - 10,
        });
        setShowOptions(true);
        setSelectedIndex(value);
        onFocus();
    };

    // Handles the Blur
    const handleBlur = () => {
        setTimer(window.setTimeout(() => {
            setShowOptions(false);
            setTimer(null);
            onBlur();
        }, 200));
    };

    // Handles the Key Down
    const handleKeyDown = (e) => {
        // Only the Options use the navigation keys, so without them the Input keeps them,
        // as the date and number inputs change their value with the up and down arrows
        if (hasOptions) {
            if (Utils.isSpecialKey(e.keyCode)) {
                return;
            }
            const [ newIndex, handled ] = Utils.handleKeyNavigation(e.keyCode, selectedIdxRef.current, options.length);
            if (handled) {
                e.preventDefault();
                selectedIdxRef.current = newIndex;
                selectedValRef.current = options[newIndex]?.value;
                setUpdate(update + 1);
            }
        }

        if (onKeyDown) {
            onKeyDown(e);
        }
    };

    // Handles the Key Up
    const handleKeyUp = (e) => {
        switch (e.keyCode) {
        case KeyCode.DOM_VK_ESCAPE:
            if (showOptions) {
                setShowOptions(false);
                e.stopPropagation();
            }
            break;
        case KeyCode.DOM_VK_RETURN:
            if (!hasOptions && onSubmit) {
                onSubmit();
            } else if (hasOptions) {
                if (selectedValRef.current) {
                    handleSelect(e, selectedValRef.current);
                }
                inputRef.current.blur();
            }
            break;
        default:
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


    // Variables
    const showMaxLength = Boolean(withInsideCnt && maxLength);
    const characters    = String(value || "").length;
    const atMaxLength   = characters > maxLength;
    const hasButtons    = Boolean((children && children.length) || generateCode);

    const options       = InputType.useOptions(props);
    const hasOptions    = Boolean(showOptions && options.length);


    // Do the Render
    return <InputContent
        passedRef={containerRef}
        inputRef={inputRef}
        className={className}
        icon={icon}
        postIcon={postIcon}
        prefixText={prefixText}
        suffixText={suffixText}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isSmall={isSmall}
        onClick={handleClick}
        onClear={onClear}
        withBorder={withBorder}
        withLabel={withLabel}
        withPadding
    >
        <InputBase
            inputRef={inputRef}
            id={id}
            type={type}
            name={name}
            value={value}
            minValue={minValue}
            maxValue={maxValue}
            placeholder={placeholder}
            isDisabled={isDisabled}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            onChange={handleChange}
            onInput={handleInput}
            onPaste={onPaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        />
        <Children className="inputfield-children">
            {showMaxLength && <Text
                atMaxLength={atMaxLength}
                hasButtons={hasButtons}
            >
                {`${characters}/${maxLength}`}
            </Text>}
            {children}
            {generateCode && <IconLink
                variant="black"
                icon="add"
                onClick={handleGenerateCode}
                isSmall
            />}
        </Children>

        {hasOptions && <InputOptions
            passedRef={optionsRef}
            inputRef={inputRef}
            top={bounds.top}
            left={bounds.left}
            width={bounds.width}
            maxHeight={bounds.maxHeight}
            withBackdrop={false}
        >
            {options.map(({ key, value }, index) => <InputOption
                key={key}
                className={`input-chooser-${index}`}
                content={NLS.get(value)}
                isSelected={selectedIdxRef.current === index}
                onMouseDown={(e) => handleSelect(e, value)}
            />)}
        </InputOptions>}
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TextInput.propTypes = {
    inputRef      : PropTypes.any,
    className     : PropTypes.string,
    icon          : PropTypes.string,
    postIcon      : PropTypes.string,
    prefixText    : PropTypes.string,
    suffixText    : PropTypes.string,
    isFocused     : PropTypes.bool,
    isDisabled    : PropTypes.bool,
    isSmall       : PropTypes.bool,
    withBorder    : PropTypes.bool,
    withLabel     : PropTypes.bool,
    withInsideCnt : PropTypes.bool,
    id            : PropTypes.string,
    type          : PropTypes.string.isRequired,
    name          : PropTypes.string,
    value         : PropTypes.any,
    minValue      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxValue      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    placeholder   : PropTypes.string,
    autoComplete  : PropTypes.string,
    spellCheck    : PropTypes.string,
    generateCode  : PropTypes.bool,
    codeSets      : PropTypes.string,
    codeLength    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxLength     : PropTypes.number,
    onChange      : PropTypes.func,
    onInput       : PropTypes.func,
    onPaste       : PropTypes.func,
    onClear       : PropTypes.func,
    onFocus       : PropTypes.func,
    onBlur        : PropTypes.func,
    onKeyDown     : PropTypes.func,
    onKeyUp       : PropTypes.func,
    onSubmit      : PropTypes.func,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TextInput.defaultProps = {
    className    : "",
    isFocused    : false,
    isDisabled   : false,
    isSmall      : false,
    withBorder   : true,
    withLabel    : true,
    placeholder  : "",
    autoComplete : "off",
    maxLength    : 0,
};

export default TextInput;
