import React                from "react";
import PropTypes            from "prop-types";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import EditDialog           from "./EditDialog";



/**
 * The Filter Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function FilterDialog(props) {
    const {
        open, title, isNarrow, bigGap, isLoading, noAutoFocus,
        initialData, data, onSubmit, onClose, children,
    } = props;

    const hasFilter = !Utils.areObjectsEqual(initialData, data);


    // Handles the Submit
    const handleSubmit = () => {
        if (hasFilter) {
            onSubmit({ ...data }, true);
        } else {
            onSubmit({ ...initialData }, false);
        }
    };


    // Do the Render
    return <EditDialog
        open={open}
        icon="filter"
        title={title}
        primary="GENERAL_FILTER"
        secondary={hasFilter ? "GENERAL_REMOVE_FILTER" : ""}
        onSubmit={handleSubmit}
        onSecondary={() => onSubmit({ ...initialData }, false)}
        onClose={onClose}
        isLoading={isLoading}
        noAutoFocus={noAutoFocus}
        isNarrow={isNarrow}
        bigGap={bigGap}
    >
        {children}
    </EditDialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FilterDialog.propTypes = {
    open        : PropTypes.bool.isRequired,
    title       : PropTypes.string.isRequired,
    isNarrow    : PropTypes.bool,
    bigGap      : PropTypes.bool,
    isLoading   : PropTypes.bool,
    noAutoFocus : PropTypes.bool,
    initialData : PropTypes.object.isRequired,
    data        : PropTypes.object.isRequired,
    onSubmit    : PropTypes.func.isRequired,
    onClose     : PropTypes.func.isRequired,
    children    : PropTypes.any,
};

export default FilterDialog;
