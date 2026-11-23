import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import TableRowCnt          from "../Table/TableRowCnt";



// Styles
const TFoot = Styled.tfoot.attrs(({ isLarge, notFixed }) => ({ isLarge, notFixed }))`
    ${(props) => !props.notFixed && `
        position: sticky;
        bottom: 0;
        z-index: 2;
    `}

    background: var(--table-background);
    border-radius: var(--table-border-radius);

    ${(props) => props.isLarge && `
        && th {
            font-size: 14px;
        }
    `}
`;



/**
 * The Table Foot, which sticks to the bottom of a fixed Table, but not of one that is not fixed,
 * like the ones in a Dialog, as it would cover its rows when the Dialog scrolls
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TableFoot(props) {
    const { isLarge, notFixed, hasActions, columns, children } = props;


    // Clone the Children
    const items = Utils.cloneChildren(children, (child, index) => ({
        ...columns[index],
    }));


    // Do the Render
    return <TFoot isLarge={isLarge} notFixed={notFixed}>
        <TableRowCnt hasActions={hasActions}>
            {items}
            {hasActions && <th />}
        </TableRowCnt>
    </TFoot>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TableFoot.propTypes = {
    isLarge    : PropTypes.bool,
    notFixed   : PropTypes.bool,
    hasActions : PropTypes.bool,
    columns    : PropTypes.array,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TableFoot.defaultProps = {
    isLarge    : false,
    notFixed   : false,
    hasActions : false,
};

export default TableFoot;
