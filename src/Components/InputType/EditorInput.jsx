// spell-checker: ignore autolink
import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
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
import MenuTitle            from "../Menu/MenuTitle";
import EditorColors         from "./EditorColors";
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

const Content = Styled.div.attrs(({ minHeight, maxHeight }) => ({ minHeight, maxHeight }))`
    box-sizing: border-box;
    width: 100%;
    cursor: text;

    ${(props) => props.maxHeight > 0 && `
        max-height: ${props.maxHeight}px;
        overflow-y: auto;
    `}

    .mce-content-body {
        min-height: ${(props) => props.minHeight}px;
        padding: 8px var(--input-horiz-padding, 12px);
        font-size: var(--input-font);
        line-height: 1.5;
        color: var(--font-color);
        overflow-wrap: anywhere;
    }
    .mce-content-body:focus {
        outline: none;
    }
    .mce-content-body[data-mce-placeholder]::before {
        top: 8px !important;
        left: var(--input-horiz-padding, 12px) !important;
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
            font-size: 18px;
        }
        h2 {
            font-size: 16px;
        }
        h3, h4 {
            font-size: 15px;
        }
        p {
            margin: 0 0 6px;
        }
        ul, ol {
            margin: 0 0 6px;
            padding-left: 22px;
        }
        a {
            color: var(--primary-color);
        }
        table {
            margin: 0 0 6px;
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
        > :first-child {
            margin-top: 0;
        }
        > :last-child {
            margin-bottom: 0;
        }
    }
`;

const Toolbar = Styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    min-height: var(--editor-toolbar-height);
    padding: 0 6px;
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
    gap: 2px;
    height: 24px;
    padding: 0 2px 0 8px;
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



/**
 * The Editor Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditorInput(props) {
    const {
        inputRef, className, isFocused, isDisabled, withLabel,
        name, value, placeholder, rows, maxRows, titles, filesUrl, variables,
        withColors, withAlign, withLinks, withFiles, withTables,
        onChange, onFocus, onBlur, onMedia,
    } = props;


    // The References
    const editorRef = React.useRef(null);
    const blockRef  = React.useRef(null);
    const listRef   = React.useRef(null);
    const numberRef = React.useRef(null);
    const tableRef  = React.useRef(null);
    const alignRef  = React.useRef(null);
    const barRef    = React.useRef(null);
    const varRef    = React.useRef(null);
    const markRef   = React.useRef(null);
    const colorRefs = { color : React.useRef(null), highlight : React.useRef(null) };
    const resizeRef = React.useRef(null);

    // The Current State
    const [ active, setActive ] = React.useState({});
    const [ menu,   setMenu   ] = React.useState("");
    const [ lift,   setLift   ] = React.useState(0);


    // The Blocks are the paragraph and the titles that are allowed, which are numbered in their
    // order, as a title is called the same whatever its level is
    const blocks = [
        { key : "p", message : NLS.get("GENERAL_FORMAT_PARAGRAPH") },
        ...titles.map((key, index) => ({ key, message : NLS.format("GENERAL_FORMAT_TITLE", index + 1) })),
    ];


    // Handles the Init, which gives the body to the Input, so the label can focus it
    const handleInit = (e, editor) => {
        editorRef.current = editor;
        if (inputRef) {
            inputRef.current = editor.getBody();
        }
        editor.on("ObjectResizeStart", handleResizeStart);
        editor.on("ObjectResized", handleResized);
    };

    // Handles the Start of the Resize of an image, keeping the width that it is shown with, as
    // the editor measures the image with its own width, which can be wider than the text
    const handleResizeStart = ({ target, width }) => {
        resizeRef.current = { shown : target.getBoundingClientRect().width, width };
    };

    // Handles the Resize of an image, which keeps its width as a part of the text instead of
    // the pixels that it has here, so it takes the same part where the text is shown wider
    const handleResized = ({ target, width }) => {
        const editor = editorRef.current;
        const start  = resizeRef.current;
        if (!editor || !start || !start.width || target.nodeName !== "IMG") {
            return;
        }
        const body    = editor.getBody();
        const style   = window.getComputedStyle(body);
        const space   = body.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const shown   = start.shown * width / start.width;
        const percent = Utils.clamp(Math.round(shown * 100 / space), 5, 100);

        editor.dom.setStyles(target, { width : `${percent}%`, height : "auto" });
        editor.dom.setAttribs(target, { width : null, height : null });
        editor.undoManager.add();
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
        if (newValue !== value) {
            onChange(name, newValue);
        }
    };

    // Handles the Media, which picks an image or a file and inserts it where the cursor was. The
    // image is shown and the file is a link with its name
    const handleMedia = (e, mediaType) => {
        e.preventDefault();
        e.stopPropagation();
        const editor   = editorRef.current;
        const bookmark = editor ? editor.selection.getBookmark(2, true) : null;
        onMedia(mediaType, (file) => {
            if (!editor || !file) {
                return;
            }
            const isFull = /^(https?:)?\/\//i.test(file);
            const url    = isFull ? file : `${filesUrl}${String(file).replace(/^\/+/, "")}`;
            editor.focus();
            if (bookmark) {
                editor.selection.moveToBookmark(bookmark);
            }
            if (mediaType === MediaType.IMAGE) {
                editor.insertContent(`<img src="${url}" alt="" />`);
            } else {
                const fileName = editor.dom.encode(String(file).split("/").pop());
                editor.insertContent(`<a href="${url}" target="_blank" rel="noopener">${fileName}</a>&nbsp;`);
            }
        });
    };

    // Handles the Node Change, to mark the actions that apply where the cursor is
    const handleNodeChange = () => {
        const editor = editorRef.current;
        if (!editor) {
            return;
        }
        const list = editor.dom.getParent(editor.selection.getNode(), "ul,ol");
        setActive({
            block     : blocks.find((block) => editor.formatter.match(block.key))?.key || "p",
            bold      : editor.queryCommandState("Bold"),
            italic    : editor.queryCommandState("Italic"),
            underline : editor.queryCommandState("Underline"),
            list      : editor.queryCommandState("InsertUnorderedList"),
            number    : editor.queryCommandState("InsertOrderedList"),
            listStyle : list ? (list.style.listStyleType || (list.nodeName === "UL" ? "disc" : "decimal")) : "",
            align     : ALIGNS.find((align) => editor.formatter.match(align.key))?.key || "alignleft",
            color     : getColor(editor, COLORS[0].style),
            highlight : getColor(editor, COLORS[1].style),
        });
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

    // Removes the given color from the selection, or from the word where the cursor is
    const removeColor = (format) => {
        const editor = editorRef.current;
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
        const editor = editorRef.current;
        if (editor) {
            editor.focus();
            if (markRef.current) {
                editor.selection.moveToBookmark(markRef.current);
            }
            editor.insertContent(editor.dom.encode(key));
        }
        setMenu("");
    };

    // The Variables are grouped by the title that each one has
    const variableItems = React.useMemo(() => {
        const result = [];
        let   title  = "";
        for (const { key, value : name, extra } of variables) {
            if (extra && extra !== title) {
                title = extra;
                result.push(<MenuTitle key={`title-${extra}`} message={extra} isTitle />);
            }
            result.push(<MenuItem
                key={key}
                title={NLS.get(name)}
                message={key}
                onClick={() => handleVariable(key)}
                isSmall
            />);
        }
        return result;
    }, [ JSON.stringify(variables) ]);

    // Handles the Table, which inserts one with the given size
    const handleTable = (rows, columns) => {
        runCommand("mceInsertTable", { rows, columns });
    };

    // Runs a command of the editor and gives it the focus back
    const runCommand = (command, commandValue = null) => {
        const editor = editorRef.current;
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

    // Handles the Menu
    const handleMenu = (e, menuName) => {
        e.preventDefault();
        e.stopPropagation();
        if (editorRef.current) {
            markRef.current = editorRef.current.selection.getBookmark(2, true);
        }
        setMenu(menu === menuName ? "" : menuName);
    };

    // Handles the List. The style that the list already has takes the list away
    const handleList = (list, style) => {
        if (active[list.key] && active.listStyle === style) {
            runCommand(list.command);
        } else {
            runCommand(list.command, { "list-style-type" : style });
        }
    };


    // Variables. The theme of the dialogs of the editor, like the one of the links, follows the
    // dark mode when it is created
    const isDark    = document.body.classList.contains("dark-mode");

    const minHeight = (Number(rows) || 3) * LINE_HEIGHT + 16;
    const maxHeight = maxRows ? Number(maxRows) * LINE_HEIGHT + 16 : 0;

    // The Input grows up while the text is written, showing the Toolbar over what is above it,
    // so the text does not move when it shows
    const showToolbar = !isDisabled && (isFocused || Boolean(menu));

    // The Input goes up as much as the Toolbar is tall, which changes when its actions wrap
    React.useLayoutEffect(() => {
        const node = barRef.current;
        if (!showToolbar || !node) {
            return undefined;
        }
        const observer = new ResizeObserver(() => setLift(node.offsetHeight));
        setLift(node.offsetHeight);
        observer.observe(node);
        return () => observer.disconnect();
    }, [ showToolbar ]);


    // Do the Render
    return <Container
        className={className}
        isFocused={isFocused || Boolean(menu)}
        isOpen={showToolbar}
        lift={lift}
        isDisabled={isDisabled}
        withLabel={withLabel}
        withBorder
    >
        <EditorStyles />
        {showToolbar && <Toolbar ref={barRef} onMouseDown={(e) => e.preventDefault()}>
            {titles.length > 0 && <>
                <Block ref={blockRef} onClick={(e) => handleMenu(e, "block")}>
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
            {FORMATS.map((action) => <Action
                key={action.key}
                variant="black"
                icon={action.icon}
                tooltip={action.tooltip}
                tooltipVariant="bottom"
                isActive={Boolean(active[action.key])}
                onClick={(e) => handleCommand(e, action.command)}
                isSmall
            />)}
            {withColors && COLORS.map((color) => <Action
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
            <Line />
            {withAlign && <>
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
            {LISTS.map((list) => <Action
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
            <Line />
            {!!onMedia && <>
                <Action
                    variant="black"
                    icon="image"
                    tooltip="GENERAL_FORMAT_IMAGE"
                    tooltipVariant="bottom"
                    onClick={(e) => handleMedia(e, MediaType.IMAGE)}
                    isSmall
                />
                {withFiles && <Action
                    variant="black"
                    icon="attachment"
                    tooltip="GENERAL_FORMAT_FILE"
                    tooltipVariant="bottom"
                    onClick={(e) => handleMedia(e, MediaType.ANY)}
                    isSmall
                />}
            </>}
            {withTables && <Action
                passedRef={tableRef}
                variant="black"
                icon="table"
                tooltip="GENERAL_FORMAT_TABLE"
                tooltipVariant="bottom"
                onClick={(e) => handleMenu(e, "table")}
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
            {withLinks && <Action
                variant="black"
                icon="insert-link"
                tooltip="GENERAL_FORMAT_LINK"
                tooltipVariant="bottom"
                onClick={(e) => handleCommand(e, "mceLink")}
                isSmall
            />}
            <Action
                variant="black"
                icon="format-clear"
                tooltip="GENERAL_FORMAT_CLEAR"
                tooltipVariant="bottom"
                onClick={(e) => handleCommand(e, "RemoveFormat")}
                isSmall
            />

            <Menu
                open={menu === "block"}
                targetRef={blockRef}
                direction="bottom right"
                onClose={() => setMenu("")}
                gap={4}
            >
                {blocks.map((block) => <MenuItem
                    key={block.key}
                    message={block.message}
                    isSelected={(active.block || "p") === block.key}
                    onClick={() => runCommand("FormatBlock", block.key)}
                />)}
            </Menu>
            {LISTS.map((list) => <Menu
                key={list.key}
                open={menu === list.key}
                targetRef={list.key === "list" ? listRef : numberRef}
                direction="bottom right"
                onClose={() => setMenu("")}
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
                onClose={() => setMenu("")}
                gap={4}
            >
                <EditorColors
                    value={active[color.key]}
                    onSelect={(value) => runCommand(color.command, value)}
                    onClear={() => removeColor(color.format)}
                />
            </Menu>)}
            <Menu
                open={menu === "align"}
                targetRef={alignRef}
                direction="bottom right"
                onClose={() => setMenu("")}
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
                open={menu === "variable"}
                targetRef={varRef}
                direction="bottom left"
                width={400}
                maxHeight={300}
                onClose={() => setMenu("")}
                gap={4}
                withSearch
            >
                {variableItems}
            </Menu>
            <Menu
                open={menu === "table"}
                targetRef={tableRef}
                direction="bottom right"
                onClose={() => setMenu("")}
                gap={4}
            >
                <EditorTable onSelect={handleTable} />
            </Menu>
        </Toolbar>}
        <Content minHeight={minHeight} maxHeight={maxHeight}>
            <Editor
                tinymceScriptSrc={`${Navigate.getAppUrl()}/tinymce/tinymce.min.js`}
                value={shownValue}
                disabled={isDisabled}
                onInit={handleInit}
                onEditorChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onNodeChange={handleNodeChange}
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

                    // The actions are the ones of the toolbar below, as the ones of the editor
                    // float over the text and move by their own when the content is scrolled
                    toolbar             : false,
                }}
            />
        </Content>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditorInput.propTypes = {
    inputRef    : PropTypes.object,
    className   : PropTypes.string,
    isFocused   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    withLabel   : PropTypes.bool,
    name        : PropTypes.string,
    value       : PropTypes.string,
    placeholder : PropTypes.string,
    rows        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxRows     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    titles      : PropTypes.array,
    withLinks   : PropTypes.bool,
    withFiles   : PropTypes.bool,
    withTables  : PropTypes.bool,
    withColors  : PropTypes.bool,
    withAlign   : PropTypes.bool,
    filesUrl    : PropTypes.string,
    variables   : PropTypes.array,
    onChange    : PropTypes.func.isRequired,
    onMedia     : PropTypes.func,
    onFocus     : PropTypes.func,
    onBlur      : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EditorInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    withLabel   : false,
    value       : "",
    placeholder : "",
    titles      : [ "h1", "h2", "h3" ],
    withLinks   : true,
    withFiles   : true,
    withTables  : true,
    withColors  : true,
    withAlign   : true,
    filesUrl    : "",
    variables   : [],
};

export default EditorInput;
