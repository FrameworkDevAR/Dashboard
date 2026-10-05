import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Html                 from "./Html";
import Icon                 from "./Icon";



// Styles
const Container = Styled.section.attrs(({ forPage, fullWidth, withSpacing }) => ({ forPage, fullWidth, withSpacing }))`
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
    ${(props) => props.forPage && `
        height: var(--page-height);
    `}
    ${(props) => props.fullWidth && `
        width: 100%;
    `}
`;

const Iconography = Styled(Icon).attrs(({ noIconMargin }) => ({ noIconMargin }))`
    ${(props) => !props.noIconMargin && "margin-top: -40px;"}
    padding: 12px 24px;
    border-radius: var(--border-radius-big);
    background-color: var(--lighter-gray);
    color: var(--darkest-gray);
    opacity: 0.8;
`;

const Content = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Title = Styled(Html).attrs(({ withDescription }) => ({ withDescription }))`
    margin: 0 auto;
    max-width: 400px;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;

    ${(props) => props.withDescription && `
        font-size: 18px;
        font-weight: 600;
    `}
`;

const Description = Styled(Html)`
    margin: 0 auto;
    max-width: 460px;
    color: var(--font-lighter);
    line-height: 1.5;
`;



/**
 * The Empty Content
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EmptyContent(props) {
    const {
        isHidden, className, icon, message, description,
        forPage, fullWidth, withSpacing, noIconMargin, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        forPage={forPage}
        fullWidth={fullWidth}
        withSpacing={withSpacing}
    >
        <Iconography
            icon={icon}
            size="72"
            noIconMargin={noIconMargin}
        />
        <Content>
            <Title
                variant="h3"
                message={message}
                withDescription={Boolean(description)}
            />
            <Description
                isHidden={!description}
                variant="p"
                message={description}
            />
        </Content>
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
    fullWidth    : PropTypes.bool,
    noIconMargin : PropTypes.bool,
    withSpacing  : PropTypes.bool,
    children     : PropTypes.any,
};

export default EmptyContent;
