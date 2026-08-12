import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import Responsive           from "../../Core/Responsive";

// Components
import BarLogo              from "../Core/BarLogo";
import BarIcon              from "../Core/BarIcon";
import Avatar               from "../Avatar/Avatar";



// Styles
const Container = Styled.nav.attrs(({ expandMobile }) => ({ expandMobile }))`
    --bar-logo-width: var(--sidebar-logo-width, auto);
    --bar-logo-height: var(--sidebar-logo-height, auto);
    --bar-logo-max-width: var(--sidebar-logo-max-width, none);
    --bar-logo-max-height: var(--sidebar-logo-max-height, none);
    --bar-logo-bottom: var(--sidebar-logo-bottom, 0px);

    --bar-icon-size: var(--sidebar-icon-size, 32px);
    --bar-icon-font: var(--sidebar-icon-font, 16px);
    --bar-icon-color: var(--sidebar-icon-color);
    --bar-icon-background: var(--sidebar-icon-background);
    --bar-icon-sel-color: var(--sidebar-icon-sel-color);
    --bar-icon-sel-bg: var(--sidebar-icon-sel-bg);
    --bar-icon-hover-color: var(--sidebar-icon-hover-color);
    --bar-icon-hover-bg: var(--sidebar-icon-hover-bg);

    grid-area: sidebar;
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: var(--sidebar-width);
    padding: var(--sidebar-padding, 16px 0);
    background-color: var(--sidebar-background, var(--primary-color));
    border-right: var(--sidebar-border, none);
    overflow: auto;

    ${(props) => props.expandMobile && `
        .baricon-text {
            display: none;
        }

        @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
            & > div {
                align-items: flex-start;
            }
            h2 {
                width: 100%;
            }
            .baricon {
                width: 100%;
                justify-content: flex-start;
            }
            .baricon-text {
                display: block;
            }
        }
    `}

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: var(--z-sidebar);
    }
`;

const Div = Styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

const Name = Styled.div`
    margin-bottom: 8px;
    white-space: nowrap;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.2);
    font-size: 20px;
    font-weight: 800;
    font-family: var(--title-font);
    transform: translate(50%) rotate(-90deg);
    transform-origin: left center;
`;

const SideAvatar = Styled(Avatar)`
    margin-top: 6px;
`;

/**
 * The Side Bar Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SideBar(props) {
    const {
        className, expandMobile, logo, showDevBadge, showNightlyBadge,
        hasSearch, onSearch, hasCreate, onCreate, onClose,
        onLogout, message, avatarUrl, avatarEmail, avatarAvatar, avatarEdition,
        children,
    } = props;


    // Handles the Search Click
    const handleSearch = (e) => {
        if (onClose) {
            onClose(e);
        }
        onSearch(e);
    };

    // Handles the Create Click
    const handleCreate = (e) => {
        if (onClose) {
            onClose(e);
        }
        onCreate(e);
    };


    // Do the Render
    return <Container
        className={`sidebar ${className}`}
        expandMobile={expandMobile}
    >
        <Div className="sidebar-top">
            <BarLogo
                logo={logo}
                showDevBadge={showDevBadge}
                showNightlyBadge={showNightlyBadge}
                withLink
            />
            {hasSearch && <BarIcon
                icon="search"
                onClick={handleSearch}
            />}
            {hasCreate && <BarIcon
                icon="add"
                onClick={handleCreate}
            />}
            {children}
        </Div>
        <Div className="sidebar-bottom">
            {!!message && <Name>{NLS.get(message)}</Name>}
            {!!onLogout && <BarIcon
                icon="logout"
                onClick={onLogout}
            />}
            {!!avatarUrl && <SideAvatar
                url={avatarUrl}
                email={avatarEmail}
                avatar={avatarAvatar}
                edition={avatarEdition}
                size={36}
                onClick={onClose}
            />}
        </Div>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SideBar.propTypes = {
    className        : PropTypes.string,
    logo             : PropTypes.string,
    showDevBadge     : PropTypes.bool,
    showNightlyBadge : PropTypes.bool,
    hasSearch        : PropTypes.bool,
    hasCreate        : PropTypes.bool,
    onSearch         : PropTypes.func,
    onCreate         : PropTypes.func,
    onClose          : PropTypes.func,
    onLogout         : PropTypes.func,
    message          : PropTypes.string,
    avatarUrl        : PropTypes.string,
    avatarEmail      : PropTypes.string,
    avatarAvatar     : PropTypes.string,
    avatarEdition    : PropTypes.number,
    withBorder       : PropTypes.bool,
    withTopBar       : PropTypes.bool,
    expandMobile     : PropTypes.bool,
    children         : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SideBar.defaultProps = {
    className    : "",
    hasSearch    : false,
    hasCreate    : false,
    withBorder   : false,
    withTopBar   : false,
    expandMobile : false,
};

export default SideBar;
