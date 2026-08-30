import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Styles
// The Details are the only scroll, so the header is stuck over what goes under it, and it
// is the one that fades that content, as it is the last thing over it
const Container = Styled.div`
    position: sticky;
    top: var(--details-title-top);
    background-color: var(--content-color);
    z-index: 2;

    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        height: var(--details-fade);
        background: linear-gradient(var(--content-color), transparent);
        pointer-events: none;
    }
`;

const Header = Styled.header`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: var(--details-spacing) 0 12px;
    border-bottom: 1px solid var(--border-color-light);
`;

const HeaderIcon = Styled(Icon).attrs(({ color }) => ({ color }))`
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 24px;
    color: var(--white-color);
    background-color: ${(props) => props.color || "var(--primary-color)"};
    border-radius: var(--border-radius);
`;

// The description takes the whole line, so it can use the space that is under the close.
// The minimum height is the one of the icon, so a header with no description still has
// its title next to the middle of it
const Content = Styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: 12px;
    row-gap: 2px;
    min-width: 0;
    min-height: 40px;
`;

const Title = Styled.h3`
    grid-row: 1;
    grid-column: 1;
    margin: 0;
    min-width: 0;
    color: var(--black-color);
    font-family: var(--title-font);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Description = Styled.p`
    grid-row: 2;
    grid-column: 1 / -1;
    margin: 0;
    color: var(--font-lighter);
    font-size: var(--font-size-small);
    line-height: 1.4;
`;

const Close = Styled(IconLink)`
    grid-row: 1;
    grid-column: 2;
`;



/**
 * The Detail Header Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DetailHeader(props) {
    const {
        isHidden, className, icon, color, message, description, onClose, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={`details-header ${className}`}>
        <Header>
            <HeaderIcon
                icon={icon}
                color={color}
            />
            <Content>
                <Title>{NLS.get(message)}</Title>
                <Close
                    isHidden={!onClose}
                    variant="black"
                    icon="close"
                    onClick={onClose}
                    isSmall
                />
                {!!description && <Description>{NLS.get(description)}</Description>}
            </Content>
        </Header>
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DetailHeader.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    icon        : PropTypes.string.isRequired,
    color       : PropTypes.string,
    message     : PropTypes.string.isRequired,
    description : PropTypes.string,
    onClose     : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DetailHeader.defaultProps = {
    isHidden  : false,
    className : "",
};

export default DetailHeader;
