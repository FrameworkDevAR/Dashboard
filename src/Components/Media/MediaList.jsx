import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Action               from "../../Core/Action";
import Utils                from "../../Utils/Utils";

// Components
import NLS                  from "../../Core/NLS";
import NoneAvailable        from "../Common/NoneAvailable";
import CircularLoader       from "../Loader/CircularLoader";
import Breadcrumb           from "../Header/Breadcrumb";
import MediaItem            from "../Media/MediaItem";



// Styles
const Container = Styled.div.attrs(({ inDialog, withSpace, isCentered }) => ({ inDialog, withSpace, isCentered }))`
    color: var(--media-main-color);

    ${(props) => props.inDialog && `
        min-height: calc(130px * 2 + 8px + 16px + 12px);
    `}
    ${(props) => props.withSpace && "padding-top: 24px;"}

    ${(props) => props.isCentered && `
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
    `}
`;

const Section = Styled.section`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-auto-rows: 1fr;
    gap: 8px;
    padding-top: 12px;
`;



/**
 * The Media List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MediaList(props) {
    const {
        className, isLoading, onAction, onDrop,
        canEdit, canSelect, canDrag, inDialog, withSpace,
        selectedPath, selectedPaths, items, path, none,
    } = props;


    // The Current State
    const [ isDragging, setDragging   ] = React.useState(false);
    const [ isMoving,   setMoving     ] = React.useState(false);
    const [ dragIndex,  setDragIndex  ] = React.useState(0);
    const [ startX,     setStartX     ] = React.useState(0);
    const [ startY,     setStartY     ] = React.useState(0);
    const [ diffX,      setDiffX      ] = React.useState(0);
    const [ diffY,      setDiffY      ] = React.useState(0);
    const [ posX,       setPosX       ] = React.useState(0);
    const [ posY,       setPosY       ] = React.useState(0);
    const [ width,      setWidth      ] = React.useState(0);
    const [ requestRAF, setRequestRAF ] = React.useState(false);
    const [ openPath,   setOpenPath   ] = React.useState("");

    // Variables
    const showLoader = Boolean(isLoading && !items.length);
    const showNone   = Boolean(!isLoading && !items.length);
    const showItems  = Boolean(items.length);
    const amount     = items.filter((elem) => !elem.isBack).length;


    // Handles the Action, keeping the Directory that is being opened
    const handleAction = (action, elem, e) => {
        if (action.isSelect && (elem.isDir || elem.isBack)) {
            setOpenPath(elem.path);
        }
        if (onAction) {
            onAction(action, elem, e);
        }
    };

    // Handles the Breadcrumb links
    const handleBreadcrumb = (href) => {
        if (onAction) {
            const path = href === "/" ? "" : href;
            onAction(Action.get("VIEW"), { isDir : true, path });
        }
    };

    // Handles the Grab
    const handleGrab = (e, elem, index) => {
        if (!canDrag || isDragging || elem.isBack || elem.isDir || e.nativeEvent.which !== 1) {
            return;
        }
        setDragging(true);
        setRequestRAF(true);
        setDragIndex(index);
        setStartX(e.clientX);
        setStartY(e.clientY);
    };

    // Handles the Drag
    const handleDrag = (e) => {
        if (!isDragging) {
            return;
        }
        if (!isMoving) {
            startDrag(e);
            return;
        }
        animateDrag(e);
        if (requestRAF) {
            setRequestRAF(false);
        }
    };

    // Handles the Drag Start
    const startDrag = (e) => {
        const currX = e.clientX - startX;
        const currY = e.clientY - startY;
        const dist  = currX * currX + currY * currY;

        if (dist <= 25) {
            return;
        }

        const node = document.querySelector(`.media-item-${dragIndex}`);
        if (!node) {
            return;
        }

        const bounds = node.getBoundingClientRect();

        setMoving(true);
        setWidth(bounds.width);
        setDiffX(startX - bounds.left);
        setDiffY(startY - bounds.top);
        setPosX(e.clientX - startX + bounds.left);
        setPosY(e.clientY - startY + bounds.top);
    };

    // Handles the Drag Animated
    const animateDrag = (e) => {
        setPosX(e.clientX - diffX);
        setPosY(e.clientY - diffY);
        setRequestRAF(true);

        e.preventDefault();
        e.stopPropagation();
        Utils.unselectAll();
    };

    // Handles the Drop
    const handleDrop = (e) => {
        if (!isDragging) {
            return;
        }
        setDragging(false);
        if (!isMoving) {
            return;
        }
        setMoving(false);

        for (const [ index, elem ] of items.entries()) {
            if (elem.isBack || elem.isDir) {
                const node = document.querySelector(`.media-item-${index}`);
                if (!node) {
                    continue;
                }

                const bounds = node.getBoundingClientRect();
                if (Utils.inBounds(e.clientX, e.clientY, bounds)) {
                    onDrop(items[dragIndex], elem);
                    break;
                }
            }
        }
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

    // The Directory stops loading when the content is fetched
    React.useEffect(() => {
        if (!isLoading) {
            setOpenPath("");
        }
    }, [ isLoading ]);

    // Adds the Listeners
    React.useEffect(() => {
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup",   handleDrop);
        return () => {
            window.removeEventListener("mousemove", handleDrag);
            window.removeEventListener("mouseup",   handleDrop);
        };
    });


    // Calculate some Styles
    const style = {};
    if (isMoving) {
        style.position = "absolute";
        style.width    = `${width}px`;
        style.top      = `${posY}px`;
        style.left     = `${posX}px`;
        style.zIndex   = 1000;
    }


    // Do the Render
    return <Container
        className={className}
        inDialog={inDialog}
        withSpace={withSpace}
        isCentered={showLoader || showNone}
    >
        {showLoader && <CircularLoader />}
        {showNone   && (none || <NoneAvailable message="MEDIA_NONE_AVAILABLE" />)}
        {showItems  && <>
            <Breadcrumb
                route={path}
                amount={NLS.pluralize("MEDIA_AMOUNT", amount)}
                onClick={handleBreadcrumb}
            />
            <Section>
                {items.map((elem, index) => {
                    const isCurrent = isMoving && index === dragIndex;
                    return <MediaItem
                        key={index}
                        elem={elem}
                        className={`media-item-${index}`}
                        style={isCurrent ? style : null}
                        isSelected={isSelected(elem)}
                        hasActions={!isCurrent && canEdit && !elem.isBack}
                        isLoading={isLoading && openPath === elem.path}
                        onAction={handleAction}
                        onMouseDown={(e) => handleGrab(e, elem, index)}
                    />;
                })}
            </Section>
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
};

export default MediaList;
