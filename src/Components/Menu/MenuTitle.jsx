import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";



// Styles
const Container = Styled.li.attrs(({ level }) => ({ level }))`
    display: flex;
    align-items: center;
    width: auto;
    margin: 0;
    padding: 8px 8px 4px 8px;
    text-align: left;
    font-size: 12px;
    white-space: nowrap;
    color: var(--font-lighter);

    ${(props) => props.level > 0 && `
        margin-left: ${props.level * 16}px;
    `}
`;



/**
 * The Menu Title Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MenuTitle(props) {
    const { className, message, level } = props;


    // Do the Render
    return <Container className={className} level={level}>
        {NLS.get(message)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MenuTitle.propTypes = {
    className : PropTypes.string,
    message   : PropTypes.string,
    level     : PropTypes.number,
    isTitle   : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MenuTitle.defaultProps = {
    className : "",
    level     : 0,
    isTitle   : true,
};

export default MenuTitle;
