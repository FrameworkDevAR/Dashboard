import React                from "react";
import PropTypes            from "prop-types";

// Core
import NLS                  from "../../Core/NLS";

// Dashboard
import EditDialog           from "../Dialogs/EditDialog";
import DialogMessage        from "../Dialog/DialogMessage";
import InputField           from "../Form/InputField";



/**
 * The Filter Range Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function FilterRange(props) {
    const {
        open, currData, name, label, prefix, suffix,
        outsideLabel, onSubmit, onClose,
    } = props;


    // The Initial Data
    const initialData = {
        fromValue : "",
        toValue   : "",
    };

    // The Current State
    const [ data, setData ] = React.useState({ ...initialData });


    // Update the data on Open
    React.useEffect(() => {
        const newData = {
            fromValue : currData?.[`${name}From`] || "",
            toValue   : currData?.[`${name}To`]   || "",
        };
        setData({ ...initialData, ...newData });
    }, [ open ]);

    // Handles the Input Change
    const handleChange = (name, value) => {
        setData((prev) => ({
            ...prev,
            [name] : value,
        }));
    };

    // Handles the Submit
    const handleSubmit = () => {
        onSubmit(data.fromValue, data.toValue);
    };


    // Do the Render
    return <EditDialog
        open={open}
        icon="range"
        title="GENERAL_NUMBER_RANGE"
        onSubmit={handleSubmit}
        onClose={onClose}
        isNarrow
    >
        <DialogMessage message={NLS.format("GENERAL_NUMBER_RANGE_FILTER", label)} />
        <InputField
            name="fromValue"
            type="number"
            label="GENERAL_FROM"
            value={data.fromValue}
            prefixText={prefix}
            suffixText={suffix}
            onChange={handleChange}
            outsideLabel={outsideLabel}
            hasClear
        />
        <InputField
            name="toValue"
            type="number"
            label="GENERAL_TO"
            value={data.toValue}
            prefixText={prefix}
            suffixText={suffix}
            onChange={handleChange}
            outsideLabel={outsideLabel}
            hasClear
        />
    </EditDialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FilterRange.propTypes = {
    open         : PropTypes.bool.isRequired,
    currData     : PropTypes.object.isRequired,
    name         : PropTypes.string,
    label        : PropTypes.string,
    prefix       : PropTypes.string,
    suffix       : PropTypes.string,
    outsideLabel : PropTypes.bool,
    onSubmit     : PropTypes.func.isRequired,
    onClose      : PropTypes.func.isRequired,
};

export default FilterRange;
