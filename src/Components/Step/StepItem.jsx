import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.div.attrs(({ isSelected, isCompleted, isDisabled }) => ({ isSelected, isCompleted, isDisabled }))`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 500;
    color: var(--darkest-gray);
    transition: color 0.2s;

    ${(props) => props.isSelected && `
        font-weight: 600;
        color: var(--font-color);
    `}
    ${(props) => (props.isCompleted && !props.isSelected) && `
        font-weight: 600;
        color: var(--success-color);
    `}
    ${(props) => (!props.isSelected && !props.isDisabled) && `
        cursor: pointer;
    `}
    ${(props) => props.isDisabled && `
        cursor: not-allowed;
    `}
`;

const Circle = Styled.span.attrs(({ isSelected, isCompleted }) => ({ isSelected, isCompleted }))`
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--border-color-medium);
    border-radius: 100%;
    font-size: 13px;
    font-weight: 600;
    color: var(--darkest-gray);
    background-color: var(--content-color);
    transition: all 0.2s;

    ${(props) => props.isSelected && `
        border-color: var(--font-color);
        color: var(--white-color);
        background-color: var(--font-color);
    `}
    ${(props) => (props.isCompleted && !props.isSelected) && `
        border-color: var(--success-color);
        color: var(--white-color);
        background-color: var(--success-color);
    `}
`;



/**
 * The Step Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StepItem(props) {
    const {
        className, message, number,
        isSelected, isCompleted, isDisabled, onClick,
    } = props;


    // Handles the Click
    const handleClick = () => {
        if (!isSelected && !isDisabled) {
            onClick();
        }
    };


    // Do the Render
    const showCheck = Boolean(isCompleted && !isSelected);

    return <Container
        className={className}
        isSelected={isSelected}
        isCompleted={isCompleted}
        isDisabled={isDisabled}
        onClick={handleClick}
    >
        <Circle isSelected={isSelected} isCompleted={isCompleted}>
            {showCheck ? <Icon icon="check" size="16" /> : number}
        </Circle>
        {NLS.get(message)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
StepItem.propTypes = {
    className   : PropTypes.string,
    value       : PropTypes.string.isRequired,
    message     : PropTypes.string.isRequired,
    number      : PropTypes.number,
    isSelected  : PropTypes.bool,
    isCompleted : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    onClick     : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
StepItem.defaultProps = {
    className   : "",
    number      : 0,
    isSelected  : false,
    isCompleted : false,
    isDisabled  : false,
};

export default StepItem;
