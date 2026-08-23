import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import Icon                 from "../Common/Icon";



// Constants
const ANIMATION_TIME = 320;

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

const Aside = Styled.aside.attrs(({ hasIcon }) => ({ hasIcon }))`
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    width: ${(props) => props.hasIcon ? "30px" : "48px"};
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

const IconItem = Styled(Icon).attrs(({ iconColor }) => ({ iconColor }))`
    ${(props) => props.iconColor && `&& {
        color: ${props.iconColor};
        border-color: ${props.iconColor};
    }`}
`;

const Inside = Styled.div.attrs(({ isLast, hasIcon, hideAside, maxWidth }) => ({ isLast, hasIcon, hideAside, maxWidth }))`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    width: ${(props) => props.hideAside ? "100%" : (props.hasIcon ? "calc(100% - 46px)" : "calc(100% - 56px)")};
    padding: ${(props) => props.hasIcon ? "0 0 32px 16px" : "6px 12px 32px 12px"};
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
    gap: 16px;
    box-sizing: border-box;
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
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
`;

const Arrow = Styled.div.attrs(({ isSelected }) => ({ isSelected }))`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    transform: rotate(${(props) => props.isSelected ? "180deg" : "0deg"});
    transition: transform 320ms cubic-bezier(0.34, 1.2, 0.4, 1);
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

const Content = Styled.section.attrs(({ isSelected }) => ({ isSelected }))`
    grid-area: content;
    display: grid;
    grid-template-rows: ${(props) => props.isSelected ? "1fr" : "0fr"};
    transition: grid-template-rows ${ANIMATION_TIME}ms cubic-bezier(0.4, 0, 0.2, 1);
`;

const Clip = Styled.div.attrs(({ isSelected, isExpanded }) => ({ isSelected, isExpanded }))`
    min-height: 0;
    overflow: ${(props) => props.isExpanded ? "visible" : "hidden"};
    visibility: ${(props) => props.isSelected ? "visible" : "hidden"};
    transition: visibility 0s ${(props) => props.isSelected ? "0s" : `${ANIMATION_TIME}ms`};
`;

const Inner = Styled.div.attrs(({ isSelected, isExpanded, withGap }) => ({ isSelected, isExpanded, withGap }))`
    padding-top: var(--accordion-gap, 24px);
    opacity: ${(props) => props.isSelected ? "1" : "0"};
    transform: ${(props) => props.isExpanded ? "none" : `translateY(${props.isSelected ? "0" : "-6px"})`};
    transition:
        opacity 240ms ease ${(props) => props.isSelected ? "70ms" : "0ms"},
        transform 300ms cubic-bezier(0.34, 1.2, 0.4, 1);

    ${(props) => props.withGap && `
        display: flex;
        flex-direction: column;
        gap: var(--main-gap);
    `}
`;



/**
 * The Accordion Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function AccordionItem(props) {
    const {
        className, header, message, description, error, errorCount,
        number, icon, iconColor, withGap, maxWidth, hideAside,
        isFirst, isLast, isComplete, isSelected, isDisabled, onClick, children,
    } = props;


    // The References
    const timerRef = React.useRef(null);

    // The Current State
    const [ isExpanded, setExpanded ] = React.useState(isSelected);


    // The content is only clipped while it opens and closes, as clipping it
    // when it is open cuts the menus and the dialogs that it has inside
    React.useEffect(() => {
        if (isSelected) {
            Utils.setTimeout(timerRef, () => setExpanded(true), ANIMATION_TIME);
        } else {
            Utils.clearTimeout(timerRef);
            setExpanded(false);
        }
    }, [ isSelected ]);


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
        {!hideAside && <Aside hasIcon={showIcon}>
            {isComplete && <Complete icon="check" />}
            {showIcon && <IconItem icon={icon} iconColor={iconColor} />}
            {showNumber && <span>{number}</span>}
        </Aside>}
        <Inside
            isLast={isLast}
            hasIcon={showIcon}
            hideAside={hideAside}
            maxWidth={maxWidth}
        >
            <Header
                isDisabled={isDisabled}
                hideAside={hideAside}
                onClick={onClick}
            >
                <Div>
                    {header ? header : <>
                        <Title>{NLS.get(message)}</Title>
                        {!!description && <Description>{NLS.get(description)}</Description>}
                    </>}
                    {!!errorMessage && <Error>{NLS.get(errorMessage)}</Error>}
                </Div>
                <Arrow isSelected={isSelected}>
                    {!isDisabled && <Icon icon="up" />}
                </Arrow>
            </Header>
            <Content isSelected={isSelected}>
                <Clip
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                >
                    <Inner
                        isSelected={isSelected}
                        isExpanded={isExpanded}
                        withGap={withGap}
                    >
                        {children}
                    </Inner>
                </Clip>
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
    header      : PropTypes.any,
    message     : PropTypes.string,
    description : PropTypes.string,
    error       : PropTypes.string,
    errorCount  : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    number      : PropTypes.number,
    icon        : PropTypes.string,
    iconColor   : PropTypes.string,
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
    message    : "",
    iconColor  : "",
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
