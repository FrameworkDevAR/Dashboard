import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.div.attrs(({ isSelected, withError, canDrag }) => ({ isSelected, withError, canDrag }))`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    height: 36px;
    padding: 0 10px;
    color: var(--black-color);
    font-size: var(--setting-description-size);
    font-weight: 500;
    background-color: var(--content-color);
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius);
    box-shadow: rgba(17, 24, 32, 0.04) 0 1px 1px;
    transition: all 0.2s;
    cursor: ${(props) => props.canDrag ? "grab" : "pointer"};

    &:hover {
        border-color: var(--border-color-medium);
        box-shadow: rgba(17, 24, 32, 0.13) 0 2px 6px -1px;
    }

    ${(props) => props.isSelected && `
        background-color: var(--lighter-gray);
        border-color: var(--border-color-medium);
        box-shadow: rgba(17, 24, 32, 0.13) 0 2px 6px -1px;
    `}

    ${(props) => props.withError && `
        height: auto;
        min-height: 36px;
        padding-top: 6px;
        padding-bottom: 6px;
    `}
`;

const CardIcon = Styled(Icon).attrs(({ color }) => ({ color }))`
    flex-shrink: 0;
    color: ${(props) => props.color};
    font-size: 18px;
`;

const Content = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex-grow: 1;
    min-width: 0;
`;

const Title = Styled.span`
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ErrorText = Styled.span`
    color: var(--error-color);
    font-size: var(--font-size-small);
    font-weight: 400;
    line-height: 1.3;
`;

const Go = Styled(Icon)`
    flex-shrink: 0;
    color: var(--darkest-gray);
    font-size: 16px;
`;



/**
 * The Detail Card Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DetailCard(props) {
    const {
        isHidden, className, icon, color, message, error,
        isSelected, canDrag, onClick, onMouseDown,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={`details-card ${className}`}
        isSelected={isSelected}
        withError={!!error}
        canDrag={canDrag}
        onClick={onClick}
        onMouseDown={onMouseDown}
    >
        <CardIcon icon={icon} color={color} />
        <Content>
            <Title>{NLS.get(message)}</Title>
            {!!error && <ErrorText>{NLS.get(error)}</ErrorText>}
        </Content>
        <Go icon={canDrag ? "drag" : "next"} />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DetailCard.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    icon        : PropTypes.string.isRequired,
    color       : PropTypes.string,
    message     : PropTypes.string.isRequired,
    error       : PropTypes.string,
    isSelected  : PropTypes.bool,
    canDrag     : PropTypes.bool,
    onClick     : PropTypes.func,
    onMouseDown : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DetailCard.defaultProps = {
    isHidden   : false,
    className  : "",
    color      : "var(--font-lighter)",
    error      : "",
    isSelected : false,
    canDrag    : false,
};

export default DetailCard;
