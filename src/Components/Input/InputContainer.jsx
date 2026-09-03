import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.div.attrs(({ width, fullWidth, hasError, bigLabel }) => ({ width, fullWidth, hasError, bigLabel }))`
    --input-border: var(--input-border-color);
    position: relative;
    display: block;

    ${(props) => props.fullWidth && `
        width: 100%;
    `}
    ${(props) => props.width && `
        width: ${props.width}px;
    `}

    ${(props) => props.hasError && `
        --input-border: var(--error-color);
        --input-color-label: var(--error-color);
    `}

    ${(props) => props.bigLabel && `
        --input-label: 28px;
    `}
`;



/**
 * The Input Container Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputContainer(props) {
    const { className, dataName, width, fullWidth, hasError, bigLabel, children } = props;

    return <Container
        className={className}
        data-name={dataName}
        width={width}
        fullWidth={fullWidth}
        hasError={hasError}
        bigLabel={bigLabel}
    >
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputContainer.propTypes = {
    className : PropTypes.string,
    dataName  : PropTypes.string,
    width     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    fullWidth : PropTypes.bool,
    hasError  : PropTypes.bool,
    bigLabel  : PropTypes.bool,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputContainer.defaultProps = {
    className : "",
    dataName  : "",
    fullWidth : false,
    hasError  : false,
};

export default InputContainer;
