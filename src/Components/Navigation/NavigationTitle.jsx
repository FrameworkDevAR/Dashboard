import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Action               from "../../Core/Action";
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Responsive           from "../../Core/Responsive";

// Components
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";
import Circle               from "../Common/Circle";



// Styles
const Container = Styled.header.attrs(({ smallNav, onlyIcon }) => ({ smallNav, onlyIcon }))`
    flex-shrink: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: var(--header-height);
    height: var(--navigation-height, auto);
    padding: var(--navigation-title-padding, 12px 12px 10px 8px);
    z-index: 1;

    ${(props) => props.onlyIcon && `
        --navigation-title-icon: 24px;
        justify-content: center;
        padding-left: 0;
        padding-right: 4px;
        gap: 0;
    `}

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        flex-wrap: wrap;
    }
`;

const HeaderIcon = Styled(Icon)`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: var(--navigation-title-icon, 20px);
    color: var(--navigation-title-color, var(--title-color));
`;

const BackLink = Styled(IconLink)`
    &.navigation-back {
        display: var(--navigation-back-display, none);
    }
`;

const Title = Styled.h2.attrs(({ hasSubTitle }) => ({ hasSubTitle }))`
    display: flex;
    flex-direction: column;
    margin: 0;

    ${(props) => props.hasSubTitle ? `
        --navigation-title-size: 18px;
        flex-grow: 0;
        flex-shrink: 0;
        width: max-content;

        @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
            flex-shrink: 1;
            width: auto;
            min-width: 0;
        }
    ` : `
        flex-grow: 2;
        min-width: 0;
    `}

    font-family: var(--title-font);
    font-size: var(--title-font-size);
    font-weight: var(--title-font-weight);
    line-height: 1.2;
    letter-spacing: var(--title-letter-spacing);
    color: var(--navigation-title-color, var(--title-color));
`;

const SubCircle = Styled(Circle)`
    width: 8px;
    height: 8px;
    margin: 0;
    flex-shrink: 0;
    opacity: 0.8;
`;

const Span1 = Styled.span`
    display: block;
    overflow: visible;
    white-space: var(--navigation-title-wrap, normal);
    font-family: var(--main-font);
    font-size: 14px;
    font-weight: 400;
    color: var(--navigation-subtitle-color, var(--subtitle-color));
`;

const SubTitle = Styled.h3`
    flex-grow: 2;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    margin-left: 8px;
    padding-left: 12px;
    border-left: 1px solid var(--darker-gray);
    white-space: nowrap;
    color: var(--darkest-gray);
    font-family: var(--main-font);
    font-weight: 400;
    font-size: 14px;

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        flex-grow: 0;
        flex-basis: 100%;
        margin-left: 28px;
        padding-left: 0;
        border-left: none;
        white-space: normal;
    }
`;

const Span2 = Styled.span`
    display: block;
    overflow: visible;
    white-space: var(--navigation-title-wrap, normal);
    font-size: var(--navigation-title-size, 18px);
    color: var(--navigation-title-color, var(--title-color));
`;



/**
 * The Navigation Title Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function NavigationTitle(props) {
    const {
        className, icon, href, message, fallback, subTitle, subCircle,
        smallNav, onlyIcon, canAdd, canEdit, canManage,
        noBack, onClick, onAction,
    } = props;

    const parent = Navigate.useParent();


    // Handles the Action
    const handleAction = (e, action) => {
        if (onAction) {
            onAction(Action.get(action));
        }
        e.stopPropagation();
        e.preventDefault();
    };


    // Variables
    const showLink   = (!icon || smallNav) && !noBack;
    const showTitle  = !onlyIcon;
    const showAdd    = canAdd && !smallNav;
    const showEdit   = canEdit && !smallNav;
    const showManage = canManage && !smallNav;


    // Do the Render
    return <Container
        className={`navigation-title ${className}`}
        smallNav={smallNav}
        onlyIcon={onlyIcon}
    >
        <BackLink
            isHidden={noBack}
            className={showLink ? "" : "navigation-back"}
            icon="back"
            href={onClick ? null : (href || parent)}
            onClick={onClick}
            isSmall
        />
        {!!icon && <HeaderIcon icon={icon} />}

        {showTitle && <Title hasSubTitle={Boolean(subTitle)}>
            {!message ? NLS.get(fallback) : <>
                {!!fallback && <Span1>{NLS.get(fallback)}</Span1>}
                <Span2>{NLS.get(message)}</Span2>
            </>}
        </Title>}

        {showTitle && !!subTitle && <SubTitle className="navigation-subtitle">
            {!!subCircle && <SubCircle color={subCircle} />}
            {NLS.get(subTitle)}
        </SubTitle>}

        {showAdd && <IconLink
            icon="add"
            onClick={(e) => handleAction(e, "ADD")}
            isSmall
        />}
        {showEdit && <IconLink
            icon="edit"
            onClick={(e) => handleAction(e, "EDIT")}
            isSmall
        />}
        {showManage && <IconLink
            icon="settings"
            onClick={(e) => handleAction(e, "MANAGE")}
            isSmall
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
NavigationTitle.propTypes = {
    className : PropTypes.string,
    icon      : PropTypes.string,
    href      : PropTypes.string,
    message   : PropTypes.string,
    fallback  : PropTypes.string,
    subTitle  : PropTypes.string,
    subCircle : PropTypes.string,
    smallNav  : PropTypes.bool,
    onlyIcon  : PropTypes.bool,
    canAdd    : PropTypes.bool,
    canEdit   : PropTypes.bool,
    canManage : PropTypes.bool,
    noBack    : PropTypes.bool,
    onAction  : PropTypes.func,
    onClick   : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
NavigationTitle.defaultProps = {
    className : "",
    icon      : "",
    href      : "",
    smallNav  : false,
    onlyIcon  : false,
    canAdd    : false,
    canEdit   : false,
    canManage : false,
    noBack    : false,
};

export default NavigationTitle;
