import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";

// Components
import Backdrop             from "../Common/Backdrop";

// Styled
import Styled, {
    keyframes, css,
} from "styled-components";



// Animations
const menuOpen = keyframes`
    from { opacity: 0; transform: translateX(calc(0px - var(--sidebar-width) - var(--navigation-width))); }
    50%  { opacity: 1; transform: translateX(0px); }
    to   { opacity: 1; transform: translateX(0px); }
`;
const menuClose = keyframes`
    from { opacity: 1; transform: translateX(0px); }
    50%  { opacity: 1; transform: translateX(0px); }
    to   { opacity: 0; transform: translateX(calc(0px - var(--sidebar-width) - var(--navigation-width))); }
`;

const detailsOpen = keyframes`
    from { opacity: 0; transform: translateX(var(--details-width)); }
    50%  { opacity: 1; transform: translateX(0px); }
    to   { opacity: 1; transform: translateX(0px); }
`;
const detailsClose = keyframes`
    from { opacity: 1; transform: translateX(0px); }
    50%  { opacity: 1; transform: translateX(0px); }
    to   { opacity: 0; transform: translateX(var(--details-width)); }
`;

// Styles
const MainContainer = Styled.div.attrs(({ withTopBar, showingMenu, openingMenu, closingMenu, showingDetails, openingDetails, closingDetails }) => ({ withTopBar, showingMenu, openingMenu, closingMenu, showingDetails, openingDetails, closingDetails }))`
    height: var(--full-height);
    width: 100vw;

    ${(props) => props.withTopBar ? `
        --main-height: calc(var(--full-height) - var(--topbar-height) - var(--main-margin));

        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        grid-template-rows: var(--main-grid-rows, var(--topbar-height) 1fr);
        grid-template-areas: var(--main-grid-areas, "sidebar topbar" "sidebar inside");
    ` : `
        --main-height: calc(var(--full-height) - var(--main-margin));
        display: flex;
    `}

    @media (max-width: ${Responsive.WIDTH_FOR_DETAILS}px) {
        ${(props) => props.showingDetails && `
            .details { display: flex; }
        `}
        ${(props) => props.openingDetails && css`
            .details { animation: ${detailsOpen} 0.3s ease-in both; }
        `}
        ${(props) => props.closingDetails && css`
            .details { animation: ${detailsClose} 0.3s ease-out both; }
        `}
    }

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        --main-height: calc(var(--full-height) - var(--topbar-height) - var(--main-margin));

        display: flex;
        flex-direction: column;

        ${(props) => props.showingMenu && `
            .sidebar, .navigation { display: flex; }
        `}
        ${(props) => props.openingMenu && css`
            .sidebar, .navigation { animation: ${menuOpen} 0.3s ease-in both; }
        `}
        ${(props) => props.closingMenu && css`
            .sidebar, .navigation { animation: ${menuClose} 0.3s ease-out both; }
        `}
    }
`;

const DetailsBackdrop = Styled(Backdrop)`
    @media (min-width: ${Responsive.WIDTH_FOR_DETAILS}px) {
        display: none;
    }
`;

const MenuBackdrop = Styled(Backdrop)`
    @media (min-width: ${Responsive.WIDTH_FOR_MENU}px) {
        display: none;
    }
`;



/**
 * The Container Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Container(props) {
    const { className, withTopBar, children } = props;
    const width = window.innerWidth;

    const { showMenu, showDetails } = Store.useState("core");
    const { closeMenu, closeDetails } = Store.useAction("core");

    // The References
    const detailsTimer = React.useRef(null);
    const menuTimer    = React.useRef(null);

    // The Current State
    const [ showingMenu,    setShowingMenu    ] = React.useState(false);
    const [ openingMenu,    setOpeningMenu    ] = React.useState(false);
    const [ closingMenu,    setClosingMenu    ] = React.useState(false);

    const [ showingDetails, setShowingDetails ] = React.useState(false);
    const [ openingDetails, setOpeningDetails ] = React.useState(false);
    const [ closingDetails, setClosingDetails ] = React.useState(false);


    // Opens the Menu
    const handleMenuOpen = () => {
        if (openingMenu || width > Responsive.WIDTH_FOR_MENU) {
            return;
        }

        setShowingMenu(true);
        setOpeningMenu(true);
        Utils.setTimeout(menuTimer, () => {
            setOpeningMenu(false);
        }, 300);
    };

    // Closes the Menu
    const handleMenuClose = () => {
        if (closingMenu || width > Responsive.WIDTH_FOR_MENU) {
            return;
        }

        setClosingMenu(true);
        Utils.setTimeout(menuTimer, () => {
            setClosingMenu(false);
            setShowingMenu(false);
        }, 300);
    };

    // Opens the Details
    const handleDetailsOpen = () => {
        if (openingDetails || width > Responsive.WIDTH_FOR_DETAILS) {
            return;
        }

        setShowingDetails(true);
        setOpeningDetails(true);
        Utils.setTimeout(detailsTimer, () => {
            setOpeningDetails(false);
            setClosingDetails(false);
            setShowingDetails(true);
        }, 300);
    };

    // Closes the Details
    const handleDetailsClose = () => {
        if (closingDetails || width > Responsive.WIDTH_FOR_DETAILS) {
            return;
        }

        setClosingDetails(true);
        Utils.setTimeout(detailsTimer, () => {
            setOpeningDetails(false);
            setClosingDetails(false);
            setShowingDetails(false);
        }, 300);
    };

    // Handles the Menu/Details Close
    const handleClose = () => {
        if (showingMenu) {
            closeMenu();
        }
        if (showingDetails) {
            closeDetails();
        }
    };


    // Open or Close the Menu
    React.useEffect(() => {
        if (showMenu) {
            handleMenuOpen();
        } else {
            handleMenuClose();
        }
        return () => {
            Utils.clearTimeout(menuTimer);
        };
    }, [ showMenu, width ]);

    // Open or Close the Details
    React.useEffect(() => {
        if (showDetails) {
            handleDetailsOpen();
        } else {
            handleDetailsClose();
        }
        return () => {
            Utils.clearTimeout(detailsTimer);
        };
    }, [ showDetails, width ]);


    // Do the Render
    const items = Utils.cloneChildren(children, () => ({ withTopBar }));

    return <MainContainer
        id="container"
        className={className}
        withTopBar={withTopBar}
        showingMenu={showingMenu}
        openingMenu={openingMenu}
        closingMenu={closingMenu}
        showingDetails={showingDetails}
        openingDetails={openingDetails}
        closingDetails={closingDetails}
    >
        {items}

        <DetailsBackdrop
            open={showingDetails}
            onClick={handleClose}
        />
        <MenuBackdrop
            open={showingMenu}
            onClick={handleClose}
        />
    </MainContainer>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Container.propTypes = {
    className  : PropTypes.string,
    withTopBar : PropTypes.bool,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Container.defaultProps = {
    className : "",
};

export default Container;
