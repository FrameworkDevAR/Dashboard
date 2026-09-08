import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Action               from "../../Core/Action";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Constants
const ANIMATION_TIME = 320;

// Styles
const stickyStyles = `
    position: sticky;
    top: var(--details-title-top);
    background-color: var(--content-color);
    z-index: 2;

    &::after {
        content: "";
        position: absolute;
        top: calc(100% + var(--details-header-border, 0px));
        left: 0;
        right: 0;
        height: var(--details-fade);
        background: linear-gradient(var(--content-color), transparent);
        opacity: var(--details-fade-top, 1);
        transition: opacity 0.2s;
        pointer-events: none;
    }
`;

// A collapsible header sticks on its own, as the container also holds the content that
// scrolls under it, and any other one sticks with the container, as what it holds are
// more parts of the header
const Container = Styled.div.attrs(({ hasChildren, isCollapsible }) => ({ hasChildren, isCollapsible }))`
    position: relative;

    ${(props) => props.hasChildren && !props.isCollapsible && "padding-bottom: 8px;"}
    ${(props) => !props.isCollapsible && stickyStyles}
`;

const Header = Styled.header.attrs(({ isCollapsible, isCollapsed }) => ({ isCollapsible, isCollapsed }))`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: var(--details-spacing) 0 12px;
    border-bottom: 1px solid var(--border-color-light);
    --details-header-border: 1px;

    ${(props) => props.isCollapsible && stickyStyles}

    ${(props) => props.isCollapsible && `
        cursor: pointer;

        & > .icon, h3, p {
            transition: transform 0.2s;
        }
        &:hover > .icon,
        &:hover h3,
        &:hover p {
            transform: translateX(4px);
        }
        &:hover .details-collapse {
            background-color: var(--hover-overlay, rgba(0, 0, 0, 0.1));
        }
    `}
    ${(props) => props.isCollapsed && `
        border-bottom: none;
        --details-header-border: 0px;
    `}
`;

const HeaderIcon = Styled(Icon).attrs(({ color, textColor }) => ({ color, textColor }))`
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 24px;
    color: ${(props) => props.textColor};
    background-color: ${(props) => props.color || "var(--primary-color)"};
    border-radius: var(--border-radius);
`;

const Content = Styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: 12px;
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
    min-height: 24px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
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

const Actions = Styled.div`
    grid-row: 1;
    grid-column: 2;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const Body = Styled.section.attrs(({ isCollapsed }) => ({ isCollapsed }))`
    display: grid;
    grid-template-rows: ${(props) => props.isCollapsed ? "0fr" : "1fr"};
    margin: 0;
    color: var(--font-lighter);
    transition: grid-template-rows ${ANIMATION_TIME}ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const Clip = Styled.div.attrs(({ isCollapsed }) => ({ isCollapsed }))`
    min-height: 0;
    overflow: hidden;
    opacity: ${(props) => props.isCollapsed ? "0" : "1"};
    transition: opacity ${(props) => props.isCollapsed ? "120ms" : "240ms"} ease;
`;

const Inside = Styled.div`
    padding: 8px 0 20px;
`;



/**
 * The Detail Header Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DetailHeader(props) {
    const {
        isHidden, className, icon, color, message, description,
        collapsible, action, canEdit, editIcon, editTooltip,
        onAction, onClose, children,
    } = props;


    // The Current State
    const [ isCollapsed, setCollapsed ] = React.useState(false);


    // Handles the Initial Collapsed state
    React.useEffect(() => {
        if (collapsible) {
            const collapsed = localStorage.getItem(`dashboard-collapsed-${collapsible}-${message}`);
            setCollapsed(Boolean(Number(collapsed)));
        }
    }, [ collapsible, message ]);

    // Handles the Collapsed click
    const handleClick = () => {
        if (collapsible) {
            setCollapsed(!isCollapsed);
            localStorage.setItem(`dashboard-collapsed-${collapsible}-${message}`, isCollapsed ? "0" : "1");
        }
    };


    // Handles the Action
    const handleAction = () => {
        if (onAction) {
            onAction(Action.get(action));
        }
    };


    // Variables
    const isCollapsible = Boolean(collapsible && !onClose);
    const hasAction     = Boolean(action && onAction && canEdit);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={`details-header ${className}`}
        hasChildren={!!children}
        isCollapsible={isCollapsible}
    >
        <Header
            isCollapsible={isCollapsible}
            isCollapsed={isCollapsed}
            onClick={handleClick}
        >
            <HeaderIcon
                icon={icon}
                color={color}
                textColor={color ? Utils.getContrastColor(color) : "var(--white-color)"}
            />
            <Content>
                <Title>{NLS.get(message)}</Title>
                <Actions>
                    <IconLink
                        isHidden={!hasAction}
                        variant="black"
                        icon={editIcon}
                        tooltip={editTooltip}
                        onClick={handleAction}
                        isSmall
                    />
                    <IconLink
                        isHidden={!onClose}
                        variant="black"
                        icon="close"
                        onClick={onClose}
                        isSmall
                    />
                    <IconLink
                        isHidden={!isCollapsible}
                        className="details-collapse"
                        variant="black"
                        icon={isCollapsed ? "closed" : "expand"}
                        isSmall
                    />
                </Actions>
                {!!description && <Description>{NLS.get(description)}</Description>}
            </Content>
        </Header>
        {!!children && (isCollapsible ? <Body className="details-content" isCollapsed={isCollapsed}>
            <Clip isCollapsed={isCollapsed}>
                <Inside>
                    {children}
                </Inside>
            </Clip>
        </Body> : children)}
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
    collapsible : PropTypes.string,
    action      : PropTypes.string,
    canEdit     : PropTypes.bool,
    editIcon    : PropTypes.string,
    editTooltip : PropTypes.string,
    onAction    : PropTypes.func,
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
    editIcon  : "edit",
};

export default DetailHeader;
