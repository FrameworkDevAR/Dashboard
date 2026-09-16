import React                from "react";
import { useNavigate }      from "react-router-dom";

// Core
import Store                from "../../Core/Store";
import Navigate             from "../../Core/Navigate";

// Components
import ConfirmDialog        from "../Dialogs/ConfirmDialog";



/**
 * The Unsaved changes Dialog
 * @returns {React.ReactElement}
 */
function Unsaved() {
    const navigate = useNavigate();

    const { unsaved } = Store.useState("core");
    const { closeUnsaved } = Store.useAction("core");


    // Handles the Discard, going where the user wanted to go
    const handleDiscard = () => {
        Navigate.setUnsaved(false);
        closeUnsaved();
        navigate(unsaved.url, { replace : unsaved.replace });
    };


    // Do the Render
    return <ConfirmDialog
        open={Boolean(unsaved.url)}
        icon="warning"
        title="GENERAL_UNSAVED_TITLE"
        message="GENERAL_UNSAVED_TEXT"
        primary="GENERAL_DISCARD"
        primaryVariant="error"
        onSubmit={handleDiscard}
        onClose={closeUnsaved}
    />;
}

export default Unsaved;
