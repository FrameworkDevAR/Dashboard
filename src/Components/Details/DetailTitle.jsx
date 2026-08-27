import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";
import Beta                 from "../Common/Beta";



// Styles
const Container = Styled.div.attrs(({ isCollapsed, noSticky }) => ({ isCollapsed, noSticky }))`
    padding: 6px 0;
    padding-top: var(--details-spacing);
    background-color: var(--content-color);
    border-bottom: 1px solid var(--border-color-light);
    z-index: 2;

    ${(props) => !props.noSticky && `
        position: sticky;
        top: var(--details-title-top);
    `}

    ${(props) => props.isCollapsed && `
        border-bottom: none;
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    `}
`;

const Inside = Styled.h3.attrs(({ isCollapsible }) => ({ isCollapsible }))`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0px;
    padding: 4px;
    min-height: 32px;
    font-size: 18px;
    font-weight: 400;
    line-height: 1;
    font-family: var(--title-font);
    color: var(--black-color);
    border-radius: var(--border-radius);

    ${(props) => props.isCollapsible && `
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
            background-color: var(--light-gray);
        }
    `}
`;

const Title = Styled.div`
    flex-grow: 2;
    display: flex;
    align-items: center;
    gap: 12px;
`;



/**
 * The Detail Title Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DetailTitle(props) {
    const {
        isHidden, className, icon, message, isBeta,
        collapsible, isCollapsed, noSticky,
        viewAction, canView, viewIcon, viewTooltip,
        action, canEdit, editIcon, editTooltip,
        onAction, onClose, onClick,
    } = props;


    // Variables
    const isCollapsible   = Boolean(collapsible);
    const hasPreCollapse  = Boolean(isCollapsible && !icon);
    const hasPreIcon      = Boolean(icon);
    const hasPostEdit     = Boolean(action && onAction && canEdit);
    const hasPostView     = Boolean(viewAction && onAction && canView);
    const hasPostClose    = Boolean(onClose);
    const hasPostCollapse = Boolean(isCollapsible && !hasPostView && !hasPostEdit && !hasPostClose && icon);


    // Do the Render
    if (isHidden || !message) {
        return <React.Fragment />;
    }
    return <Container
        className={`details-title ${className}`}
        isCollapsed={isCollapsed}
        noSticky={noSticky}
    >
        <Inside onClick={onClick} isCollapsible={isCollapsible}>
            {hasPreCollapse && <IconLink
                variant="black"
                icon={isCollapsed ? "closed" : "expand"}
                isSmall
            />}
            {hasPreIcon && <Icon icon={icon} />}

            <Title>
                {NLS.get(message)}
                <Beta isHidden={!isBeta} />
            </Title>

            {hasPostView && <IconLink
                variant="black"
                icon={viewIcon}
                tooltip={viewTooltip}
                onClick={(e) => onAction(e, viewAction)}
                isSmall
            />}

            {hasPostEdit && <IconLink
                variant="black"
                icon={editIcon}
                tooltip={editTooltip}
                onClick={(e) => onAction(e, action)}
                isSmall
            />}
            {hasPostClose && <IconLink
                variant="black"
                icon="close"
                onClick={onClose}
                isSmall
            />}
            {hasPostCollapse && <IconLink
                variant="black"
                icon={isCollapsed ? "closed" : "expand"}
                isSmall
            />}
        </Inside>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DetailTitle.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    icon        : PropTypes.string,
    message     : PropTypes.string,
    isBeta      : PropTypes.bool,
    collapsible : PropTypes.string,
    isCollapsed : PropTypes.bool,
    noSticky    : PropTypes.bool,
    viewAction  : PropTypes.string,
    canView     : PropTypes.bool,
    viewIcon    : PropTypes.string,
    viewTooltip : PropTypes.string,
    action      : PropTypes.string,
    canEdit     : PropTypes.bool,
    editIcon    : PropTypes.string,
    editTooltip : PropTypes.string,
    onAction    : PropTypes.func,
    onClose     : PropTypes.func,
    onClick     : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DetailTitle.defaultProps = {
    isHidden  : false,
    className : "",
};

export default DetailTitle;
