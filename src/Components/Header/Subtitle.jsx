import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Pill                 from "../Pill/Pill";



// Constants
const VARIANTS = {
    green  : "success",
    yellow : "warning",
    orange : "warning",
    red    : "error",
    blue   : "primary",
};

// Styles
const H3 = Styled.h3.attrs(({ withBorder }) => ({ withBorder }))`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: var(--darkest-gray);
    font-weight: 400;
    font-size: 15px;
    line-height: 1.5;
    overflow: hidden;

    ${(props) => props.withBorder && `
        padding-left: var(--main-padding);
        border-left: 1px solid var(--darker-gray);
    `}
`;





/**
 * The Subtitle Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Subtitle(props) {
    const { message, circle, withBorder } = props;


    // Do the Render
    if (!message) {
        return <React.Fragment />;
    }
    // The border of the Pill separates it from the title
    if (circle) {
        return <H3 className="subtitle">
            <Pill
                variant={VARIANTS[circle] || "gray"}
                message={message}
                isOutlined
                withDot
            />
        </H3>;
    }
    return <H3 className="subtitle" withBorder={withBorder}>
        {NLS.get(message)}
    </H3>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Subtitle.propTypes = {
    message    : PropTypes.string,
    circle     : PropTypes.string,
    withBorder : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Subtitle.defaultProps = {
    withBorder : true,
};

export default Subtitle;
