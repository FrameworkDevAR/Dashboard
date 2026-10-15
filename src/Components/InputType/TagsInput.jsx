import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import KeyCode              from "../../Utils/KeyCode";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import ChipList             from "../Chip/ChipList";
import ChipItem             from "../Chip/ChipItem";



// Styles
const EditItem = Styled.li`
    flex: 1 0 48px;
    min-width: 48px;

    input {
        min-width: 0;
    }
`;



/**
 * The Tags Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TagsInput(props) {
    const {
        inputRef, className, icon, postIcon, isFocused, isDisabled,
        isSmall, withLabel,
        id, name, value, placeholder,
        onChange, onClear, onFocus, onBlur,
    } = props;


    // The Current State
    const [ text, setText ] = React.useState("");


    // Variables
    const values = Array.isArray(value) ? value : [];


    // Adds the written text as a Tag, unless it is empty or already there
    const addText = () => {
        const tag = text.trim();
        if (tag && !values.includes(tag)) {
            onChange(name, [ ...values, tag ]);
        }
        setText("");
        return Boolean(tag);
    };

    // Handles the Click
    const handleClick = () => {
        if (inputRef?.current) {
            inputRef.current.focus();
        }
    };

    // Handles the Remove
    const handleRemove = (index) => {
        if (!isDisabled) {
            onChange(name, values.filter((tag, tagIndex) => tagIndex !== index));
        }
    };

    // Handles the Key Down. The Enter adds the Tag without submitting the form, and the
    // Backspace of an empty text removes the last one
    const handleKeyDown = (e) => {
        if (e.keyCode === KeyCode.DOM_VK_RETURN || e.keyCode === KeyCode.DOM_VK_COMMA) {
            if (addText() || e.keyCode === KeyCode.DOM_VK_COMMA) {
                e.preventDefault();
                e.stopPropagation();
            }
        } else if (e.keyCode === KeyCode.DOM_VK_BACK_SPACE && !text.length && values.length) {
            handleRemove(values.length - 1);
        }
    };

    // Handles the Blur, which keeps what was written
    const handleBlur = () => {
        addText();
        onBlur();
    };


    // Do the Render
    return <InputContent
        className={className}
        icon={icon}
        postIcon={postIcon}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isSmall={isSmall}
        onClick={handleClick}
        onClear={onClear}
        withLabel={withLabel}
        withBorder
        withPadding
    >
        <ChipList>
            {values.map((tag, index) => <ChipItem
                key={`${tag}-${index}`}
                message={tag}
                onClose={() => handleRemove(index)}
                isDisabled={isDisabled}
            />)}

            {!isDisabled && <EditItem>
                <InputBase
                    inputRef={inputRef}
                    id={id}
                    type="text"
                    name={name}
                    value={text}
                    placeholder={values.length ? "" : placeholder}
                    onInput={(e) => setText(e.target.value)}
                    onFocus={onFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </EditItem>}
        </ChipList>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TagsInput.propTypes = {
    inputRef    : PropTypes.object,
    className   : PropTypes.string,
    icon        : PropTypes.string,
    postIcon    : PropTypes.string,
    isFocused   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    isSmall     : PropTypes.bool,
    withLabel   : PropTypes.bool,
    id          : PropTypes.string,
    name        : PropTypes.string,
    value       : PropTypes.any,
    placeholder : PropTypes.string,
    onChange    : PropTypes.func.isRequired,
    onClear     : PropTypes.func,
    onFocus     : PropTypes.func.isRequired,
    onBlur      : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TagsInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    isSmall     : false,
    withLabel   : false,
    placeholder : "",
};

export default TagsInput;
