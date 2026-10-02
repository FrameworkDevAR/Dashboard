import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";



// Styles
const Container = Styled.div.attrs(({ isUploading }) => ({ isUploading }))`
    display: ${(props)=> props.isUploading ? "flex" : "none"};
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 32px;
    color: white;
    background-color: var(--drop-color);
    z-index: var(--z-dropzone);
`;



/**
 * The Drag Drop Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DragDrop(props) {
    const { isHidden, message, onlyImages, withSVG, maxSize, onDrop, onError } = props;


    // The References
    const containerRef = React.useRef(null);

    // The Current State
    const [ isUploading, setUploading ] = React.useState(false);


    // Returns true if there is a File
    const containsFiles = (e) => {
        if (e.dataTransfer.types) {
            for (const type of e.dataTransfer.types) {
                if (type === "Files") {
                    return true;
                }
            }
        }
        return false;
    };


    // Starts a Drop
    const startDrop = (e) => {
        if (containsFiles(e)) {
            setUploading(true);
        }
    };

    // Ends a Drop
    const endDrop = (e) => {
        setUploading(false);
    };

    // Allows Dragging
    const allowDrag = (e) => {
        e.dataTransfer.dropEffect = "copy";
        e.preventDefault();
    };

    // Handles the Drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files      = [];
        let   totalFiles = 0;

        // Use DataTransferItemList interface to access the file(s)
        if (e.dataTransfer.items) {
            totalFiles = e.dataTransfer.items.length;
            for (const item of e.dataTransfer.items) {
                if (item.kind === "file" && Utils.isValidFile(item, onlyImages, maxSize, withSVG)) {
                    const file = item.getAsFile();
                    files.push(file);
                }
            }
        }

        // Use DataTransfer interface to access the file(s)
        if (!files.length) {
            totalFiles = e.dataTransfer.files.length;
            for (const file of e.dataTransfer.files) {
                if (Utils.isValidFile(file, onlyImages, maxSize, withSVG)) {
                    files.push(file);
                }
            }
        }

        if (files.length) {
            onDrop(files);
        }
        if (totalFiles !== files.length && onError) {
            onError(totalFiles - files.length);
        }

        endDrop();
    };


    // Adds the Listeners
    React.useEffect(() => {
        window.addEventListener("dragenter", startDrop);
        if (containerRef.current) {
            const node = containerRef.current;
            node.addEventListener("dragenter", allowDrag);
            node.addEventListener("dragover",  allowDrag);
            node.addEventListener("dragleave", endDrop);
            node.addEventListener("drop",      handleDrop);
        }

        return () => {
            window.removeEventListener("dragenter", startDrop);
            if (containerRef.current) {
                const node = containerRef.current;
                node.removeEventListener("dragenter", allowDrag);
                node.removeEventListener("dragover",  allowDrag);
                node.removeEventListener("dragleave", endDrop);
                node.removeEventListener("drop",      handleDrop);
            }
        };
    });


    // Generate the Text
    const text = React.useMemo(() => {
        if (message) {
            return NLS.get(message);
        }
        return onlyImages ? NLS.get("DROPZONE_IMAGES_DROP") : NLS.get("DROPZONE_FILES_DROP");
    }, [ message, onlyImages ]);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={containerRef}
        isUploading={isUploading}
    >
        {NLS.get(text)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DragDrop.propTypes = {
    isHidden   : PropTypes.bool,
    message    : PropTypes.string,
    onlyImages : PropTypes.bool,
    withSVG    : PropTypes.bool,
    maxSize    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onDrop     : PropTypes.func.isRequired,
    onError    : PropTypes.func,
};

export default DragDrop;
