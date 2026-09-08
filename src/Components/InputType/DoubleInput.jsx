import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import InputField           from "../Form/InputField";



// Styles
const Container = Styled.div.attrs(({ withLabel, outsideLabel }) => ({ withLabel, outsideLabel }))`
    width: 100%;
    display: flex;
    align-items: center;

    .inputfield:first-child::after {
        content: "";
        position: absolute;
        border-right: 1px solid var(--input-border);
    }

    ${(props) => props.withLabel ? `
        gap: 16px;

        .inputfield,
        .inputfield input {
            height: 20px;
        }

        .inputfield:first-child::after {
            top: calc(0px - var(--input-label));
            bottom: calc(0px - var(--input-vert-padding));
            right: -8px;
        }
    ` : `
        .input-content {
            min-height: calc(var(--input-height) - 2px);
            padding: var(--input-padding);
            padding-top: var(--input-label) !important;
        }

        .inputfield:first-child::after {
            top: 0;
            bottom: 0;
            right: 0;
        }
    `}

    ${(props) => props.outsideLabel && `
        .input-content {
            min-height: 36px;
            padding: var(--input-padding) !important;
        }
    `}
`;



/**
 * The Double Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DoubleInput(props) {
    const {
        className, isFocused, isDisabled, withLabel, outsideLabel, withBorder,
        onChange, onFocus, onBlur, children,
    } = props;

    const items = [];
    for (const child of Utils.getVisibleChildren(children)) {
        items.push(child.props);
    }


    // Do the Render
    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withLabel={withLabel}
        withPadding={withLabel}
        withBorder={withBorder}
    >
        <Container withLabel={withLabel} outsideLabel={outsideLabel}>
            {items.map((item) => <InputField
                {...item}
                key={item.name}
                label={outsideLabel ? "" : item.label}
                onChange={item.onChange || onChange}
                isDisabled={isDisabled}
                withBorder={false}
                onFocus={onFocus}
                onBlur={onBlur}
                withPadding
                withLabel={!outsideLabel}
                fullWidth
            />)}
        </Container>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DoubleInput.propTypes = {
    className    : PropTypes.string,
    isFocused    : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    withBorder   : PropTypes.bool,
    withLabel    : PropTypes.bool,
    outsideLabel : PropTypes.bool,
    onChange     : PropTypes.func.isRequired,
    onFocus      : PropTypes.func,
    onBlur       : PropTypes.func,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DoubleInput.defaultProps = {
    className    : "",
    isFocused    : false,
    isDisabled   : false,
    withBorder   : true,
    withLabel    : true,
    outsideLabel : false,
};

export default DoubleInput;
