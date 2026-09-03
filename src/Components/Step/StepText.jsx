import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Html                 from "../Common/Html";



// Styles
const Text = Styled(Html)`
    max-width: 600px;
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: var(--font-light);

    b {
        color: var(--title-color);
        font-weight: 600;
    }
`;



/**
 * The Step Text Component, a paragraph of the content of a step
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StepText(props) {
    const { isHidden, className, message } = props;


    // Do the Render
    return <Text
        isHidden={isHidden}
        className={className}
        variant="p"
        message={message}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
StepText.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    message   : PropTypes.string.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
StepText.defaultProps = {
    isHidden  : false,
    className : "",
};

export default StepText;
