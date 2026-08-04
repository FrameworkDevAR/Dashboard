import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";

// Components
import NavigationTitle      from "./NavigationTitle";
import NavigationBody       from "./NavigationBody";
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.main.attrs(({ isCollapsed }) => ({ isCollapsed }))`
    ${(props) => props.isCollapsed && "--navigation-width: var(--navigation-small-width);"}
    position: relative;
    display: flex;
`;

const Content = Styled.nav`
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    box-sizing: border-box;
    width: var(--navigation-width);
    max-height: var(--main-height);
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

const Collapse = Styled(IconLink)`
    --link-background: var(--lighter-gray);
    --link-size: 18px;

    position: absolute;
    top: 22px;
    left: calc(var(--navigation-width) - var(--link-size) / 2);
    z-index: 4;
    border: 1px solid var(--border-color-light);
    background-color: var(--content-color);
`;



/**
 * The Navigation Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Navigation(props) {
    const {
        className, message, fallback, icon, href, noBack,
        none, add, canAdd, canEdit, canManage, onAction,
        isLoading, canCollapse, isCollapsed, onCollapse, children,
    } = props;


    // Do the Render
    return <Container isCollapsed={isCollapsed}>
        <Content className={`navigation ${className}`}>
            <NavigationTitle
                message={message}
                fallback={fallback}
                icon={icon}
                href={href}
                noBack={noBack}
                smallNav={isCollapsed}
                canAdd={canAdd}
                canEdit={canEdit}
                canManage={canManage}
                onAction={onAction}
            />
            <NavigationBody
                isLoading={isLoading}
                canAdd={canAdd}
                add={add}
                none={none}
                onAction={onAction}
            >
                {children}
            </NavigationBody>
        </Content>

        <Collapse
            isHidden={!canCollapse}
            icon={isCollapsed ? "next" : "prev"}
            onClick={onCollapse}
            isTiny
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Navigation.propTypes = {
    className   : PropTypes.string,
    message     : PropTypes.string,
    fallback    : PropTypes.string,
    icon        : PropTypes.string,
    href        : PropTypes.string,
    none        : PropTypes.string,
    add         : PropTypes.string,
    isLoading   : PropTypes.bool,
    noBack      : PropTypes.bool,
    canAdd      : PropTypes.bool,
    canEdit     : PropTypes.bool,
    canManage   : PropTypes.bool,
    onAction    : PropTypes.func,
    canCollapse : PropTypes.bool,
    isCollapsed : PropTypes.bool,
    onCollapse  : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Navigation.defaultProps = {
    className   : "",
    href        : "/",
    none        : "",
    add         : "",
    isLoading   : false,
    noBack      : false,
    canAdd      : false,
    canEdit     : false,
    canManage   : false,
    canCollapse : false,
    isCollapsed : false,
};

export default Navigation;
