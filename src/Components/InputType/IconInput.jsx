import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Icon                 from "../Common/Icon";



// Styles
const List = Styled.div.attrs(({ columns }) => ({ columns }))`
    display: grid;
    grid-template-columns: repeat(${(props) => props.columns}, 1fr);
    gap: 4px;
    width: 100%;
`;

const Item = Styled.button.attrs(({ isSelected }) => ({ isSelected }))`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    margin: 0;
    padding: 0;
    font-size: 20px;
    border: 1px solid var(--input-border-color);
    border-radius: var(--input-border-radius);
    background-color: var(--content-color);
    color: var(--font-light);
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        border-color: var(--input-border-hover);
    }
    &:focus-visible {
        outline: none;
        border-color: var(--input-border-focus);
        box-shadow: var(--input-border-shadow, 0 0 0 1px var(--input-border-focus));
    }
    &:disabled {
        cursor: default;
    }

    ${(props) => props.isSelected && `
        border-color: var(--border-color-medium);
        background-color: var(--lighter-gray);
        color: var(--title-color);
    `}
`;



/**
 * The Icon Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function IconInput(props) {
    const {
        className, isDisabled, name, value, options, columns, iconPrefix,
        onChange, onFocus, onBlur,
    } = props;


    // Do the Render
    return <List className={className} columns={columns} data-name={name}>
        {(options || []).map((icon) => <Item
            key={icon}
            type="button"
            isSelected={value === icon}
            disabled={isDisabled}
            onClick={() => onChange(name, icon)}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            <Icon icon={`${iconPrefix}${icon}`} />
        </Item>)}
    </List>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
IconInput.propTypes = {
    className  : PropTypes.string,
    isDisabled : PropTypes.bool,
    name       : PropTypes.string.isRequired,
    value      : PropTypes.string,
    options    : PropTypes.array,
    columns    : PropTypes.number,
    iconPrefix : PropTypes.string,
    onChange   : PropTypes.func.isRequired,
    onFocus    : PropTypes.func,
    onBlur     : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
IconInput.defaultProps = {
    className  : "",
    isDisabled : false,
    value      : "",
    columns    : 8,
    iconPrefix : "",
};

export default IconInput;
