import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";

// Components
import Html                 from "../Common/Html";

// Variants
const Variant = {
    NONE      : "none",
    COLORED   : "colored",
    PRIMARY   : "primary",
    ACCENT    : "accent",
    ERROR     : "error",
    BLACK     : "black",
    WHITE     : "white",
    GRAY      : "gray",
    GREEN     : "green",
    OPACITY   : "opacity",
    UNDERLINE : "underline",
    OUTLINED  : "outlined",
    IMAGE     : "image",
};



// Styles
const Link = Styled.a.attrs(({ variant }) => ({ variant }))`
    position: relative;
    color: var(--link-color);
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    &:hover, &:focus {
        outline: none;
        color: var(--link-hover, var(--link-color));
    }
`;

const ColoredLink = Styled(Link)`
    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: 0;
        left: 0;
        visibility: hidden;
        transform: scaleX(0);
        transition: all 0.2s ease-in-out;
        background-color: var(--link-hover, var(--link-color));
    }
    &:hover::before,
    &:focus::before {
        visibility: visible;
        transform: scaleX(1);
    }

    ${(props) => {
        switch (props.variant) {
        case Variant.PRIMARY: return `
            --link-color: var(--primary-color);
        `;
        case Variant.ACCENT: return `
            --link-color: var(--accent-color);
        `;
        case Variant.ERROR: return `
            --link-color: var(--error-color);
            font-weight: 600;
        `;
        case Variant.BLACK: return `
            --link-color: var(--black-color);
        `;
        case Variant.WHITE: return `
            --link-color: white;
            font-weight: 200;
        `;
        case Variant.GRAY: return `
            --link-color: var(--gray-color);
            font-weight: 400;
        `;
        case Variant.GREEN: return `
            --link-color: var(--green-color);
            font-weight: 600;
        `;
        default: return "";
        }
    }};
`;

const OpacityLink = Styled(Link)`
    display: block;
    transition: all 0.2s ease-in-out;

    &:hover {
        opacity: 0.5;
    }
`;

const UnderlineLink = Styled(Link)`
    &:hover {
        text-decoration: underline;
    }
`;

const ImageLink = Styled(Link)`
    display: block;
    transition: all 0.2s ease-in-out;

    &:hover {
        filter: grayscale(1);
        color: #666;
    }
`;



// Components
const Components = {
    [Variant.NONE]      : Link,
    [Variant.COLORED]   : ColoredLink,
    [Variant.PRIMARY]   : ColoredLink,
    [Variant.ACCENT]    : ColoredLink,
    [Variant.BLACK]     : ColoredLink,
    [Variant.WHITE]     : ColoredLink,
    [Variant.GRAY]      : ColoredLink,
    [Variant.RED]       : ColoredLink,
    [Variant.GREEN]     : ColoredLink,
    [Variant.OPACITY]   : OpacityLink,
    [Variant.UNDERLINE] : UnderlineLink,
    [Variant.IMAGE]     : ImageLink,
};



/**
 * The HyperLink Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function HyperLink(props) {
    const {
        passedRef, isHidden, variant, className,
        target, message, html, children,
    } = props;

    const Component = Components[variant] || Link;
    const content   = children || NLS.get(message);
    const onClick   = Navigate.useLink(props);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Component
        ref={passedRef}
        className={`link ${className}`}
        variant={variant}
        href={Navigate.getHref(props)}
        target={target}
        onClick={onClick}
    >
        {html ? <Html className="link-content" variant="span">
            {html}
        </Html> : content}
    </Component>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
HyperLink.propTypes = {
    passedRef  : PropTypes.any,
    isHidden   : PropTypes.bool,
    className  : PropTypes.string,
    variant    : PropTypes.string,
    message    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    html       : PropTypes.string,
    href       : PropTypes.string,
    url        : PropTypes.string,
    target     : PropTypes.string,
    useBase    : PropTypes.bool,
    isEmail    : PropTypes.bool,
    isPhone    : PropTypes.bool,
    isWhatsApp : PropTypes.bool,
    onClick    : PropTypes.func,
    dontStop   : PropTypes.bool,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
HyperLink.defaultProps = {
    isHidden   : false,
    className  : "",
    variant    : Variant.PRIMARY,
    href       : "#",
    url        : "",
    target     : "_self",
    useBase    : false,
    isEmail    : false,
    isPhone    : false,
    isWhatsApp : false,
    dontStop   : false,
};

export default HyperLink;
