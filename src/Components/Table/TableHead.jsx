import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Utils                from "../../Utils/Utils";

// Components
import TableRowCnt          from "../Table/TableRowCnt";
import CheckboxInput        from "../InputType/CheckboxInput";
import IconLink             from "../Link/IconLink";



// Styles
const THead = Styled.thead.attrs(({ isEditable }) => ({ isEditable }))`
    position: sticky;
    top: 0;
    z-index: 2;

    box-sizing: border-box;
    height: var(--table-header-height);
    background: var(--table-background);
    border-radius: var(--table-border-radius);

    ${(props) => !props.isEditable && `
        @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
            display: none;
        }
    `}
`;

const CheckCell = Styled.th`
    padding: 0 0 0 8px;
    background: var(--table-background);
    border-top-left-radius: var(--table-border-radius);
    border-bottom-left-radius: var(--table-border-radius);
`;

const EditCell = Styled.th`
    padding: 0 8px;
    background: var(--table-background);
    border-top-right-radius: var(--table-border-radius);
    border-bottom-right-radius: var(--table-border-radius);
`;



/**
 * The Table Head Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TableHead(props) {
    const {
        hasChecks, hasCheckAll, isCheckedAll, isCheckedSome, handleCheckAll,
        hasActions, isEditable, setShowEdit, handleColWidth,
        hasSorting, sort, fetch, handleSort, sortField, columns, children,
    } = props;


    // Clone the Children
    const items = Utils.cloneChildren(children, (child, index, realIndex) => ({
        hasSorting, sort, fetch, handleSort, sortField,
        isEditable, handleColWidth, ...columns[realIndex],
    }));
    if (isEditable) {
        items.sort((a, b) => a.props.position - b.props.position);
    }


    // Do the Render
    return <THead isEditable={isEditable}>
        <TableRowCnt
            hasChecks={hasChecks}
            hasActions={hasActions}
            isEditable={isEditable}
        >
            {hasChecks && hasCheckAll && <CheckCell>
                <CheckboxInput
                    name="checked"
                    isChecked={isCheckedAll}
                    isIndeterminate={isCheckedSome}
                    onChange={() => handleCheckAll()}
                />
            </CheckCell>}
            {hasChecks && !hasCheckAll && <th />}

            {items}

            {isEditable && <EditCell>
                <IconLink
                    variant="light"
                    icon="column"
                    onClick={() => setShowEdit(true)}
                    dontStop
                    isTiny
                />
            </EditCell>}
            {hasActions && !isEditable && <th />}
        </TableRowCnt>
    </THead>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TableHead.propTypes = {
    hasChecks      : PropTypes.bool,
    hasCheckAll    : PropTypes.bool,
    isCheckedAll   : PropTypes.bool,
    isCheckedSome  : PropTypes.bool,
    handleCheckAll : PropTypes.func,
    hasActions     : PropTypes.bool,
    isEditable     : PropTypes.bool,
    setShowEdit    : PropTypes.func,
    handleColWidth : PropTypes.func,
    hasSorting     : PropTypes.bool,
    sort           : PropTypes.object,
    fetch          : PropTypes.func,
    handleSort     : PropTypes.func,
    sortField      : PropTypes.string,
    columns        : PropTypes.array,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TableHead.defaultProps = {
    hasChecks     : false,
    hasCheckAll   : false,
    isCheckedAll  : false,
    isCheckedSome : false,
    hasActions    : false,
    isEditable    : false,
    hasSorting    : false,
};

export default TableHead;
