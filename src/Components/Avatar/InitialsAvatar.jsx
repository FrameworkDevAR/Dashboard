import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.span.attrs(({ avatarColor, size }) => ({ avatarColor, size }))`
    box-sizing: border-box;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => `${props.size}px`};
    height: ${(props) => `${props.size}px`};
    border-radius: 50%;
    color: color-mix(in srgb, ${(props) => props.avatarColor} 60%, var(--black-color));
    background-color: color-mix(in srgb, ${(props) => props.avatarColor} 18%, transparent);
    font-size: ${(props) => `${Math.round(props.size * 0.375)}px`};
    font-weight: 600;
    letter-spacing: 0.3px;
    line-height: 1;
`;



/**
 * The Initials Avatar Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InitialsAvatar(props) {
    const {
        className, size, name, initials, icon,
        color, colorID, palette, children,
    } = props;


    // Returns the Initials, from the first letter of the first two words of the Name
    // Only letters and numbers are used, as a name can have symbols like an asterisk
    const getInitials = () => {
        if (initials) {
            return initials.toUpperCase();
        }
        const words  = String(name || "").split(" ");
        const firsts = words.map((word) => word.match(/[\p{L}\p{N}]/u)?.[0] ?? "").filter(Boolean);
        return firsts.slice(0, 2).join("").toUpperCase();
    };

    // Returns the Color, which is the given one, the one of the Palette for the ID, so it is
    // always the same one for an element, or the gray of the texts
    const getColor = () => {
        if (color) {
            return color;
        }
        if (colorID && palette.length) {
            return palette[Number(colorID) % palette.length];
        }
        return "var(--font-lighter)";
    };


    // Variables
    const text = getInitials();


    // Do the Render
    return <Container
        className={className}
        avatarColor={getColor()}
        size={size}
    >
        {text || (!!icon && <Icon icon={icon} size={String(Math.round(size * 0.56))} />)}
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InitialsAvatar.propTypes = {
    className : PropTypes.string,
    size      : PropTypes.number,
    name      : PropTypes.string,
    initials  : PropTypes.string,
    icon      : PropTypes.string,
    color     : PropTypes.string,
    colorID   : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    palette   : PropTypes.array,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InitialsAvatar.defaultProps = {
    className : "",
    size      : 32,
    palette   : [],
};

export default InitialsAvatar;
