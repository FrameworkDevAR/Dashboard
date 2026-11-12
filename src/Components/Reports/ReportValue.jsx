import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import Responsive           from "../../Core/Responsive";

// Components
import Icon                 from "../Common/Icon";
import Html                 from "../Common/Html";
import IconLink             from "../Link/IconLink";



// Constants
const COLORS = [
    { color : "rgb(22, 163, 74)",  background : "rgba(22, 163, 74, 0.12)"  },
    { color : "rgb(234, 88, 12)",  background : "rgba(234, 88, 12, 0.12)"  },
    { color : "rgb(124, 58, 237)", background : "rgba(124, 58, 237, 0.12)" },
    { color : "rgb(37, 99, 235)",  background : "rgba(37, 99, 235, 0.12)"  },
];

// Styles
const Container = Styled.div.attrs(({ withLinks, isSmall }) => ({ withLinks, isSmall }))`
    position: relative;
    display: flex;
    align-items: center;
    min-width: 0;
    padding: ${(props) => props.isSmall ? "6px 10px" : "16px 24px 16px 20px"};
    gap: var(--main-gap);
    border-radius: var(--main-radius);
    background-color: var(--content-color);

    ${(props) => props.withLinks && `
        cursor: pointer;
    `}

    @media (max-width: ${Responsive.WIDTH_FOR_DETAILS}px) {
        padding: 16px;
    }
`;

const Content = Styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    gap: 2px;
    min-width: 0;
`;

const Header = Styled.header`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Title = Styled(Html).attrs(({ isSmall }) => ({ isSmall }))`
    font-size: ${(props) => props.isSmall ? "14px" : "16px"};
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px 8px;

    b {
        white-space: nowrap;
    }
`;

const Help = Styled(Icon)`
    font-size: 18px;
    cursor: pointer;
`;

const Action = Styled(IconLink)`
    position: absolute;
    top: 12px;
    right: 12px;
`;

const Amount = Styled.div.attrs(({ color, isSmall }) => ({ color, isSmall }))`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-grow: 2;
    font-size: ${(props) => props.isSmall ? "22px" : "28px"};
    font-weight: 600;
    color: ${(props) => props.color};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Detail = Styled.span`
    margin-left: 8px;
    font-family: var(--google-font);
    font-size: 14px;
    font-weight: 400;
    color: var(--font-lighter);
`;

const Iconography = Styled(Icon).attrs(({ color, background, isSmall }) => ({ color, background, isSmall }))`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.isSmall ? "42px" : "56px"};
    height: ${(props) => props.isSmall ? "42px" : "56px"};
    border-radius: var(--border-radius-medium);
    color: ${(props) => props.color};
    background-color: ${(props) => props.background};
`;

const Unread = Styled.div`
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 2px 6px;
    font-size: 12px;
    color: white;
    background-color: rgb(255, 0, 51);
    border-radius: var(--border-radius);
`;



/**
 * The Report Value
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ReportValue(props) {
    const {
        index, label, icon, value, detail, unread, tooltip,
        withLinks, isSmall, url, onClick,
        action, actionTooltip, onAction,
    } = props;

    const { color, background } = COLORS[index % COLORS.length];


    // Handle the Click
    const handleClick = () => {
        if (withLinks && onClick && url) {
            onClick(url);
        }
    };


    // Do the Render
    return <Container
        withLinks={withLinks}
        isSmall={isSmall}
        onClick={handleClick}
    >
        <Iconography
            icon={icon}
            color={color}
            background={background}
            size={isSmall ? "22" : "28"}
            isSmall={isSmall}
        />
        <Content>
            <Header>
                <Title message={label} isSmall={isSmall} />
                {!!tooltip && <Help
                    icon="help"
                    tooltip={tooltip}
                    tooltipWidth={300}
                    tooltipDelay={0.1}
                    tooltipBreaks
                    size="16"
                />}
            </Header>

            <Amount color={color} isSmall={isSmall} title={String(value)}>
                {value}
                {!!detail && <Detail>{detail}</Detail>}
            </Amount>
        </Content>
        {!!unread && <Unread>{unread}</Unread>}
        {!!action && <Action
            variant="black"
            icon={action}
            tooltip={actionTooltip}
            onClick={onAction}
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ReportValue.propTypes = {
    index         : PropTypes.number.isRequired,
    label         : PropTypes.string.isRequired,
    icon          : PropTypes.string.isRequired,
    value         : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    detail        : PropTypes.string,
    unread        : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    tooltip       : PropTypes.string,
    withLinks     : PropTypes.bool,
    isSmall       : PropTypes.bool,
    url           : PropTypes.string,
    onClick       : PropTypes.func,
    action        : PropTypes.string,
    actionTooltip : PropTypes.string,
    onAction      : PropTypes.func,
};

export default ReportValue;
