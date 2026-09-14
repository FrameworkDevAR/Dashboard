import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import PagingContent        from "./PagingContent";



// Styles
const TFoot = Styled.tfoot`
    position: sticky;
    bottom: 0;
    z-index: 2;

    background: var(--table-background);
    border-radius: var(--table-border-radius);
`;

const TRow = Styled.tr`
    position: sticky;
    right: 0;
    z-index: 1000;

    display: flex;
    height: auto;
    min-height: 32px;
`;

const GrowCell = Styled.td`
    display: flex;
    flex: 1 0 auto;
`;

const PagingCell = Styled.td`
    position: sticky;
    right: 0;
    z-index: 2;

    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 4px;
    font-size: 12px;
`;



/**
 * The Table Paging Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TablePaging(props) {
    const { sort, total, fetch, handlePaging, isPaging } = props;


    // Do the Render
    return <TFoot>
        <TRow>
            <GrowCell />
            <PagingCell className="table-paging">
                <PagingContent
                    sort={sort}
                    total={total}
                    fetch={handlePaging ?? fetch}
                    isPaging={isPaging}
                />
            </PagingCell>
        </TRow>
    </TFoot>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TablePaging.propTypes = {
    fetch        : PropTypes.func,
    handlePaging : PropTypes.func,
    isPaging     : PropTypes.bool,
    sort         : PropTypes.object,
    total        : PropTypes.number.isRequired,
};

export default TablePaging;
