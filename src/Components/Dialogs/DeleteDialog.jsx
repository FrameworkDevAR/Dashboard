import React                from "react";
import PropTypes            from "prop-types";

// Components
import ConfirmDialog        from "./ConfirmDialog";



/**
 * The Delete Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DeleteDialog(props) {
    const {
        open, title, message, content,
        isLoading, isWide, onSubmit, onClose,
    } = props;


    // Do the Render
    return <ConfirmDialog
        open={open}
        icon="delete"
        title={title}
        message={message}
        content={content}
        isLoading={isLoading}
        isWide={isWide}
        primary="GENERAL_DELETE"
        primaryVariant="error"
        onSubmit={onSubmit}
        onClose={onClose}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DeleteDialog.propTypes = {
    open      : PropTypes.bool.isRequired,
    title     : PropTypes.string.isRequired,
    message   : PropTypes.string.isRequired,
    content   : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    isLoading : PropTypes.bool,
    isWide    : PropTypes.bool,
    onSubmit  : PropTypes.func.isRequired,
    onClose   : PropTypes.func.isRequired,
};

export default DeleteDialog;
