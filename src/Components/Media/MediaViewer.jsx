import React                from "react";
import ReactDOM             from "react-dom";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import Icon                 from "../Common/Icon";
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    font-family: var(--main-font);
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(12px);
    z-index: var(--z-preview);
`;

const Header = Styled.header`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding: 12px 16px 12px 24px;
    color: var(--white-color);
`;

const Name = Styled.div`
    flex-shrink: 0;
    max-width: 100%;
    font-size: 14px;
    color: var(--white-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Amount = Styled.div`
    flex-shrink: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
`;

const Actions = Styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Content = Styled.div`
    position: relative;
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 0;
    padding: 0 96px 24px;
`;

const Arrow = Styled.div.attrs(({ isNext }) => ({ isNext }))`
    position: absolute;
    top: 50%;
    ${(props) => props.isNext ? "right: 24px;" : "left: 24px;"}
    transform: translateY(-50%);
`;

const Image = Styled.img`
    min-height: 0;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
`;

const Video = Styled.video`
    min-height: 0;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
`;

const Audio = Styled.audio`
    width: 480px;
    max-width: 100%;
`;

const Frame = Styled.iframe`
    flex-grow: 2;
    width: 1000px;
    max-width: 100%;
    min-height: 0;
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--white-color);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
`;

const FileCard = Styled.a`
    display: flex;
    align-items: center;
    gap: 16px;
    width: 480px;
    max-width: 100%;
    padding: 12px 24px 12px 12px;
    box-sizing: border-box;
    color: var(--white-color);
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: var(--border-radius-big);
    background-color: rgba(255, 255, 255, 0.08);
    transition: background-color 0.2s, border-color 0.2s;

    &:hover {
        border-color: rgba(255, 255, 255, 0.28);
        background-color: rgba(255, 255, 255, 0.14);
    }
`;

const FileIcon = Styled.div.attrs(({ color }) => ({ color }))`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: var(--border-radius);
    color: ${(props) => props.color};
    background-color: color-mix(in srgb, ${(props) => props.color} 18%, transparent);
`;

const FileTexts = Styled.div`
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    line-height: 1.3;
`;

const FileName = Styled.span`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 15px;
    font-weight: 600;
`;

const FileInfo = Styled.span`
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
`;



/**
 * The Media Viewer
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MediaViewer(props) {
    const { open, images, index, onClose } = props;

    // The Current State
    const [ current, setCurrent ] = React.useState(index);

    // Returns the given index inside the Images, as the last one goes back to the first
    const getIndex = (value) => (value + images.length) % images.length;


    // Starts at the Image that was opened
    React.useEffect(() => {
        setCurrent(index);
    }, [ open, index ]);

    // The keys move between the Images and close the viewer. They are caught before the
    // rest of the page, which would close the dialog or the details under it
    React.useEffect(() => {
        if (!open) {
            return undefined;
        }
        const handleKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                setCurrent((value) => getIndex(value - 1));
            } else if (e.key === "ArrowRight") {
                setCurrent((value) => getIndex(value + 1));
            } else {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        };
        window.addEventListener("keydown", handleKey, true);
        return () => window.removeEventListener("keydown", handleKey, true);
    }, [ open, images.length ]);

    // Handles the Click on an Arrow
    const handleMove = (amount) => {
        setCurrent(getIndex(current + amount));
    };

    // Handles the Click outside of the Image and the buttons, which closes the viewer
    const handleClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Returns the type of the given File, from its extension, and its size
    const getFileInfo = (file) => {
        const parts     = String(file.name).split(".");
        const extension = parts.length > 1 ? parts.pop().toUpperCase() : "";
        const size      = file.size ? Utils.formatSize(file.size) : "";
        return [ extension, size ].filter(Boolean).join(" · ");
    };


    // Do the Render
    const image = images[current];
    if (!open || !image) {
        return null;
    }
    const hasMany = images.length > 1;

    return ReactDOM.createPortal(<Container onClick={handleClick}>
        <Header onClick={handleClick}>
            {hasMany && <Amount>{`${current + 1} / ${images.length}`}</Amount>}
            <Actions>
                <IconLink
                    variant="white"
                    icon="link"
                    tooltip="GENERAL_OPEN"
                    href={image.url}
                    target="_blank"
                />
                <IconLink
                    variant="white"
                    icon="close"
                    tooltip="GENERAL_CLOSE"
                    onClick={onClose}
                />
            </Actions>
        </Header>

        <Content onClick={handleClick}>
            {hasMany && <Arrow>
                <IconLink
                    variant="white"
                    icon={current === 0 ? "restart" : "prev"}
                    tooltip="GENERAL_PREV"
                    onClick={() => handleMove(-1)}
                    size="48"
                />
            </Arrow>}
            {image.isVideo && <Video
                key={image.url}
                src={image.url}
                controls
            />}
            {image.isAudio && <Audio
                key={image.url}
                src={image.url}
                controls
            />}
            {image.isPDF && <Frame
                key={image.url}
                src={image.url}
                title={image.name}
            />}
            {image.isText && <Frame
                key={image.url}
                src={image.url}
                title={image.name}
                sandbox=""
            />}
            {image.isFile && <FileCard href={image.url} target="_blank" rel="noopener">
                <FileIcon color={image.color || "var(--white-color)"}>
                    <Icon icon={image.icon || "file"} size="32" />
                </FileIcon>
                <FileTexts>
                    <FileName>{image.name}</FileName>
                    <FileInfo>{getFileInfo(image)}</FileInfo>
                </FileTexts>
            </FileCard>}
            {!image.isVideo && !image.isAudio && !image.isPDF && !image.isText && !image.isFile && <Image
                src={image.url}
                alt={image.name}
            />}
            {!image.isFile && <Name>{image.name}</Name>}
            {hasMany && <Arrow isNext>
                <IconLink
                    variant="white"
                    icon={current === images.length - 1 ? "restart" : "next"}
                    tooltip="GENERAL_NEXT"
                    onClick={() => handleMove(1)}
                    size="48"
                />
            </Arrow>}
        </Content>
    </Container>, document.body);
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MediaViewer.propTypes = {
    open    : PropTypes.bool.isRequired,
    images  : PropTypes.array.isRequired,
    index   : PropTypes.number,
    onClose : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MediaViewer.defaultProps = {
    index : 0,
};

export default MediaViewer;
