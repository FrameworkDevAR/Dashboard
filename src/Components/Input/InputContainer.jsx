import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.div.attrs(({ width, fullWidth, hasError, bigLabel, outsideLabel, bottomSpace, rightInput, atBottom, disabledBackground }) => ({ width, fullWidth, hasError, bigLabel, outsideLabel, bottomSpace, rightInput, atBottom, disabledBackground }))`
    --input-border: var(--input-border-color);
    position: relative;
    display: block;

    ${(props) => props.fullWidth && `
        width: 100%;
    `}
    ${(props) => (Boolean(props.width) && !props.rightInput) && `
        width: ${props.width}px;
    `}

    ${(props) => props.hasError && `
        --input-border: var(--error-color);
        --input-color-label: var(--error-color);
    `}

    ${(props) => props.bigLabel && `
        --input-label: 28px;
    `}

    ${(props) => props.rightInput && `
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto;
        align-items: center;
        column-gap: var(--main-gap);

        > .inputfield-label {
            grid-column: 1;
            line-height: 1.3;
            white-space: normal;
            overflow: visible;
        }
        &:not(:has(> .inputfield-helper)) {
            grid-template-rows: auto;

            > .inputfield-label {
                margin-bottom: 0;
            }
        }
        > .inputfield-content {
            grid-column: 2;
            grid-row: 1 / -1;
            align-self: end;
            width: ${props.width || 120}px;
        }
        > .inputfield-error,
        > .inputfield-helper {
            grid-column: 1;
        }
    `}

    ${(props) => props.atBottom && `
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    `}

    ${(props) => props.disabledBackground && `
        .input-content {
            background-color: var(--lightest-gray);
        }
        .input-content input {
            background-color: transparent;
        }
    `}

    ${(props) => props.bottomSpace && `
        padding-bottom: 8px;
    `}

    &:not(:has(> .inputfield-label)):not(:has(> .inputview-label)):not(.inputfield-toggle):not(.inputfield-checkbox):not(.inputfield-radiobox) {
        --input-height: var(--input-plain-height, 38px);
        --input-border-radius: var(--input-border-radius-small);
    }

    ${(props) => props.outsideLabel && `
        --input-height: var(--input-plain-height, 38px);
        --input-border-radius: var(--input-border-radius-small);

        &.inputfield-textarea {
            --input-vert-padding: 10px;
            --input-padding: var(--input-vert-padding) var(--input-horiz-padding);
        }
    `}
`;



/**
 * The Input Container Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputContainer(props) {
    const {
        className, dataName, width, fullWidth,
        hasError, bigLabel, outsideLabel, bottomSpace, rightInput, atBottom, disabledBackground, children,
    } = props;

    return <Container
        className={className}
        data-name={dataName}
        width={width}
        fullWidth={fullWidth}
        hasError={hasError}
        bigLabel={bigLabel}
        outsideLabel={outsideLabel}
        bottomSpace={bottomSpace}
        rightInput={rightInput}
        atBottom={atBottom}
        disabledBackground={disabledBackground}
    >
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputContainer.propTypes = {
    className          : PropTypes.string,
    dataName           : PropTypes.string,
    width              : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    fullWidth          : PropTypes.bool,
    hasError           : PropTypes.bool,
    bigLabel           : PropTypes.bool,
    outsideLabel       : PropTypes.bool,
    bottomSpace        : PropTypes.bool,
    rightInput         : PropTypes.bool,
    atBottom           : PropTypes.bool,
    disabledBackground : PropTypes.bool,
    children           : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputContainer.defaultProps = {
    className          : "",
    dataName           : "",
    fullWidth          : false,
    hasError           : false,
    outsideLabel       : false,
    bottomSpace        : false,
    rightInput         : false,
    atBottom           : false,
    disabledBackground : false,
};

export default InputContainer;
