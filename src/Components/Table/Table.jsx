import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Action               from "../../Core/Action";
import Responsive           from "../../Core/Responsive";
import Navigate             from "../../Core/Navigate";
import Utils                from "../../Utils/Utils";

// Components
import TableHead            from "../Table/TableHead";
import TableBody            from "../Table/TableBody";
import TableFoot            from "../Table/TableFoot";
import TablePaging          from "../Table/TablePaging";
import TableActionList      from "../Table/TableActionList";
import TableEdit            from "../Table/TableEdit";
import Menu                 from "../Menu/Menu";
import MenuItem             from "../Menu/MenuItem";
import NoneAvailable        from "../Common/NoneAvailable";
import CircularLoader       from "../Loader/CircularLoader";



// Styles
const Wrapper = Styled.div.attrs(({ inDialog, hasFilter, statsAmount, hasTabs, hasAlert, hasPaging, hasChecks, hasActions, notFixed, isEditable, extraSpace }) => ({ inDialog, hasFilter, statsAmount, hasTabs, hasAlert, hasPaging, hasChecks, hasActions, notFixed, isEditable, extraSpace }))`
    ${(props) => props.inDialog ? `
        --table-height: calc(var(--dialog-body) - 2 * var(--main-padding) - 2px);
    ` : `
        --table-height: calc(var(--main-height) - var(--main-padding) - var(--header-height) - 2px);
    `}

    --table-header-height: 28px;
    --table-filter-height: ${(props) => props.hasFilter ? "var(--filter-height)" : "0px"};
    --table-stats-height: ${(props) => props.statsAmount > 0 ? `calc((var(--stats-height) + var(--main-gap)) * ${props.statsAmount})` : "0px"};
    --table-tabs-height: ${(props) => props.hasTabs ? "var(--tabs-table)" : "0px"};
    --table-alert-height: ${(props) => props.hasAlert ? "var(--alert-height)" : "0px"};
    --table-paging-height: ${(props) => props.hasPaging ? "32px" : "0px"};
    --table-extra-space: ${(props) => props.extraSpace ? `${props.extraSpace}px` : "0px"};

    --table-checks-width: ${(props) => props.hasChecks ? "28px" : "0px"};
    --table-actions-width: ${(props) => props.hasActions || props.isEditable ? "40px" : "0px"};

    position: relative;

    ${(props) => !props.notFixed && `
        overflow: auto;
        height: calc(
            var(--table-height)
            - var(--table-stats-height)
            - var(--table-tabs-height)
            - var(--table-alert-height)
            - var(--table-filter-height)
            - var(--table-extra-space)
        );
    `}

    ${(props) => props.isEditable ? `
        td:last-child {
            justify-content: flex-end;
        }
    ` : `
        @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
            --table-header-height: 0px;
        }
    `}
`;

const Loading = Styled(Wrapper)`
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const Container = Styled.table.attrs(({ isEditable, totalWidth, hasRadius, hasScroll }) => ({ isEditable, totalWidth, hasRadius, hasScroll }))`
    display: flex;
    flex-direction: column;
    width: 100%;
    table-layout: fixed;
    color: var(--table-font-color);

    .input-content {
        background-color: transparent;
    }

    ${(props) => props.isEditable && `
        min-width: calc(${props.totalWidth}px + var(--table-checks-width) + var(--table-actions-width));
    `}

    ${(props) => props.hasRadius && `
        tr:last-child td:first-child {
            border-bottom-left-radius: var(--border-radius);
        }
        tr:last-child td:last-child {
            border-bottom-right-radius: var(--border-radius);
        }
    `}

    ${(props) => props.hasScroll && `tr:last-child td {
        border-bottom: none;
    }`}
`;



/**
 * The Table Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Table(props) {
    const {
        isHidden, className, sort, fetch, isLoading, none, hideEmpty,
        noClick, inDialog, hasFilter, statsAmount, hasTabs, hasAlert,
        noSorting, notFixed, columnData, onColumnEdit,
        checked, setChecked, hasCheckAll, extraSpace, children,
    } = props;

    // The References
    const tableRef = React.useRef(null);
    const navigate = Navigate.useGoto();
    const path     = Navigate.usePath();

    // The Current State
    const [ menuID,     setMenuID     ] = React.useState(null);
    const [ menuTop,    setMenuTop    ] = React.useState(null);
    const [ menuLeft,   setMenuLeft   ] = React.useState(null);
    const [ menuDir,    setMenuDir    ] = React.useState(null);
    const [ iconHeight, setIconHeight ] = React.useState(0);
    const [ hasScroll,  setHasScroll  ] = React.useState(false);
    const [ showEdit,   setShowEdit   ] = React.useState(false);


    // Handles the Column Edit
    const handleColEdit = (columns) => {
        const hidden = columnList.filter((column) => hiddenCols.includes(column.id));
        onColumnEdit([ ...columns, ...hidden ], true);
        setShowEdit(false);
    };

    // Handles the Column Width
    const handleColWidth = (field, width, isDrop) => {
        const column = Utils.getValue(columnList, "id", field);
        column.width = width;
        onColumnEdit(columnList, isDrop);
    };

    // Handles the Check all
    const handleCheckAll = () => {
        if (isCheckedAll) {
            setChecked([]);
        } else {
            setChecked(elemIDs);
        }
    };

    // Handles the Click
    const handleClick = (elem, elemID) => {
        if (elem.onClick) {
            elem.onClick(elemID);
        } else if (elem.onAction) {
            elem.onAction(elem.act, elemID);
        } else if (elem.navigate) {
            navigate(path, elemID);
        }
    };

    // Handles the Row Click
    const handleRowClick = (elemID) => {
        if (noClick || menuID !== null || Utils.hasSelection()) {
            return;
        }
        for (const action of actions) {
            if (action.action && (!action.hide || !action.hide(elemID))) {
                handleClick(action, elemID);
                break;
            }
        }
    };

    // Handles the Menu Open
    const handleMenuOpen = (menuID, menuTop, menuLeft, menuDir, iconHeight) => {
        setMenuID(menuID);
        setMenuTop(menuTop);
        setMenuLeft(menuLeft);
        setMenuDir(menuDir);
        setIconHeight(iconHeight);
    };

    // Handles the Menu Close
    const handleMenuClose = () => {
        setMenuID(null);
    };

    // Close the Menu if the Filter Changes
    React.useEffect(() => {
        if (sort && sort.filter && menuID) {
            handleMenuClose();
        }
    }, [ sort ]);



    // Parse the table data
    const isEditable = Boolean(onColumnEdit);
    const columns    = [];
    const columnList = [];
    const hiddenCols = [];
    const elemIDs    = [];
    const actions    = [];

    let   totalWidth = 0;
    let   hasContent = false;
    let   hasPaging  = false;
    let   hasFooter  = false;
    let   hasActions = false;

    for (const child of Utils.toArray(children)) {
        if (child.type === TableHead) {
            for (const [ index, tableHead ] of Utils.getChildren(child.props.children).entries()) {
                const data = {
                    id          : tableHead.props.field,
                    isHidden    : !!tableHead.props.isHidden,
                    isTitle     : !!tableHead.props.isTitle,
                    isSmall     : !!tableHead.props.isSmall,
                    isFlex      : !!tableHead.props.isFlex,
                    isMultiline : !!tableHead.props.isMultiline,
                    bigMobile   : !!tableHead.props.bigMobile,
                    hideMobile  : !!tableHead.props.hideMobile,
                    hideCircle  : !!tableHead.props.hideCircle,
                    noSpace     : !!tableHead.props.noSpace,
                    smallSpace  : !!tableHead.props.smallSpace,
                    grow        : tableHead.props.grow     || "",
                    shrink      : tableHead.props.shrink   || "",
                    minWidth    : tableHead.props.minWidth || "",
                    maxWidth    : tableHead.props.maxWidth || "",
                    align       : tableHead.props.align    || "",
                };

                if (isEditable) {
                    const colData   = Utils.getValue(columnData, "id", tableHead.props.field);
                    const colIndex  = Utils.getIndex(columnData, "id", tableHead.props.field);
                    const position  = colIndex !== null ? colIndex : columnData.length + index;
                    const width     = colData.width || Number(tableHead.props.width) || 200;
                    const isVisible = !tableHead.props.isHidden && (!!colData.isVisible || (!columnData.length && !!tableHead.props.isDefault));

                    data.isHidden = !isVisible;
                    data.width    = width;
                    data.position = position;

                    columnList.push({
                        id        : tableHead.props.field,
                        name      : tableHead.props.message,
                        width     : width,
                        position  : position,
                        isVisible : isVisible,
                    });
                    if (tableHead.props.isHidden) {
                        hiddenCols.push(tableHead.props.field);
                    }
                    if (isVisible) {
                        totalWidth += width;
                    }
                }
                columns.push(data);
            }
            columnList.sort((a, b) => a.position - b.position);
        }

        if (child.type === TableBody) {
            const tableRows = Utils.getChildren(child.props.children);
            hasContent = tableRows.length > 0;
            for (const tableRow of tableRows) {
                elemIDs.push(tableRow.props.elemID);
            }
        }

        if (child.type === TablePaging) {
            hasPaging = true;
        }
        if (child.type === TableFoot) {
            hasFooter = true;
        }

        if (child.type === TableActionList) {
            for (const tableAction of Utils.getChildren(child.props.children)) {
                const action = { ...tableAction.props };
                action.act = Action.get(action.action);
                if (!action.isHidden && ((action.act.isCCED && child.props.canEdit) || !action.act.isCCED)) {
                    hasActions = true;
                    if (!action.navigate && !action.onClick) {
                        action.onClick  = child.props.onClick;
                        action.onAction = child.props.onAction;
                    }
                    if (!menuID || !action.hide || !action.hide(menuID)) {
                        actions.push(action);
                    }
                }
            }
        }
    }


    // Variables
    const hasRadius     = notFixed && !hasFooter && !hasPaging;
    const showMenu      = hasActions && Boolean(menuID !== null && menuTop);
    const hasSorting    = !noSorting && !Utils.isEmpty(sort);
    const hasChecks     = Boolean(checked && setChecked);
    const isCheckedAll  = hasChecks && checked.length === elemIDs.length;
    const isCheckedSome = hasChecks && checked.length > 0;


    // Get the Children
    const items = [];
    for (const [ key, child ] of Utils.getChildren(children).entries()) {
        if (child.type !== TableActionList) {
            items.push(React.cloneElement(child, {
                key, fetch, sort, columns,
                hasSorting, hasPaging, hasFooter, notFixed,
                hasChecks, checked, setChecked,
                hasCheckAll, isCheckedAll, isCheckedSome, handleCheckAll,
                hasActions, isEditable, setShowEdit, handleColWidth,
                handleRowClick, handleMenuOpen,
            }));
        }
    }

    // Check if the Table should scroll
    React.useEffect(() => {
        if (tableRef.current && items.length) {
            setHasScroll(tableRef.current.scrollHeight > tableRef.current.clientHeight);
        }
    }, [ isLoading, elemIDs.length ]);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    if (isLoading) {
        return <Loading
            inDialog={inDialog}
            hasFilter={hasFilter}
            statsAmount={statsAmount}
            hasTabs={hasTabs}
            hasAlert={hasAlert}
            hasPaging={hasPaging}
            hasChecks={hasChecks}
            hasActions={hasActions}
            notFixed={notFixed}
            isEditable={isEditable}
            extraSpace={extraSpace}
        >
            <CircularLoader />
        </Loading>;
    }
    if (!hasContent && none) {
        return <div>
            <NoneAvailable message={none} />
        </div>;
    }
    if (!hasContent && hideEmpty) {
        return <React.Fragment />;
    }
    return <>
        <Wrapper
            ref={tableRef}
            inDialog={inDialog}
            hasFilter={hasFilter}
            statsAmount={statsAmount}
            hasTabs={hasTabs}
            hasAlert={hasAlert}
            hasPaging={hasPaging}
            hasChecks={hasChecks}
            hasActions={hasActions}
            notFixed={notFixed}
            isEditable={isEditable}
            extraSpace={extraSpace}
        >
            <Container
                className={className}
                isEditable={isEditable}
                totalWidth={totalWidth}
                hasRadius={hasRadius}
                hasScroll={hasScroll}
            >
                {items}
            </Container>
        </Wrapper>

        <Menu
            containerRef={tableRef}
            open={showMenu}
            top={menuTop}
            left={menuLeft}
            direction={menuDir}
            iconHeight={iconHeight}
            onClose={handleMenuClose}
        >
            {actions.map((elem, index) => <MenuItem
                key={index}
                icon={elem.icon || elem.act.icon}
                message={elem.message || elem.act.message}
                onClick={() => handleClick(elem, menuID)}
            />)}
        </Menu>

        <TableEdit
            open={showEdit}
            onSubmit={handleColEdit}
            onClose={() => setShowEdit(false)}
            columns={columnList.filter((column) => !hiddenCols.includes(column.id))}
        />
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Table.propTypes = {
    isHidden     : PropTypes.bool,
    className    : PropTypes.string,
    fetch        : PropTypes.func,
    sort         : PropTypes.object,
    none         : PropTypes.string,
    hideEmpty    : PropTypes.bool,
    isLoading    : PropTypes.bool,
    inDialog     : PropTypes.bool,
    hasFilter    : PropTypes.bool,
    statsAmount  : PropTypes.number,
    hasTabs      : PropTypes.bool,
    hasAlert     : PropTypes.bool,
    noSorting    : PropTypes.bool,
    noClick      : PropTypes.bool,
    notFixed     : PropTypes.bool,
    columnData   : PropTypes.array,
    onColumnEdit : PropTypes.func,
    checked      : PropTypes.array,
    setChecked   : PropTypes.func,
    hasCheckAll  : PropTypes.bool,
    extraSpace   : PropTypes.number,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Table.defaultProps = {
    isHidden    : false,
    className   : "",
    sort        : {},
    none        : "",
    hideEmpty   : false,
    isLoading   : false,
    hasFilter   : false,
    statsAmount : 0,
    hasTabs     : false,
    noSorting   : false,
    notFixed    : false,
    columnData  : [],
    hasCheckAll : false,
    extraSpace  : 0,
};

export default Table;
