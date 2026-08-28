import React                from "react";

// Core & Utils
import Utils                from "../Utils/Utils";



// Constants
const MIN_SAVING_TIME  = 600;
const SHOW_RESULT_TIME = 5000;

// The Save Status of an Option
const Status = {
    SAVING  : "saving",
    SUCCESS : "success",
    ERROR   : "error",
};

// The Context with the Option that is being saved and its status
const SavingContext = React.createContext({ name : "", status : "" });



/**
 * Returns the value and the handlers used to show the save status of the Options
 * @returns {object}
 */
function useSaving() {
    // The References
    const startRef = React.useRef({});
    const timerRef = React.useRef(null);

    // The Current State
    const [ saving, setSaving ] = React.useState({ name : "", status : "" });


    // Sets the status of the given Option, when it is still the one saving
    const setStatus = (name, status) => {
        setSaving((current) => current.name === name ? { name, status } : current);
    };

    // Starts the Save of the given Option
    const startSaving = (name) => {
        Utils.clearTimeout(timerRef);
        startRef.current[name] = Date.now();
        setSaving({ name, status : Status.SAVING });
    };

    // Ends the Save of the given Option, showing the result for a bit
    const endSaving = (name, isError) => {
        // The request can complete instantly, so the loader is shown for a
        // minimum time before the result replaces it
        const elapsed = Date.now() - (startRef.current[name] ?? 0);
        delete startRef.current[name];

        window.setTimeout(() => {
            setStatus(name, isError ? Status.ERROR : Status.SUCCESS);
            Utils.setTimeout(timerRef, () => setStatus(name, ""), SHOW_RESULT_TIME);
        }, Math.max(MIN_SAVING_TIME - elapsed, 0));
    };


    return { saving, startSaving, endSaving };
}



// The public API
export default {
    SavingContext,
    Status,

    useSaving,
};
