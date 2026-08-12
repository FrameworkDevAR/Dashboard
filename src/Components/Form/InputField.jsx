import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import InputType            from "../../Core/InputType";

// Components
import Input                from "../Input/Input";
import InputContainer       from "../Input/InputContainer";
import InputLabel           from "../Input/InputLabel";
import InputError           from "../Input/InputError";
import InputCopy            from "../Input/InputCopy";



// Styles
const FieldContent = Styled.div`
    display: flex;
    align-items: center;
`;

const FieldHelper = Styled.p`
    font-size: 0.9em;
    margin: 4px 0 0 4px;
    color: var(--darkest-gray);
`;



/**
 * The Input Field Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputField(props) {
    const {
        passedRef, isHidden, className, type, name,
        label, icon, postIcon, prefixText, suffixText, value,
        error, helperText, width, fullWidth, isRequired,
        onChange, onInput, onFocus, onBlur,
        autoFocus, withLabel, shrinkLabel, bigLabel, errorBackground,
        suggestID, hasClear, forceClear, hideClear, onClear,
        hasCopy, copyValue, onCopy,
    } = props;


    // The References
    const fieldRef     = React.useRef(null);
    const inputRef     = passedRef || fieldRef;
    const containerRef = React.useRef(null);
    const blurRef      = React.useRef(null);

    // The Current State
    const [ isFocused, setFocus ] = React.useState(false);


    // The Input got Focus
    // A pending blur is cancelled, as the Input is focused again
    const handleFocus = (e) => {
        if (blurRef.current) {
            window.clearTimeout(blurRef.current);
            blurRef.current = null;
        }

        setFocus(true);
        if (onFocus) {
            onFocus(e);
        }
    };

    // The Input lost Focus
    const handleBlur = (e) => {
        blurRef.current = window.setTimeout(() => {
            blurRef.current = null;
            setFocus(false);
            if (onBlur) {
                onBlur(e);
            }
        }, 200);
    };

    // Handles the Change
    const handleChange = (name, value, secName, secValue, data) => {
        if (onChange) {
            onChange(name, value, secName, secValue, data);
        }
    };

    // Handles the Input
    const handleInput = (name, value) => {
        if (onInput) {
            onInput(name, value);
        }
    };

    // Handles the Clear
    const handleClear = (clearValue = "") => {
        let params = [ name, clearValue ];
        if (suggestID) {
            params = [ name, clearValue, suggestID, 0 ];
        } else if (type === "file") {
            params = [ name, clearValue, `${name}Name`, "" ];
        }

        if (onClear) {
            onClear(...params);
        } else {
            handleChange(...params);
        }
    };


    // AutoFocus
    React.useEffect(() => {
        const node = inputRef.current;
        if (autoFocus && node) {
            // @ts-ignore
            node.focus();
        }
    }, []);

    // Clear the Blur Timer
    React.useEffect(() => {
        return () => {
            if (blurRef.current) {
                window.clearTimeout(blurRef.current);
            }
        };
    }, []);


    // Variables
    const hasLabel      = Boolean(label && InputType.hasLabel(type));
    const isValueFilled = InputType.isValueFilled(type, value);
    const hasValue      = InputType.hasValue(type, value);
    const showsEmpty    = InputType.showsEmpty(type, props);
    const withTransform = !shrinkLabel && InputType.canShrink(type);
    const withValue     = Boolean(isValueFilled || isFocused || showsEmpty);
    const withInsideCnt = !hasLabel || isValueFilled || isFocused || shrinkLabel || showsEmpty;
    const withClear     = forceClear || (hasValue && !hideClear && (hasClear || InputType.hasClear(type)));
    const hasError      = Boolean(error);
    const hasHelperText = !hasError && Boolean(helperText);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <InputContainer
        className={`inputfield inputfield-${type} ${className}`}
        width={width}
        fullWidth={fullWidth}
        hasError={hasError}
        bigLabel={bigLabel}
    >
        {hasLabel && <InputLabel
            className="inputfield-label"
            isRequired={isRequired}
            withTransform={withTransform}
            withValue={withValue}
            isFocused={isFocused}
            isBigger={bigLabel}
            message={label}
        />}
        <FieldContent ref={containerRef}>
            <Input
                {...props}
                className="inputfield-input"
                inputRef={inputRef}
                isFocused={isFocused}
                onChange={handleChange}
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                icon={withInsideCnt ? icon : undefined}
                postIcon={withInsideCnt ? postIcon : undefined}
                prefixText={withInsideCnt ? prefixText : undefined}
                suffixText={withInsideCnt ? suffixText : undefined}
                onClear={withClear ? handleClear : undefined}
                withLabel={withLabel || hasLabel}
                withInsideCnt={withInsideCnt}
            />
            <InputCopy
                isHidden={!hasCopy}
                copyValue={copyValue}
                inputValue={String(value)}
                onCopy={onCopy}
                isFloating
            />
        </FieldContent>
        <InputError
            error={error}
            useBackground={errorBackground}
        />
        {hasHelperText && <FieldHelper>
            {NLS.get(helperText)}
        </FieldHelper>}
    </InputContainer>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputField.propTypes = {
    passedRef         : PropTypes.any,
    isHidden          : PropTypes.bool,
    className         : PropTypes.string,
    id                : PropTypes.string,
    type              : PropTypes.string,
    inputType         : PropTypes.string,
    name              : PropTypes.string,
    label             : PropTypes.string,
    placeholder       : PropTypes.string,
    title             : PropTypes.string,
    getAfterTitle     : PropTypes.func,
    icon              : PropTypes.string,
    postIcon          : PropTypes.string,
    prefixText        : PropTypes.string,
    suffixText        : PropTypes.string,
    value             : PropTypes.any,
    isChecked         : PropTypes.bool,
    allowMultiple     : PropTypes.bool,
    step              : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minValue          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxValue          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxAmount         : PropTypes.number,
    maxLength         : PropTypes.number,
    autoComplete      : PropTypes.string,
    spellCheck        : PropTypes.string,
    isRequired        : PropTypes.bool,
    isDisabled        : PropTypes.bool,
    getDisabled       : PropTypes.func,
    onChange          : PropTypes.func,
    onInput           : PropTypes.func,
    onPaste           : PropTypes.func,
    onFocus           : PropTypes.func,
    onBlur            : PropTypes.func,
    onSubmit          : PropTypes.func,
    onKeyDown         : PropTypes.func,
    onKeyUp           : PropTypes.func,
    onMedia           : PropTypes.func,
    suggestID         : PropTypes.string,
    suggestFetch      : PropTypes.func,
    suggestParams     : PropTypes.object,
    suggestWidth      : PropTypes.number,
    keepSuggestions   : PropTypes.bool,
    addButton         : PropTypes.string,
    error             : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    errors            : PropTypes.object,
    helperText        : PropTypes.string,
    counterText       : PropTypes.string,
    options           : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    extraOptions      : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    descriptions      : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    showDescription   : PropTypes.bool,
    inlineDescription : PropTypes.bool,
    createOption      : PropTypes.string,
    onCreate          : PropTypes.func,
    showCreate        : PropTypes.bool,
    buttonMessage     : PropTypes.string,
    onButton          : PropTypes.func,
    withIcons         : PropTypes.bool,
    iconSize          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    width             : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minWidth          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    fullWidth         : PropTypes.bool,
    shrinkLabel       : PropTypes.bool,
    bigLabel          : PropTypes.bool,
    withLabel         : PropTypes.bool,
    withBorder        : PropTypes.bool,
    dashedBorder      : PropTypes.bool,
    withLine          : PropTypes.bool,
    withEditor        : PropTypes.bool,
    isSmall           : PropTypes.bool,
    errorBackground   : PropTypes.bool,
    generateCode      : PropTypes.bool,
    codeSets          : PropTypes.string,
    codeLength        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    defaultText       : PropTypes.string,
    emptyText         : PropTypes.string,
    noneText          : PropTypes.string,
    noneValue         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withCustom        : PropTypes.bool,
    customFirst       : PropTypes.bool,
    customText        : PropTypes.string,
    customKey         : PropTypes.string,
    hasClear          : PropTypes.bool,
    forceClear        : PropTypes.bool,
    hideClear         : PropTypes.bool,
    onClear           : PropTypes.func,
    allowEmpty        : PropTypes.bool,
    isSortable        : PropTypes.bool,
    onSort            : PropTypes.func,
    extraIcon         : PropTypes.string,
    onExtraIcon       : PropTypes.func,
    autoFocus         : PropTypes.bool,
    onlyImages        : PropTypes.bool,
    accept            : PropTypes.string,
    maxSize           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onError           : PropTypes.func,
    columns           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    rows              : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxRows           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    hasCopy           : PropTypes.bool,
    copyValue         : PropTypes.string,
    onCopy            : PropTypes.func,
    children          : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputField.defaultProps = {
    isHidden        : false,
    className       : "",
    type            : InputType.TEXT,
    inputType       : InputType.TEXT,
    placeholder     : "",
    autoComplete    : "off",
    isRequired      : false,
    isDisabled      : false,
    options         : [],
    extraOptions    : [],
    suggestParams   : {},
    fullWidth       : false,
    shrinkLabel     : false,
    bigLabel        : false,
    isSmall         : false,
    errorBackground : false,
    withCustom      : false,
    customFirst     : false,
    customText      : "",
    customKey       : "",
    hasClear        : false,
    forceClear      : false,
    hideClear       : false,
    allowEmpty      : false,
    isSortable      : false,
    autoFocus       : false,
    onlyImages      : false,
    hasCopy         : false,
};

export default InputField;
