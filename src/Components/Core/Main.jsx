import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";



// Styles
const Content = Styled.main.attrs(({ withNavigation, isCollapsed, withDetails, wideDetails, largeDetails }) => ({ withNavigation, isCollapsed, withDetails, wideDetails, largeDetails }))`
    --main-navigation: ${(props) => props.withNavigation ? (props.isCollapsed ? "calc(var(--navigation-small-width) + 16px)" : "var(--navigation-width)") : "0px"};
    --main-details: ${(props) => props.withDetails ? `calc(${props.wideDetails ? "var(--details-width-wide)" : (props.largeDetails ? "var(--details-width-large)" : "var(--details-width)")} + var(--main-margin))` : "0px"};

    display: flex;
    flex-grow: 2;
    flex-direction: column;
    height: var(--main-height, var(--full-height));
    width: calc(100vw - var(--sidebar-width) - var(--main-navigation) - var(--main-details) - var(--main-margin));
    transition: width 0.2s ease;
    margin-right: var(--main-margin);
    margin-bottom: var(--main-margin);
    border-radius: var(--main-radius);
    background-color: var(--content-color);

    @media (max-width: ${Responsive.WIDTH_FOR_DETAILS}px) {
        width: calc(100vw - var(--sidebar-width) - var(--main-navigation) - var(--main-margin));
    }

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        width: 100vw !important;
        overflow: auto;
    }
`;



/**
 * The Main Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Main(props) {
    const { className, withNavigation, withDetails, wideDetails, largeDetails, children } = props;

    const isForMenu = Responsive.useIsForMenu();
    const { smallNav } = Store.useState("core");


    // Do the Render
    return <Content
        className={`main ${className}`}
        withNavigation={withNavigation}
        isCollapsed={smallNav && !isForMenu}
        withDetails={withDetails}
        largeDetails={largeDetails}
        wideDetails={wideDetails}
    >
        {children}
    </Content>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Main.propTypes = {
    className      : PropTypes.string,
    withNavigation : PropTypes.bool,
    withDetails    : PropTypes.bool,
    wideDetails    : PropTypes.bool,
    largeDetails   : PropTypes.bool,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Main.defaultProps = {
    className      : "",
    withNavigation : true,
    withDetails    : false,
    wideDetails    : false,
    largeDetails   : false,
};

export default Main;
