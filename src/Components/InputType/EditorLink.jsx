import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import EditorVariables      from "./EditorVariables";
import Dialog               from "../Dialog/Dialog";
import DialogHeader         from "../Dialog/DialogHeader";
import DialogBody           from "../Dialog/DialogBody";
import DialogFooter         from "../Dialog/DialogFooter";
import InputField           from "../Form/InputField";
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;



/**
 * The Editor Link
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditorLink(props) {
    const { open, link, variables, outsideLabel, onSubmit, onRemove, onClose } = props;


    // The References
    const urlRef      = React.useRef(null);
    const variableRef = React.useRef(null);

    // The Current State
    const [ data,     setData     ] = React.useState(link);
    const [ showMenu, setShowMenu ] = React.useState(false);


    // Starts with the Link where the cursor was, each time that it opens
    React.useEffect(() => {
        if (open) {
            setData(link);
        }
    }, [ open ]);


    // Handles the Change
    const handleChange = (name, value) => {
        setData({ ...data, [name] : value });
    };

    // Handles the Variable, which is written in the Url where the cursor is
    const handleVariable = (key) => {
        handleChange("url", Utils.insertText(urlRef, data.url, key));
        handleMenuClose();
    };

    // Handles the Close of the Variables, which gives the focus back to the Url
    const handleMenuClose = () => {
        setShowMenu(false);
        urlRef.current.focus();
    };

    // Handles the Submit. An email or a domain written without the protocol gets one, as the
    // browser would take it as a path of the current site, and a variable is kept as it is
    const handleSubmit = () => {
        let url = data.url.trim();
        if (!url) {
            return;
        }
        if (!/^([a-z][a-z0-9+.-]*:|\/|#|\{)/i.test(url)) {
            if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(url)) {
                url = `mailto:${url}`;
            } else if (/^[^\s/]+\.[^\s/]+/.test(url)) {
                url = `https://${url}`;
            }
        }
        onSubmit({ ...data, url });
    };


    // Do the Render
    return <Dialog open={open} onClose={onClose} isNarrow>
        <DialogHeader
            message={link.isEdit ? "GENERAL_FORMAT_LINK_EDIT" : "GENERAL_FORMAT_LINK"}
            icon="insert-link"
        />
        <DialogBody withSpacing>
            <Container>
                <InputField
                    passedRef={urlRef}
                    name="url"
                    label="GENERAL_URL"
                    value={data.url}
                    autoFocus={open}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    outsideLabel={outsideLabel}
                    isRequired
                >
                    {variables.length > 0 && <IconLink
                        passedRef={variableRef}
                        variant="black"
                        icon="variable"
                        tooltip="GENERAL_VARIABLES"
                        onClick={() => setShowMenu(true)}
                        isSmall
                    />}
                </InputField>
                <InputField
                    name="text"
                    label="GENERAL_TEXT"
                    value={data.text}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    outsideLabel={outsideLabel}
                />
                <InputField
                    type="select"
                    name="target"
                    label="GENERAL_FORMAT_LINK_TARGET"
                    options="SELECT_LINK_TARGETS"
                    value={data.target}
                    onChange={handleChange}
                    outsideLabel={outsideLabel}
                    hideClear
                />
            </Container>

            <EditorVariables
                open={showMenu}
                targetRef={variableRef}
                variables={variables}
                onSelect={handleVariable}
                onClose={handleMenuClose}
            />
        </DialogBody>
        <DialogFooter
            primary={link.isEdit ? "GENERAL_SAVE" : "GENERAL_INSERT"}
            onSubmit={handleSubmit}
            secondary={link.isEdit ? "GENERAL_REMOVE" : ""}
            onSecondary={onRemove}
            isDisabled={!data.url.trim()}
            onClose={onClose}
        />
    </Dialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditorLink.propTypes = {
    open         : PropTypes.bool.isRequired,
    link         : PropTypes.object.isRequired,
    variables    : PropTypes.array.isRequired,
    outsideLabel : PropTypes.bool,
    onSubmit     : PropTypes.func.isRequired,
    onRemove     : PropTypes.func.isRequired,
    onClose      : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EditorLink.defaultProps = {
    outsideLabel : false,
};

export default EditorLink;
