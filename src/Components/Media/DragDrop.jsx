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
    const {
        isHidden, message, onlyImages, withSVG, maxSize, maxVideoSize,
        onDrop, onError,
    } = props;


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

    // Handles the Drop. The Files are read from the list of Files, as the items of the
    // transfer have no size to check
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files    = [];
        const rejected = [];

        for (const file of e.dataTransfer.files) {
            if (Utils.isValidFile(file, onlyImages, maxSize, withSVG, maxVideoSize)) {
                files.push(file);
            } else {
                rejected.push(file);
            }
        }

        if (files.length) {
            onDrop(files);
        }
        if (rejected.length && onError) {
            onError(rejected.length, rejected);
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
    isHidden     : PropTypes.bool,
    message      : PropTypes.string,
    onlyImages   : PropTypes.bool,
    withSVG      : PropTypes.bool,
    maxSize      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxVideoSize : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onDrop       : PropTypes.func.isRequired,
    onError      : PropTypes.func,
};

export default DragDrop;
