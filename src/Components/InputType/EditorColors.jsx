import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Icon                 from "../Common/Icon";



// Constants
const COLORS = [
    "#000000", "#434343", "#666666", "#999999", "#cccccc", "#efefef", "#f3f3f3", "#ffffff",
    "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff",
    "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3",
    "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc",
    "#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394",
];
const COLUMNS = 8;

// Styles
const Container = Styled.div`
    padding: 4px;
`;

const Clear = Styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    margin-bottom: 8px;
    padding: 4px 6px;
    font-family: inherit;
    font-size: 12px;
    color: var(--black-color);
    background-color: transparent;
    border: none;
    border-radius: var(--border-radius-small);
    cursor: pointer;

    &:hover {
        background-color: var(--lighter-gray);
    }
`;

const Grid = Styled.div`
    display: grid;
    grid-template-columns: repeat(${COLUMNS}, 18px);
    gap: 4px;
`;

const Swatch = Styled.button.attrs(({ color, isSelected }) => ({ color, isSelected }))`
    width: 18px;
    height: 18px;
    padding: 0;
    background-color: ${(props) => props.color};
    border: 1px solid ${(props) => props.isSelected ? "var(--primary-color)" : "var(--border-color-light)"};
    border-radius: 50%;
    box-shadow: ${(props) => props.isSelected ? "0 0 0 2px var(--primary-color)" : "none"};
    cursor: pointer;
    transition: transform 0.1s;

    &:hover {
        transform: scale(1.15);
    }
`;



/**
 * The Editor Colors, to pick the color of the text or of its highlight
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditorColors(props) {
    const { value, onSelect, onClear } = props;

    const current = String(value || "").toLowerCase();


    // Do the Render
    return <Container>
        <Clear type="button" onClick={onClear}>
            <Icon icon="format-clear" />
            {NLS.get("GENERAL_FORMAT_COLOR_NONE")}
        </Clear>
        <Grid>
            {COLORS.map((color) => <Swatch
                key={color}
                type="button"
                color={color}
                isSelected={current === color}
                onClick={() => onSelect(color)}
            />)}
        </Grid>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditorColors.propTypes = {
    value    : PropTypes.string,
    onSelect : PropTypes.func.isRequired,
    onClear  : PropTypes.func.isRequired,
};

export default EditorColors;
