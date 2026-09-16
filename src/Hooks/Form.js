import React                from "react";

// Core & Utils
import Store                from "../Core/Store";
import Navigate             from "../Core/Navigate";
import Utils                from "../Utils/Utils";



/**
 * Returns a Hook to use the Form Data and Errors
 * @param {string}    slice
 * @param {object}    initialData
 * @param {Function=} edit
 * @param {Function=} onSubmit
 * @param {boolean=}  startInLoading
 * @param {boolean=}  open
 * @param {boolean=}  withUnsaved
 *
 * @typedef {object}    FormType
 * @property {boolean}  loading
 * @property {Function} startLoading
 * @property {Function} endLoading
 * @property {object}   data
 * @property {Function} setData
 * @property {Function} resetData
 * @property {object}   errors
 * @property {Function} setError
 * @property {Function} setErrors
 * @property {Function} resetErrors
 * @property {Function} setElem
 * @property {boolean} hasChanges
 * @property {(...args: any[]) => any} handleChange
 * @property {(...args: any[]) => any} handleSubmit
 * @returns {FormType}
 */
function useForm(slice, initialData, edit = undefined, onSubmit = undefined, startInLoading = true, open = true, withUnsaved = false) {
    const { loaders                } = Store.useState("core");
    const { startLoader, endLoader } = Store.useAction("core");

    const loading = loaders[slice] || false;

    const initialErrors = { form : "" };
    for (const key of Object.keys(initialData)) {
        initialErrors[key] = "";
    }

    const [ data,     setDataInt   ] = React.useState(Utils.clone(initialData));
    const [ errors,   setErrorsInt ] = React.useState({ ...initialErrors });
    const [ snapshot, setSnapshot  ] = React.useState(Utils.clone(initialData));

    // The changes are the difference with the data that was loaded or saved last, so a
    // value that goes back to what it was counts as no change
    const hasChanges = Boolean(open && !Utils.areSameData(data, snapshot));

    // Only the forms that ask for it warn before leaving with changes, as a form in a dialog
    // keeps its data after closing and would ask on the next navigation
    Navigate.useUnsaved(withUnsaved && hasChanges);

    // Reset the Loader
    React.useEffect(() => {
        if (open && !startInLoading) {
            endLoading();
        }
    }, [ open ]);


    // Starts the Loading
    const startLoading = () => {
        startLoader(slice);
    };

    // Ends the Loading
    const endLoading = () => {
        endLoader(slice);
    };

    // Sets the Data
    const setData = (fields) => {
        setDataInt({ ...data, ...fields });
    };

    // Resets the Data
    const resetData = (fields) => {
        const newData = { ...Utils.clone(initialData), ...fields };
        setDataInt(newData);
        setSnapshot(Utils.clone(newData));
    };


    // Sets an Error
    const setError = (field, error) => {
        setErrorsInt({ ...errors, [field] : error });
    };

    // Sets the Errors
    const setErrors = (newErrors) => {
        setErrorsInt({ ...initialErrors, ...newErrors });
    };

    // Resets the Errors
    const resetErrors = () => {
        setErrorsInt({ ...initialErrors });
    };


    // Sets the Elem
    const setElem = (elem = {}) => {
        const fields = {};
        for (const [ key, value ] of Object.entries(initialData)) {
            if (elem[key] !== undefined) {
                fields[key] = Utils.isBoolean(elem[key]) ? Number(elem[key]) : elem[key];
            } else {
                fields[key] = value;
            }
        }
        setDataInt(fields);
        setSnapshot(Utils.clone(fields));
        resetErrors();
        endLoading();
    };


    // Handles the Input Change. The name can be an object to set more than two fields,
    // as every call replaces the data and the ones in the same tick would be lost
    const handleChange = (name, value, secondName, secondValue) => {
        const hasFields = typeof name === "object";
        const fields    = hasFields ? { ...name } : { [name] : value };
        if (!hasFields && secondName) {
            fields[secondName] = secondValue;
        }

        setData(fields);
        const removeErrors = {};
        for (const key of Object.keys(fields)) {
            removeErrors[key] = "";
        }

        // Handle the Errors of a Field input
        try {
            const newItems   = JSON.parse(value);
            const oldItems   = JSON.parse(data[name]);
            const sameAmount = newItems.length === oldItems.length;

            for (const key of Object.keys(errors)) {
                if (!key.startsWith(name)) {
                    continue;
                }
                const parts = key.split("-");
                if (parts.length !== 3) {
                    continue;
                }
                // Remove the Error if an Item was added or removed, as the
                // Errors are stored by index, or if the value is now set
                if (!sameAmount || newItems[parts[1]]?.[parts[2]]) {
                    removeErrors[key] = "";
                }
            }
        } catch {
            // Do Nothing
        }
        setErrorsInt({ ...errors, ...removeErrors });
    };

    // Starts the Submit
    const handleSubmit = async (extraData = {}) => {
        if (!edit) {
            if (onSubmit) {
                onSubmit();
            }
            return;
        }

        if (loading) {
            return;
        }
        startLoading();
        resetErrors();
        try {
            const response = await edit({ ...data, ...extraData });
            endLoading();

            // What was saved is the new base, and the flag is cleared right away, as the
            // submit usually navigates before the effect gets to run
            setSnapshot(Utils.clone(data));
            if (withUnsaved) {
                Navigate.setUnsaved(false);
            }
            if (onSubmit) {
                onSubmit(response);
            }
        } catch (/** @type {object} */ errors) {
            endLoading();
            setErrorsInt(errors);
        }
    };


    // The API
    return {
        loading, startLoading, endLoading,
        data, setData, resetData, hasChanges,
        errors, setError, setErrors, resetErrors,
        setElem, handleChange, handleSubmit,
    };
}




// The public API
export default useForm;
