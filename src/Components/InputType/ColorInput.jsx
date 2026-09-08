import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import Icon                 from "../Common/Icon";



// Styles
const List = Styled.ul`
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 6px;
`;

const Item = Styled.li.attrs(({ color, isSelected }) => ({ color, isSelected }))`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 18px;
    border: 1px solid var(--input-border-color);
    border-radius: var(--border-radius);
    background-color: ${(props) => props.color};
    color: ${(props) => Utils.getContrastColor(props.color)};
    transition: box-shadow 0.2s;
    cursor: pointer;

    &:hover, &:focus {
        box-shadow: 0 0 0 1px var(--content-color), 0 0 0 2px ${(props) => props.color};
    }
    ${(props) => props.isSelected && `
        box-shadow: 0 0 0 1px var(--content-color), 0 0 0 2px ${props.color};
    `}
`;

const Input = Styled(InputBase).attrs(({ maxWidth }) => ({ maxWidth }))`
    height: 16px;
    max-width: ${(props) => props.maxWidth};

    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }
`;



/**
 * The Color Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ColorInput(props) {
    const {
        inputRef, className, icon, postIcon,
        isFocused, isDisabled, isSmall,
        withBorder, withLabel,
        id, name, value, options,
        onChange, onClear, onFocus, onBlur,
    } = props;


    // Handles the Input Change
    const handleChange = (e) => {
        let value = e.target.value.toUpperCase();
        if (value && !value.startsWith("#")) {
            value = `#${value}`;
        }
        value = value.substring(0, 7);
        onChange(name, value);
    };


    // Variables
    const withOptions = Boolean(options && options.length);
    const color       = value.replace("#", "").toUpperCase();


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
        withBorder={withBorder}
        withLabel={withLabel}
        withPadding
    >
        {withOptions ? <List>
            {options.map((color) => <Item
                key={color}
                color={color}
                isSelected={value === color}
                onClick={() => onChange(name, color)}
            >
                {value === color && <Icon icon="check" size="18" />}
            </Item>)}
        </List> : <>
            <Input
                inputRef={inputRef}
                name={name}
                value={color}
                isDisabled={isDisabled}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
                maxLength={7}
                maxWidth="80px"
            />
            <Input
                type="color"
                id={id}
                name={name}
                value={value || "#FFFFFF"}
                isDisabled={isDisabled}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </>}
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ColorInput.propTypes = {
    inputRef   : PropTypes.any,
    className  : PropTypes.string,
    icon       : PropTypes.string,
    postIcon   : PropTypes.string,
    isFocused  : PropTypes.bool,
    isDisabled : PropTypes.bool,
    isSmall    : PropTypes.bool,
    withBorder : PropTypes.bool,
    withLabel  : PropTypes.bool,
    id         : PropTypes.string,
    name       : PropTypes.string,
    value      : PropTypes.any,
    options    : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    onChange   : PropTypes.func.isRequired,
    onClear    : PropTypes.func,
    onFocus    : PropTypes.func.isRequired,
    onBlur     : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ColorInput.defaultProps = {
    className  : "",
    isFocused  : false,
    isDisabled : false,
    isSmall    : false,
    withBorder : true,
    withLabel  : true,
};

export default ColorInput;
