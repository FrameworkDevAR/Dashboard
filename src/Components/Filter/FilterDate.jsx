import React                from "react";
import PropTypes            from "prop-types";

// Dashboard
import EditDialog           from "../Dialogs/EditDialog";
import DialogMessage        from "../Dialog/DialogMessage";
import Columns              from "../Form/Columns";
import InputField           from "../Form/InputField";



/**
 * The Filter Date Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function FilterDate(props) {
    const { open, withHour, onlyHour, currData, datesName, onSubmit, onClose } = props;


    // The Initial Data
    const initialData = {
        fromDate : "",
        fromHour : "",
        toDate   : "",
        toHour   : "",
    };

    // The Current State
    const [ data, setData ] = React.useState({ ...initialData });


    // Update the data on Open
    React.useEffect(() => {
        const newData = {
            fromDate : currData?.fromDate || "",
            fromHour : currData?.fromHour || "",
            toDate   : currData?.toDate   || "",
            toHour   : currData?.toHour   || "",
        };
        if (datesName && datesName !== "period") {
            newData.fromDate = currData?.[`${datesName}FromDate`] || "";
            newData.toDate   = currData?.[`${datesName}ToDate`]   || "";
            newData.fromHour = currData?.[`${datesName}FromHour`] || "";
            newData.toHour   = currData?.[`${datesName}ToHour`]   || "";
        }
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
        onSubmit(data.fromDate, data.fromHour, data.toDate, data.toHour);
    };


    // Do the Render
    return <EditDialog
        open={open}
        icon="date-range"
        title={onlyHour ? "GENERAL_HOUR_RANGE" : "GENERAL_DATE_RANGE"}
        onSubmit={handleSubmit}
        onClose={onClose}
        isNarrow
    >
        <DialogMessage message={onlyHour ? "GENERAL_HOUR_RANGE_FILTER" : "GENERAL_DATE_RANGE_FILTER"} />
        <Columns amount={withHour ? 2 : 1}>
            <InputField
                isHidden={onlyHour}
                name="fromDate"
                type="date"
                label="GENERAL_FROM_DATE"
                maxValue="2999-12-31"
                value={data.fromDate}
                onChange={handleChange}
                hasClear
            />
            <InputField
                isHidden={!withHour && !onlyHour}
                name="fromHour"
                type="time"
                label="GENERAL_FROM_HOUR"
                value={data.fromHour}
                onChange={handleChange}
                hasClear
            />

            <InputField
                isHidden={onlyHour}
                name="toDate"
                type="date"
                label="GENERAL_TO_DATE"
                maxValue="2999-12-31"
                value={data.toDate}
                onChange={handleChange}
                hasClear
            />
            <InputField
                isHidden={!withHour && !onlyHour}
                name="toHour"
                type="time"
                label="GENERAL_TO_HOUR"
                value={data.toHour}
                onChange={handleChange}
                hasClear
            />
        </Columns>
    </EditDialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FilterDate.propTypes = {
    open      : PropTypes.bool.isRequired,
    withHour  : PropTypes.bool,
    onlyHour  : PropTypes.bool,
    currData  : PropTypes.object.isRequired,
    datesName : PropTypes.string,
    onSubmit  : PropTypes.func.isRequired,
    onClose   : PropTypes.func.isRequired,
};

export default FilterDate;
