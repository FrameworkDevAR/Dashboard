import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import { Outcome }          from "../../Core/Variants";
import NLS                  from "../../Core/NLS";

// Dashboard
import Icon                 from "../Common/Icon";
import Html                 from "../Common/Html";



// Styles
const Container = Styled.div.attrs(({ variant, topSpace, bottomSpace, noBorder, inlineChildren, isTight }) => ({ variant, topSpace, bottomSpace, noBorder, inlineChildren, isTight }))`
    position: relative;
    gap: 8px;
    padding: 12px 16px;
    line-height: 1.4;
    border: 1px solid;
    border-radius: var(--border-radius-medium);

    .banner-content {
        gap: 12px;
    }
    .banner-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: color-mix(in srgb, currentColor 14%, transparent);
    }
    ${(props) => !props.inlineChildren && ".banner-children { padding-left: 48px; }"}

    ${(props) => props.variant === Outcome.SUCCESS && `
        background-color: color-mix(in srgb, var(--success-color) 8%, var(--content-color));
        border-color: var(--success-color);
        .banner-icon {
            color: var(--success-color);
        }
    `}
    ${(props) => props.variant === Outcome.WARNING && `
        background-color: color-mix(in srgb, var(--warning-color) 10%, var(--content-color));
        border-color: var(--warning-color);
        .banner-icon {
            color: var(--warning-color);
        }
    `}
    ${(props) => props.variant === Outcome.ERROR && `
        background-color: color-mix(in srgb, var(--error-color) 8%, var(--content-color));
        border-color: var(--error-color);
        .banner-icon {
            color: var(--error-color);
        }
    `}
    ${(props) => props.variant === Outcome.INFO && `
        padding: 10px 14px;
        font-size: 13px;
        line-height: 1.5;
        border-color: var(--input-border-color);
        background-color: ${props.noBorder ? "transparent" : "color-mix(in srgb, var(--font-color) 4%, var(--content-color))"};

        .banner-icon {
            color: var(--primary-color);
        }
    `}
    ${(props) => props.isTight && `
        padding: 6px 12px;
        font-size: 13px;
        line-height: 1.5;

        .banner-content {
            gap: 10px;
        }
        .banner-icon {
            width: 28px;
            height: 28px;
        }
        ${!props.inlineChildren ? ".banner-children { padding-left: 38px; }" : ""}
    `}

    ${(props) => props.noBorder && `
        border: none;
        padding: 0 0 0 12px;
    `}
    ${(props) => props.inlineChildren && `
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    `}

    ${(props) => props.topSpace && `margin-top: ${props.topSpace}px;`}
    ${(props) => props.bottomSpace && `margin-bottom: ${props.bottomSpace}px;`}
`;

const Content = Styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Children = Styled.div.attrs(({ inlineChildren }) => ({ inlineChildren }))`
    ${(props) => !props.inlineChildren && "padding: 12px 0 0 28px;"}

    :empty {
        display: none;
    }
`;



/**
 * The Banner
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Banner(props) {
    const {
        isHidden, className, variant, icon, message,
        topSpace, bottomSpace, noBorder, inlineChildren, isTight, children,
    } = props;


    // The Icon, which is the one of the Variant unless another one is given
    const bannerIcon = React.useMemo(() => {
        if (icon) {
            return icon;
        }
        switch (variant) {
        case Outcome.SUCCESS:
            return "check-circle";
        case Outcome.WARNING:
            return "warning";
        case Outcome.ERROR:
            return "error";
        default:
            return "info";
        }
    }, [ variant, icon ]);


    // Do the Render
    if (isHidden || !message) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        variant={variant}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
        noBorder={noBorder}
        inlineChildren={inlineChildren}
        isTight={isTight}
    >
        <Content className="banner-content">
            <Icon
                className="banner-icon"
                icon={bannerIcon}
                size="20"
            />
            <Html>{NLS.get(message)}</Html>
        </Content>
        <Children className="banner-children" inlineChildren={inlineChildren}>
            {children}
        </Children>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Banner.propTypes = {
    isHidden       : PropTypes.bool,
    className      : PropTypes.string,
    variant        : PropTypes.string.isRequired,
    icon           : PropTypes.string,
    message        : PropTypes.string,
    topSpace       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    bottomSpace    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    noBorder       : PropTypes.bool,
    inlineChildren : PropTypes.bool,
    isTight        : PropTypes.bool,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Banner.defaultProps = {
    isHidden  : false,
    className : "",
    isTight   : false,
};

export default Banner;
