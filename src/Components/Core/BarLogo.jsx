import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";



// Styles
const Container = Styled.h1.attrs(({ withLink }) => ({ withLink }))`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    ${(props) => props.withLink ? "cursor: pointer;" : ""}
`;

const Badge = Styled.span.attrs(({ isNightly }) => ({ isNightly }))`
    position: absolute;
    right: var(--bar-logo-badge-right, -2px);
    bottom: calc(var(--bar-logo-bottom, 0px) + var(--bar-logo-badge-bottom, -3px));
    padding: 0 2px;
    border-radius: 3px;
    color: white;
    background-color: ${(props) => props.isNightly
        ? "var(--bar-logo-badge-nightly-color, rgb(124, 58, 237))"
        : "var(--bar-logo-badge-dev-color, rgb(188, 28, 72))"};
    font-size: 7px;
    font-weight: 600;
    line-height: 9px;
    letter-spacing: 0.04em;
`;

const Image = Styled.img`
    width: var(--bar-logo-width, auto);
    height: var(--bar-logo-height, auto);
    max-width: var(--bar-logo-max-width, none);
    max-height: var(--bar-logo-max-height, none);
    margin-top: var(--bar-logo-top, 0);
    margin-bottom: var(--bar-logo-bottom, 0);
`;



/**
 * The Bar Logo Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function BarLogo(props) {
    const { className, logo, showDevBadge, showNightlyBadge, withLink } = props;

    const navigate = Navigate.useGotoUrl();


    // Variables
    const showBadge = showDevBadge || showNightlyBadge;


    // Handles the Click
    const handleClick = (e) => {
        if (withLink) {
            navigate("/", "_self");
            e.stopPropagation();
            e.preventDefault();
        }
    };


    // Do the Render
    if (!logo) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        onClick={handleClick}
        withLink
    >
        <Image
            src={logo}
            alt={NLS.get("TITLE")}
        />
        {showBadge && <Badge isNightly={showNightlyBadge}>
            {showNightlyBadge ? "NGT" : "DEV"}
        </Badge>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
BarLogo.propTypes = {
    className        : PropTypes.string,
    logo             : PropTypes.string,
    showDevBadge     : PropTypes.bool,
    showNightlyBadge : PropTypes.bool,
    withLink         : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
BarLogo.defaultProps = {
    className        : "",
    showDevBadge     : false,
    showNightlyBadge : false,
    withLink         : false,
};

export default BarLogo;
