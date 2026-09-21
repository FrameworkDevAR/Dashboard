import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";



// Constants
const ANIMATION_TIME = 200;

// Styles
const Content = Styled.main.attrs(({ withNavigation, isCollapsed, withDetails, wideDetails, largeDetails, isAnimated }) => ({ withNavigation, isCollapsed, withDetails, wideDetails, largeDetails, isAnimated }))`
    --main-navigation: ${(props) => props.withNavigation ? (props.isCollapsed ? "calc(var(--navigation-small-width) + 16px)" : "var(--navigation-width)") : "0px"};
    --main-details: ${(props) => props.withDetails ? `calc(${props.wideDetails ? "var(--details-width-wide)" : (props.largeDetails ? "var(--details-width-large)" : "var(--details-width)")} + var(--main-margin))` : "0px"};

    display: flex;
    flex-grow: 2;
    flex-direction: column;
    height: var(--main-height, var(--full-height));
    width: calc(100vw - var(--sidebar-width) - var(--main-navigation) - var(--main-details) - var(--main-margin));
    ${(props) => props.isAnimated && `transition: width ${ANIMATION_TIME}ms ease;`}
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


    // The References
    const timerRef       = React.useRef(0);
    const interactionRef = React.useRef(false);

    // The Current State
    const isCollapsed = smallNav && !isForMenu;
    const panels      = `${withDetails}-${isCollapsed}`;
    const [ shownPanels, setShownPanels ] = React.useState(panels);
    const [ isAnimated,  setAnimated    ] = React.useState(false);

    // The width only animates when the user shows or hides the Details or the Navigation, so
    // it does not animate when a page sets them while it loads. It is set while rendering, so
    // the transition is there when the width changes
    if (panels !== shownPanels) {
        setShownPanels(panels);
        setAnimated(interactionRef.current);
    }

    // Listens to the interactions of the user since the page was shown
    React.useEffect(() => {
        const handleInteraction = () => {
            interactionRef.current = true;
        };
        window.addEventListener("pointerdown", handleInteraction, true);
        window.addEventListener("keydown", handleInteraction, true);
        return () => {
            window.removeEventListener("pointerdown", handleInteraction, true);
            window.removeEventListener("keydown", handleInteraction, true);
        };
    }, []);

    // Removes the transition once the animation ends
    React.useEffect(() => {
        if (isAnimated) {
            Utils.setTimeout(timerRef, () => setAnimated(false), ANIMATION_TIME);
        }
        return () => Utils.clearTimeout(timerRef);
    }, [ isAnimated, shownPanels ]);


    // Do the Render
    return <Content
        className={`main ${className}`}
        withNavigation={withNavigation}
        isCollapsed={isCollapsed}
        withDetails={withDetails}
        largeDetails={largeDetails}
        wideDetails={wideDetails}
        isAnimated={isAnimated}
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
