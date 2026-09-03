import React                 from "react";
import PropTypes             from "prop-types";
import Styled, { keyframes } from "styled-components";

// Core
import NLS                   from "../../Core/NLS";

// Components
import ScrollFade            from "../Common/ScrollFade";
import Html                  from "../Common/Html";
import Icon                  from "../Common/Icon";
import Pill                  from "../Pill/Pill";



// Animations
const enter = keyframes`
    from {
        opacity: 0;
        transform: translateX(var(--step-enter, 24px));
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

// Styles
const Container = Styled.section`
    flex-grow: 2;
    min-height: 0;
    overflow: auto;
`;

const Inside = Styled.div.attrs(({ maxWidth }) => ({ maxWidth }))`
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: ${enter} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ${(props) => props.maxWidth && `max-width: ${props.maxWidth}px;`}
`;

const Body = Styled.div.attrs(({ indent }) => ({ indent }))`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-left: ${(props) => `${props.indent}px`};
`;

const Header = Styled.header`
    display: flex;
    align-items: center;
    gap: 14px;
`;

const HeaderIcon = Styled(Icon)`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: color-mix(in srgb, currentColor 14%, transparent);
`;

const Titles = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Heading = Styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Title = Styled.h2`
    margin: 0;
    color: var(--title-color);
    font-family: var(--title-font);
    font-size: 18px;
    font-weight: 600;
`;

const Description = Styled(Html)`
    margin: 0;
    color: var(--font-lighter);
    line-height: 1.5;
`;



/**
 * The Step Content Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StepContent(props) {
    const {
        isHidden, className, header, icon, color, message, description,
        badge, badgeVariant, maxWidth, indent, children,
    } = props;


    // The References
    const contentRef = React.useRef(null);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <ScrollFade passedRef={contentRef}>
        <Container className={className} ref={contentRef}>
            <Inside maxWidth={maxWidth}>
                <Header>
                    {header}
                    {!!icon && <HeaderIcon
                        icon={icon}
                        color={color}
                        size={22}
                    />}
                    <Titles>
                        <Heading>
                            <Title>{NLS.get(message)}</Title>
                            <Pill
                                isHidden={!badge}
                                variant={badgeVariant}
                                message={badge}
                                isOutlined
                                withDot
                            />
                        </Heading>
                        <Description variant="p" message={description} />
                    </Titles>
                </Header>
                <Body indent={indent}>
                    {children}
                </Body>
            </Inside>
        </Container>
    </ScrollFade>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
StepContent.propTypes = {
    isHidden     : PropTypes.bool,
    className    : PropTypes.string,
    header       : PropTypes.any,
    icon         : PropTypes.string,
    color        : PropTypes.string,
    message      : PropTypes.string.isRequired,
    description  : PropTypes.string,
    badge        : PropTypes.string,
    badgeVariant : PropTypes.string,
    maxWidth     : PropTypes.number,
    indent       : PropTypes.number,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
StepContent.defaultProps = {
    isHidden     : false,
    className    : "",
    icon         : "",
    color        : "",
    description  : "",
    badge        : "",
    badgeVariant : "gray",
    maxWidth     : 0,
    indent       : 54,
};

export default StepContent;
