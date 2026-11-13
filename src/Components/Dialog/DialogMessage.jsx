import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Html                 from "../Common/Html";



// Styles
const Container = Styled.div.attrs(({ centered, topSpace, bottomSpace }) => ({ centered, topSpace, bottomSpace }))`
    color: var(--black-color);
    font-weight: 400;
    line-height: 1.5;

    ${(props) => props.centered ? "text-align: center;" : ""}
    ${(props) => props.topSpace && `margin-top: ${props.topSpace}px;`}
    ${(props) => props.bottomSpace && `margin-bottom: ${props.bottomSpace}px;`}
`;

const Content = Styled(Html).attrs(({ centered, noSpace, topSpace, bottomSpace }) => ({ centered, noSpace, topSpace, bottomSpace }))`
    color: var(--black-color);
    font-weight: 400;
    line-height: 1.5;

    ${(props) => props.centered && "text-align: center;"}
    ${(props) => props.noSpace && "margin: 0;"}
    ${(props) => props.topSpace && `margin-top: ${props.topSpace}px;`}
    ${(props) => props.bottomSpace && `margin-bottom: ${props.bottomSpace}px;`}
`;



/**
 * The Dialog Message Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogMessage(props) {
    const {
        isHidden, className, variant, centered,
        noSpace, topSpace, bottomSpace,
        html, message, children,
    } = props;

    const content = message ? NLS.get(message) : html;


    // Do the Render
    if (isHidden || (!content && !children)) {
        return <React.Fragment />;
    }

    if (children) {
        return <Container
            className={className}
            centered={centered}
            topSpace={topSpace}
            bottomSpace={bottomSpace}
        >
            {children}
        </Container>;
    }

    return <Content
        variant={variant}
        className={className}
        centered={centered}
        noSpace={noSpace}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
    >
        {content}
    </Content>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DialogMessage.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    variant     : PropTypes.string,
    centered    : PropTypes.bool,
    noSpace     : PropTypes.bool,
    topSpace    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    bottomSpace : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    message     : PropTypes.string,
    html        : PropTypes.string,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DialogMessage.defaultProps = {
    isHidden  : false,
    className : "",
    variant   : "div",
    centered  : false,
    noSpace   : false,
};

export default DialogMessage;
