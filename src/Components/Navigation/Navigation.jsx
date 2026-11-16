import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";

// Components
import NavigationTitle      from "./NavigationTitle";
import NavigationBody       from "./NavigationBody";
import TopTitle             from "../Core/TopTitle";
import MenuLink             from "../Link/MenuLink";
import ScrollFade           from "../Common/ScrollFade";



// Styles
const Container = Styled.main.attrs(({ isCollapsed }) => ({ isCollapsed }))`
    position: relative;
    display: flex;

    ${(props) => props.isCollapsed && `
        --navigation-width: var(--navigation-small-width);
        --navigation-body-padding: 0 0 16px 0;

        .navigation {
            margin-right: 16px;
        }
    `}
`;

const Content = Styled.nav`
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    box-sizing: border-box;
    width: var(--navigation-width);
    transition: width 0.2s ease, margin 0.2s ease;
    max-height: var(--full-height);
    border-left: var(--navigation-border-left, none);
    border-right: var(--navigation-border);
    font-size: var(--navigation-font-size, var(--font-size));
    color: var(--navigation-color, var(--font-light));
    background-color: var(--navigation-background);

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        display: none;
        position: fixed;
        top: 0;
        left: var(--sidebar-width);
        height: var(--full-height);
        max-height: none;
        max-width: calc(100vw - var(--sidebar-width));
        z-index: var(--z-navigation);
    }
`;

const Body = Styled(ScrollFade).attrs(({ isCollapsed }) => ({ isCollapsed }))`
    --fade-height: var(--navigation-fade, 0px);
    --fade-color: var(--navigation-background, var(--background-color));
    --fade-right: ${(props) => props.isCollapsed ? "0px" : "16px"};
`;

const Footer = Styled.div`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding-top: 8px;
`;

const Collapse = Styled(MenuLink)`
    --link-color: var(--navigation-color, var(--title-color));
    --link-hover: var(--navigation-hover-color, var(--title-color));
    --link-background: var(--navigation-hover, rgba(0, 0, 0, 0.1));

    flex-shrink: 0;
    margin: 0 16px var(--main-margin) 0;
    white-space: nowrap;
    overflow: hidden;

    ${(props) => props.onlyIcon && "margin-right: 0;"}
`;



/**
 * The Navigation Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Navigation(props) {
    const {
        className, message, fallback, subTitle, subCircle, icon, href, noBack,
        canEdit, onAction, withTopTitle, isLoading, canCollapse, children,
    } = props;

    const { smallNav } = Store.useState("core");
    const { setSmallNav, showTooltip, hideTooltip } = Store.useAction("core");


    // The References
    const elementRef = React.useRef(null);
    const bodyRef    = React.useRef(null);


    // Restore the Small Nav on load
    React.useEffect(() => {
        const smallNav = Utils.restoreItem("small-nav", "0");
        setSmallNav(Boolean(Number(smallNav)));
    }, []);

    // Handles the Small Nav toggle
    const handleCollapse = () => {
        Utils.storeItem("small-nav", smallNav ? "0" : "1");
        setSmallNav(!smallNav);
        hideTooltip();
    };

    // Handles the Tooltip
    const handleTooltip = () => {
        if (collapsed) {
            showTooltip(elementRef, "right", "GENERAL_EXPAND_MENU", 0, 0.2);
        }
    };


    // Variables
    const isForMenu    = Responsive.useIsForMenu();
    const showCollapse = canCollapse && !isForMenu;
    const collapsed    = showCollapse && smallNav;


    // Do the Render
    return <>
        {withTopTitle && <TopTitle
            onlyForMenu
            message={message}
            icon={icon}
        />}

        <Container
            className="navigation-wrapper"
            isCollapsed={collapsed}
        >
            <Content className={`navigation ${className}`}>
                <NavigationTitle
                    message={message}
                    fallback={fallback}
                    subTitle={subTitle}
                    subCircle={subCircle}
                    icon={icon}
                    href={href}
                    noBack={noBack}
                    smallNav={collapsed}
                    canEdit={canEdit}
                    onAction={onAction}
                />
                <Body
                    passedRef={bodyRef}
                    isCollapsed={collapsed}
                >
                    <NavigationBody
                        passedRef={bodyRef}
                        isLoading={isLoading}
                        onAction={onAction}
                        smallNav={collapsed}
                    >
                        {children}
                    </NavigationBody>
                </Body>

                {showCollapse && <Footer>
                    <Collapse
                        passedRef={elementRef}
                        variant="light"
                        message="GENERAL_COLLAPSE_MENU"
                        icon={collapsed ? "sidebar-open" : "sidebar-close"}
                        onClick={handleCollapse}
                        onlyIcon={collapsed}
                        onMouseEnter={handleTooltip}
                        onMouseLeave={hideTooltip}
                        isButton
                    />
                </Footer>}
            </Content>
        </Container>
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Navigation.propTypes = {
    className    : PropTypes.string,
    message      : PropTypes.string,
    withTopTitle : PropTypes.bool,
    fallback     : PropTypes.string,
    subTitle     : PropTypes.string,
    subCircle    : PropTypes.string,
    icon         : PropTypes.string,
    href         : PropTypes.string,
    isLoading    : PropTypes.bool,
    noBack       : PropTypes.bool,
    canEdit      : PropTypes.bool,
    onAction     : PropTypes.func,
    canCollapse  : PropTypes.bool,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Navigation.defaultProps = {
    className   : "",
    href        : "/",
    isLoading   : false,
    noBack      : false,
    canEdit     : false,
    canCollapse : false,
};

export default Navigation;
