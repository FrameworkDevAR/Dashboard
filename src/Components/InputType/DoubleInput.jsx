import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import InputField           from "../Form/InputField";



// Styles
const Container = Styled.div.attrs(({ withLabel, outsideLabel, noLabels }) => ({ withLabel, outsideLabel, noLabels }))`
    width: 100%;
    display: flex;
    align-items: center;

    .inputfield-checkbox {
        flex: 0 0 auto;
        width: auto;
    }

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

    ${(props) => (props.outsideLabel || props.noLabels) && `
        .input-content {
            min-height: calc(var(--input-height) - 2px);
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

    // Without a label anywhere the fields do not reserve the space of one
    const noLabels = !withLabel && items.every((item) => !item.label);


    // Do the Render. The label of a checkbox is the text next to the box and not the label
    // of a field, so it is the one label that stays when the input has its label outside
    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withLabel={withLabel}
        withPadding={withLabel}
        withBorder={withBorder}
    >
        <Container withLabel={withLabel} outsideLabel={outsideLabel} noLabels={noLabels}>
            {items.map((item) => <InputField
                {...item}
                key={item.name}
                label={(outsideLabel && item.type !== "checkbox") ? "" : item.label}
                onChange={item.onChange || onChange}
                isDisabled={isDisabled || item.isDisabled}
                withBorder={false}
                onFocus={onFocus}
                onBlur={onBlur}
                withPadding
                withLabel={!outsideLabel && !noLabels}
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
