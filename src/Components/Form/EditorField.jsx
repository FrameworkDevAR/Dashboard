// spell-checker: disable
import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import { Editor }           from "@tinymce/tinymce-react";

// Core
import NLS                  from "../../Core/NLS";
import MediaType            from "../../Core/MediaType";

// Components
import EditorStyles         from "./EditorStyles";
import InputError           from "../Input/InputError";



// Styles
const Container = Styled.div.attrs(({ maxHeight }) => ({ maxHeight }))`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    ${(props) => props.maxHeight && `max-height: ${props.maxHeight}px;`}
`;

const FieldHelper = Styled.p`
    font-size: 0.9em;
    margin: 4px 0 0 4px;
    color: var(--darkest-gray);
`;



/**
 * The Editor Field
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditorField(props) {
    const {
        isHidden, baseUrl, filesUrl,
        name, value, helperText, error, height, maxHeight, language,
        clientID, contentStyle, menubar, menu, toolbar,
        onChange, onMedia, onSetup, isDisabled, isSimple,
    } = props;


    // The Current State
    const [ firstChange, setFirstChange ] = React.useState(true);
    const [ reloading,   setReloading   ] = React.useState(false);


    // Handle the Client change
    React.useEffect(() => {
        setFirstChange(true);
        setReloading(true);
        setTimeout(() => {
            setReloading(false);
        }, 10);
    }, [ clientID ]);


    // Handles the Editor Change
    const handleChange = (newValue) => {
        if (firstChange) {
            setFirstChange(false);
            if (value !== newValue) {
                onChange(name, newValue);
            }
            return;
        }
        onChange(name, newValue);
    };

    // Handles the File Picker
    const handlePicker = (callback, value, meta) => {
        if (isSimple) {
            return;
        }
        if (meta.fileType === "image") {
            onMedia(MediaType.IMAGE, callback);
        } else if (meta.fileType === "media") {
            onMedia(MediaType.MEDIA, callback);
        } else {
            onMedia(MediaType.ANY, callback);
        }
    };


    // Variables
    const hasError      = Boolean(error);
    const hasHelperText = !hasError && Boolean(helperText);


    // Do the Render
    if (isHidden || reloading) {
        return <React.Fragment />;
    }
    return <Container
        className={error ? "editorfield-error" : ""}
        maxHeight={maxHeight}
    >
        <EditorStyles />
        <Editor
            tinymceScriptSrc={`${baseUrl}/tinymce/tinymce.min.js`}
            onEditorChange={handleChange}
            value={value}
            init={{
                document_base_url    : filesUrl,
                readonly             : isDisabled,
                height               : height,
                menu                 : menu,
                language             : language,
                resize               : false,
                statusbar            : false,
                convert_urls         : false,
                menubar              : isSimple ? "" : `edit insert view format table tools ${menubar}`,
                toolbar              : isSimple ? `
                    undo redo | bold italic underline | link ${toolbar ? `| ${toolbar}` : ""}
                ` : `
                    undo redo | blocks |
                    bold italic forecolor |
                    alignleft aligncenter alignright |
                    bullist numlist outdent indent |
                    image link removeformat fullscreen
                `,
                plugins              : [
                    "advlist", "autolink", "lists", "link", "image", "media", "charmap",
                    "anchor", "searchreplace", "visualblocks", "code",
                    "insertdatetime", "media", "table", "wordcount", "fullscreen", "preview",
                ],
                content_style        : `
                    body { font-family:Inter,Lato,Helvetica,Arial,sans-serif; font-size:14px; max-width: 800px; padding: 0 24px; margin: 0 auto; }
                    ${contentStyle}
                `,
                file_picker_callback : handlePicker,
                setup                : (editor) => {
                    if (onSetup) {
                        onSetup(editor);
                    }
                },
            }}
        />
        <InputError error={error} />
        {hasHelperText && <FieldHelper>
            {NLS.get(helperText)}
        </FieldHelper>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditorField.propTypes = {
    isHidden     : PropTypes.bool,
    baseUrl      : PropTypes.string.isRequired,
    filesUrl     : PropTypes.string.isRequired,
    name         : PropTypes.string.isRequired,
    value        : PropTypes.string,
    helperText   : PropTypes.string,
    error        : PropTypes.string,
    height       : PropTypes.number,
    maxHeight    : PropTypes.number,
    language     : PropTypes.string,
    clientID     : PropTypes.number,
    contentStyle : PropTypes.string,
    menubar      : PropTypes.string,
    toolbar      : PropTypes.string,
    menu         : PropTypes.object,
    onChange     : PropTypes.func.isRequired,
    onMedia      : PropTypes.func,
    onSetup      : PropTypes.func,
    isDisabled   : PropTypes.bool,
    isSimple     : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EditorField.defaultProps = {
    isHidden     : false,
    value        : "",
    height       : 600,
    language     : "es",
    clientID     : 0,
    contentStyle : "",
    menubar      : "",
    toolbar      : "",
    isDisabled   : false,
    isSimple     : false,
};

export default EditorField;
