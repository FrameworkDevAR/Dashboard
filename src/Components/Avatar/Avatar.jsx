import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";



// Styles
const Container = Styled.div.attrs(({ size, hasClick }) => ({ size, hasClick }))`
    position: relative;
    box-sizing: border-box;
    display: block;
    flex-shrink: 0;
    width: ${(props) => `${props.size}px`};
    height: ${(props) => `${props.size}px`};
    border-radius: 100%;
    transition: transform 0.2s ease;
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        pointer-events: none;
    }

    ${(props) => props.hasClick && `
        cursor: pointer;

        &:hover {
            transform: scale(1.08);
        }
    `}
`;

const Image = Styled.img`
    display: block;
    box-sizing: border-box;
    width: 100%;
`;



/**
 * The Avatar Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Avatar(props) {
    const {
        passedRef, className, size, name, email, avatar, edition, withReload,
        url, href, target, onClick, defaultValue,
        tooltip, tooltipVariant, tooltipWidth, tooltipDelay,
    } = props;

    const defaultRef = React.useRef(null);
    const elementRef = passedRef || defaultRef;

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Variables
    const hasClick = Boolean(url || href || onClick);
    const uri      = url ? NLS.baseUrl(url) : href;
    const navigate = Navigate.useGotoUrl();


    // Handles the Click
    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
        if (hasClick) {
            navigate(uri, target);
            e.stopPropagation();
            e.preventDefault();
        }
    };

    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip, tooltipWidth, tooltipDelay);
        }
    };


    // Calculate the Source
    const source = React.useMemo(() => {
        let source = avatar;
        if (!source) {
            source = Utils.getGravatarUrl(email, defaultValue);
        } else if (edition) {
            source += `?rdm=${edition}`;
        } else if (withReload) {
            source += `?rdm=${new Date().getTime()}`;
        }
        return source;
    }, [ avatar, email, defaultValue, edition, withReload ]);


    // Do the Render
    if (!source) {
        return <React.Fragment />;
    }
    return <Container
        ref={elementRef}
        className={className}
        size={size}
        hasClick={hasClick}
        onClick={handleClick}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        <Image
            alt={name}
            src={source}
            width={size}
            height={size}
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Avatar.propTypes = {
    passedRef      : PropTypes.any,
    className      : PropTypes.string,
    size           : PropTypes.number,
    name           : PropTypes.string,
    email          : PropTypes.string,
    avatar         : PropTypes.string,
    url            : PropTypes.string,
    href           : PropTypes.string,
    target         : PropTypes.string,
    defaultValue   : PropTypes.string,
    edition        : PropTypes.number,
    withReload     : PropTypes.bool,
    onClick        : PropTypes.func,
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    tooltipWidth   : PropTypes.number,
    tooltipDelay   : PropTypes.number,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Avatar.defaultProps = {
    className      : "",
    size           : 36,
    target         : "_self",
    withReload     : false,
    defaultValue   : "mp",
    tooltip        : "",
    tooltipVariant : "bottom",
    tooltipWidth   : 0,
    tooltipDelay   : 1,
};

export default Avatar;
