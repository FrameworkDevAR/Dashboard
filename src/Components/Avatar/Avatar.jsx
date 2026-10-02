import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";



// Constants
const COLORS = [
    "#4573d2", "#8d84e8", "#b36bd4", "#f06a6a", "#ec8d71",
    "#f1bd6c", "#5da283", "#4ecbc4", "#e362b5", "#5a9bd5",
];

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

const Initials = Styled.span.attrs(({ size, color }) => ({ size, color }))`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: ${(props) => `${Math.round(props.size * 0.42)}px`};
    font-weight: 600;
    line-height: 1;
    color: white;
    background-color: ${(props) => props.color};
    user-select: none;
`;

const Image = Styled.img.attrs(({ isOver }) => ({ isOver }))`
    display: block;
    box-sizing: border-box;
    width: 100%;

    ${(props) => props.isOver && `
        position: absolute;
        inset: 0;
        height: 100%;
    `}
`;



/**
 * The Avatar Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Avatar(props) {
    const {
        passedRef, className, size, name, email, avatar, edition, withReload,
        url, href, target, onClick, defaultValue, withInitials,
        tooltip, tooltipVariant, tooltipWidth, tooltipDelay,
    } = props;

    const defaultRef = React.useRef(null);
    const elementRef = passedRef || defaultRef;

    const { showTooltip, hideTooltip } = Store.useAction("core");

    // The Current State
    const [ hasError, setHasError ] = React.useState(false);


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
            // With the initials the Gravatar is transparent when there is none, as it goes
            // over them, which shows them without a request that fails
            source = Utils.getGravatarUrl(email, withInitials ? "blank" : defaultValue);
        } else if (edition) {
            source += `?rdm=${edition}`;
        } else if (withReload) {
            source += `?rdm=${new Date().getTime()}`;
        }
        return source;
    }, [ avatar, email, defaultValue, edition, withReload, withInitials ]);

    // The Initials are the first letter of the first two words of the name
    const initials = React.useMemo(() => {
        const words = String(name || "").split(" ").filter(Boolean);
        return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join("");
    }, [ name ]);

    // The color depends on the name, so it is always the same one for each person
    const color = React.useMemo(() => {
        let total = 0;
        for (const char of String(name || "")) {
            total += char.codePointAt(0);
        }
        return COLORS[total % COLORS.length];
    }, [ name ]);

    // Try the image again when it changes
    React.useEffect(() => {
        setHasError(false);
    }, [ source ]);


    // Variables
    const hasInitials  = Boolean(withInitials && initials);
    const showInitials = hasInitials && (hasError || !avatar);
    const showImage    = !hasError && Boolean(avatar || email || !hasInitials);


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
        {showInitials && <Initials size={size} color={color}>
            {initials}
        </Initials>}
        {showImage && <Image
            isOver={showInitials}
            alt={showInitials ? "" : name}
            src={source}
            width={size}
            height={size}
            onError={() => setHasError(true)}
        />}
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
    withInitials   : PropTypes.bool,
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
    withInitials   : false,
    defaultValue   : "mp",
    tooltip        : "",
    tooltipVariant : "bottom",
    tooltipWidth   : 0,
    tooltipDelay   : 1,
};

export default Avatar;
