import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.div.attrs(({ isFloating }) => ({ isFloating }))`
    position: relative;

    ${(props) => props.isFloating && `
        position: absolute;
        right: 2px;
        top: 2px;
    `}
`;

const CopyLink = Styled(IconLink)`
    margin-top: 4px;
    margin-right: 2px;
`;

const IconCheck = Styled(Icon)`
    position: absolute;
    top: -4px;
    left: -4px;
    color: green;
    font-size: 16px;
`;



/**
 * The Input Copy
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputCopy(props) {
    const { isHidden, isFloating, copyValue, inputValue, onCopy } = props;


    // The Current State
    const [ showCopied, setCopied ] = React.useState(false);


    // Handles the Text Copy
    const handleCopy = () => {
        let value = String(copyValue || inputValue || "");
        if (onCopy) {
            value = onCopy(value);
        }

        navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container isFloating={isFloating}>
        <CopyLink
            variant="black"
            icon="copy"
            onClick={handleCopy}
            isSmall
        />
        {showCopied && <IconCheck icon="check" />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputCopy.propTypes = {
    isHidden   : PropTypes.bool,
    isFloating : PropTypes.bool,
    copyValue  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    inputValue : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onCopy     : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputCopy.defaultProps = {
    isHidden   : false,
    isFloating : false,
};

export default InputCopy;
