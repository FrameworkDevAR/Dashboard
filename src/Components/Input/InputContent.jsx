import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import MenuLink             from "../Link/MenuLink";
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.div.attrs(({ isFocused, isDisabled, isSmall, withBorder, dashedBorder, withPadding, withLabel, withClick }) => ({ isFocused, isDisabled, isSmall, withBorder, withPadding, dashedBorder, withLabel, withClick }))`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    color: var(--font-color);

    ${(props) => props.withBorder && `
        background-color: var(--content-color);
        min-height: var(--input-height);

        ${props.isSmall ? `
            border-radius: var(--input-border-radius-small, var(--border-radius));
        ` : `
            border-radius: var(--input-border-radius, var(--border-radius));
        `}

        ${props.dashedBorder ? `
            border: 2px dashed var(--input-border);
        ` : `
            border: 1px solid var(--input-border);
        `}
    `}

    ${(props) => (props.withBorder && props.withPadding) && `
        padding: var(--input-padding);
    `}
    ${(props) => (props.withBorder && props.withLabel) && `
        padding-top: var(--input-label) !important;
    `}
    ${(props) => (props.withClick && !props.isDisabled) && `
        cursor: pointer;
    `}
    ${(props) => (props.withBorder && !props.withLabel && props.isSmall) && `
        min-height: calc(var(--input-height) - var(--input-label));
    `}

    ${(props) => (props.withBorder && props.isFocused) && `
        --input-border: var(--input-border-focus);
        box-shadow: 0 0 0 3px var(--input-border-shadow, transparent);
        .inputfield {
            --input-border: var(--input-border-focus);
        }
    `}

    ${(props) => props.isDisabled && `
        color: var(--input-disabled-color);
    `}
    ${(props) => (props.withBorder && props.isDisabled) && `
        --input-border: var(--input-border-disabled);
    `}
    ${(props) => (props.withBorder && !props.isDisabled && !props.isFocused) && `
        &:hover, &:hover .inputfield {
            --input-border: var(--input-border-hover);
        }
    `}
`;

const InputIcon = Styled(Icon)`
    flex-shrink: 0;
    margin-left: -4px;
    color: var(--black-color);
`;

const PostInputIcon = Styled(Icon)`
    flex-shrink: 0;
    margin-top: -8px;
    margin-right: -6px;
    color: var(--black-color);
`;

const Text = Styled.p`
    margin: 0;
    font-size: 12px;
    color: var(--font-lighter);
`;

const InputClear = Styled(IconLink).attrs(({ smallInput, withLabel }) => ({ smallInput, withLabel }))`
    margin-right: calc(2px - var(--input-horiz-padding));

    ${(props) => props.withLabel ? `
        margin-top: -8px;
        ${props.smallInput ? "margin-bottom: -4px;" : ""}
    ` : `
        margin-top: -6px;
        margin-bottom: -6px;
    `}
`;

const InputButton = Styled(MenuLink)`
    --link-color: var(--primary-color);
    --link-hover: var(--primary-color);
    --link-gap: 2px;

    margin-top: -8px;
    margin-right: calc(6px - var(--input-horiz-padding));
    margin-left: 4px;
    padding: 2px 6px 2px 2px;
    font-size: 12px;
    border-radius: var(--border-radius-small);
`;



/**
 * The Input Content Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputContent(props) {
    const {
        passedRef, inputRef, className,
        isFocused, isDisabled, isSmall,
        withBorder, dashedBorder,
        withPadding, withLabel, withClick,
        onClick, onClear, showButton, onButton, buttonMessage,
        prefixText, suffixText, icon, postIcon, children,
    } = props;


    // Handles the Click
    const handleClick = (e) => {
        if (isDisabled) {
            return;
        }
        if (onClick) {
            onClick(e);
            return;
        }
        if (inputRef && inputRef.current) {
            inputRef.current.click();
            if (!isFocused) {
                inputRef.current.focus();
            } else {
                window.setTimeout(() => inputRef.current.focus(), 200);
            }
        }
    };


    // Variables
    const hasClear  = Boolean(!isDisabled && onClear);
    const hasButton = Boolean(!isDisabled && showButton && buttonMessage && onButton);


    // Do the Render
    return <Container
        ref={passedRef}
        className={`input-content ${className}`}
        isFocused={isFocused}
        isDisabled={isDisabled}
        isSmall={isSmall}
        withBorder={withBorder}
        dashedBorder={dashedBorder}
        withPadding={withPadding}
        withLabel={withLabel}
        withClick={withClick}
        onClick={handleClick}
    >
        {!!icon && <InputIcon icon={icon} size="18" />}
        {!!prefixText && <Text>{NLS.get(prefixText)}</Text>}

        {children}

        {!!suffixText && <Text>{NLS.get(suffixText)}</Text>}
        {!!postIcon && <PostInputIcon
            icon={postIcon}
            size="18"
        />}

        {hasClear && <InputClear
            className="input-clear"
            variant="black"
            icon="close"
            onClick={() => onClear()}
            smallInput={isSmall}
            withLabel={withLabel}
            isSmall
        />}
        {hasButton && <InputButton
            className="input-button"
            variant="light"
            icon="add"
            message={buttonMessage}
            onClick={onButton}
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputContent.propTypes = {
    passedRef     : PropTypes.any,
    inputRef      : PropTypes.any,
    className     : PropTypes.string,
    isFocused     : PropTypes.bool,
    isDisabled    : PropTypes.bool,
    isSmall       : PropTypes.bool,
    withBorder    : PropTypes.bool,
    dashedBorder  : PropTypes.bool,
    withPadding   : PropTypes.bool,
    withLabel     : PropTypes.bool,
    withClick     : PropTypes.bool,
    onClick       : PropTypes.func,
    onClear       : PropTypes.func,
    showButton    : PropTypes.bool,
    buttonMessage : PropTypes.string,
    onButton      : PropTypes.func,
    icon          : PropTypes.string,
    postIcon      : PropTypes.string,
    prefixText    : PropTypes.string,
    suffixText    : PropTypes.string,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputContent.defaultProps = {
    className    : "",
    isFocused    : false,
    isDisabled   : false,
    isSmall      : false,
    withBorder   : false,
    dashedBorder : false,
    withPadding  : false,
    withLabel    : false,
    withClick    : false,
};

export default InputContent;
