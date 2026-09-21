import React                from "react";
import PropTypes            from "prop-types";

// Components
import Icon                 from "../Common/Icon";
import Html                 from "../Common/Html";

// Styled
import Styled, {
    keyframes,
} from "styled-components";



// Animations
const pop = keyframes`
    from { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.1); opacity: 1; }
    to   { transform: scale(1); }
`;

const draw = keyframes`
    from { transform: scale(0); }
    to   { transform: scale(1); }
`;

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

const Circle = Styled.div.attrs(({ variant }) => ({ variant }))`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    animation: ${pop} 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;

    ${(props) => props.variant === "success" && `
        color: var(--success-color);
        background-color: hsl(136, 52%, 95%);
    `}
    ${(props) => props.variant === "warning" && `
        color: var(--warning-color);
        background-color: hsl(37, 90%, 95%);
    `}
    ${(props) => (props.variant !== "success" && props.variant !== "warning") && `
        color: var(--error-color);
        background-color: hsl(0, 62%, 96%);
    `}
`;

const Content = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Symbol = Styled.span`
    display: flex;
    animation: ${draw} 0.45s 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
`;

const Message = Styled(Html)`
    margin: 0;
    color: var(--title-color);
    font-size: 20px;
    font-weight: 400;
    line-height: 1.4;
`;

const Description = Styled(Html)`
    margin: 0;
    color: var(--font-light);
    font-size: var(--font-size);
    line-height: 1.5;
`;



/**
 * The Dialog Result Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogResult(props) {
    const {
        isHidden, className, variant, icon, message, description,
        topSpace, bottomSpace, children,
    } = props;


    // Variables
    const iconName = icon || (variant === "success" ? "completed" : variant);


    // Do the Render
    if (isHidden || !message) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
    >
        <Circle variant={variant}>
            <Symbol>
                <Icon icon={iconName} size="44" />
            </Symbol>
        </Circle>
        <Content>
            <Message
                variant="h3"
                message={message}
            />
            <Description
                isHidden={!description}
                message={description}
            />
            {children}
        </Content>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DialogResult.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    variant     : PropTypes.string,
    icon        : PropTypes.string,
    message     : PropTypes.string,
    description : PropTypes.string,
    topSpace    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    bottomSpace : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DialogResult.defaultProps = {
    isHidden    : false,
    className   : "",
    variant     : "error",
    description : "",
};

export default DialogResult;
