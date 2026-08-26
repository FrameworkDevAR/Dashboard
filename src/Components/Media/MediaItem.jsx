import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Action               from "../../Core/Action";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import Icon                 from "../Common/Icon";
import IconLink             from "../Link/IconLink";
import CircularLoader       from "../Loader/CircularLoader";



// Styles
const Div = Styled.div.attrs(({ isSelected, isTarget, isMoving, hasActions }) => ({ isSelected, isTarget, isMoving, hasActions }))`
    position: relative;
    display: flex;
    flex-direction: column;
    border: var(--media-border-width) solid var(--media-border-color);
    border-radius: var(--media-border-radius, var(--border-radius));
    background-color: var(--media-background, var(--white-color));
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: var(--input-border-hover);
    }
    &:hover img {
        transform: scale(1.04);
    }
    &:hover .media-icon .icon {
        transform: scale(1.08);
    }

    ${(props) => props.isSelected && `
        border-color: var(--input-border-focus);
        box-shadow: var(--input-border-shadow);
    `}

    ${(props) => props.isTarget && `
        border-color: var(--primary-color);
        background-color: var(--accent-light);

        .media-icon, .media-image {
            background-color: var(--accent-light);
        }
    `}

    ${(props) => props.isMoving && `
        transition: none;
        opacity: 0.9;
        box-shadow: 0 6px 16px rgba(9, 30, 66, 0.2);
    `}

    ${(props) => props.hasActions && `
        &:hover .media-actions {
            visibility: visible;
            opacity: 1;
            transform: translateY(0);
        }
    `}
`;

const MediaElem = Styled.div.attrs(({ isTransparent }) => ({ isTransparent }))`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: var(--media-item-height, 130px);
    background-color: var(--media-elem-background);
    border-bottom: none;
    overflow: hidden;

    .icon {
        transition: transform 0.2s;
    }

    img {
        display: block;
        margin: 0 auto;
        max-width: calc(100% - 12px);
        max-height: calc(100% - 12px);
        border-radius: var(--border-radius);
    }

    ${(props) => props.isTransparent && `
        background-color: var(--media-trans-light);
        background-size: 20px 20px;
        background-position: 0 0, 10px 10px;
        background-image: linear-gradient(45deg, var(--media-trans-dark) 25%, transparent 25%, transparent 75%, var(--media-trans-dark) 75%, var(--media-trans-dark)),
                          linear-gradient(45deg, var(--media-trans-dark) 25%, transparent 25%, transparent 75%, var(--media-trans-dark) 75%, var(--media-trans-dark));
    `}
`;

const FileIcon = Styled(Icon).attrs(({ iconColor }) => ({ iconColor }))`
    color: ${(props) => props.iconColor};
`;

const MediaName = Styled.div`
    position: relative;
    padding: 7px 8px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: var(--font-light);
    background-color: var(--media-name-color);
    border-top: var(--media-border-width) solid var(--media-border-color);
    transition: all 0.2s;
    z-index: 1;
`;

const Name = Styled.div`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const MediaInfo = Styled.div`
    padding-top: 2px;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 11px;
    color: var(--font-lightest);
`;

const MediaActions = Styled.div`
    position: absolute;
    top: 6px;
    right: 6px;
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 2px;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-4px);
    background-color: var(--media-actions-color);
    border: var(--media-border-width) solid var(--media-border-color);
    border-radius: var(--border-radius);
    box-shadow: 0 1px 4px rgba(9, 30, 66, 0.12);
    transition: all 0.2s;
    z-index: 2;
`;

const Image = Styled.img`
    pointer-events: none;
    transition: transform 0.2s;
`;

const Loading = Styled(CircularLoader)`
    padding: 0;
`;



/**
 * The Media Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MediaItem(props) {
    const {
        isHidden, isSelected, isTarget, isMoving, hasActions, isLoading,
        onAction, elem, className, style, onMouseDown,
    } = props;
    const { isFile, isImage, isTransparent, icon, color, source, thumb, name, isDir, isBack, size, total } = elem;

    // Variables
    // The Directories show what they have inside and the Files their size
    // The Back says the Directory that it returns to
    const parent = elem.path ? elem.path.split("/").pop() : NLS.get("GENERAL_START");
    const title  = isBack ? NLS.get("GENERAL_BACK") : name;
    const info   = isBack ? parent : (isDir ?
        (total !== undefined ? NLS.pluralize("MEDIA_AMOUNT", total) : "") :
        (size !== undefined ? Utils.formatSize(size) : ""));
    const select = Action.get("SELECT");
    const view   = Action.get("VIEW");
    const edit   = Action.get("EDIT");
    const remove = Action.get("DELETE");


    // Handles the Action
    const handleAction = (e, action) => {
        if (onAction) {
            onAction(action, elem, e);
        }
        e.stopPropagation();
        e.preventDefault();
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Div
        className={className}
        style={style}
        isSelected={isSelected}
        isTarget={isTarget}
        isMoving={isMoving}
        hasActions={hasActions}
        onClick={(e) => handleAction(e, select)}
    >
        {isFile && <MediaElem
            className="media-icon"
            onMouseDown={onMouseDown}
        >
            {isLoading ? <Loading variant="primary" isSmall /> : <FileIcon
                icon={icon}
                iconColor={color || "var(--media-main-color)"}
                size="48"
            />}
        </MediaElem>}

        {isImage && <MediaElem
            className="media-image"
            isTransparent={isTransparent}
            onMouseDown={onMouseDown}
        >
            <Image src={thumb || source} alt={name} />
        </MediaElem>}

        <MediaName className="media-name">
            <Name>{title}</Name>
            {!!info && <MediaInfo>{info}</MediaInfo>}
        </MediaName>

        {hasActions && <MediaActions className="media-actions">
            <IconLink
                isHidden={isDir}
                icon={view.icon}
                tooltip={view.message}
                onClick={(e) => handleAction(e, view)}
                isSmall
            />
            <IconLink
                icon={edit.icon}
                tooltip={edit.message}
                onClick={(e) => handleAction(e, edit)}
                isSmall
            />
            <IconLink
                variant="error"
                icon={remove.icon}
                tooltip={remove.message}
                onClick={(e) => handleAction(e, remove)}
                isSmall
            />
        </MediaActions>}
    </Div>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MediaItem.propTypes = {
    isHidden    : PropTypes.bool,
    isSelected  : PropTypes.bool,
    isTarget    : PropTypes.bool,
    isMoving    : PropTypes.bool,
    hasActions  : PropTypes.bool,
    isLoading   : PropTypes.bool,
    elem        : PropTypes.object,
    className   : PropTypes.string,
    style       : PropTypes.object,
    onAction    : PropTypes.func,
    onMouseDown : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MediaItem.defaultProps = {
    className : "",
};

export default MediaItem;
