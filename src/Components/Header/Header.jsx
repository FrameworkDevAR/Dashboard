import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Title                from "../Header/Title";
import Subtitle             from "../Header/Subtitle";



// Styles
const Container = Styled.header`
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    height: var(--header-height);
    padding: var(--header-padding);
    gap: var(--main-padding);
    overflow: hidden;
`;

const Child = Styled.div`
    flex-grow: 2;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;
    gap: 8px;

    .tab-item {
        margin-bottom: 0;
    }
`;



/**
 * The Header Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Header(props) {
    const {
        isHidden, className, icon, iconColor, emoji,
        message, fallback, href, backIcon,
        subTitle, subCircle, hasChanges, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        <Title
            icon={icon}
            iconColor={iconColor}
            emoji={emoji}
            message={message}
            fallback={fallback}
            href={href}
            backIcon={backIcon}
        />
        {hasChanges ? <Subtitle
            message="GENERAL_UNSAVED_CHANGES"
            circle="orange"
        /> : <Subtitle
            message={subTitle}
            circle={subCircle}
        />}
        <Child className="header-child">
            {children}
        </Child>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Header.propTypes = {
    isHidden   : PropTypes.bool,
    className  : PropTypes.string,
    icon       : PropTypes.string,
    iconColor  : PropTypes.string,
    emoji      : PropTypes.string,
    message    : PropTypes.string.isRequired,
    fallback   : PropTypes.string,
    href       : PropTypes.string,
    backIcon   : PropTypes.string,
    subTitle   : PropTypes.string,
    subCircle  : PropTypes.string,
    hasChanges : PropTypes.bool,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Header.defaultProps = {
    isHidden  : false,
    className : "",
};

export default Header;
