import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Utils                from "../../Utils/Utils";

// Components
import Icon                 from "../Common/Icon";



// Constants
const ANIMATION_TIME = 320;
const INDICATOR_GAP  = 4;

// Styles
const List = Styled.div.attrs(({ columns }) => ({ columns }))`
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: repeat(${(props) => props.columns}, 1fr);
    gap: 4px;
    width: 100%;
`;

const Indicator = Styled.div.attrs(({ bounds, isAnimated }) => ({ bounds, isAnimated }))`
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: ${(props) => props.bounds.width - 2 * INDICATOR_GAP}px;
    height: ${(props) => props.bounds.height - 2 * INDICATOR_GAP}px;
    translate: ${(props) => props.bounds.left + INDICATOR_GAP}px ${(props) => props.bounds.top + INDICATOR_GAP}px;
    border-radius: calc(var(--input-border-radius) - ${INDICATOR_GAP}px);
    background-color: var(--buttons-sel-background, rgb(237, 241, 250));
    pointer-events: none;

    ${(props) => !props.bounds.width && `
        display: none;
    `}
    ${(props) => props.isAnimated && `
        transition: translate ${ANIMATION_TIME}ms cubic-bezier(0.34, 1.4, 0.4, 1);
    `}
`;

const Item = Styled.button.attrs(({ isSelected }) => ({ isSelected }))`
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    margin: 0;
    padding: 0;
    font-size: 20px;
    border: 1px solid var(--input-border-color);
    border-radius: var(--input-border-radius);
    background-color: transparent;
    color: var(--font-light);
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        border-color: var(--input-border-hover);
    }
    &:focus-visible {
        outline: none;
        border-color: var(--input-border-focus);
        box-shadow: var(--input-border-shadow, 0 0 0 1px var(--input-border-focus));
    }
    &:disabled {
        cursor: default;
    }

    ${(props) => props.isSelected && `
        &, &:hover:not(:disabled) {
            border-color: color-mix(in srgb, var(--border-color-medium), var(--input-border-hover));
        }
        color: var(--black-color);
    `}
`;



/**
 * The Icon Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function IconInput(props) {
    const {
        className, isDisabled, name, value, options, columns, iconPrefix,
        onChange, onFocus, onBlur,
    } = props;


    // The References
    const listRef  = React.useRef(null);
    const timerRef = React.useRef(null);

    // The Current State. The Indicator only moves animated after a click, as the value
    // that is loaded and the size that is measured have to show it in place at once
    const [ bounds,     setBounds     ] = React.useState({ left : 0, top : 0, width : 0, height : 0 });
    const [ isAnimated, setIsAnimated ] = React.useState(false);


    // Moves the Indicator to the selected Icon, using the observer as the input can
    // mount with a size of zero, when it is inside a section that is closed
    React.useEffect(() => {
        const node = listRef.current;
        if (!node) {
            return () => {};
        }

        const update = () => {
            const item = node.querySelector(".picker-selected");
            if (!item) {
                setBounds({ left : 0, top : 0, width : 0, height : 0 });
            } else if (item.offsetWidth) {
                setBounds({
                    left   : item.offsetLeft,
                    top    : item.offsetTop,
                    width  : item.offsetWidth,
                    height : item.offsetHeight,
                });
            }
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, [ value, options?.length ]);


    // Clears the Timer
    React.useEffect(() => {
        return () => Utils.clearTimeout(timerRef);
    }, []);


    // Handles the Click
    const handleClick = (icon) => {
        setIsAnimated(true);
        Utils.setTimeout(timerRef, () => setIsAnimated(false), ANIMATION_TIME);
        onChange(name, icon);
    };


    // Do the Render
    return <List ref={listRef} className={className} columns={columns} data-name={name}>
        <Indicator bounds={bounds} isAnimated={isAnimated} />
        {(options || []).map((icon) => <Item
            key={icon}
            type="button"
            className={value === icon ? "picker-selected" : ""}
            isSelected={value === icon}
            disabled={isDisabled}
            onClick={() => handleClick(icon)}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            <Icon icon={`${iconPrefix}${icon}`} />
        </Item>)}
    </List>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
IconInput.propTypes = {
    className  : PropTypes.string,
    isDisabled : PropTypes.bool,
    name       : PropTypes.string.isRequired,
    value      : PropTypes.string,
    options    : PropTypes.array,
    columns    : PropTypes.number,
    iconPrefix : PropTypes.string,
    onChange   : PropTypes.func.isRequired,
    onFocus    : PropTypes.func,
    onBlur     : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
IconInput.defaultProps = {
    className  : "",
    isDisabled : false,
    value      : "",
    columns    : 8,
    iconPrefix : "",
};

export default IconInput;
