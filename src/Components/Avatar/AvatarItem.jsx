import React                from "react";
import PropTypes            from "prop-types";
import Styled, { keyframes, css } from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";

// Components
import Avatar               from "../Avatar/Avatar";
import Pill                 from "../Pill/Pill";
import Icon                 from "../Common/Icon";



// Animations
const tick = keyframes`
    from { transform: scale(0.4); }
    60%  { transform: scale(1.15); }
    to   { transform: scale(1); }
`;

// Styles
const Container = Styled.li.attrs(({ isSelected }) => ({ isSelected }))`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: var(--border-radius);
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;

    ${(props) => props.isSelected ? `
        background-color: color-mix(in srgb, var(--primary-color) 7%, transparent);
    ` : `&:hover {
        background-color: var(--lighter-gray);
    }`}
`;

const AvatarContent = Styled(Avatar)`
    flex-shrink: 0;
    border-radius: 50%;
`;

const Content = Styled.div`
    flex-grow: 2;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
`;

const Header = Styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Title = Styled.h3`
    margin: 0;
    font-size: var(--font-size);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Text = Styled.p`
    margin: 0;
    color: var(--font-lighter);
    font-size: var(--font-size-small);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Amount = Styled.span`
    flex-shrink: 0;
    color: var(--font-lighter);
    font-size: var(--font-size-small);
    font-variant-numeric: tabular-nums;
`;

const IconContent = Styled(Icon).attrs(({ isSelected }) => ({ isSelected }))`
    flex-shrink: 0;
    font-size: 20px;
    color: ${(props) => props.isSelected ? "var(--primary-color)" : "var(--darker-gray)"};
    transition: color 0.2s ease-in-out;

    ${(props) => props.isSelected && css`
        animation: ${tick} 0.3s cubic-bezier(0.175, 0.885, 0.320, 1.275);
    `}
`;



/**
 * The Avatar Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function AvatarItem(props) {
    const {
        className, isSelected, onClick,
        name, email, avatar, badge, amount,
    } = props;


    // Do the Render
    return <Container
        className={className}
        isSelected={isSelected}
        onClick={onClick}
    >
        <AvatarContent
            name={name}
            email={email}
            avatar={avatar}
            size={32}
        />
        <Content>
            <Header>
                <Title>{name}</Title>
                <Pill
                    isHidden={!badge}
                    variant="primary"
                    message={badge}
                    isSmall
                />
            </Header>
            <Text>{email}</Text>
        </Content>
        {!!amount && <Amount>{NLS.get(amount)}</Amount>}
        <IconContent
            icon={isSelected ? "checkbox-on" : "checkbox-off"}
            isSelected={isSelected}
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
AvatarItem.propTypes = {
    className  : PropTypes.string,
    isSelected : PropTypes.bool,
    onClick    : PropTypes.func,
    name       : PropTypes.string.isRequired,
    email      : PropTypes.string.isRequired,
    avatar     : PropTypes.string.isRequired,
    badge      : PropTypes.string,
    amount     : PropTypes.string,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
AvatarItem.defaultProps = {
    className  : "",
    isSelected : false,
};

export default AvatarItem;
