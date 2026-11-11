import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Styles
const Track = Styled.div.attrs(({ height }) => ({ height }))`
    flex-shrink: 0;
    display: flex;
    gap: 2px;
    height: ${(props) => props.height}px;
    border-radius: ${(props) => props.height / 2}px;
    background-color: var(--lighter-gray);
    overflow: hidden;
`;

const Part = Styled.div.attrs(({ color, isStriped }) => ({ color, isStriped }))`
    flex: 0 1 auto;
    height: 100%;
    background: ${(props) => props.isStriped ? `repeating-linear-gradient(
        45deg,
        color-mix(in oklab, ${props.color} 45%, white) 0 4px,
        color-mix(in oklab, ${props.color} 12%, white) 4px 8px
    )` : props.color};
    transition: width 0.2s;

    &:only-child {
        border-radius: inherit;
    }
`;



/**
 * The Report Bar Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ReportBar(props) {
    const { isHidden, className, color, height, percent, parts } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }

    // A single value is a bar of one part
    let items = parts;
    if (!items.length) {
        items = [{ percent, color }];
    }

    // A percent outside of the bar would draw past its ends, and the parts shrink to leave the
    // space between them
    return <Track className={className} height={height}>
        {items.filter((part) => Number(part.percent) > 0).map((part, index) => <Part
            key={index}
            color={part.color || "var(--primary-color)"}
            isStriped={Boolean(part.isStriped)}
            style={{ width : `${Math.min(100, Math.max(0, Number(part.percent)))}%` }}
        />)}
    </Track>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ReportBar.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    color     : PropTypes.string,
    height    : PropTypes.number,
    percent   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    parts     : PropTypes.array,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ReportBar.defaultProps = {
    isHidden  : false,
    className : "",
    color     : "",
    height    : 8,
    percent   : 0,
    parts     : [],
};

export default ReportBar;
