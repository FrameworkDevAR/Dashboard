import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Html                 from "./Html";
import Icon                 from "./Icon";



// Styles
const Container = Styled.section.attrs(({ forPage, forPanel, hasTabs, fullWidth, withSpacing, isSmall }) => ({ forPage, forPanel, hasTabs, fullWidth, withSpacing, isSmall }))`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--main-gap);

    ${(props) => props.withSpacing && `
        flex-grow: 2;
        padding: 40px;
    `}
    ${(props) => props.isSmall && `
        gap: 12px;
        padding: 16px;
    `}
    ${(props) => props.forPanel && `
        flex-grow: 2;
        gap: 12px;
        padding: 24px 16px;
    `}
    ${(props) => props.forPage && `
        height: var(--page-height${props.hasTabs ? "-tabs" : ""});
    `}
    ${(props) => props.fullWidth && `
        width: 100%;
    `}
`;

const Iconography = Styled(Icon).attrs(({ noIconMargin, isSmall }) => ({ noIconMargin, isSmall }))`
    ${(props) => !props.noIconMargin && "margin-top: -40px;"}
    padding: 12px 24px;
    border-radius: var(--border-radius-big);
    background-color: var(--lighter-gray);
    color: var(--darkest-gray);
    opacity: 0.8;

    ${(props) => props.isSmall && `
        margin-top: 0;
        padding: 8px 16px;
        border-radius: var(--border-radius);
    `}
`;

const Content = Styled.div.attrs(({ forPanel }) => ({ forPanel }))`
    display: flex;
    flex-direction: column;
    gap: 8px;

    ${(props) => props.forPanel && "gap: 12px;"}
`;

const Title = Styled(Html).attrs(({ withDescription, forPanel }) => ({ withDescription, forPanel }))`
    margin: 0 auto;
    max-width: 400px;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;

    ${(props) => props.withDescription && `
        font-size: 18px;
        font-weight: 600;
    `}
    ${(props) => props.forPanel && `
        max-width: 260px;
        color: var(--black-color);
        font-size: 16px;
        font-weight: normal;
    `}
`;

const Description = Styled(Html).attrs(({ forPanel }) => ({ forPanel }))`
    margin: 0 auto;
    max-width: 460px;
    color: var(--font-lighter);
    line-height: 1.5;

    ${(props) => props.forPanel && `
        max-width: 260px;
        font-size: var(--font-size-small);
    `}
`;

const Samples = Styled.ul`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    max-width: 280px;
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
`;

const Sample = Styled.li`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px 8px 12px;
    color: var(--font-light);
    font-size: var(--font-size-small);
    line-height: 1.4;
    text-align: left;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-medium);
    transition: all 0.2s;
    cursor: pointer;

    .icon {
        flex-shrink: 0;
        color: var(--font-lighter);
    }

    &:hover {
        color: var(--font-color);
        border-color: var(--primary-color);

        .icon {
            color: var(--primary-color);
        }
    }
`;



/**
 * The Empty Content
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EmptyContent(props) {
    const {
        isHidden, className, icon, message, description,
        forPage, forPanel, hasTabs, fullWidth, withSpacing, noIconMargin, isSmall,
        samples, sampleIcon, onSample, children,
    } = props;

    let iconSize = "72";
    if (isSmall) {
        iconSize = "40";
    } else if (forPanel) {
        iconSize = "56";
    }


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        forPage={forPage}
        forPanel={forPanel}
        hasTabs={hasTabs}
        fullWidth={fullWidth}
        withSpacing={withSpacing}
        isSmall={isSmall}
    >
        <Iconography
            icon={icon}
            size={iconSize}
            noIconMargin={noIconMargin || forPanel}
            isSmall={isSmall}
        />
        <Content forPanel={forPanel}>
            <Title
                variant="h3"
                message={message}
                withDescription={Boolean(description)}
                forPanel={forPanel}
            />
            <Description
                isHidden={!description}
                variant="p"
                message={description}
                forPanel={forPanel}
            />
        </Content>
        {samples.length > 0 && <Samples>
            {samples.map((sample) => <Sample
                key={sample}
                onClick={() => onSample(sample)}
            >
                <Icon isHidden={!sampleIcon} icon={sampleIcon} size="16" />
                {NLS.get(sample)}
            </Sample>)}
        </Samples>}
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EmptyContent.propTypes = {
    isHidden     : PropTypes.bool,
    className    : PropTypes.string,
    icon         : PropTypes.string.isRequired,
    message      : PropTypes.string.isRequired,
    description  : PropTypes.string,
    forPage      : PropTypes.bool,
    forPanel     : PropTypes.bool,
    hasTabs      : PropTypes.bool,
    fullWidth    : PropTypes.bool,
    noIconMargin : PropTypes.bool,
    withSpacing  : PropTypes.bool,
    isSmall      : PropTypes.bool,
    samples      : PropTypes.array,
    sampleIcon   : PropTypes.string,
    onSample     : PropTypes.func,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EmptyContent.defaultProps = {
    samples    : [],
    sampleIcon : "",
    onSample   : () => {},
};

export default EmptyContent;
