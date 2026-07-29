import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Span = Styled.span`
    box-sizing: border-box;
    min-width: 14px;
    margin-left: 6px;
    padding: 0 4px;
    font-size: 10px;
    line-height: 14px;
    border-radius: var(--border-radius-small);
    background-color: rgba(0, 0, 0, 0.07);
`;



/**
 * The Amount Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Amount(props) {
    const { className, value } = props;


    // Do the Render
    if (value === undefined || value === null || value === "") {
        return <React.Fragment />;
    }
    return <Span className={`amount ${className}`}>
        {value}
    </Span>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Amount.propTypes = {
    value     : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    className : PropTypes.string,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Amount.defaultProps = {
    className : "",
};

export default Amount;
