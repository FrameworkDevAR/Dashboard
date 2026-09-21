import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Span = Styled.span`
    box-sizing: border-box;
    position: absolute;
    top: -2px;
    right: 2px;
    min-width: 16px;
    padding: 0 4px;
    line-height: 14px;
    font-size: 10px;
    text-align: center;
    border-radius: 999px;
    background-color: #ff0033;
    border: 1px solid var(--content-color);
    color: white;
`;



/**
 * The Badge Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Badge(props) {
    const { className, value } = props;


    // Do the Render
    if (!value) {
        return <React.Fragment />;
    }
    return <Span className={`badge ${className}`}>
        {value}
    </Span>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Badge.propTypes = {
    value     : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    className : PropTypes.string,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Badge.defaultProps = {
    className : "",
};

export default Badge;
