import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.div.attrs(({ isValid }) => ({ isValid }))`
    display: flex;
    gap: 8px;
    width: 100%;

    ${(props) => props.isValid && `
        --input-border: var(--success-color);
    `}
`;

const Box = Styled.input`
    box-sizing: border-box;
    flex: 1 1 0;
    min-width: 0;
    max-width: 56px;
    height: var(--input-height);
    padding: 0;
    font-family: inherit;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase;
    color: var(--black-color);
    background-color: var(--content-color);
    border: 1px solid var(--input-border);
    border-radius: var(--input-border-radius, var(--border-radius));
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:hover:not(:disabled) {
        border-color: var(--input-border-hover);
    }
    &:focus {
        border-color: var(--input-border-focus);
        box-shadow: var(--input-border-shadow, 0 0 0 1px var(--input-border-focus));
    }
    &:disabled {
        cursor: not-allowed;
        color: var(--input-disabled-color);
        border-color: var(--input-border-disabled);
    }
`;



/**
 * Returns the given Text with only its letters and numbers, in capitals
 * @param {string} text
 * @returns {string}
 */
function cleanText(text) {
    return String(text || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}



/**
 * The Code Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function CodeInput(props) {
    const {
        inputRef, className, name, value, codeLength, autoComplete,
        isDisabled, isValid, onChange, onFocus, onBlur,
    } = props;

    const boxesRef = React.useRef([]);

    // The Value is kept without gaps, so a Box is only filled after the ones before it
    const length = Number(codeLength);
    const code   = cleanText(value).substring(0, length);

    // The Code is also kept in a Reference, as the focus moves to the next Box as soon as
    // a char is written, and a fast typing gets there before the new Value is rendered
    const codeRef = React.useRef(code);
    codeRef.current = code;


    // Focuses the Box at the given Index, which never goes past the first empty one
    const focusBox = (index) => {
        const newIndex = Math.max(0, Math.min(index, codeRef.current.length, length - 1));
        const box      = boxesRef.current[newIndex];
        if (box) {
            box.focus();
            box.select();
        }
    };

    // Changes the Code and moves the focus to the given Box
    const setCode = (newCode, focusIndex) => {
        codeRef.current = newCode;
        onChange(name, newCode);
        focusBox(focusIndex);
    };

    // Changes the Code, starting from the Box at the given Index with the given Text
    const setText = (index, text) => {
        const current = codeRef.current;
        const newCode = (current.substring(0, index) + text + current.substring(index + text.length)).substring(0, length);
        setCode(newCode, index + text.length);
    };

    // Handles the Change of a Box. The Box keeps its old char when a new one is written
    // without selecting it, so the new char is always the last one
    const handleChange = (index, e) => {
        const text = cleanText(e.target.value);
        if (text) {
            setText(index, text.substring(text.length - 1));
        }
    };

    // Handles the Paste. A whole Code replaces the Value wherever it is pasted, while a
    // shorter text fills the Boxes from the one that has the focus
    const handlePaste = (index, e) => {
        e.preventDefault();
        const text = cleanText(e.clipboardData.getData("text"));
        if (text.length >= length) {
            setText(0, text.substring(0, length));
        } else if (text) {
            setText(index, text.substring(0, length - index));
        }
    };

    // Handles the Keys that move between the Boxes or remove a char
    const handleKeyDown = (index, e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            focusBox(index - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            focusBox(index + 1);
        } else if (e.key === "Backspace") {
            e.preventDefault();
            const current     = codeRef.current;
            const removeIndex = current[index] ? index : index - 1;
            if (removeIndex >= 0) {
                setCode(current.substring(0, removeIndex) + current.substring(removeIndex + 1), removeIndex);
            }
        }
    };

    // Handles the Focus, which is moved to the first empty Box when one after it is clicked
    const handleFocus = (index, e) => {
        if (index > codeRef.current.length) {
            focusBox(codeRef.current.length);
            return;
        }
        e.target.select();
        onFocus(e);
    };

    // Sets the Reference of a Box. The first one is the Input, so the label focuses it
    const setBoxRef = (index, elem) => {
        boxesRef.current[index] = elem;
        if (index === 0 && inputRef) {
            inputRef.current = elem;
        }
    };


    // Do the Render
    return <Container className={className} isValid={isValid}>
        {Array.from({ length }, (_, index) => <Box
            key={index}
            ref={(elem) => setBoxRef(index, elem)}
            name={index === 0 ? name : undefined}
            value={code[index] || ""}
            disabled={isDisabled}
            autoComplete={autoComplete}
            autoCapitalize="characters"
            spellCheck={false}
            onChange={(e) => handleChange(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => handleFocus(index, e)}
            onBlur={onBlur}
        />)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
CodeInput.propTypes = {
    inputRef     : PropTypes.any,
    className    : PropTypes.string,
    name         : PropTypes.string.isRequired,
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    codeLength   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    autoComplete : PropTypes.string,
    isDisabled   : PropTypes.bool,
    isValid      : PropTypes.bool,
    onChange     : PropTypes.func.isRequired,
    onFocus      : PropTypes.func.isRequired,
    onBlur       : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
CodeInput.defaultProps = {
    className    : "",
    value        : "",
    codeLength   : 6,
    autoComplete : "off",
    isDisabled   : false,
    isValid      : false,
};

export default CodeInput;
