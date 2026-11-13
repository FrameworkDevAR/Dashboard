import React                from "react";
import PropTypes            from "prop-types";

// Components
import ConfirmDialog        from "./ConfirmDialog";
import DataCard             from "../Card/DataCard";



/**
 * The Delete Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DeleteDialog(props) {
    const {
        open, title, message, content,
        isLoading, isWide, onCheck, onSubmit, onClose,
    } = props;


    // The Current State
    const [ check, setCheck ] = React.useState(null);


    // Ask if it can be deleted each time the Dialog opens. When the check fails the
    // normal Dialog is shown, as the delete itself validates it again
    React.useEffect(() => {
        let isCurrent = true;
        setCheck(null);
        if (open && onCheck) {
            onCheck().then((result) => result, () => ({})).then((result) => {
                if (isCurrent) {
                    setCheck(result || {});
                }
            });
        }
        return () => {
            isCurrent = false;
        };
    }, [ open ]);


    // Variables
    const isChecking = Boolean(open && onCheck && !check);
    const error      = check?.error || "";
    const hasError   = Boolean(error);
    const names      = check?.names || [];
    const hasNames   = hasError && names.length > 0;


    // Do the Render
    return <ConfirmDialog
        open={open}
        icon="delete"
        title={title}
        message={hasError ? error : message}
        content={hasError ? "" : content}
        isLoading={isLoading || isChecking}
        isWide={isWide}
        bigSpacing={!hasError}
        result={hasError ? "error" : ""}
        noBottom={hasNames}
        primary={hasError || isChecking ? "" : "GENERAL_DELETE"}
        primaryVariant="error"
        cancel={hasError ? "GENERAL_CLOSE" : "GENERAL_CANCEL"}
        onSubmit={onSubmit}
        onClose={onClose}
    >
        <DataCard
            isHidden={!hasNames}
            message="GENERAL_WHERE_USED"
            items={names}
        />
    </ConfirmDialog>;
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
    onCheck   : PropTypes.func,
    onSubmit  : PropTypes.func.isRequired,
    onClose   : PropTypes.func.isRequired,
};

export default DeleteDialog;
