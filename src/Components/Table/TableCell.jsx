import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";

// Components
import Circle               from "../Common/Circle";
import Html                 from "../Common/Html";



// Styles
const props = ({
    flexGrow, flexShrink, flexWidth, minWidth, maxWidth, align, isSmall, isBold, isTitle, isFlex, isMultiline,
    bigMobile, hideMobile, noSpace, smallSpace, isEditable, indent,
}) => ({
    flexGrow, flexShrink, flexWidth, minWidth, maxWidth, align, isSmall, isBold, isTitle, isFlex, isMultiline,
    bigMobile, hideMobile, noSpace, smallSpace, isEditable, indent,
});

const TData = Styled.td.attrs(props)`
    && {
        box-sizing: border-box;
        font-size: var(--table-font-size);
        flex-grow: ${(props) => props.flexGrow};
        flex-shrink: ${(props) => props.flexShrink};
        min-width: ${(props) => props.minWidth ? `${props.minWidth}px` : "0"};
        max-width: ${(props) => props.maxWidth ? `${props.maxWidth}px` : "none"};
        text-align: ${(props) => props.align};

        ${(props) => !props.noSpace && `
            padding-top: ${props.smallSpace ? "6px" : "12px"};
            padding-bottom: ${props.smallSpace ? "6px" : "12px"};
            padding-left: ${props.indent ? "24px" : "12px"};
        `}

        ${(props) => props.isSmall && `
            flex: 0 1 150px;
            width: 150px;
        `}

        ${(props) => props.flexWidth && `
            flex: 0 0 ${props.flexWidth}px;
            width: ${props.flexWidth}px;
            min-width: 0;
            max-width: none;
        `};

        ${(props) => props.isBold && `
            font-weight: bold;
        `}

        ${(props) => props.isTitle && `
            color: var(--title-color);
            font-weight: var(--table-title-weight, var(--title-font-weight));
        `}

        ${(props) => props.isFlex && `
            display: flex;
            gap: 8px;
            ${props.isMultiline ? `
                flex-direction: column;
                justify-content: center;
                align-items: ${props.align === "center" ? "center" : props.align === "right" ? "flex-end" : "flex-start"};
            ` : `
                align-items: center;
                justify-content: ${props.align === "center" ? "center" : props.align === "right" ? "flex-end" : "flex-start"};
            `}
        `}

        ${(props) => !props.isMultiline && `
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        `}
    }

    ${(props) => !props.isEditable && `
        @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
            && {
                display: flex;
                align-items: center;
                text-align: left;
                margin: 4px;
                padding: 0;
                border: none;
                min-width: 0;
                max-width: none;

                ${props.bigMobile  && "grid-column: 1 / -1;"}
                ${props.hideMobile && "display: none;"}
            }
        }
    `}
`;



/**
 * The Table Cell Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TableCell(props) {
    const {
        isHidden, message,
        tooltip, tooltipVariant, tooltipWidth, tooltipDelay,
        className, textColor, circle, circleTooltip, hideCircle,
        colSpan, grow, shrink, width, minWidth, maxWidth, align,
        isSmall, isBold, isTitle, isFlex, isMultiline,
        bigMobile, hideMobile,
        noSpace, smallSpace, indent, isEditable, children,
    } = props;

    const elementRef = React.useRef(null);

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip, tooltipWidth, tooltipDelay);
        }
    };


    // Variables
    const content     = message !== undefined ? NLS.get(message) : "";
    const hasHtml     = !!content && String(content).includes("<");
    const hasMessage  = message !== undefined && !hasHtml;
    const hasChildren = !hasMessage;
    const isColor     = Boolean(textColor) && (/^(#|rgb|hsl)/i).test(textColor);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <TData
        ref={elementRef}
        className={textColor && !isColor ? `text-${textColor}` : className}
        style={isColor ? { color : textColor } : undefined}
        flexGrow={grow}
        flexShrink={shrink}
        flexWidth={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        align={align}
        isSmall={isSmall}
        isBold={isBold}
        isTitle={isTitle}
        isFlex={isFlex}
        isMultiline={isMultiline}
        bigMobile={bigMobile}
        hideMobile={hideMobile}
        noSpace={noSpace}
        smallSpace={smallSpace}
        indent={indent}
        isEditable={isEditable}
        colSpan={colSpan}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        {!!circle && !hideCircle && <Circle
            color={circle}
            tooltip={circleTooltip}
            tooltipVariant="bottom"
            tooltipWidth={100}
            tooltipDelay={0.2}
        />}

        {hasHtml && <Html content={content} />}
        {hasMessage && NLS.get(message)}
        {hasChildren && children}
    </TData>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TableCell.propTypes = {
    isHidden       : PropTypes.bool,
    message        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    tooltipDelay   : PropTypes.number,
    className      : PropTypes.string,
    textColor      : PropTypes.string,
    colSpan        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    grow           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    shrink         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    width          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minWidth       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxWidth       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    align          : PropTypes.string,
    isBold         : PropTypes.bool,
    isSmall        : PropTypes.bool,
    isTitle        : PropTypes.bool,
    isFlex         : PropTypes.bool,
    isMultiline    : PropTypes.bool,
    bigMobile      : PropTypes.bool,
    hideMobile     : PropTypes.bool,
    circle         : PropTypes.string,
    circleTooltip  : PropTypes.string,
    hideCircle     : PropTypes.bool,
    noSpace        : PropTypes.bool,
    smallSpace     : PropTypes.bool,
    indent         : PropTypes.bool,
    isEditable     : PropTypes.bool,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TableCell.defaultProps = {
    isHidden       : false,
    tooltip        : "",
    tooltipVariant : "bottom",
    tooltipWidth   : 0,
    tooltipDelay   : 1,
    className      : "",
    textColor      : "",
    colSpan        : "1",
    grow           : "1",
    shrink         : "1",
    align          : "left",
    isBold         : false,
    isSmall        : false,
    isTitle        : false,
    isFlex         : false,
    isMultiline    : false,
    bigMobile      : false,
    hideMobile     : false,
    hideCircle     : false,
    noSpace        : false,
    smallSpace     : false,
    indent         : false,
};

export default TableCell;
