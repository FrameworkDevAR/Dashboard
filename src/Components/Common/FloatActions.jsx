import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.div.attrs(({ isVertical }) => ({ isVertical }))`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 3px;
    background-color: var(--content-color);
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius);
    box-shadow: rgba(17, 24, 32, 0.05) 0 1px 2px, rgba(17, 24, 32, 0.10) 0 4px 12px -6px;
    z-index: 5;

    ${(props) => props.isVertical && "flex-direction: column;"}
`;



/**
 * The Float Actions Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function FloatActions(props) {
    const {
        isHidden, className, isVertical, style,
        onMouseDown, onMouseUp, onContextMenu, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={`float-actions ${className}`}
        isVertical={isVertical}
        style={style}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onContextMenu={onContextMenu}
    >
        {children}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FloatActions.propTypes = {
    isHidden      : PropTypes.bool,
    className     : PropTypes.string,
    isVertical    : PropTypes.bool,
    style         : PropTypes.object,
    onMouseDown   : PropTypes.func,
    onMouseUp     : PropTypes.func,
    onContextMenu : PropTypes.func,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
FloatActions.defaultProps = {
    isHidden   : false,
    className  : "",
    isVertical : false,
};

export default FloatActions;
