import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import InputContent         from "../Input/InputContent";



// Styles
const Container = Styled(InputContent).attrs(({ withLabel }) => ({ withLabel }))`
    position: relative;

    ${(props) => props.withLabel && `
        padding-top: calc(var(--input-label) - (20px - var(--input-label)) * 2) !important;
    `}

    .input-clear {
        position: absolute;
        top: 0;
        right: 0;
        margin-top: 0;
        margin-right: 0;
    }
`;

const Content = Styled.div.attrs(({ hideOverflow }) => ({ hideOverflow }))`
    box-sizing: border-box;
    width: 100%;
    border-radius: var(--input-border-radius, var(--border-radius));
    ${(props) => props.hideOverflow && "overflow: hidden;"}
`;

const Textarea = Styled.textarea.attrs(({ withLabel }) => ({ withLabel }))`
    box-sizing: border-box;
    display: block;
    width: 100%;
    appearance: none;
    margin: 0;
    padding: var(--input-padding);
    padding-top: ${(props) => props.withLabel ? "0px" : "4px"};
    padding-bottom: ${(props) => props.withLabel ? "6px" : "4px"};
    font-size: var(--input-font);
    line-height: 20px;
    border: none;
    resize: none;

    &:focus {
        outline: none;
    }
    &:disabled {
        color: var(--input-disabled-color);
    }
    &::placeholder {
        color: var(--darkest-gray);
    }
`;

const Text = Styled.p.attrs(({ atMaxLength }) => ({ atMaxLength }))`
    flex-grow: 2;
    margin: 0;
    padding-left: 4px;
    font-size: 12px;
    color: var(--darkest-gray);

    ${(props) => props.atMaxLength && `
        color: var(--error-color);
        font-weight: bold;
    `}
`;

const Footer = Styled.footer`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;

    ${Text} {
        flex-grow: 0;
        margin-left: auto;
        white-space: nowrap;
    }
`;

const Aside = Styled.aside`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;

    p {
        flex-grow: 0;
    }
`;



/**
 * The Textarea Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TextareaInput(props) {
    const {
        inputRef, className, isFocused, isDisabled, withLabel,
        id, name, value, placeholder, rows, maxRows, withEditor,
        onChange, onClear, onInput, onPaste,
        onFocus, onBlur, onKeyDown, onKeyUp,
        maxLength, children,
    } = props;

    // Variables
    const minRows = Number(rows) || 1;

    // The Current State
    const [ actualRows, setActualRows ] = React.useState(minRows);


    // Returns the Value
    const getValue = (e) => {
        const text = String(e.target.value);
        if (maxLength && text.length > maxLength) {
            return text.substring(0, maxLength);
        }
        return e.target.value;
    };

    // Handles the Input Change
    const handleChange = (e) => {
        onChange(name, getValue(e));
    };

    // Handles the Textarea Input
    const handleInput = (e) => {
        handleAutoGrow();
        if (onInput) {
            onInput(name, getValue(e));
        }
    };

    // Handles the Textarea AutoGrow
    const handleAutoGrow = () => {
        const lineHeight  = 20;
        const node        = inputRef.current;
        let   currentRows = Math.floor(node.scrollHeight / lineHeight);
        let   rows        = currentRows;

        if (currentRows <= node.rows) {
            rows = node.rows - 1;
            while (rows >= minRows) {
                node.rows   = rows;
                currentRows = Math.floor(node.scrollHeight / lineHeight);
                if (currentRows > rows) {
                    rows = currentRows;
                    break;
                }
                rows -= 1;
            }
        }

        rows = Math.max(rows, minRows);
        if (maxRows) {
            rows = Math.min(rows, maxRows);
        }
        node.rows = rows;
        setActualRows(rows);
    };

    // Resize the Textarea when required
    React.useEffect(() => {
        handleAutoGrow();
    }, []);

    React.useEffect(() => {
        handleAutoGrow();
    }, [ value ]);

    React.useEffect(() => {
        const observer = new IntersectionObserver(([ entry ]) => {
            if (inputRef.current && entry.isIntersecting) {
                handleAutoGrow();
            }
        });

        if (inputRef.current) {
            observer.observe(inputRef.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [ inputRef.current ]);

    // Counts the Characters
    const characters = React.useMemo(() => {
        return Array.from(value || "").length;
    }, [ value ]);


    // Variables
    const hasEditor   = Boolean(maxLength || (children && children.length));
    const hasFooter   = Boolean(hasEditor && withEditor);
    const hasAside    = Boolean(hasEditor && !withEditor);
    const counterText = maxLength ? "GENERAL_CHARACTERS_MAX" : "GENERAL_CHARACTERS";
    const atMaxLength = Boolean(maxLength && characters >= maxLength);


    // Do the Render
    return <Container
        inputRef={inputRef}
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        onClear={onClear}
        withLabel={withLabel}
        withBorder
    >
        <Content hideOverflow={!hasAside}>
            <Textarea
                ref={inputRef}
                className="input-textarea"
                id={id}
                name={name}
                value={value}
                rows={actualRows}
                placeholder={NLS.get(placeholder)}
                disabled={isDisabled}
                onChange={handleChange}
                onInput={handleInput}
                onPaste={onPaste}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                withLabel={withLabel}
            />
            {hasFooter && <Footer className="inputfield-editor">
                {!isDisabled && children}
                <Text atMaxLength={atMaxLength}>
                    {NLS.format(counterText, String(characters), maxLength)}
                </Text>
            </Footer>}
            {hasAside && <Aside className="inputfield-editor">
                {!!maxLength && <Text atMaxLength={atMaxLength}>
                    {`${characters}/${maxLength}`}
                </Text>}
                {!isDisabled && children}
            </Aside>}
        </Content>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TextareaInput.propTypes = {
    inputRef    : PropTypes.any,
    className   : PropTypes.string,
    isFocused   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    withLabel   : PropTypes.bool,
    withEditor  : PropTypes.bool,
    id          : PropTypes.string,
    name        : PropTypes.string.isRequired,
    placeholder : PropTypes.string,
    value       : PropTypes.any,
    rows        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxRows     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxLength   : PropTypes.number,
    onChange    : PropTypes.func,
    onClear     : PropTypes.func,
    onInput     : PropTypes.func,
    onPaste     : PropTypes.func,
    onFocus     : PropTypes.func,
    onBlur      : PropTypes.func,
    onKeyDown   : PropTypes.func,
    onKeyUp     : PropTypes.func,
    counterText : PropTypes.string,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TextareaInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    withEditor  : true,
    placeholder : "",
    maxLength   : 0,
};

export default TextareaInput;
