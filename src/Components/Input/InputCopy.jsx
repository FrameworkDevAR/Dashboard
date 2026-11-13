import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Constants
const COPIED_TIME = 1500;

// Styles
const Container = Styled.div.attrs(({ isFloating }) => ({ isFloating }))`
    position: relative;

    ${(props) => props.isFloating && `
        position: absolute;
        right: 2px;
        top: 2px;
    `}
`;

const Content = Styled.div`
    position: relative;
    margin-top: 4px;
    margin-right: 2px;
`;

const Swap = Styled.div.attrs(({ isShown, turn }) => ({ isShown, turn }))`
    transition: opacity 0.2s, transform 0.2s, filter 0.2s;
    transition-timing-function: cubic-bezier(0.2, 0, 0, 1);

    ${(props) => !props.isShown && `
        opacity: 0;
        transform: rotate(${props.turn}deg) scale(0.6);
        filter: blur(2px);
    `}
`;

const CheckSwap = Styled(Swap)`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-text-color);
    pointer-events: none;
`;



/**
 * The Input Copy
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputCopy(props) {
    const { isHidden, className, isFloating, copyValue, inputValue, onCopy } = props;


    // The References
    const timerRef = React.useRef(null);

    // The Current State
    const [ showCopied, setCopied ] = React.useState(false);

    // Clears the timer when it is removed
    React.useEffect(() => {
        return () => Utils.clearTimeout(timerRef);
    }, []);


    // Handles the Text Copy
    const handleCopy = () => {
        let value = String(copyValue || inputValue || "");
        if (onCopy) {
            value = onCopy(value);
        }

        // Another copy while the check is shown starts its time again
        navigator.clipboard.writeText(value);
        setCopied(true);
        Utils.setTimeout(timerRef, () => setCopied(false), COPIED_TIME);
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className} isFloating={isFloating}>
        <Content>
            <Swap isShown={!showCopied} turn={-30}>
                <IconLink
                    variant="black"
                    icon="copy"
                    onClick={handleCopy}
                    isSmall
                />
            </Swap>
            <CheckSwap isShown={showCopied} turn={30}>
                <Icon icon="check" size="22" />
            </CheckSwap>
        </Content>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputCopy.propTypes = {
    isHidden   : PropTypes.bool,
    className  : PropTypes.string,
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
    className  : "",
    isFloating : false,
};

export default InputCopy;
