import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";

// Components
import InputCopy            from "../Input/InputCopy";
import Icon                 from "../Common/Icon";
import Html                 from "../Common/Html";
import PillYesNo            from "../Pill/PillYesNo";



// Styles
const Container = Styled.div.attrs(({ gap, isLink, isSelected, withTitle, smallPill }) => ({ gap, isLink, isSelected, withTitle, smallPill }))`
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px;
    overflow: hidden;
    border-radius: var(--border-radius);
    transition: all 0.2s;

    ${(props) => props.smallPill && "padding: 4px 8px;"};
    ${(props) => !!props.gap && `gap: ${props.gap}px;`};
    ${(props) => props.isLink && "cursor: pointer;"};
    ${(props) => props.withTitle && `
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 4px;
        border-radius: 0;
        border-bottom: 1px solid var(--border-color-light);
    `};

    ${(props) => !props.withTitle && `
        &:hover {
            background-color: var(--details-hover, var(--light-gray));
        }
    `}

    ${(props) => props.isSelected && `
        background-color: var(--details-selected, var(--light-gray));
    `}
`;

const DetailIcon = Styled(Icon)`
    padding: 0 8px 0 4px;
`;

const Text = Styled.span`
    flex-grow: 2;
    min-width: 0;
    font-weight: 600;
`;

const ItemTitle = Styled.h4`
    margin: 0 0 2px 0;
    font-size: inherit;
    font-weight: bold;
`;

const DetailCopy = Styled.div.attrs(({ isFloating }) => ({ isFloating }))`
    flex-shrink: 0;
    margin-left: auto;

    ${(props) => props.isFloating && `
        position: absolute;
        right: 2px;
        top: 2px;
        margin-left: 0;
    `}
`;



/**
 * The Detail Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DetailItem(props) {
    const {
        isHidden, className, textColor, gap,
        message, icon, title, prefix, prefixLine, yesNo, smallPill, showAlways,
        tooltip, tooltipVariant, tooltipWidth, tooltipDelay,
        href, url, onClick, isEmail, isPhone, isWhatsApp, isSelected,
        hasCopy, copyValue, children,
    } = props;

    const navigate   = Navigate.useClick(props);
    const elementRef = React.useRef(null);

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Handles the Click
    const handleClick = (e) => {
        if (!Utils.hasSelection()) {
            navigate(e);
        }
    };

    // Handles the Copy Click, so it does not trigger the Item click
    const handleCopyClick = (e) => {
        e.stopPropagation();
    };

    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip, tooltipWidth, tooltipDelay);
        }
    };


    // Get the Content
    let   content  = message ? NLS.get(String(message)) : children;
    let   isHtml   = message && (content.includes("\n") || content.includes("</b>") || content.includes("</span>"));
    const isLink   = href || url || onClick || isEmail || isPhone || isWhatsApp;
    const hasYesNo = yesNo !== undefined;

    // The Copy uses the Message without the Prefix that is added below
    const copyText  = message ? NLS.get(String(message)) : "";
    const showCopy  = Boolean(hasCopy && (copyValue || copyText));
    const withTitle = Boolean(title);
    const floatCopy = Boolean(withTitle || copyText.length > 1000 || isHtml);


    // Nothing to Render
    if (isHidden || (!message && !children && !showAlways)) {
        return <React.Fragment />;
    }

    if (showAlways && !message && !children) {
        content = "";
    }
    if (!children && prefix && !hasYesNo) {
        // The Prefix can be shown in its own line, and then it has no colon
        content = prefixLine ? `<b>${NLS.get(prefix)}</b>\n${content}` : `<b>${NLS.get(prefix)}</b>: ${content}`;
        isHtml  = true;
    }


    // Do the Render
    return <Container
        ref={elementRef}
        className={textColor ? `text-${textColor} ${className}` : className}
        gap={gap}
        smallPill={hasYesNo && smallPill}
        isLink={isLink}
        isSelected={isSelected}
        withTitle={withTitle}
        onClick={handleClick}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        {!!icon && <DetailIcon icon={icon} size="16" />}
        {withTitle && <ItemTitle>{NLS.get(title)}</ItemTitle>}
        {hasYesNo && <Text>{content}</Text>}
        {!hasYesNo && (isHtml ? <Html addBreaks>{content}</Html> : content)}
        {hasYesNo && <PillYesNo value={yesNo} isSmall={smallPill} />}
        {showCopy && <DetailCopy
            isFloating={floatCopy}
            onClick={handleCopyClick}
        >
            <InputCopy
                copyValue={copyValue}
                inputValue={copyText}
            />
        </DetailCopy>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DetailItem.propTypes = {
    isHidden       : PropTypes.bool,
    className      : PropTypes.string,
    textColor      : PropTypes.string,
    gap            : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    message        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    icon           : PropTypes.string,
    title          : PropTypes.string,
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    tooltipDelay   : PropTypes.number,
    prefix         : PropTypes.string,
    prefixLine     : PropTypes.bool,
    yesNo          : PropTypes.oneOfType([ PropTypes.bool, PropTypes.number, PropTypes.string ]),
    smallPill      : PropTypes.bool,
    href           : PropTypes.string,
    url            : PropTypes.string,
    target         : PropTypes.string,
    isEmail        : PropTypes.bool,
    isPhone        : PropTypes.bool,
    isWhatsApp     : PropTypes.bool,
    onClick        : PropTypes.func,
    showAlways     : PropTypes.bool,
    isSelected     : PropTypes.bool,
    hasCopy        : PropTypes.bool,
    copyValue      : PropTypes.string,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DetailItem.defaultProps = {
    isHidden       : false,
    className      : "",
    textColor      : "",
    tooltip        : "",
    tooltipVariant : "bottom",
    tooltipWidth   : 0,
    tooltipDelay   : 1,
    target         : "_self",
    isEmail        : false,
    isPhone        : false,
    isWhatsApp     : false,
    isSelected     : false,
    hasCopy        : false,
};

export default DetailItem;
