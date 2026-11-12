import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import DragDrop             from "./DragDrop";
import Icon                 from "../Common/Icon";
import LinearLoader         from "../Loader/LinearLoader";
import Button               from "../Form/Button";
import PromptDialog         from "../Dialogs/PromptDialog";



// Constants
const MIN_UPLOAD = 1000;

// Styles
const Container = Styled.div.attrs(({ isStacked }) => ({ isStacked }))`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px 24px;
    margin-bottom: 16px;
    padding: 12px 16px;
    color: var(--black-color);
    background-color: var(--dropzone-background);
    border: 1px dashed var(--dropzone-border-color);
    border-radius: var(--dropzone-border-radius, var(--border-radius));
    transition: border-color 0.2s;

    &:hover {
        border-color: var(--primary-color);
    }

    ${(props) => props.isStacked && `
        flex-direction: column;
        gap: 20px;
        min-height: 186px;
        margin-bottom: 0;
        padding: 32px 24px;
        text-align: center;
    `}
`;

const Content = Styled.div.attrs(({ isStacked }) => ({ isStacked }))`
    display: flex;
    align-items: center;
    flex-grow: ${(props) => props.isStacked ? 0 : 2};
    gap: 10px;
    min-width: 0;

    ${(props) => props.isStacked && "flex-direction: column;"}
`;

const UploadIcon = Styled(Icon)`
    flex-shrink: 0;
    font-size: 26px;
    color: var(--primary-color);
`;

const Buttons = Styled.div`
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    gap: 8px;
    flex-wrap: wrap;
`;

const Title = Styled.h3`
    margin: 0;
    font-size: var(--font-size);
    font-weight: 600;
`;

const Text = Styled.p`
    margin: 2px 0 0;
    color: var(--font-lighter);
    font-size: var(--font-size-small);
`;

const Input = Styled.input`
    display: none;
`;

const Info = Styled.div`
    min-width: 0;
`;

const FileName = Styled(Title)`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const Bar = Styled(LinearLoader).attrs(({ isStacked }) => ({ isStacked }))`
    width: 240px;
    max-width: ${(props) => props.isStacked ? "100%" : "40%"};
`;



/**
 * The Drop Zone Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DropZone(props) {
    const {
        isHidden, isSingle, isStacked, withoutDrop, accept, onlyImages, withSVG, maxSize, maxVideoSize, upload,
        onDrop, onError, onUrl,
    } = props;


    // The References
    const containerRef = React.useRef(null);
    const inputRef     = React.useRef(null);
    const heightRef    = React.useRef(0);
    const startRef     = React.useRef(0);
    const timerRef     = React.useRef(null);

    // The Current State
    const [ uploading,  setUploading  ] = React.useState(false);
    const [ showUpload, setShowUpload ] = React.useState(false);
    const [ error,      setError      ] = React.useState("");
    const [ lastUpload, setLastUpload ] = React.useState(null);


    // Handles the Click
    const handleClick = (e) => {
        Utils.triggerClick(inputRef);
    };

    // Sends the valid Files and reports the ones left out
    const sendFiles = (files) => {
        if (upload) {
            return;
        }
        const result   = [];
        const rejected = [];
        for (const file of files) {
            if (Utils.isValidFile(file, onlyImages, maxSize, withSVG, maxVideoSize)) {
                result.push(file);
            } else {
                rejected.push(file);
            }
        }

        if (result.length) {
            onDrop(result);
        }
        if (rejected.length && onError) {
            onError(rejected.length, rejected);
        }
    };

    // Handles the Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const node = inputRef.current;
        sendFiles(e.target.files);
        if (node) {
            node.value = "";
        }
    };

    // Handles the Paste of Files. Only the top Dialog takes it, or the page when there is
    // no Dialog open, whatever has the focus. The copied images are all named the same,
    // so they get the time to not replace each other
    const handlePaste = (e) => {
        const files = Array.from(e.clipboardData?.files || []);
        if (!files.length) {
            return;
        }

        const ownDialog = /** @type {HTMLElement} */ (containerRef.current?.closest(".dialog"));
        const ownLevel  = ownDialog ? Number(ownDialog.dataset.level) : 0;
        const levels    = Array.from(document.querySelectorAll(".dialog"), (node) => Number(/** @type {HTMLElement} */ (node).dataset.level));
        if (ownLevel !== Math.max(0, ...levels)) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        const time = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
        sendFiles(files.map((file) => {
            if (!/^image\.\w+$/.test(file.name)) {
                return file;
            }
            const extension = file.name.split(".").pop();
            return new File([ file ], `image-${time}.${extension}`, { type : file.type });
        }));
    };

    // Listens to the Paste before the editors behind a Dialog can take it
    React.useEffect(() => {
        if (isHidden) {
            return undefined;
        }
        window.addEventListener("paste", handlePaste, true);
        return () => window.removeEventListener("paste", handlePaste, true);
    });

    // The upload stays for a minimum time, as one that ends right away would show the bar and
    // the buttons again in a blink
    React.useEffect(() => {
        if (upload) {
            if (!lastUpload) {
                startRef.current = Date.now();
            }
            Utils.clearTimeout(timerRef);
            setLastUpload(upload);
            return;
        }
        if (!lastUpload) {
            return;
        }
        const elapsed = Date.now() - startRef.current;
        if (elapsed >= MIN_UPLOAD) {
            setLastUpload(null);
        } else {
            Utils.setTimeout(timerRef, () => setLastUpload(null), MIN_UPLOAD - elapsed);
        }
    }, [ upload ]);

    React.useEffect(() => {
        return () => Utils.clearTimeout(timerRef);
    }, []);

    // Keeps the height without the upload, so the bar takes the same space as the buttons
    React.useLayoutEffect(() => {
        if (!upload && !lastUpload && containerRef.current) {
            heightRef.current = containerRef.current.offsetHeight;
        }
    });

    // Handles the Upload Url
    const handleUploadUrl = async (fileUrl, fileName) => {
        if (!onUrl) {
            return;
        }

        setUploading(true);
        setError("");
        try {
            await onUrl(fileUrl, fileName);
            setShowUpload(false);
        } catch (errors) {
            setError(errors.form || errors.fileUrl);
        } finally {
            setUploading(false);
        }
    };

    // Handles the Upload Close
    const handleUploadClose = () => {
        setShowUpload(false);
        setError("");
    };


    // Do the Render
    const current  = upload || lastUpload;
    let   prefix   = onlyImages ? "DROPZONE_IMAGES_" : "DROPZONE_FILES_";
    const percent  = current ? Math.round((current.index + current.progress) / current.total * 100) : 0;
    let   sizeText = NLS.format("DROPZONE_MAX_SIZE", String(maxSize));
    let   amount   = `${percent}%`;

    // The browser only knows of the bytes it sends, so there is nothing to show before the
    // first ones leave and once they arrived, while the server stores the file
    const isProcessing = Boolean(current && current.progress >= 1);
    const isWaiting    = Boolean(current && (current.progress <= 0 || isProcessing));
    if (isWaiting) {
        amount = "";
    }

    if (Number(maxVideoSize) && !onlyImages) {
        sizeText = NLS.format("DROPZONE_MAX_SIZE_VIDEO", String(maxSize), String(maxVideoSize));
    }
    if (current && current.total > 1) {
        amount = `${NLS.format("DROPZONE_UPLOADING_AMOUNT", String(current.index + 1), String(current.total))} · ${percent}%`;
    }
    if (isSingle) {
        prefix = "DROPZONE_FILE_";
    }
    if (isHidden) {
        return <React.Fragment />;
    }
    return <>
        <DragDrop
            isHidden={isHidden || withoutDrop || Boolean(current)}
            onlyImages={onlyImages}
            withSVG={withSVG}
            maxSize={maxSize}
            maxVideoSize={maxVideoSize}
            onDrop={onDrop}
            onError={onError}
        />

        <Container
            ref={containerRef}
            className="dropzone-upload"
            isStacked={isStacked}
            style={current ? { minHeight : heightRef.current } : null}
        >
            {!!current && <>
                <Content isStacked={isStacked}>
                    <UploadIcon icon="upload" />
                    <Info>
                        <FileName>{NLS.format(isProcessing ? "DROPZONE_PROCESSING" : "DROPZONE_UPLOADING", current.name)}</FileName>
                        <Text>{amount}</Text>
                    </Info>
                </Content>
                <Bar
                    isStacked={isStacked}
                    percent={percent}
                    isWaiting={isWaiting}
                />
            </>}

            {!current && <Content isStacked={isStacked}>
                <UploadIcon icon="upload" />
                <div>
                    <Title>{NLS.get(`${prefix}TITLE`)}</Title>
                    {!!Number(maxSize) && <Text>{sizeText}</Text>}
                </div>
            </Content>}
            {!current && <Buttons>
                <Button
                    variant="outlined"
                    icon="upload"
                    message={`${prefix}BUTTON`}
                    onClick={handleClick}
                    inLowerCase
                />
                <Button
                    isHidden={!onUrl}
                    variant="outlined"
                    icon="link"
                    message="MEDIA_UPLOAD_URL_TITLE"
                    onClick={() => setShowUpload(true)}
                    inLowerCase
                />
            </Buttons>}
            <Input
                ref={inputRef}
                type="file"
                accept={accept || (onlyImages ? "image/*" : "")}
                className="dropzone-input"
                onChange={handleSubmit}
                multiple={!isSingle}
            />
        </Container>

        <PromptDialog
            open={showUpload}
            isLoading={uploading}
            icon="link"
            title="MEDIA_UPLOAD_URL_TITLE"
            inputLabel="MEDIA_UPLOAD_URL"
            secInputLabel={isSingle ? "" : "MEDIA_UPLOAD_URL_NAME"}
            secHelperText={isSingle ? "" : "MEDIA_UPLOAD_URL_NAME_TIP"}
            onSubmit={handleUploadUrl}
            onClose={handleUploadClose}
            error={error}
            showError
            isNarrow
            outsideLabel
        />
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DropZone.propTypes = {
    isHidden     : PropTypes.bool,
    isSingle     : PropTypes.bool,
    isStacked    : PropTypes.bool,
    withoutDrop  : PropTypes.bool,
    accept       : PropTypes.string,
    onlyImages   : PropTypes.bool,
    withSVG      : PropTypes.bool,
    maxSize      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxVideoSize : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    upload       : PropTypes.shape({
        name     : PropTypes.string,
        index    : PropTypes.number,
        total    : PropTypes.number,
        progress : PropTypes.number,
    }),
    onDrop       : PropTypes.func.isRequired,
    onError      : PropTypes.func,
    onUrl        : PropTypes.func,
};

export default DropZone;
