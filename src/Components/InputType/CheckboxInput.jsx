import React                 from "react";
import PropTypes             from "prop-types";
import Styled, { keyframes } from "styled-components";

// Core & Utils
import NLS                   from "../../Core/NLS";
import Utils                 from "../../Utils/Utils";

// Components
import InputContent          from "../Input/InputContent";
import Icon                  from "../Common/Icon";
import Html                  from "../Common/Html";



// Animations
const tick = keyframes`
    from { transform: scale(0); }
    to   { transform: scale(1); }
`;

// Styles
const Container = Styled.label`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
`;

const Input = Styled.input`
    width: 0;
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    opacity: 0;

    &:focus + span {
        color: var(--input-check-focus, black);
        outline: none;
    }

    &:checked + span,
    &:indeterminate + span {
        color: var(--input-check-checked, black);
    }
    &:checked + span::before {
        animation: ${tick} 0.4s cubic-bezier(0.175, 0.885, 0.320, 1.275);
    }

    &:disabled + span {
        color: var(--input-check-disabled);
        cursor: not-allowed;
    }
`;

const Span = Styled(Icon)`
    color: var(--input-check-normal, black);
    width: var(--input-check-size, 18px);
    height: var(--input-check-size, 18px);
    font-size: var(--input-check-size, 18px);
    margin-right: 6px;
    cursor: pointer;
`;

const Label = Styled(Html)`
    font-size: var(--input-font);
    color: var(--input-check-normal, black);
`;



/**
 * The Checkbox Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function CheckboxInput(props) {
    const {
        inputRef, className, isFocused, isDisabled, withBorder,
        id, name, value, label, prefix, isChecked, isIndeterminate,
        onChange, onClick, onFocus, onBlur, children,
    } = props;


    // The References
    const fieldRef = React.useRef(null);
    const checkRef = inputRef || fieldRef;


    // Update the indeterminate state
    React.useEffect(() => {
        if (checkRef?.current) {
            checkRef.current.indeterminate = isIndeterminate;
        }
    }, [ isIndeterminate ]);


    // Handles the Change
    const handleChange = (e) => {
        onChange(name, e.target.checked ? 1 : 0);
    };

    // Handles the Click
    const handleClick = (e) => {
        if (withBorder) {
            Utils.triggerClick(inputRef);
            e.preventDefault();
            e.stopPropagation();
        }
        if (onClick) {
            onClick(e);
        }
    };

    // Memoized icon determination
    const icon = React.useMemo(() => {
        if (isChecked) {
            return "checkbox-on";
        }
        if (isIndeterminate) {
            return "checkbox-indeterminate";
        }
        return "checkbox-off";
    }, [ isChecked, isIndeterminate ]);


    // Do the Render
    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withBorder={withBorder}
        onClick={handleClick}
        withClick={withBorder}
        withPadding
    >
        <Container>
            <Input
                ref={checkRef}
                type="checkbox"
                id={id}
                name={name}
                value={value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            <Span icon={icon} />
            {prefix}
            {!!label && <Label variant="span">{NLS.get(label)}</Label>}
            {children}
        </Container>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
CheckboxInput.propTypes = {
    inputRef        : PropTypes.any,
    className       : PropTypes.string,
    isFocused       : PropTypes.bool,
    isDisabled      : PropTypes.bool,
    withBorder      : PropTypes.bool,
    id              : PropTypes.string,
    name            : PropTypes.string.isRequired,
    value           : PropTypes.any,
    label           : PropTypes.string,
    prefix          : PropTypes.node,
    isChecked       : PropTypes.bool,
    isIndeterminate : PropTypes.bool,
    onChange        : PropTypes.func.isRequired,
    onClick         : PropTypes.func,
    onFocus         : PropTypes.func,
    onBlur          : PropTypes.func,
    children        : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
CheckboxInput.defaultProps = {
    className       : "",
    isFocused       : false,
    isDisabled      : false,
    withBorder      : false,
    isChecked       : false,
    isIndeterminate : false,
};

export default CheckboxInput;
