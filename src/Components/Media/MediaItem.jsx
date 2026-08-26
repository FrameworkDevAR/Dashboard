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
const Div = Styled.div.attrs(({ isSelected, hasActions }) => ({ isSelected, hasActions }))`
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
        border-color: var(--border-color-medium);
        box-shadow: 0 2px 8px rgba(9, 30, 66, 0.08);
    }
    &:hover img {
        transform: scale(1.04);
    }

    ${(props) => props.isSelected && `
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
    `}

    ${(props) => props.hasActions && `
        &:hover .media-name {
            transform: translateY(-20px);
        }
    `}
`;

const MediaElem = Styled.div.attrs(({ isTransparent }) => ({ isTransparent }))`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    background-color: var(--media-elem-background);
    border-bottom: none;
    overflow: hidden;

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

const MediaName = Styled.div`
    position: relative;
    padding: 7px 8px;
    text-align: center;
    font-size: 12px;
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
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 11px;
    color: var(--font-lightest);
`;

const MediaActions = Styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 2px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: var(--media-actions-color);
    border-top: var(--media-border-width) solid var(--media-border-color);
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
    const { isSelected, hasActions, isLoading, onAction, elem, className, style, onMouseDown } = props;
    const { isFile, isImage, isTransparent, icon, source, thumb, name, isDir, isBack, size, total } = elem;

    // Variables
    // The Directories show what they have inside and the Files their size
    const info   = isDir ? (total !== undefined ? NLS.pluralize("MEDIA_AMOUNT", total) : "") :
        (size !== undefined ? Utils.formatSize(size) : "");
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
    return <Div
        className={className}
        style={style}
        isSelected={isSelected}
        hasActions={hasActions}
        onClick={(e) => handleAction(e, select)}
    >
        {isFile && <MediaElem
            className="media-icon"
            onMouseDown={onMouseDown}
        >
            {isLoading ? <Loading variant="primary" isSmall /> : <Icon icon={icon} size="48" />}
        </MediaElem>}

        {isImage && <MediaElem
            className="media-image"
            isTransparent={isTransparent}
            onMouseDown={onMouseDown}
        >
            <Image src={thumb || source} alt={name} />
        </MediaElem>}

        <MediaName className="media-name">
            <Name>{name}</Name>
            {!isBack && !!info && <MediaInfo>{info}</MediaInfo>}
        </MediaName>

        {hasActions && <MediaActions className="media-actions">
            <IconLink
                icon={view.icon}
                onClick={(e) => handleAction(e, view)}
                isTiny
            />
            <IconLink
                icon={edit.icon}
                onClick={(e) => handleAction(e, edit)}
                isTiny
            />
            <IconLink
                icon={remove.icon}
                onClick={(e) => handleAction(e, remove)}
                isTiny
            />
        </MediaActions>}
    </Div>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MediaItem.propTypes = {
    isSelected  : PropTypes.bool,
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
