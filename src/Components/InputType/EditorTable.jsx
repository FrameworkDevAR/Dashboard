import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";



// Constants
const COLUMNS   = 8;
const ROWS      = 6;
const CELL_SIZE = 16;

// Styles
const Container = Styled.div`
    padding: 4px;
`;

const Grid = Styled.div`
    display: grid;
    grid-template-columns: repeat(${COLUMNS}, ${CELL_SIZE}px);
    gap: 3px;
`;

const Cell = Styled.button.attrs(({ isActive }) => ({ isActive }))`
    width: ${CELL_SIZE}px;
    height: ${CELL_SIZE}px;
    padding: 0;
    border: 1px solid var(--border-color-dark);
    border-radius: 3px;
    background-color: transparent;
    cursor: pointer;

    ${(props) => props.isActive && `
        border-color: var(--primary-color);
        background-color: color-mix(in srgb, var(--primary-color) 20%, transparent);
    `}
`;

const Size = Styled.p`
    margin: 8px 0 0;
    font-size: 12px;
    text-align: center;
    color: var(--font-light);
`;



/**
 * The Editor Table, to pick the amount of rows and columns of a new table
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditorTable(props) {
    const { onSelect } = props;


    // The Current State
    const [ size, setSize ] = React.useState({ rows : 1, columns : 1 });


    // Do the Render
    return <Container>
        <Grid onMouseLeave={() => setSize({ rows : 1, columns : 1 })}>
            {Array.from({ length : ROWS * COLUMNS }, (value, index) => {
                const row    = Math.floor(index / COLUMNS) + 1;
                const column = index % COLUMNS + 1;
                return <Cell
                    key={index}
                    type="button"
                    isActive={row <= size.rows && column <= size.columns}
                    onMouseEnter={() => setSize({ rows : row, columns : column })}
                    onClick={() => onSelect(row, column)}
                />;
            })}
        </Grid>
        <Size>{NLS.format("GENERAL_FORMAT_TABLE_SIZE", size.columns, size.rows)}</Size>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditorTable.propTypes = {
    onSelect : PropTypes.func.isRequired,
};

export default EditorTable;
