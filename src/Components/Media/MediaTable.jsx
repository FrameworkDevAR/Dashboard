import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Action               from "../../Core/Action";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";
import DateTime             from "../../Utils/DateTime";

// Components
import CircularLoader       from "../Loader/CircularLoader";
import Icon                 from "../Common/Icon";
import Table                from "../Table/Table";
import TableHead            from "../Table/TableHead";
import TableBody            from "../Table/TableBody";
import TableRow             from "../Table/TableRow";
import TableHeader          from "../Table/TableHeader";
import TableCell            from "../Table/TableCell";
import TableActionList      from "../Table/TableActionList";
import TableAction          from "../Table/TableAction";



// Styles
const List = Styled(Table)`
    tr.media-target td {
        background-color: var(--accent-light);
    }
    tr.media-moving td {
        opacity: 0.5;
    }
    tr.media-hidden {
        display: none;
    }

    &.media-dragging {
        &, td {
            cursor: grabbing;
        }
        tr:hover td {
            background-color: var(--content-color);
        }
        tr.media-target td {
            background-color: var(--accent-light);
        }
    }
`;

const Loading = Styled(CircularLoader)`
    flex-shrink: 0;
    width: 44px;
    height: 36px;
    padding: 0;

    > div {
        flex-grow: 0;
    }
`;

const IconBox = Styled.div.attrs(({ color }) => ({ color }))`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 36px;
    border-radius: var(--border-radius);
    color: ${(props) => props.color};
    background-color: color-mix(in srgb, currentColor 12%, transparent);
`;

const Name = Styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;

    img {
        width: 44px;
        height: 36px;
        object-fit: cover;
        border-radius: var(--border-radius);
    }
    span {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
`;

const Ghost = Styled(Name)`
    position: fixed;
    z-index: 1000;
    max-width: 280px;
    padding: 6px 12px 6px 6px;
    color: var(--title-color);
    font-weight: 500;
    background-color: var(--content-color);
    border: var(--media-border-width) solid var(--media-border-color);
    border-radius: var(--media-border-radius);
    box-shadow: var(--box-shadow);
    pointer-events: none;
`;



/**
 * The Media Table Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MediaTable(props) {
    const {
        items, inDialog, canEdit, extraSpace, isSelected, openElem,
        isMoving, dragIndex, dropIndex, movedIndex, ghostStyle,
        onAction, onGrab,
    } = props;


    // Returns the classes of a Row, used to drag and to drop
    const getRowClass = (index) => {
        const result = [ `media-item-${index}` ];
        if (index === movedIndex) {
            result.push("media-hidden");
        }
        if (isMoving && index === dragIndex) {
            result.push("media-moving");
        }
        if (index === dropIndex) {
            result.push("media-target");
        }
        return result.join(" ");
    };

    // Returns the Name, the Type and the Info of the given elem
    const getTitle = (elem) => elem.isBack ? NLS.get("GENERAL_BACK") : elem.name;

    const getType = (elem) => {
        if (elem.isBack) {
            return "";
        }
        if (elem.isDir) {
            return NLS.get("MEDIA_TYPE_DIRECTORY");
        }
        const parts = elem.name.split(".");
        return parts.length > 1 ? parts.pop().toUpperCase() : NLS.get("GENERAL_FILE");
    };

    const getInfo = (elem) => {
        if (elem.isBack) {
            return "";
        }
        if (elem.isDir) {
            return elem.total !== undefined ? NLS.pluralize("MEDIA_AMOUNT", elem.total) : "";
        }
        return elem.size !== undefined ? Utils.formatSize(elem.size) : "";
    };

    const getDate = (elem) => elem.modifiedTime ? DateTime.formatDate(elem.modifiedTime, "dashesHour") : "";

    // Returns the Icon or the image of the given elem
    const getIcon = (elem) => {
        if (openElem === elem) {
            return <Loading variant="primary" isSmall />;
        }
        if (elem.isImage) {
            return <img src={elem.thumb || elem.source} alt={elem.name} />;
        }
        return <IconBox color={elem.color || "var(--media-main-color)"}>
            <Icon icon={elem.icon} size="18" />
        </IconBox>;
    };

    // Handles the Action of the Table, which gives the index of the item
    const handleAction = (action, index) => {
        onAction(action, items[index]);
    };

    // The Back has no actions and the Directories can not be viewed
    const hideAction = (index) => items[index].isBack;
    const hideView   = (index) => items[index].isBack || items[index].isDir;


    // Do the Render
    return <>
        <List
            className={isMoving ? "media-dragging" : ""}
            none="MEDIA_NONE_AVAILABLE"
            onRowClick={(index, e) => onAction(Action.get("SELECT"), items[index], e)}
            inDialog={inDialog}
            extraSpace={extraSpace}
            hasFade
            noSorting
        >
            <TableHead>
                <TableHeader message="GENERAL_NAME"     isTitle isFlex smallSpace />
                <TableHeader message="GENERAL_TYPE"     maxWidth="140" isFlex />
                <TableHeader message="MEDIA_SIZE"       maxWidth="120" isFlex />
                <TableHeader message="GENERAL_MODIFIED" maxWidth="150" isFlex />
            </TableHead>
            <TableBody>
                {items.map((elem, index) => <TableRow
                    key={index}
                    elemID={index}
                    className={getRowClass(index)}
                    isSelected={isSelected(elem)}
                    onMouseDown={(e) => onGrab(e, elem, index)}
                >
                    <TableCell>
                        <Name>
                            {getIcon(elem)}
                            <span>{getTitle(elem)}</span>
                        </Name>
                    </TableCell>
                    <TableCell message={getType(elem)} />
                    <TableCell message={getInfo(elem)} />
                    <TableCell message={getDate(elem)} />
                </TableRow>)}
            </TableBody>
            <TableActionList onAction={handleAction} canEdit={canEdit}>
                <TableAction action="VIEW"   message="GENERAL_VIEW"   hide={hideView}   />
                <TableAction action="EDIT"   message="GENERAL_EDIT"   hide={hideAction} />
                <TableAction action="DELETE" message="GENERAL_DELETE" hide={hideAction} />
            </TableActionList>
        </List>

        {isMoving && <Ghost style={ghostStyle}>
            {getIcon(items[dragIndex])}
            <span>{getTitle(items[dragIndex])}</span>
        </Ghost>}
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MediaTable.propTypes = {
    items      : PropTypes.array.isRequired,
    inDialog   : PropTypes.bool,
    canEdit    : PropTypes.bool,
    extraSpace : PropTypes.number,
    isSelected : PropTypes.func.isRequired,
    openElem   : PropTypes.object,
    isMoving   : PropTypes.bool,
    dragIndex  : PropTypes.number,
    dropIndex  : PropTypes.number,
    movedIndex : PropTypes.number,
    ghostStyle : PropTypes.object,
    onAction   : PropTypes.func,
    onGrab     : PropTypes.func,
};

export default MediaTable;
