import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import DialogError          from "../Dialog/DialogError";



// Styles
const Container = Styled(DialogError).attrs(({ hasTabs }) => ({ hasTabs }))`
    box-sizing: border-box;
    height: ${(props) => props.hasTabs ? "var(--page-height-tabs)" : "var(--page-height)"};
`;



/**
 * The Page Error
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageError(props) {
    const { isHidden, className, icon, message, hasTabs } = props;


    // Do the Render
    return <Container
        isHidden={isHidden}
        className={className}
        icon={icon}
        message={message}
        hasTabs={hasTabs}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PageError.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    icon      : PropTypes.string,
    message   : PropTypes.string,
    hasTabs   : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PageError.defaultProps = {
    isHidden  : false,
    className : "",
    icon      : "error",
    hasTabs   : false,
};

export default PageError;
