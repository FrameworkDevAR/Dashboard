import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Action               from "../../Core/Action";
import NLS                  from "../../Core/NLS";
import useMediaDrag         from "../../Hooks/MediaDrag";

// Components
import NoneAvailable        from "../Common/NoneAvailable";
import CircularLoader       from "../Loader/CircularLoader";
import Breadcrumb           from "../Header/Breadcrumb";
import MediaGrid            from "../Media/MediaGrid";
import MediaTable           from "../Media/MediaTable";
import PillTabs             from "../Pill/PillTabs";
import PillTab              from "../Pill/PillTab";



// Constants
const GAP_SPACE   = 16;
const CRUMB_SPACE = 28 + GAP_SPACE;
const DROP_SPACE  = 60 + GAP_SPACE;
const TIP_SPACE   = 46 + GAP_SPACE;

// Styles
const Container = Styled.div.attrs(({ inDialog, isCentered }) => ({ inDialog, isCentered }))`
    display: flex;
    flex-direction: column;
    gap: ${GAP_SPACE}px;
    color: var(--media-main-color);

    ${(props) => props.inDialog ? `
        --media-height: calc(var(--dialog-content, var(--dialog-body)) - 2px);
        min-height: calc(148px * 2 + 12px + 12px + 27px);
    ` : `
        --media-height: calc(var(--main-height) - var(--main-padding) - var(--header-height) - 2px);
    `}

    ${(props) => props.isCentered && `
        flex-grow: 1;
        justify-content: center;
        align-items: center;
    `}
`;

const Crumb = Styled(Breadcrumb)`
    flex-grow: 2;
`;

const Toolbar = Styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;



/**
 * The Media List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MediaList(props) {
    const {
        className, isLoading, onAction, onDrop,
        canEdit, canSelect, canDrag, inDialog, withSpace, withTip,
        selectedPath, selectedPaths, items, path, none,
    } = props;


    // The Current State
    const [ openElem, setOpenElem ] = React.useState(null);
    const [ view,     setView     ] = React.useState(localStorage.getItem("dashboard-media-view") || "grid");
    const [ sort,     setSort     ] = React.useState(localStorage.getItem("dashboard-media-sort") || "name");

    // The Back and the Directories are always first, no matter the sort
    const sortedItems = React.useMemo(() => [ ...items ].sort((a, b) => {
        if (a.isBack !== b.isBack) {
            return a.isBack ? -1 : 1;
        }
        if (a.isDir !== b.isDir) {
            return a.isDir ? -1 : 1;
        }
        if (sort === "time") {
            return b.modifiedTime - a.modifiedTime;
        }
        return a.name.localeCompare(b.name);
    }), [ items, sort ]);

    // Variables
    const showLoader = Boolean(isLoading && !items.length);
    const showNone   = Boolean(!isLoading && !items.length);
    const showItems  = Boolean(items.length);
    const amount     = items.filter((elem) => !elem.isBack).length;
    const isGrid     = view === "grid";

    // The items leave the space of the Breadcrumb, the Drop Zone and the Tip
    const extraSpace = CRUMB_SPACE + (withSpace ? DROP_SPACE : 0) + (withTip ? TIP_SPACE : 0);


    // Handles the Drop, the Directory loads while the File is moved
    const handleDrop = (fromElem, toElem) => {
        setOpenElem(toElem);
        onDrop(fromElem, toElem);
    };

    // The Drag Hook
    const {
        isMoving, dragIndex, dropIndex, movedIndex,
        dragStyle, ghostStyle, handleGrab, resetDrag,
    } = useMediaDrag(sortedItems, isGrid, canDrag, handleDrop);


    // Handles the Action, keeping the Directory that is being opened
    const handleAction = (action, elem, e) => {
        if (action.isSelect && (elem.isDir || elem.isBack)) {
            setOpenElem(elem);
        }
        if (onAction) {
            onAction(action, elem, e);
        }
    };

    // Handles the View, which is remembered
    const handleView = (newView) => {
        setView(newView);
        localStorage.setItem("dashboard-media-view", newView);
    };

    // Handles the Sort, which is remembered
    const handleSort = (newSort) => {
        setSort(newSort);
        localStorage.setItem("dashboard-media-sort", newSort);
    };

    // Returns true if the elem is selected
    const isSelected = (elem) => {
        if (!canSelect || elem.isBack) {
            return false;
        }
        if (selectedPaths && selectedPaths.length && selectedPaths.includes(elem.path)) {
            return true;
        }
        if (selectedPath && selectedPath === elem.path) {
            return true;
        }
        return false;
    };

    // Handles the Breadcrumb links
    const handleBreadcrumb = (href) => {
        if (onAction) {
            const path = href === "/" ? "" : href;
            onAction(Action.get("VIEW"), { isDir : true, path });
        }
    };

    // The Directory stops loading when the content is fetched
    React.useEffect(() => {
        if (!isLoading) {
            setOpenElem(null);
            resetDrag();
        }
    }, [ isLoading, items ]);


    // Do the Render
    return <Container
        className={className}
        inDialog={inDialog}
        isCentered={showLoader || showNone}
    >
        {showLoader && <CircularLoader />}
        {showNone   && (none || <NoneAvailable message="MEDIA_NONE_AVAILABLE" />)}
        {showItems  && <>
            <Toolbar>
                <Crumb
                    route={path}
                    amount={NLS.pluralize("MEDIA_AMOUNT", amount)}
                    onClick={handleBreadcrumb}
                />
                <PillTabs selected={sort} onClick={handleSort}>
                    <PillTab
                        icon="sort-alpha"
                        value="name"
                        tooltip="MEDIA_SORT_NAME"
                        tooltipWidth={140}
                    />
                    <PillTab
                        icon="time"
                        value="time"
                        tooltip="MEDIA_SORT_TIME"
                        tooltipWidth={140}
                    />
                </PillTabs>
                <PillTabs selected={view} onClick={handleView}>
                    <PillTab
                        icon="grid"
                        value="grid"
                        tooltip="MEDIA_VIEW_GRID"
                        tooltipWidth={120}
                    />
                    <PillTab
                        icon="list"
                        value="list"
                        tooltip="MEDIA_VIEW_LIST"
                        tooltipWidth={120}
                    />
                </PillTabs>
            </Toolbar>

            {isGrid ? <MediaGrid
                items={sortedItems}
                inDialog={inDialog}
                canEdit={canEdit}
                extraSpace={extraSpace}
                isSelected={isSelected}
                openElem={openElem}
                isMoving={isMoving}
                dragIndex={dragIndex}
                dropIndex={dropIndex}
                movedIndex={movedIndex}
                dragStyle={dragStyle}
                onAction={handleAction}
                onGrab={handleGrab}
            /> : <MediaTable
                items={sortedItems}
                inDialog={inDialog}
                canEdit={canEdit}
                extraSpace={extraSpace}
                isSelected={isSelected}
                openElem={openElem}
                isMoving={isMoving}
                dragIndex={dragIndex}
                dropIndex={dropIndex}
                movedIndex={movedIndex}
                ghostStyle={ghostStyle}
                onAction={handleAction}
                onGrab={handleGrab}
            />}
        </>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MediaList.propTypes = {
    className     : PropTypes.string,
    onAction      : PropTypes.func,
    onDrop        : PropTypes.func,
    isLoading     : PropTypes.bool,
    canSelect     : PropTypes.bool,
    canEdit       : PropTypes.bool,
    canDrag       : PropTypes.bool,
    inDialog      : PropTypes.bool,
    withSpace     : PropTypes.bool,
    withTip       : PropTypes.bool,
    selectedPath  : PropTypes.string,
    selectedPaths : PropTypes.arrayOf(PropTypes.string),
    items         : PropTypes.array,
    path          : PropTypes.string,
    none          : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MediaList.defaultProps = {
    className : "",
    isLoading : false,
    canSelect : false,
    canEdit   : false,
    canDrag   : false,
    inDialog  : false,
    withSpace : true,
    withTip   : false,
};

export default MediaList;
