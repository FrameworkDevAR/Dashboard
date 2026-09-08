import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.div.attrs(({ color, size }) => ({ color, size }))`
    box-sizing: border-box;
    flex-shrink: 0;
    width: ${(props) => `${props.size}px`};
    height: ${(props) => `${props.size}px`};
    background-color: ${(props) => props.color};
    border: 1px solid ${(props) => `color-mix(in srgb, ${props.color} 75%, black)`};
    border-radius: 50%;
    padding: 0;
`;



/**
 * The Color Circle
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ColorCircle(props) {
    const { color, size } = props;

    return <Container
        color={color || "white"}
        size={size || 24}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ColorCircle.propTypes = {
    color : PropTypes.string,
    size  : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
};

export default ColorCircle;
