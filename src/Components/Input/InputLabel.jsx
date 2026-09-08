import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";



// Styles
const Label = Styled.p.attrs(({ isRequired, withTransform, withValue, isFocused, isBigger, isOutside, isClickable }) => ({ isRequired, withTransform, withValue, isFocused, isBigger, isOutside, isClickable }))`
    box-sizing: border-box;
    position: absolute;
    top: 6px;
    left: 6px;
    max-width: calc(100% - 22px);
    margin: 0;
    padding: 0 6px;
    line-height: 1;
    background-color: var(--input-label-background, var(--content-color));
    color: var(--input-label-color, var(--font-color));
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.2s;
    pointer-events: none;
    z-index: 1;

    ${(props) => props.isRequired && `
        &::after {
            content: "*";
            margin-left: 4px;
        }
    `}
    ${(props) => props.withTransform && `
        transform-origin: top left;
        transform: translateY(12px) scale(1.2);
    `}
    ${(props) => props.withValue && `
        transform: translateY(0) scale(1);
        max-width: calc(100% - 10px);
    `}
    ${(props) => props.isFocused && `
        color: var(--input-label-focus);
    `}
    ${(props) => props.isBigger && `
        font-size: 14px;
    `}

    ${(props) => props.isOutside && `
        position: static;
        width: fit-content;
        max-width: none;
        margin-bottom: 6px;
        padding: 0;
        background-color: transparent;
        color: var(--black-color);
        font-size: 13px;
        font-weight: 500;
        transform: none;

        &::after {
            color: var(--error-color);
        }
    `}

    ${(props) => (props.isOutside && props.isClickable) && `
        pointer-events: auto;
        cursor: pointer;
    `}
`;



/**
 * The Input Label Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputLabel(props) {
    const {
        className, isRequired, withTransform, withValue,
        isFocused, isBigger, isOutside, message, onClick,
    } = props;


    // Do the Render
    return <Label
        className={className}
        isRequired={isRequired}
        withTransform={withTransform}
        withValue={withValue}
        isFocused={isFocused}
        isBigger={isBigger}
        isOutside={isOutside}
        isClickable={Boolean(onClick)}
        onClick={onClick}
    >
        {NLS.get(message)}
    </Label>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputLabel.propTypes = {
    className     : PropTypes.string,
    isRequired    : PropTypes.bool,
    withTransform : PropTypes.bool,
    withValue     : PropTypes.bool,
    isFocused     : PropTypes.bool,
    isBigger      : PropTypes.bool,
    isOutside     : PropTypes.bool,
    message       : PropTypes.string.isRequired,
    onClick       : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputLabel.defaultProps = {
    className     : "",
    isRequired    : false,
    withTransform : false,
    withValue     : false,
    isFocused     : false,
    isBigger      : false,
    isOutside     : false,
};

export default InputLabel;
