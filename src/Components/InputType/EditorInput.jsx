// spell-checker: ignore autolink
import React                from "react";
import PropTypes            from "prop-types";
import Styled, { keyframes } from "styled-components";
import { Editor }           from "@tinymce/tinymce-react";

// Core & Utils
import MediaType            from "../../Core/MediaType";
import Navigate             from "../../Core/Navigate";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import EditorStyles         from "../Form/EditorStyles";
import Icon                 from "../Common/Icon";
import IconLink             from "../Link/IconLink";
import Menu                 from "../Menu/Menu";
import MenuItem             from "../Menu/MenuItem";
import EditorColors         from "./EditorColors";
import EditorLink           from "./EditorLink";
import EditorVariables      from "./EditorVariables";
import EditorTable          from "./EditorTable";



// Constants
const LINE_HEIGHT = 20;
const COLORS      = [
    {
        key     : "color",
        icon    : "format-color",
        tooltip : "GENERAL_FORMAT_COLOR",
        command : "ForeColor",
        format  : "forecolor",
        style   : "color",
    },
    {
        key     : "highlight",
        icon    : "format-highlight",
        tooltip : "GENERAL_FORMAT_HIGHLIGHT",
        command : "HiliteColor",
        format  : "hilitecolor",
        style   : "backgroundColor",
    },
];
const SIZES = [ 10, 12, 14, 16, 18, 20, 22, 24, 36, 48 ];
const ALIGNS = [
    { key : "alignleft",    icon : "align-left",    message : "GENERAL_FORMAT_ALIGN_LEFT",    command : "JustifyLeft"   },
    { key : "aligncenter",  icon : "align-center",  message : "GENERAL_FORMAT_ALIGN_CENTER",  command : "JustifyCenter" },
    { key : "alignright",   icon : "align-right",   message : "GENERAL_FORMAT_ALIGN_RIGHT",   command : "JustifyRight"  },
    { key : "alignjustify", icon : "align-justify", message : "GENERAL_FORMAT_ALIGN_JUSTIFY", command : "JustifyFull"   },
];
const INDENTS = [
    { key : "outdent", icon : "outdent", tooltip : "GENERAL_FORMAT_OUTDENT", command : "Outdent" },
    { key : "indent",  icon : "indent",  tooltip : "GENERAL_FORMAT_INDENT",  command : "Indent"  },
];
const IMAGE_SRC   = /(<img[^>]*?\ssrc=["'])([^"']+)/gi;
const IMAGE_FILE  = /\.(png|jpe?g|gif|bmp|webp|svg)$/i;
const FORMATS     = [
    { key : "bold",      icon : "bold",      tooltip : "GENERAL_FORMAT_BOLD",      command : "Bold"      },
    { key : "italic",    icon : "italic",    tooltip : "GENERAL_FORMAT_ITALIC",    command : "Italic"    },
    { key : "underline", icon : "underline", tooltip : "GENERAL_FORMAT_UNDERLINE", command : "Underline" },
];
const LISTS = [
    {
        key     : "list",
        icon    : "list",
        tooltip : "GENERAL_FORMAT_LIST",
        command : "InsertUnorderedList",
        styles  : [
            { key : "disc",   message : "GENERAL_FORMAT_LIST_DISC"   },
            { key : "circle", message : "GENERAL_FORMAT_LIST_CIRCLE" },
            { key : "square", message : "GENERAL_FORMAT_LIST_SQUARE" },
        ],
    },
    {
        key     : "number",
        icon    : "list-number",
        tooltip : "GENERAL_FORMAT_LIST_NUMBER",
        command : "InsertOrderedList",
        styles  : [
            { key : "decimal",     message : "GENERAL_FORMAT_LIST_DECIMAL" },
            { key : "lower-alpha", message : "GENERAL_FORMAT_LIST_ALPHA"   },
            { key : "lower-roman", message : "GENERAL_FORMAT_LIST_ROMAN"   },
        ],
    },
];

// The patterns of the editor, which are its default ones and the three dashes of a line, as
// giving them replaces the defaults
const TEXT_PATTERNS = [
    { start : "*",      end : "*",  format : "italic" },
    { start : "**",     end : "**", format : "bold" },
    { start : "`",      end : "`",  format : "code" },
    { start : "#",      format : "h1" },
    { start : "##",     format : "h2" },
    { start : "###",    format : "h3" },
    { start : "####",   format : "h4" },
    { start : "#####",  format : "h5" },
    { start : "######", format : "h6" },
    { start : ">",      format : "blockquote" },
    { start : "1. ",    cmd : "InsertOrderedList" },
    { start : "* ",     cmd : "InsertUnorderedList" },
    { start : "- ",     cmd : "InsertUnorderedList" },
    { start : "---",    replacement : "<hr>" },
];

// A list of tasks is a list with a class, where the items that are done have another one.
// The box of each item is drawn before it, in a space of this width at its left
const CHECK_LIST  = "task-list";
const CHECK_DONE  = "task-done";
const CHECK_WIDTH = 24;
const CHECK_REGEX = /^\[( |x|X)?\] $/;

// Styles
const Container = Styled(InputContent).attrs(({ isOpen, lift }) => ({ isOpen, lift }))`
    --editor-toolbar-height: 36px;
    position: relative;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0;

    ${(props) => props.isOpen && `
        z-index: 3;
        margin-top: -${props.lift}px;
    `}
`;

const Content = Styled.div.attrs(({ centerImages, minHeight, maxHeight }) => ({ centerImages, minHeight, maxHeight }))`
    box-sizing: border-box;
    width: 100%;
    cursor: text;

    ${(props) => props.maxHeight > 0 && `
        max-height: ${props.maxHeight}px;
        overflow-y: auto;
    `}

    .mce-content-body {
        min-height: calc(${(props) => props.minHeight}px + var(--editor-padding-y, 8px) * 2);
        padding: var(--editor-padding-y, 8px) var(--editor-padding-x, var(--input-horiz-padding, 12px));
        font-size: var(--input-font);
        line-height: 1.5;
        color: var(--font-color);
        overflow-wrap: anywhere;
    }
    .mce-content-body:focus {
        outline: none;
    }
    .mce-content-body[data-mce-placeholder]::before {
        top: var(--editor-padding-y, 8px) !important;
        left: var(--editor-padding-x, var(--input-horiz-padding, 12px)) !important;
        color: var(--darkest-gray) !important;
    }

    .mce-content-body {
        h1, h2, h3, h4 {
            margin: 12px 0 4px;
            font-weight: 600;
            line-height: 1.3;
            color: var(--title-color);
        }
        h1 {
            font-size: 16px;
        }
        h2 {
            font-size: 15px;
        }
        h3, h4 {
            font-size: 14px;
        }
        p, ul, ol, table, pre, blockquote {
            margin: 0 0 var(--editor-spacing, 12px);
        }
        ul, ol {
            padding-left: 22px;
        }
        ul.${CHECK_LIST} {
            padding-left: 2px;
            list-style: none;
        }
        ul.${CHECK_LIST} > li {
            position: relative;
            padding-left: ${CHECK_WIDTH}px;
        }
        ul.${CHECK_LIST} > li::before {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            box-sizing: border-box;
            width: 15px;
            height: 15px;
            border: 1.5px solid var(--darkest-gray);
            border-radius: 4px;
            cursor: pointer;
        }
        ul.${CHECK_LIST} > li.${CHECK_DONE}::before {
            border-color: var(--primary-color);
            background: var(--primary-color) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-6.5' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 12px no-repeat;
        }
        ul.${CHECK_LIST} > li.${CHECK_DONE} {
            color: var(--font-lighter);
        }
        a:not([contenteditable="false"]) {
            color: var(--editor-link-color, var(--primary-color));
            text-decoration: none;
            border-radius: var(--border-radius-small);
            transition: color 0.2s, background-color 0.2s;
        }
        a:not([contenteditable="false"]):hover {
            color: color-mix(in srgb, var(--editor-link-color, var(--primary-color)) 80%, var(--black-color));
            text-decoration: underline;
            background-color: color-mix(in srgb, var(--editor-link-color, var(--primary-color)) 8%, transparent);
        }
        table {
            border-collapse: collapse;
        }
        th, td {
            padding: 4px 8px;
            border: 1px solid var(--border-color-light);
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: var(--border-radius-medium);
        }
        img[data-mce-selected] {
            outline: 2px solid var(--primary-color);
            outline-offset: -2px;
        }
        pre, code {
            font-family: monospace;
            font-size: 12px;
            background-color: var(--lighter-gray);
            border-radius: var(--border-radius-small);
        }
        pre {
            padding: 8px 10px;
            white-space: pre-wrap;
        }
        code {
            padding: 1px 4px;
        }
        blockquote {
            padding-left: 12px;
            border-left: 3px solid var(--border-color-medium);
        }
        hr {
            margin: calc((1.5em - 1px) / 2 + var(--editor-spacing, 12px)) 0;
            border: none;
            border-top: 1px solid var(--border-color-medium);
        }
        > :first-child {
            margin-top: 0;
        }
        > :last-child {
            margin-bottom: 0;
        }
    }

    ${(props) => props.centerImages && `
        .mce-content-body img {
            display: block;
            margin: 8px auto;
        }
        .mce-content-body img[data-mce-selected] {
            outline: none;
        }
    `}
`;

const Toolbar = Styled.div`
    position: sticky;
    top: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    min-height: var(--editor-toolbar-height);
    padding: 0 6px;
    background-color: var(--content-color);
    border-radius: var(--border-radius);
    z-index: 1;
`;

const Line = Styled.div`
    flex: none;
    width: 1px;
    height: 20px;
    margin: 0 2px;
    background-color: var(--border-color-light);
`;

const Block = Styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 2px 0 6px;
    font-family: inherit;
    font-size: 12px;
    color: var(--black-color);
    background-color: transparent;
    border: none;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--lighter-gray);
    }
    .icon {
        font-size: 16px;
    }
`;

const BlockNames = Styled.span`
    display: grid;
    text-align: left;
`;

const BlockName = Styled.span.attrs(({ isHidden }) => ({ isHidden }))`
    grid-area: 1 / 1;
    visibility: ${(props) => props.isHidden ? "hidden" : "visible"};
`;

const Action = Styled(IconLink).attrs(({ isActive }) => ({ isActive }))`
    && {
        --link-color: ${(props) => props.isActive ? "var(--primary-color)" : "var(--black-color)"};
        background-color: ${(props) => props.isActive ? "var(--lighter-gray)" : "transparent"};
    }
    &&:hover {
        background-color: var(--lighter-gray);
    }
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
`;

const Resize = Styled.div`
    position: absolute;
    pointer-events: none;
    z-index: 1;
`;

const ResizeHandle = Styled.div.attrs(({ isLeft }) => ({ isLeft }))`
    position: absolute;
    top: 50%;
    ${(props) => props.isLeft ? "left: 3px;" : "right: 3px;"}
    box-sizing: border-box;
    width: 8px;
    height: min(56px, 40%);
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.55);
    border: 2px solid var(--white-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    cursor: ew-resize;
    pointer-events: auto;
    animation: ${fadeIn} 0.15s ease-in;
    transition: background-color 0.15s, transform 0.15s;

    &:hover {
        background-color: var(--primary-color);
        transform: translateY(-50%) scaleY(1.1);
    }
`;

const FileInput = Styled.input`
    display: none;
`;



/**
 * The Editor Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditorInput(props) {
    const {
        inputRef, className, isFocused, isDisabled, centerImages, fixedToolbar, withLabel,
        name, value, placeholder, rows, maxRows, titles, filesUrl, variables, init,
        toolbar, outsideLabel,
        onChange, onFocus, onBlur, onMedia, onUpload, onInit, onKeyUp, onKeyDown, onMouseDown,
    } = props;


    // The buttons of the Toolbar that are shown
    const has = (key) => toolbar.includes(key);


    // The References
    const editorRef = React.useRef(null);
    const boxRef    = React.useRef(null);
    const blockRef  = React.useRef(null);
    const listRef   = React.useRef(null);
    const numberRef = React.useRef(null);
    const tableRef  = React.useRef(null);
    const alignRef  = React.useRef(null);
    const sizeRef   = React.useRef(null);
    const fileRef   = React.useRef(null);
    const uploadRef = React.useRef(null);
    const barRef    = React.useRef(null);
    const varRef    = React.useRef(null);
    const markRef   = React.useRef(null);
    const colorRefs = { color : React.useRef(null), highlight : React.useRef(null) };
    const resizeRef = React.useRef({ image : null, isDragging : false });
    const touchRef  = React.useRef(false);
    const sentRef   = React.useRef(null);

    // The Current State
    const [ active, setActive ] = React.useState(/** @type {{ [key: string]: any }} */ ({}));
    const [ menu,   setMenu   ] = React.useState("");
    const [ lift,   setLift   ] = React.useState(0);
    const [ resize, setResize ] = React.useState(null);
    const [ link,   setLink   ] = React.useState({ url : "", text : "", target : "_blank", isEdit : false });


    // The Blocks are the paragraph, the titles that are allowed, which are numbered in their
    // order, as a title is called the same whatever its level is, and the quote and the code
    const blocks = [
        { key : "p", icon : "format-paragraph", message : NLS.get("GENERAL_FORMAT_PARAGRAPH") },
        ...titles.map((key, index) => ({
            key,
            icon    : index < 3 ? `format-h${index + 1}` : "",
            message : NLS.format("GENERAL_FORMAT_TITLE", index + 1),
        })),
    ];
    if (has("quote")) {
        blocks.push({ key : "blockquote", icon : "blockquote", message : NLS.get("GENERAL_FORMAT_QUOTE") });
    }
    if (has("code")) {
        blocks.push({ key : "pre", icon : "code-block", message : NLS.get("GENERAL_FORMAT_CODE") });
    }

    const formats = has("format") ? [ ...FORMATS ] : [];
    if (has("code")) {
        formats.push({ key : "code", icon : "code", tooltip : "GENERAL_FORMAT_CODE", command : "mceToggleFormat", value : "code" });
    }


    // Handles the Init, which gives the body to the Input, so the label can focus it
    const handleInit = (e, editor) => {
        editorRef.current = editor;
        if (inputRef) {
            inputRef.current = editor.getBody();
        }

        // The editor rewrites the html that it is given, and reports it as a change when it loads
        // it, so the changes are only sent once the user edits the text. Focusing it runs a
        // command too, which does not edit it
        editor.on("input keydown paste cut drop Undo Redo ExecCommand", (e) => {
            if (e.type === "execcommand" && e.command === "mceFocus") {
                return;
            }
            touchRef.current = true;
        });

        // The shortcut of the links opens the dialog of the Link instead of the one of the editor
        editor.addShortcut("meta+k", "", () => openLink());

        // The item that the Enter adds after one that is done starts as not done
        if (has("check")) {
            editor.on("NewBlock", ({ newBlock }) => editor.dom.removeClass(newBlock, CHECK_DONE));
        }
        if (onInit) {
            onInit(editor);
        }
    };

    // The images are saved without the url of the Files, which is added to show them
    const shownValue = React.useMemo(() => {
        if (!filesUrl) {
            return value;
        }
        return value.replace(IMAGE_SRC, (match, start, src) => (
            /^(https?:)?\/\/|^data:/i.test(src) ? match : `${start}${filesUrl}${src}`
        ));
    }, [ value, filesUrl ]);

    // Handles the Change
    const handleChange = (content) => {
        let newValue = content;
        if (filesUrl) {
            newValue = content.replace(IMAGE_SRC, (match, start, src) => (
                src.startsWith(filesUrl) ? `${start}${src.substring(filesUrl.length)}` : match
            ));
        }
        if (touchRef.current && newValue !== value) {
            sentRef.current = newValue;
            onChange(name, newValue);
        }
    };

    // A value that comes from outside, like the text of another language, is rewritten again
    React.useEffect(() => {
        if (value !== sentRef.current) {
            touchRef.current = false;
        }
    }, [ value ]);


    // Returns the width of the text, which is the widest an image can be
    const getTextWidth = () => {
        const body  = editorRef.current.getBody();
        const style = window.getComputedStyle(body);
        return body.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    };

    // Places the handles that resize the given image over it, or takes them away
    const showResize = (image) => {
        resizeRef.current.image = image;
        if (!image || !boxRef.current) {
            setResize(null);
            return;
        }
        const box    = boxRef.current.getBoundingClientRect();
        const bounds = image.getBoundingClientRect();
        setResize({
            top    : bounds.top - box.top,
            left   : bounds.left - box.left,
            width  : bounds.width,
            height : bounds.height,
        });
    };

    // Handles the Mouse Move, which shows the handles over the image that is under the mouse
    const handleResizeHover = (e) => {
        if (isDisabled || resizeRef.current.isDragging || e.target.closest(".editor-resize")) {
            return;
        }
        const image = e.target.nodeName === "IMG" && e.target.closest(".mce-content-body") ? e.target : null;
        if (image !== resizeRef.current.image) {
            showResize(image);
        }
    };

    // Handles the Leave of the mouse, or the scroll, which takes the handles away
    const handleResizeLeave = () => {
        if (!resizeRef.current.isDragging) {
            showResize(null);
        }
    };

    // Handles the Mouse Down on a handle, which resizes the image while it is dragged keeping
    // its proportions. A centered image grows on both sides, so the change is doubled to follow
    // the mouse. Once dropped, its width is kept as a part of the text instead of the pixels
    // that it has here, so it takes the same part where the text is shown wider
    const handleResizeStart = (e, isLeft) => {
        const editor = editorRef.current;
        const image  = resizeRef.current.image;
        if (!editor || !image) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();

        const bounds = image.getBoundingClientRect();
        const body   = editor.getBody().getBoundingClientRect();
        const space  = getTextWidth();
        const startX = e.clientX;
        const factor = Math.abs((bounds.left - body.left) - (body.right - bounds.right)) < 2 ? 2 : 1;
        let   width  = bounds.width;
        resizeRef.current.isDragging = true;

        const handleMove = (event) => {
            const change = (isLeft ? startX - event.clientX : event.clientX - startX) * factor;
            width = Math.round(Utils.clamp(bounds.width + change, 40, space));
            editor.dom.setStyles(image, { width : `${width}px`, height : "auto" });
            editor.dom.setAttribs(image, { width : null, height : null });
            showResize(image);
        };
        const handleUp = () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
            resizeRef.current.isDragging = false;

            const percent = Utils.clamp(Math.round(width * 100 / space), 5, 100);
            editor.dom.setStyles(image, { width : `${percent}%`, height : "auto" });
            touchRef.current = true;
            editor.undoManager.add();
            handleChange(editor.getContent());
            showResize(image);
        };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
    };


    // Inserts a File where the cursor was: an image is shown and any other one is a link with
    // its name
    const insertFile = (url, fileName, isImage, bookmark) => {
        const editor = editorRef.current;
        if (!editor || !url) {
            return;
        }
        editor.focus();
        if (bookmark) {
            editor.selection.moveToBookmark(bookmark);
        }
        touchRef.current = true;
        if (isImage) {
            editor.insertContent(`<img src="${url}" alt="" />`);
        } else {
            const text = editor.dom.encode(fileName);
            editor.insertContent(`<a href="${url}" target="_blank" rel="noopener">${text}</a>&nbsp;`);
        }
    };

    // Handles the Media, which picks an image or a file that already exists. A file that is
    // an image is shown too
    const handleMedia = (mediaType) => {
        const editor   = editorRef.current;
        const bookmark = markRef.current || (editor ? editor.selection.getBookmark(2, true) : null);
        markRef.current = null;
        setMenu("");
        onMedia(mediaType, (file) => {
            if (!file) {
                return;
            }
            const isFull  = /^(https?:)?\/\//i.test(file);
            const url     = isFull ? file : `${filesUrl}${String(file).replace(/^\/+/, "")}`;
            const isImage = mediaType === MediaType.IMAGE || IMAGE_FILE.test(String(file));
            insertFile(url, String(file).split("/").pop(), isImage, bookmark);
        });
    };

    // Handles the Upload Open, which picks the files to upload keeping where the cursor was
    const handleUploadOpen = () => {
        setMenu("");
        uploadRef.current.click();
    };

    // Handles the Upload of the picked files, which are inserted as each one is uploaded
    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        let bookmark = markRef.current;
        markRef.current = null;
        e.target.value = "";
        if (!files.length) {
            return;
        }
        onUpload(files, (url, fileName, isImage) => {
            insertFile(url, fileName, isImage, bookmark);
            bookmark = null;
        });
    };


    // Makes the list where the cursor is a list of tasks, creating it when there is none
    const setCheckList = (isDone = false) => {
        const editor = editorRef.current;
        if (!editor.dom.getParent(editor.selection.getNode(), "ul")) {
            editor.execCommand("InsertUnorderedList");
        }
        const list = editor.dom.getParent(editor.selection.getNode(), "ul");
        if (!list) {
            return;
        }
        editor.dom.setStyle(list, "list-style-type", null);
        editor.dom.addClass(list, CHECK_LIST);
        if (isDone) {
            editor.dom.addClass(editor.dom.getParent(editor.selection.getNode(), "li"), CHECK_DONE);
        }
    };

    // Handles the Check List, which makes the list one of tasks or a normal one again
    const handleCheckList = (e) => {
        e.preventDefault();
        const editor = editorRef.current;
        if (!editor) {
            return;
        }
        editor.undoManager.transact(() => {
            if (active.check) {
                const list = editor.dom.getParent(editor.selection.getNode(), "ul");
                editor.dom.removeClass(list, CHECK_LIST);
                editor.dom.removeClass(editor.dom.select("li", list), CHECK_DONE);
            } else {
                setCheckList();
            }
        });
        editor.focus();
        handleNodeChange();
    };

    // Starts a list of tasks when a [ ] or a [x] is written at the start of a line, as in
    // GitHub, taking away what was written. Returns true when it did
    const startCheckList = () => {
        const editor = editorRef.current;
        const range  = editor ? editor.selection.getRng() : null;
        const node   = range ? range.startContainer : null;
        if (!range || !range.collapsed || node.nodeType !== Node.TEXT_NODE) {
            return false;
        }
        const before = node.data.substring(0, range.startOffset);
        const match  = before.replace(/\u00a0/g, " ").match(CHECK_REGEX);
        const block  = editor.dom.getParent(node, "p,li");
        if (!match || !block || block.firstChild !== node) {
            return false;
        }

        // The list is made first, as it keeps the text and the cursor that is in it,
        // and what was written is then taken away from the start of that text
        editor.undoManager.transact(() => {
            setCheckList((match[1] || "").toLowerCase() === "x");
            node.deleteData(0, match[0].length);

            const item = editor.dom.getParent(node, "li");
            if (!node.data.length && item) {
                editor.dom.setHTML(item, "<br data-mce-bogus=\"1\">");
                editor.selection.setCursorLocation(item, 0);
            } else {
                editor.selection.setCursorLocation(node, 0);
            }
        });
        handleNodeChange();
        return true;
    };

    // Handles the Key Up, which starts a list of tasks after its marks are written
    const handleKeyUp = (e) => {
        if (has("check") && e.key === " " && startCheckList()) {
            return;
        }
        if (onKeyUp) {
            onKeyUp(e);
        }
    };

    // Handles the Mouse Down, which marks the task of a list as done or not when its box is
    // clicked, without giving the focus to the text, as checking a task is not writing in it
    const handleMouseDown = (e) => {
        if (onMouseDown) {
            onMouseDown(e);
        }
        const editor = editorRef.current;
        const item   = e.target.nodeName === "LI" ? e.target : null;
        if (e.defaultPrevented || !has("check") || isDisabled || !editor || !item) {
            return;
        }
        if (!editor.dom.hasClass(item.parentNode, CHECK_LIST)) {
            return;
        }
        if (e.clientX - item.getBoundingClientRect().left > CHECK_WIDTH) {
            return;
        }

        e.preventDefault();
        touchRef.current = true;
        editor.undoManager.transact(() => editor.dom.toggleClass(item, CHECK_DONE));
        handleChange(editor.getContent());
    };


    // Handles the Node Change, to mark the actions that apply where the cursor is
    const handleNodeChange = () => {
        const editor = editorRef.current;
        if (!editor) {
            return;
        }

        // A selection outside of the text, like the one a click on a tab leaves, marks nothing,
        // as the lists and the formats of the page would be found as the ones of the text
        const node = editor.selection.getNode();
        if (!editor.getBody().contains(node)) {
            setActive({});
            return;
        }
        const list    = editor.dom.getParent(node, "ul,ol");
        const isCheck = Boolean(list && editor.dom.hasClass(list, CHECK_LIST));
        setActive({
            block     : getBlock(editor),
            bold      : editor.queryCommandState("Bold"),
            italic    : editor.queryCommandState("Italic"),
            underline : editor.queryCommandState("Underline"),
            code      : editor.formatter.match("code"),
            list      : editor.queryCommandState("InsertUnorderedList") && !isCheck,
            check     : isCheck,
            number    : editor.queryCommandState("InsertOrderedList"),
            listStyle : list ? (list.style.listStyleType || (list.nodeName === "UL" ? "disc" : "decimal")) : "",
            align     : ALIGNS.find((align) => editor.formatter.match(align.key))?.key || "alignleft",
            color     : getColor(editor, COLORS[0].style),
            highlight : getColor(editor, COLORS[1].style),
            size      : getSize(editor),
        });
    };

    // Returns the Block where the cursor is. A Quote wraps the paragraphs it has, so it is
    // looked for before them
    const getBlock = (editor) => {
        if (has("quote") && editor.formatter.match("blockquote")) {
            return "blockquote";
        }
        return blocks.find((block) => editor.formatter.match(block.key))?.key || "p";
    };

    // Returns the font size in pixels that was set where the cursor is, or 0 for the normal one,
    // as the size of the input is not the one where the text is shown
    const getSize = (editor) => {
        const hasSize = (elem) => Boolean(elem.style && elem.style.fontSize);
        const node    = editor.dom.getParent(editor.selection.getNode(), hasSize);
        return node ? Math.round(parseFloat(node.style.fontSize)) || 0 : 0;
    };

    // Returns the color in hex that the given style has where the cursor is, if it was set
    const getColor = (editor, style) => {
        const hasColor = (elem) => Boolean(elem.style && elem.style[style]);
        const node     = editor.dom.getParent(editor.selection.getNode(), hasColor);
        const value    = node ? node.style[style] : "";
        const parts    = value.match(/\d+/g);
        if (!value.startsWith("rgb") || !parts) {
            return value;
        }
        const hex = parts.slice(0, 3).map((part) => Number(part).toString(16).padStart(2, "0"));
        return `#${hex.join("")}`;
    };

    // Removes the given color or size from the selection, or from the word where the cursor is
    const removeStyle = (format) => {
        const editor = editorRef.current;
        markRef.current = null;
        if (editor) {
            editor.focus();
            editor.undoManager.transact(() => {
                editor.formatter.remove(format, { value : null }, null, true);
            });
            handleNodeChange();
        }
        setMenu("");
    };

    // Handles the Variable, which is written where the cursor was, as the search of the menu
    // takes the focus away from the text
    const handleVariable = (key) => {
        const editor = restoreFocus();
        if (editor) {
            editor.insertContent(editor.dom.encode(key));
        }
        setMenu("");
    };

    // Handles the Table, which inserts one with the given size
    const handleTable = (rows, columns) => {
        runCommand("mceInsertTable", { rows, columns });
    };

    // Runs a command of the editor and gives it the focus back. The command already used the
    // cursor, so it is not restored when its Menu closes
    const runCommand = (command, commandValue = null) => {
        const editor = editorRef.current;
        markRef.current = null;
        if (editor) {
            editor.execCommand(command, false, commandValue);
            editor.focus();
            handleNodeChange();
        }
        setMenu("");
    };

    // Handles the Command of a button of the toolbar
    const handleCommand = (e, command, commandValue = null) => {
        e.preventDefault();
        e.stopPropagation();
        runCommand(command, commandValue);
    };

    // Handles the Block. A Quote is a wrapper and not a block, so it is added or taken away
    // with its own command, and the Block is then set inside of it
    const handleBlock = (key) => {
        const inQuote = active.block === "blockquote";
        if (key === "blockquote") {
            if (!inQuote) {
                runCommand("mceBlockQuote");
            }
            return;
        }
        if (inQuote) {
            runCommand("mceBlockQuote");
        }
        runCommand("FormatBlock", key);
    };

    // Handles the Menu, which keeps where the cursor is to give it back when it closes
    const handleMenu = (e, menuName) => {
        e.preventDefault();
        e.stopPropagation();
        if (menu === menuName) {
            handleMenuClose();
            return;
        }
        if (editorRef.current) {
            markRef.current = editorRef.current.selection.getBookmark(2, true);
        }
        setMenu(menuName);
    };

    // Handles the Close of a Menu or of the Link. When nothing was picked, the cursor is still
    // kept, and the focus goes back to it
    const handleMenuClose = () => {
        if (markRef.current) {
            restoreFocus();
        }
        setMenu("");
    };

    // Gives the focus back to the editor where the cursor was, which is used only once
    const restoreFocus = () => {
        const editor = editorRef.current;
        if (editor) {
            editor.focus();
            if (markRef.current) {
                editor.selection.moveToBookmark(markRef.current);
            }
        }
        markRef.current = null;
        return editor;
    };

    // Opens the Link, which edits the one where the cursor is or links the selected text
    const openLink = () => {
        const editor = editorRef.current;
        if (!editor) {
            return;
        }
        markRef.current = editor.selection.getBookmark(2, true);
        const anchor = editor.dom.getParent(editor.selection.getNode(), "a[href]");
        if (anchor) {
            setLink({
                url    : anchor.getAttribute("href"),
                text   : anchor.textContent,
                target : anchor.target === "_blank" ? "_blank" : "_self",
                isEdit : true,
            });
        } else {
            setLink({
                url    : "",
                text   : editor.selection.getContent({ format : "text" }),
                target : "_blank",
                isEdit : false,
            });
        }
        setMenu("link");
    };

    // Handles the Link of the toolbar
    const handleLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLink();
    };

    // Handles the Submit of the Link. A selected text that was not changed keeps its format,
    // as it is linked as it is, and any other text is written with the link
    const handleLinkSubmit = ({ url, text, target }) => {
        const editor = restoreFocus();
        if (editor) {
            const newTab = target === "_blank";
            const attrs  = { href : url, target : newTab ? target : null, rel : newTab ? "noopener" : null };
            const label  = text || url;
            const anchor = editor.dom.getParent(editor.selection.getNode(), "a[href]");
            if (anchor) {
                editor.dom.setAttribs(anchor, attrs);
                if (anchor.textContent !== label) {
                    anchor.textContent = label;
                }
            } else if (!editor.selection.isCollapsed() && text === link.text) {
                editor.execCommand("mceInsertLink", false, attrs);
            } else {
                editor.insertContent(editor.dom.createHTML("a", attrs, editor.dom.encode(label)));
            }
            editor.undoManager.add();
            handleNodeChange();
        }
        setMenu("");
    };

    // Handles the Remove of the Link, which keeps its text
    const handleLinkRemove = () => {
        const editor = restoreFocus();
        if (editor) {
            editor.execCommand("unlink");
        }
        setMenu("");
    };

    // Handles the List. The style that the list already has takes the list away
    const handleList = (list, style) => {
        if (active[list.key] && active.listStyle === style) {
            runCommand(list.command);
        } else {
            runCommand(list.command, { "list-style-type" : style });
        }
    };


    // Variables. The theme of the dialogs of the editor, like the ones of the tables, follows
    // the dark mode when it is created
    const isDark    = document.body.classList.contains("dark-mode");

    const minHeight = (Number(rows) || 3) * LINE_HEIGHT;
    const maxHeight = maxRows ? Number(maxRows) * LINE_HEIGHT + 16 : 0;

    const hasImages = has("image") && Boolean(onMedia);
    const hasFiles  = has("file") && Boolean(onMedia || onUpload);

    // The Input grows up while the text is written, showing the Toolbar over what is above it,
    // so the text does not move when it shows. A fixed Toolbar is always shown in its place
    const showToolbar = !isDisabled && (fixedToolbar || isFocused || Boolean(menu));
    const liftToolbar = showToolbar && !fixedToolbar;

    // The Input goes up as much as the Toolbar is tall, which changes when its actions wrap
    React.useLayoutEffect(() => {
        const node = barRef.current;
        if (!liftToolbar || !node) {
            return undefined;
        }
        const observer = new ResizeObserver(() => setLift(node.offsetHeight));
        setLift(node.offsetHeight);
        observer.observe(node);
        return () => observer.disconnect();
    }, [ liftToolbar ]);


    // Do the Render
    return <>
        <Container
            passedRef={boxRef}
            className={className}
            isFocused={isFocused || Boolean(menu)}
            isOpen={liftToolbar}
            lift={lift}
            isDisabled={isDisabled}
            withLabel={withLabel}
            withBorder
        >
            <EditorStyles />
            {showToolbar && <Toolbar ref={barRef} onMouseDown={(e) => e.preventDefault()}>
                {has("block") && blocks.length > 1 && <>
                    <Block ref={blockRef} onClick={(e) => handleMenu(e, "block")}>
                        <Icon icon={Utils.getValue(blocks, "key", active.block || "p", "icon")} />
                        <BlockNames>
                            {blocks.map((block) => <BlockName
                                key={block.key}
                                isHidden={block.key !== (active.block || "p")}
                            >
                                {block.message}
                            </BlockName>)}
                        </BlockNames>
                        <Icon icon="expand" />
                    </Block>
                    <Line />
                </>}
                {has("size") && <>
                    <Block ref={sizeRef} onClick={(e) => handleMenu(e, "size")}>
                        <BlockNames>
                            <BlockName isHidden={Boolean(active.size)}>
                                {NLS.get("GENERAL_FORMAT_SIZE_NORMAL")}
                            </BlockName>
                            {SIZES.map((size) => <BlockName key={size} isHidden={active.size !== size}>
                                {NLS.format("GENERAL_FORMAT_SIZE_PX", size)}
                            </BlockName>)}
                        </BlockNames>
                        <Icon icon="expand" />
                    </Block>
                    <Line />
                </>}
                {formats.map((action) => <Action
                    key={action.key}
                    variant="black"
                    icon={action.icon}
                    tooltip={action.tooltip}
                    tooltipVariant="bottom"
                    isActive={Boolean(active[action.key])}
                    onClick={(e) => handleCommand(e, action.command, action.value)}
                    isSmall
                />)}
                {has("color") && COLORS.map((color) => <Action
                    key={color.key}
                    passedRef={colorRefs[color.key]}
                    variant="black"
                    icon={color.icon}
                    tooltip={color.tooltip}
                    tooltipVariant="bottom"
                    isActive={Boolean(active[color.key])}
                    onClick={(e) => handleMenu(e, color.key)}
                    isSmall
                />)}
                {(formats.length > 0 || has("color")) && <Line />}
                {has("align") && <>
                    <Action
                        passedRef={alignRef}
                        variant="black"
                        icon={Utils.getValue(ALIGNS, "key", active.align || "alignleft", "icon")}
                        tooltip="GENERAL_FORMAT_ALIGN"
                        tooltipVariant="bottom"
                        onClick={(e) => handleMenu(e, "align")}
                        isSmall
                    />
                    {INDENTS.map((indent) => <Action
                        key={indent.key}
                        variant="black"
                        icon={indent.icon}
                        tooltip={indent.tooltip}
                        tooltipVariant="bottom"
                        onClick={(e) => handleCommand(e, indent.command)}
                        isSmall
                    />)}
                    <Line />
                </>}
                {has("list") && LISTS.map((list) => <Action
                    key={list.key}
                    passedRef={list.key === "list" ? listRef : numberRef}
                    variant="black"
                    icon={list.icon}
                    tooltip={list.tooltip}
                    tooltipVariant="bottom"
                    isActive={Boolean(active[list.key])}
                    onClick={(e) => handleMenu(e, list.key)}
                    isSmall
                />)}
                {has("check") && <Action
                    variant="black"
                    icon="list-check"
                    tooltip="GENERAL_FORMAT_LIST_CHECK"
                    tooltipVariant="bottom"
                    isActive={Boolean(active.check)}
                    onClick={handleCheckList}
                    isSmall
                />}
                {(has("list") || has("check")) && <Line />}
                {hasImages && <Action
                    variant="black"
                    icon="image"
                    tooltip="GENERAL_FORMAT_IMAGE"
                    tooltipVariant="bottom"
                    onClick={(e) => {
                        e.preventDefault();
                        handleMedia(MediaType.IMAGE);
                    }}
                    isSmall
                />}
                {hasFiles && <Action
                    passedRef={fileRef}
                    variant="black"
                    icon="attachment"
                    tooltip="GENERAL_FORMAT_FILE"
                    tooltipVariant="bottom"
                    onClick={(e) => {
                        e.preventDefault();
                        if (onUpload) {
                            handleMenu(e, "file");
                        } else {
                            handleMedia(MediaType.ANY);
                        }
                    }}
                    isSmall
                />}
                {has("table") && <Action
                    passedRef={tableRef}
                    variant="black"
                    icon="table"
                    tooltip="GENERAL_FORMAT_TABLE"
                    tooltipVariant="bottom"
                    onClick={(e) => handleMenu(e, "table")}
                    isSmall
                />}
                {has("line") && <Action
                    variant="black"
                    icon="divider"
                    tooltip="GENERAL_FORMAT_LINE"
                    tooltipVariant="bottom"
                    onClick={(e) => handleCommand(e, "InsertHorizontalRule")}
                    isSmall
                />}
                {variables.length > 0 && <Action
                    passedRef={varRef}
                    variant="black"
                    icon="variable"
                    tooltip="GENERAL_VARIABLES"
                    tooltipVariant="bottom"
                    onClick={(e) => handleMenu(e, "variable")}
                    isSmall
                />}
                {has("link") && <Action
                    variant="black"
                    icon="insert-link"
                    tooltip="GENERAL_FORMAT_LINK"
                    tooltipVariant="bottom"
                    onClick={handleLink}
                    isSmall
                />}
                {has("clear") && <Action
                    variant="black"
                    icon="format-clear"
                    tooltip="GENERAL_FORMAT_CLEAR"
                    tooltipVariant="bottom"
                    onClick={(e) => handleCommand(e, "RemoveFormat")}
                    isSmall
                />}

                <Menu
                    open={menu === "block"}
                    targetRef={blockRef}
                    direction="bottom right"
                    onClose={handleMenuClose}
                    gap={4}
                >
                    {blocks.map((block) => <MenuItem
                        key={block.key}
                        icon={block.icon}
                        message={block.message}
                        isSelected={(active.block || "p") === block.key}
                        onClick={() => handleBlock(block.key)}
                    />)}
                </Menu>
                <Menu
                    open={menu === "size"}
                    targetRef={sizeRef}
                    direction="bottom right"
                    onClose={handleMenuClose}
                    gap={4}
                >
                    <MenuItem
                        message="GENERAL_FORMAT_SIZE_NORMAL"
                        isSelected={!active.size}
                        onClick={() => removeStyle("fontsize")}
                    />
                    {SIZES.map((size) => <MenuItem
                        key={size}
                        message={NLS.format("GENERAL_FORMAT_SIZE_PX", size)}
                        isSelected={active.size === size}
                        onClick={() => runCommand("FontSize", `${size}px`)}
                    />)}
                </Menu>
                {LISTS.map((list) => <Menu
                    key={list.key}
                    open={menu === list.key}
                    targetRef={list.key === "list" ? listRef : numberRef}
                    direction="bottom right"
                    onClose={handleMenuClose}
                    gap={4}
                >
                    {list.styles.map((style) => <MenuItem
                        key={style.key}
                        message={style.message}
                        isSelected={Boolean(active[list.key]) && active.listStyle === style.key}
                        onClick={() => handleList(list, style.key)}
                    />)}
                </Menu>)}
                {COLORS.map((color) => <Menu
                    key={color.key}
                    open={menu === color.key}
                    targetRef={colorRefs[color.key]}
                    direction="bottom right"
                    onClose={handleMenuClose}
                    gap={4}
                >
                    <EditorColors
                        value={active[color.key]}
                        onSelect={(value) => runCommand(color.command, value)}
                        onClear={() => removeStyle(color.format)}
                    />
                </Menu>)}
                <Menu
                    open={menu === "align"}
                    targetRef={alignRef}
                    direction="bottom right"
                    onClose={handleMenuClose}
                    gap={4}
                >
                    {ALIGNS.map((align) => <MenuItem
                        key={align.key}
                        icon={align.icon}
                        message={align.message}
                        isSelected={(active.align || "alignleft") === align.key}
                        onClick={() => runCommand(align.command)}
                    />)}
                </Menu>
                <Menu
                    open={menu === "file"}
                    targetRef={fileRef}
                    direction="bottom right"
                    onClose={handleMenuClose}
                    gap={4}
                >
                    <MenuItem
                        message="GENERAL_FILE_NEW"
                        onClick={handleUploadOpen}
                    />
                    <MenuItem
                        isHidden={!onMedia}
                        message="GENERAL_FILE_EXISTING"
                        onClick={() => handleMedia(MediaType.ANY)}
                    />
                </Menu>
                <EditorVariables
                    open={menu === "variable"}
                    targetRef={varRef}
                    variables={variables}
                    onSelect={handleVariable}
                    onClose={handleMenuClose}
                />
                <Menu
                    open={menu === "table"}
                    targetRef={tableRef}
                    direction="bottom right"
                    onClose={handleMenuClose}
                    gap={4}
                >
                    <EditorTable onSelect={handleTable} />
                </Menu>
            </Toolbar>}
            <Content
                centerImages={centerImages}
                minHeight={minHeight}
                maxHeight={maxHeight}
                onMouseMove={handleResizeHover}
                onMouseLeave={handleResizeLeave}
                onWheel={handleResizeLeave}
            >
                <Editor
                    tinymceScriptSrc={`${Navigate.getAppUrl()}/tinymce/tinymce.min.js`}
                    value={shownValue}
                    disabled={isDisabled}
                    onInit={handleInit}
                    onEditorChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onNodeChange={handleNodeChange}
                    onKeyUp={handleKeyUp}
                    onKeyDown={onKeyDown}
                    onMouseDown={handleMouseDown}
                    init={{
                        inline              : true,
                        menubar             : false,
                        skin                : isDark ? "oxide-dark" : "oxide",
                        language            : NLS.getCurrentLang(),
                        placeholder         : placeholder ? NLS.get(placeholder) : "",
                        valid_children      : "-li[p]",
                        convert_urls        : false,
                        plugins             : [ "autolink", "lists", "link", "table" ],
                        link_default_target : "_blank",
                        contextmenu         : "table",
                        object_resizing     : false,
                        ...(has("line") ? { text_patterns : TEXT_PATTERNS } : {}),

                        // The actions are the ones of the toolbar below, as the ones of the editor
                        // float over the text and move by their own when the content is scrolled
                        toolbar             : false,
                        ...init,
                    }}
                />
            </Content>
            {Boolean(resize) && <Resize className="editor-resize" style={resize}>
                <ResizeHandle isLeft onMouseDown={(e) => handleResizeStart(e, true)} />
                <ResizeHandle onMouseDown={(e) => handleResizeStart(e, false)} />
            </Resize>}
            {Boolean(onUpload) && <FileInput
                ref={uploadRef}
                type="file"
                onChange={handleUpload}
                multiple
            />}
        </Container>

        <EditorLink
            open={menu === "link"}
            link={link}
            variables={variables}
            outsideLabel={outsideLabel}
            onSubmit={handleLinkSubmit}
            onRemove={handleLinkRemove}
            onClose={handleMenuClose}
        />
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditorInput.propTypes = {
    inputRef     : PropTypes.object,
    className    : PropTypes.string,
    isFocused    : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    centerImages : PropTypes.bool,
    fixedToolbar : PropTypes.bool,
    withLabel    : PropTypes.bool,
    name         : PropTypes.string,
    value        : PropTypes.string,
    placeholder  : PropTypes.string,
    rows         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxRows      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    titles       : PropTypes.array,
    toolbar      : PropTypes.array,
    filesUrl     : PropTypes.string,
    outsideLabel : PropTypes.bool,
    variables    : PropTypes.array,
    init         : PropTypes.object,
    onChange     : PropTypes.func.isRequired,
    onMedia      : PropTypes.func,
    onUpload     : PropTypes.func,
    onInit       : PropTypes.func,
    onFocus      : PropTypes.func,
    onBlur       : PropTypes.func,
    onKeyUp      : PropTypes.func,
    onKeyDown    : PropTypes.func,
    onMouseDown  : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EditorInput.defaultProps = {
    className    : "",
    isFocused    : false,
    isDisabled   : false,
    centerImages : false,
    fixedToolbar : false,
    withLabel    : false,
    value        : "",
    placeholder  : "",
    titles       : [ "h1", "h2", "h3" ],
    toolbar      : [ "block", "format", "color", "align", "list", "image", "file", "table", "link", "clear" ],
    filesUrl     : "",
    outsideLabel : false,
    variables    : [],
    init         : {},
};

export default EditorInput;
