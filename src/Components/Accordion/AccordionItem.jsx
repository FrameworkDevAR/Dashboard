import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.section.attrs(({ isFirst, isSelected, isDisabled }) => ({ isFirst, isSelected, isDisabled }))`
    display: flex;
    opacity: 0.7;
    transition: 0.2s all;

    aside {
        opacity: 0.5;
    }

    ${(props) => props.isFirst ? `
        margin-top: 16px;
    ` : `
        margin-top: 32px;
    `}

    ${(props) => props.isSelected && `
        opacity: 1;
        aside {
            opacity: 1;
        }
    `}

    ${(props) => !props.isSelected && !props.isDisabled && `:hover {
        opacity: 1;
        aside {
            opacity: 1;
        }
    }`}

    @media (max-width: 500px) {
        display: block;
        position: relative;
    }
`;

const Aside = Styled.aside`
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    width: 48px;
    color: var(--title-color);
    transition: 0.2s all;

    .icon {
        font-size: 14px;
    }
    span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 28px;
        border: 1px solid var(--title-color);
        font-family: var(--title-font);
        border-radius: 100%;
    }

    @media (max-width: 500px) {
        position: absolute;
        top: 0;
        left: 0;
        width: auto;
    }
`;

const Complete = Styled(Icon)`
    && {
        color: var(--success-color);
        border-color: var(--success-color);
    }
`;

const Inside = Styled.div.attrs(({ isLast, hideAside, maxWidth }) => ({ isLast, hideAside, maxWidth }))`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    gap: 24px;
    width: ${(props) => props.hideAside ? "100%" : "calc(100% - 56px)"};
    padding: 6px 12px 32px 12px;
    transition: 0.3s all;

    ${(props) => !props.isLast && "border-bottom: 1px solid var(--border-color-light);"}
    ${(props) => props.maxWidth && `max-width: ${props.maxWidth}px;`}

    @media (max-width: 500px) {
        width: 100%;
    }
`;

const Header = Styled.header.attrs(({ isDisabled, hideAside }) => ({ isDisabled, hideAside }))`
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box; : ""
    width: 100%;
    cursor: pointer;

    ${(props) => props.isDisabled && `
        cursor: not-allowed;
        background-color: var(--content-color);
    `}

    ${(props) => !props.hideAside && `
        @media (max-width: 500px) {
            margin-left: 38px;
        }
    `}
`;

const Div = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Title = Styled.h2`
    margin: 0;
    color: var(--title-color);
    font-family: var(--title-font);
    font-size: 18px;
    font-weight: 600;
`;

const Description = Styled.p`
    margin: 0;
    color: var(--font-lighter);
`;

const Error = Styled.p`
    margin: 0;
    color: var(--error-text-color);
`;

const Content = Styled.section.attrs(({ isSelected, withGap }) => ({ isSelected, withGap }))`
    grid-area: content;
    display: ${(props) => props.isSelected ? (props.withGap ? "flex" : "block") : "none"};

    ${(props) => props.withGap && `
        gap: var(--main-gap);
        flex-direction: column;
    `}
`;



/**
 * The Accordion Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function AccordionItem(props) {
    const {
        className, message, description, error, errorCount,
        number, icon, withGap, maxWidth, hideAside,
        isFirst, isLast, isComplete, isSelected, isDisabled, onClick, children,
    } = props;


    // Variables
    const showIcon     = Boolean(!isComplete && icon);
    const showNumber   = Boolean(!isComplete && !icon);
    const errorMessage = error || (Number(errorCount) > 0 ? NLS.pluralize("GENERAL_ERROR_SECTION", errorCount) : "");


    // Do the Render
    return <Container
        className={className}
        isFirst={isFirst}
        isSelected={isSelected}
        isDisabled={isDisabled}
    >
        {!hideAside && <Aside>
            {isComplete && <Complete icon="check" />}
            {showIcon && <Icon icon={icon} />}
            {showNumber && <span>{number}</span>}
        </Aside>}
        <Inside
            isLast={isLast}
            hideAside={hideAside}
            maxWidth={maxWidth}
        >
            <Header
                isDisabled={isDisabled}
                hideAside={hideAside}
                onClick={onClick}
            >
                <Div>
                    <Title>{NLS.get(message)}</Title>
                    {!!description && <Description>{NLS.get(description)}</Description>}
                    {!!errorMessage && <Error>{NLS.get(errorMessage)}</Error>}
                </Div>
                {!isDisabled && <Icon icon={isSelected ? "down" : "up"} />}
            </Header>
            <Content
                isSelected={isSelected}
                withGap={withGap}
            >
                {children}
            </Content>
        </Inside>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
AccordionItem.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    message     : PropTypes.string.isRequired,
    description : PropTypes.string,
    error       : PropTypes.string,
    errorCount  : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    number      : PropTypes.number,
    icon        : PropTypes.string,
    withGap     : PropTypes.bool,
    maxWidth    : PropTypes.number,
    hideAside   : PropTypes.bool,
    isFirst     : PropTypes.bool,
    isLast      : PropTypes.bool,
    isComplete  : PropTypes.bool,
    isSelected  : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    onClick     : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
AccordionItem.defaultProps = {
    isHidden   : false,
    className  : "",
    errorCount : 0,
    withGap    : false,
    maxWidth   : 0,
    isFirst    : false,
    isLast     : false,
    isComplete : false,
    isSelected : false,
    isDisabled : false,
};

export default AccordionItem;
