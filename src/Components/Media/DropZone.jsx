import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import DragDrop             from "./DragDrop";
import Icon                 from "../Common/Icon";
import Button               from "../Form/Button";
import PromptDialog         from "../Dialogs/PromptDialog";



// Styles
const Container = Styled.div`
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
`;

const Content = Styled.div`
    display: flex;
    align-items: center;
    flex-grow: 2;
    gap: 10px;
    min-width: 0;
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

const Bar = Styled.div`
    flex-shrink: 0;
    width: 240px;
    max-width: 40%;
    height: 8px;
    border-radius: 4px;
    background-color: var(--lighter-gray);
    overflow: hidden;
`;

const Fill = Styled.div`
    height: 100%;
    border-radius: 4px;
    background-color: var(--primary-color);
    transition: width 0.2s;
`;



/**
 * The Drop Zone Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DropZone(props) {
    const {
        isHidden, onlyImages, withSVG, maxSize, maxVideoSize, upload,
        onDrop, onError, onUrl,
    } = props;


    // The References
    const containerRef = React.useRef(null);
    const inputRef     = React.useRef(null);

    // The Current State
    const [ uploading,  setUploading  ] = React.useState(false);
    const [ showUpload, setShowUpload ] = React.useState(false);
    const [ error,      setError      ] = React.useState("");


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

        const ownDialog = containerRef.current?.closest(".dialog");
        const ownLevel  = ownDialog ? Number(ownDialog.dataset.level) : 0;
        const levels    = Array.from(document.querySelectorAll(".dialog"), (node) => Number(node.dataset.level));
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
        } catch (/** @type {object} */ errors) {
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
    const prefix   = onlyImages ? "DROPZONE_IMAGES_" : "DROPZONE_FILES_";
    const percent  = upload ? Math.round((upload.index + upload.progress) / upload.total * 100) : 0;
    let   sizeText = NLS.format("DROPZONE_MAX_SIZE", String(maxSize));
    let   amount   = `${percent}%`;

    if (Number(maxVideoSize) && !onlyImages) {
        sizeText = NLS.format("DROPZONE_MAX_SIZE_VIDEO", String(maxSize), String(maxVideoSize));
    }
    if (upload && upload.total > 1) {
        amount = `${NLS.format("DROPZONE_UPLOADING_AMOUNT", String(upload.index + 1), String(upload.total))} · ${percent}%`;
    }
    if (isHidden) {
        return <React.Fragment />;
    }
    return <>
        <DragDrop
            isHidden={isHidden || Boolean(upload)}
            onlyImages={onlyImages}
            withSVG={withSVG}
            maxSize={maxSize}
            maxVideoSize={maxVideoSize}
            onDrop={onDrop}
            onError={onError}
        />

        <Container ref={containerRef} className="dropzone-upload">
            {!!upload && <>
                <Content>
                    <UploadIcon icon="upload" />
                    <Info>
                        <FileName>{NLS.format("DROPZONE_UPLOADING", upload.name)}</FileName>
                        <Text>{amount}</Text>
                    </Info>
                </Content>
                <Bar>
                    <Fill style={{ width : `${percent}%` }} />
                </Bar>
            </>}

            {!upload && <Content>
                <UploadIcon icon="upload" />
                <div>
                    <Title>{NLS.get(`${prefix}TITLE`)}</Title>
                    {!!Number(maxSize) && <Text>{sizeText}</Text>}
                </div>
            </Content>}
            {!upload && <Buttons>
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
                accept={onlyImages ? "image/*" : ""}
                className="dropzone-input"
                onChange={handleSubmit}
                multiple
            />
        </Container>

        <PromptDialog
            open={showUpload}
            isLoading={uploading}
            icon="link"
            title="MEDIA_UPLOAD_URL_TITLE"
            inputLabel="MEDIA_UPLOAD_URL"
            secInputLabel="MEDIA_UPLOAD_URL_NAME"
            secHelperText="MEDIA_UPLOAD_URL_NAME_TIP"
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
