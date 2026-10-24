import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import { Outcome, Brightness } from "../../Core/Variants";
import NLS                  from "../../Core/NLS";

// Components
import Html                 from "../Common/Html";
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.div.attrs(({ variant, topSpace, bottomSpace }) => ({ variant, topSpace, bottomSpace }))`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px 8px 16px;
    color: white;
    font-weight: 400;
    border-radius: var(--border-radius);
    transition: all 0.5s;

    ${(props) => props.variant === Outcome.SUCCESS && `
        background-color: var(--success-color);
    `}
    ${(props) => props.variant === Outcome.WARNING && `
        background-color: var(--warning-color);
    `}
    ${(props) => props.variant === Outcome.ERROR && `
        background-color: var(--error-color);
    `}

    .alert-content {
        flex-grow: 2;
    }

    ${(props) => props.topSpace && `margin-top: ${props.topSpace}px;`}
    ${(props) => props.bottomSpace && `margin-bottom: ${props.bottomSpace}px;`}
`;



/**
 * The Alert Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Alert(props) {
    const {
        isHidden, className, variant, message,
        topSpace, bottomSpace, onClose, children,
    } = props;


    // Variables
    let content = children;
    if (message) {
        if (Array.isArray(message)) {
            content = NLS.format(message[0], ...message.slice(1));
        } else {
            content = NLS.get(message);
        }
    }


    // Do the Render
    if (isHidden || !content) {
        return <React.Fragment />;
    }
    return <Container
        className={`alert ${className}`}
        variant={variant}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
    >
        {!!message  && <Html>{content}</Html>}
        {!!children && <div className="alert-content">{children}</div>}
        {!!onClose  && <IconLink
            className="alert-close"
            variant={Brightness.WHITE}
            icon="close"
            onClick={onClose}
            isSmall
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Alert.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    variant     : PropTypes.string.isRequired,
    message     : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    topSpace    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    bottomSpace : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onClose     : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Alert.defaultProps = {
    isHidden  : false,
    className : "",
};

export default Alert;
