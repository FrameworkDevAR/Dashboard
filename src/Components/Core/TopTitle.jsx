import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import NLS                  from "../../Core/NLS";
import Responsive           from "../../Core/Responsive";

// Dashboard
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.header.attrs(({ onlyForMenu }) => ({ onlyForMenu }))`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: var(--navigation-title-padding);
    pointer-events: none;
    z-index: 2;

    ${(props) => props.onlyForMenu && `
        display: none;

        @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
            display: flex;
        }
    `}
`;

const TitleIcon = Styled(Icon)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: var(--navigation-title-icon, 20px);
    color: var(--navigation-title-color, var(--title-color));
`;

const Title = Styled.h2`
    margin: 0;
    font-family: var(--title-font);
    font-size: var(--navigation-title-size);
    font-weight: var(--title-font-weight);
    letter-spacing: var(--title-letter-spacing);
    color: var(--navigation-title-color, var(--title-color));
    white-space: nowrap;
`;



/**
 * The Top Title
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TopTitle(props) {
    const { isHidden, onlyForMenu, message, icon } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className="top-title"
        onlyForMenu={onlyForMenu}
    >
        {!!icon && <TitleIcon icon={icon} />}
        <Title>{NLS.get(message)}</Title>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TopTitle.propTypes = {
    isHidden    : PropTypes.bool,
    onlyForMenu : PropTypes.bool,
    message     : PropTypes.string.isRequired,
    icon        : PropTypes.string,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TopTitle.defaultProps = {
    isHidden    : false,
    onlyForMenu : false,
    icon        : "",
};

export default TopTitle;
