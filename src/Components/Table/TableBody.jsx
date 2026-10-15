import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Utils                from "../../Utils/Utils";



// Styles
const TBody = Styled.tbody.attrs(({ hasFooter, notFixed }) => ({ hasFooter, notFixed }))`
    box-sizing: border-box;
    width: 100%;

    min-height: calc(
        var(--table-height)
        - var(--table-header-height)
        - var(--table-paging-height)
        - var(--table-stats-height)
        - var(--table-tabs-height)
        - var(--table-alert-height)
        - var(--table-filter-height)
        - var(--table-extra-space)
    );

    ${(props) => props.notFixed && `
        min-height: auto;
        tr:last-child td {
            border-bottom: none;
        }
    `}

    ${(props) => !props.hasFooter && `
        border-bottom-left-radius: var(--table-border-radius);
        border-bottom-right-radius: var(--table-border-radius);
    `}

    @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
        border-radius: var(--table-border-radius);
    }
`;



/**
 * The Table Body Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TableBody(props) {
    const {
        notFixed, isEditable, hasChecks,
        hasActions, hasPaging, hasFooter,
        handleRowClick, handleRowDoubleClick, handleMenuOpen, columns,
        checked, setChecked, children,
    } = props;


    // Clone the Children
    const items = Utils.cloneChildren(children, () => ({
        hasChecks, hasActions, isEditable,
        columns, checked, setChecked,
        handleRowClick, handleRowDoubleClick, handleMenuOpen,
    }));


    // Do the Render
    return <TBody
        notFixed={notFixed}
        hasFooter={hasPaging || hasFooter}
    >
        {items}
    </TBody>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TableBody.propTypes = {
    notFixed             : PropTypes.bool,
    isEditable           : PropTypes.bool,
    hasChecks            : PropTypes.bool,
    hasActions           : PropTypes.bool,
    hasPaging            : PropTypes.bool,
    hasFooter            : PropTypes.bool,
    handleRowClick       : PropTypes.func,
    handleRowDoubleClick : PropTypes.func,
    handleMenuOpen       : PropTypes.func,
    columns              : PropTypes.array,
    checked              : PropTypes.array,
    setChecked           : PropTypes.func,
    children             : PropTypes.node,
};

export default TableBody;
