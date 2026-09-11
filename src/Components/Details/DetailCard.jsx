import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.div.attrs(({ isSelected, isDimmed, withError, canDrag, isClickable }) => ({ isSelected, isDimmed, withError, canDrag, isClickable }))`
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
    transition:
        opacity 0.25s ease,
        scale 0.3s cubic-bezier(0.34, 1.5, 0.4, 1),
        border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
    cursor: ${(props) => props.canDrag ? "grab" : (props.isClickable ? "pointer" : "default")};

    &:hover {
        border-color: var(--border-color-medium);
        box-shadow: rgba(17, 24, 32, 0.13) 0 2px 6px -1px;
    }

    ${(props) => props.isDimmed && `
        opacity: 0.4;
        scale: 0.97;
    `}

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

const Grip = Styled(Icon)`
    flex-shrink: 0;
    color: var(--darkest-gray);
    font-size: 16px;
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

const Actions = Styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-right: -4px;
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
        isSelected, isDimmed, canDrag, onClick, onMouseDown, onSort, actions, children,
    } = props;


    // Handles a Click in the Actions. Only the ones in an action are stopped, so the space
    // between them still clicks the card instead of doing nothing
    const handleActions = (e) => {
        if (e.target !== e.currentTarget) {
            e.stopPropagation();
        }
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={`details-card ${className}`}
        isSelected={isSelected}
        isDimmed={isDimmed}
        withError={!!error}
        canDrag={canDrag}
        isClickable={Boolean(onClick || onMouseDown)}
        onClick={onClick}
        onMouseDown={onMouseDown}
    >
        <Grip
            isHidden={!onSort}
            icon="drag"
            cursor="grab"
            onMouseDown={onSort}
            onClick={(e) => e.stopPropagation()}
        />
        <CardIcon
            isHidden={!icon}
            icon={icon}
            color={color}
        />
        <Content>
            {children || <>
                <Title>{NLS.get(message)}</Title>
                {!!error && <ErrorText>{NLS.get(error)}</ErrorText>}
            </>}
        </Content>
        {!!actions && <Actions onClick={handleActions}>
            {actions}
        </Actions>}
        <Go
            isHidden={Boolean(actions)}
            icon={canDrag ? "drag" : "next"}
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DetailCard.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    icon        : PropTypes.string,
    color       : PropTypes.string,
    message     : PropTypes.string,
    error       : PropTypes.string,
    isSelected  : PropTypes.bool,
    isDimmed    : PropTypes.bool,
    canDrag     : PropTypes.bool,
    onClick     : PropTypes.func,
    onMouseDown : PropTypes.func,
    onSort      : PropTypes.func,
    actions     : PropTypes.any,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DetailCard.defaultProps = {
    isHidden   : false,
    className  : "",
    icon       : "",
    message    : "",
    color      : "var(--font-lighter)",
    error      : "",
    isSelected : false,
    isDimmed   : false,
    canDrag    : false,
};

export default DetailCard;
