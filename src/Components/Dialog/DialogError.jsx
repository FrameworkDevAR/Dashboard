import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Icon                 from "../Common/Icon";
import Html                 from "../Common/Html";



// Styles
const Container = Styled.div.attrs(({ topSpace, bottomSpace }) => ({ topSpace, bottomSpace }))`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 32px 24px;
    text-align: center;

    ${(props) => props.topSpace && `margin-top: ${props.topSpace}px;`}
    ${(props) => props.bottomSpace && `margin-bottom: ${props.bottomSpace}px;`}
`;

const Circle = Styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    color: var(--error-color);
    background-color: hsl(0, 62%, 96%);
    border-radius: 50%;
`;

const Message = Styled(Html)`
    margin: 0;
    color: var(--title-color);
    font-size: 20px;
    font-weight: 400;
    line-height: 1.4;
`;



/**
 * The Dialog Error Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogError(props) {
    const {
        isHidden, className, icon, message,
        topSpace, bottomSpace,
    } = props;


    // Do the Render
    if (isHidden || !message) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
    >
        <Circle>
            <Icon icon={icon} size="44" />
        </Circle>
        <Message
            variant="h3"
            message={message}
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DialogError.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    icon        : PropTypes.string,
    message     : PropTypes.string,
    topSpace    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    bottomSpace : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DialogError.defaultProps = {
    isHidden  : false,
    className : "",
    icon      : "error",
};

export default DialogError;
