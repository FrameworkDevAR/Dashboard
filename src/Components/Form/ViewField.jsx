import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import InputLabel           from "../Input/InputLabel";
import InputContainer       from "../Input/InputContainer";
import InputCopy            from "../Input/InputCopy";
import HyperLink            from "../Link/HyperLink";
import MenuLink             from "../Link/MenuLink";
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";
import Html                 from "../Common/Html";
import MultiLine            from "../Common/MultiLine";



// Styles
const FieldLabel = Styled(InputLabel).attrs(({ isSelected }) => ({ isSelected }))`
    ${(props) => props.isSelected && "background-color: var(--lighter-gray);"}
`;

const FieldContent = Styled.div.attrs(({ withLabel, isSmall, maxHeight, noWrap, withLink, isSelected }) => ({ withLabel, isSmall, maxHeight, noWrap, withLink, isSelected }))`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: var(--input-font);
    background-color: var(--content-color);
    border: 1px solid var(--input-border);
    transition: all 0.2s;

    ${(props) => props.isSmall ? `
        border-radius: var(--input-border-radius-small, var(--border-radius));
    ` : `
        border-radius: var(--input-border-radius, var(--border-radius));
    `}

    .inputview-value {
        width: 100%;
        box-sizing: border-box;
        color: var(--black-color);
        margin: 0;
        padding: var(--input-padding);
        min-height: calc(var(--input-height) - 2px);
        line-height: 1.3;
        overflow: auto;

        ${(props) => props.isSelected && `
            background-color: var(--lighter-gray);
        `}
        ${(props) => props.isSmall && `
            min-height: calc(var(--input-height) - 7px - 2px);
            padding: var(--input-padding);
            line-height: initial;
        `}
        ${(props) => props.withLabel && `
            padding-top: calc(var(--input-label) + 2px);
        `}
        ${(props) => (!props.withLabel && props.isSmall) && `
            min-height: calc(var(--input-height) - var(--input-label) + 1px);
        `}
        ${(props) => props.noWrap && `
            white-space: nowrap;
            min-width: 0;
            flex-grow: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        `}

        ${(props) => props.maxHeight && `max-height: ${props.maxHeight}px;`}
        ${(props) => props.noWrap && "white-space: nowrap;"}
        ${(props) => props.withLink && "cursor: pointer;"}
    }

    .inputview-link {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &:hover {
        --input-border: var(--input-border-hover);
    }
`;

const FieldIcon = Styled(Icon)`
    margin-top: 8px;
    margin-left: 8px;
`;

const FieldLink = Styled(IconLink)`
    flex-shrink: 0;
    font-size: 20px;
    margin-left: 4px;
`;

const FieldButton = Styled(MenuLink)`
    --link-color: var(--primary-color);
    --link-hover: var(--primary-color);
    --link-gap: 2px;

    margin-top: 14px;
    margin-right: 4px;
    margin-left: 4px;
    padding: 2px 6px 2px 2px;
    font-size: 12px;
    border-radius: var(--border-radius-small);
    white-space: nowrap;
`;

const FieldError = Styled.p`
    font-size: 12px;
    margin: 4px 0 0 4px;
    color: #ff0033;
`;

const FieldHelper = Styled.p.attrs(({ isOutside }) => ({ isOutside }))`
    font-size: 0.9em;
    margin: 4px 0 0 4px;
    color: var(--darkest-gray);

    ${(props) => props.isOutside && `
        margin: -2px 0 6px 0;
    `}
`;



/**
 * The Input View Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ViewField(props) {
    const {
        isHidden, showEmpty, className, viewClass, textColor,
        label, value, copyValue, message, icon, outsideLabel,
        fullWidth, isSmall, maxHeight, noWrap, usePre,
        isSelected, error, helperText,
        linkIcon, linkVariant, linkUrl, linkHref, linkTarget,
        isEmail, isPhone, isWhatsApp, hasCopy, onClick,
        showButton, buttonMessage, onButton, children,
    } = props;


    // Variables
    const val         = value === null || value === undefined ? "" : String(value);
    const content     = message ? NLS.get(message) : val;
    const href        = content.startsWith("http") ? content : (val.startsWith("http") ? val : "");
    const hasChildren = Boolean(children && (children.props || children.length > 0));
    const isLink      = href !== "";
    const isHtml      = !isLink && !hasChildren && (content.includes("<br>") || content.includes("<b>") || content.includes("<i>"));
    const isText      = !isLink && !hasChildren && !isHtml;
    const withLabel   = !!label;
    const hasOutside  = Boolean(withLabel && outsideLabel);
    const hasLink     = Boolean(linkIcon && linkHref);
    const hasButton   = Boolean(showButton && buttonMessage && onButton);
    const hasError    = Boolean(error);
    const hasHelper   = !hasError && Boolean(helperText);
    const floatCopy   = content.length > 1000 || isHtml;


    // Do the Render
    if (isHidden || (!content && !hasChildren && !showEmpty)) {
        return <React.Fragment />;
    }
    return <InputContainer
        className={`inputview ${className}`}
        fullWidth={fullWidth}
        hasError={hasError}
        outsideLabel={hasOutside}
    >
        {withLabel && <FieldLabel
            className="inputview-label"
            message={label}
            isSelected={isSelected}
            isOutside={hasOutside}
            withTransform={!hasOutside}
            withValue
        />}
        {(hasHelper && hasOutside) && <FieldHelper isOutside>
            {NLS.get(helperText)}
        </FieldHelper>}
        <FieldContent
            className="inputview-cnt"
            isSmall={isSmall}
            withLabel={withLabel && !hasOutside}
            maxHeight={maxHeight}
            noWrap={noWrap}
            withLink={!!onClick}
            isSelected={isSelected}
        >
            {!!icon && <FieldIcon icon={icon} />}
            {hasChildren && <div className="inputview-value">
                {children}
            </div>}
            {isLink && <div className="inputview-value inputview-link">
                <HyperLink
                    variant="primary"
                    href={href}
                    message={content}
                    target="_blank"
                />
            </div>}
            {isHtml && <Html
                className="inputview-value"
                variant={usePre ? "pre" : "div"}
                onClick={onClick}
                content={content}
            />}
            {isText && <MultiLine
                className={`inputview-value ${textColor ? `text-${textColor}` : viewClass}`}
                onClick={onClick}
                content={content || " "}
            />}
            {hasLink && <FieldLink
                variant={linkVariant}
                icon={linkIcon}
                url={linkUrl}
                href={linkHref}
                target={linkTarget}
                isEmail={isEmail}
                isPhone={isPhone}
                isWhatsApp={isWhatsApp}
            />}

            {hasButton && <FieldButton
                className="inputview-button"
                variant="light"
                icon="add"
                message={buttonMessage}
                onClick={onButton}
            />}
            <InputCopy
                isHidden={!hasCopy}
                copyValue={copyValue}
                inputValue={content}
                isFloating={floatCopy}
            />
        </FieldContent>
        {hasError  && <FieldError>{NLS.get(error)}</FieldError>}
        {(hasHelper && !hasOutside) && <FieldHelper>{NLS.get(helperText)}</FieldHelper>}
    </InputContainer>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ViewField.propTypes = {
    isHidden      : PropTypes.bool,
    showEmpty     : PropTypes.bool,
    className     : PropTypes.string,
    viewClass     : PropTypes.string,
    textColor     : PropTypes.string,
    label         : PropTypes.string,
    outsideLabel  : PropTypes.bool,
    icon          : PropTypes.string,
    value         : PropTypes.any,
    copyValue     : PropTypes.any,
    message       : PropTypes.string,
    error         : PropTypes.string,
    helperText    : PropTypes.string,
    fullWidth     : PropTypes.bool,
    isSmall       : PropTypes.bool,
    maxHeight     : PropTypes.number,
    noWrap        : PropTypes.bool,
    usePre        : PropTypes.bool,
    isSelected    : PropTypes.bool,
    linkIcon      : PropTypes.string,
    linkVariant   : PropTypes.string,
    linkUrl       : PropTypes.string,
    linkHref      : PropTypes.string,
    linkTarget    : PropTypes.string,
    isEmail       : PropTypes.bool,
    isPhone       : PropTypes.bool,
    isWhatsApp    : PropTypes.bool,
    hasCopy       : PropTypes.bool,
    onClick       : PropTypes.func,
    showButton    : PropTypes.bool,
    buttonMessage : PropTypes.string,
    onButton      : PropTypes.func,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ViewField.defaultProps = {
    isHidden   : false,
    showEmpty  : false,
    className  : "",
    viewClass  : "",
    textColor  : "",
    fullWidth  : false,
    isSmall    : false,
    noWrap     : false,
    usePre     : false,
    isSelected : false,
    linkTarget : "_blank",
    isEmail    : false,
    isPhone    : false,
    isWhatsApp : false,
    hasCopy    : false,
};

export default ViewField;
