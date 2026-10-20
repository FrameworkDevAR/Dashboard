import React                from "react";

// Core
import Store                from "../Core/Store";



/**
 * Returns a Hook to use the Dialog Data
 * @param {string}    slice
 * @param {boolean}   open
 * @param {number=}   elemID
 * @param {object=}   data
 * @param {Function=} setElem
 * @param {Function=} getElem
 *
 * @typedef {object}    DialogType
 * @property {boolean}  loading
 * @property {boolean}  error
 * @property {Function} startLoading
 * @property {Function} endLoading
 * @property {object}   elem
 * @property {boolean}  canEdit
 * @returns {DialogType}
 */
function useDialog(slice, open, elemID = 0, data = null, setElem = null, getElem = null) {
    const { loaders } = Store.useState("core");
    const { startLoader, endLoader } = Store.useAction("core");

    const { elem, canEdit, edition, position } = Store.useState(slice);
    const { fetchElem, fetchEditData, fetchFilterData } = Store.useAction(slice);

    const loading = loaders[slice] || false;

    // The Current State
    const [ error, setError ] = React.useState(false);


    // The fetch answers an error when the element does not exist or can not be shown,
    // so the dialog can say so instead of showing an empty content
    const handleResult = async (promise) => {
        const data = await promise;
        setError(Boolean(data && data.error));
    };

    // Starts the Loading
    const startLoading = () => {
        startLoader(slice);
    };

    // Ends the Loading
    const endLoading = () => {
        endLoader(slice);
    };


    // Dialog Opens. The loading starts before the browser paints, as the body of the dialog
    // would show the fields with the data of the last time it was open for a frame
    React.useLayoutEffect(() => {
        if (!open) {
            return;
        }

        setError(false);
        if (getElem && elemID) {
            handleResult(getElem(elemID, ...Object.values(data || {})));
            startLoading();
        } else if (getElem) {
            handleResult(getElem(...Object.values(data || {})));
            startLoading();
        } else if (fetchElem && elemID) {
            handleResult(fetchElem(elemID, ...Object.values(data || {})));
            startLoading();
        } else if (fetchEditData) {
            handleResult(fetchEditData(...Object.values(data || {})));
            startLoading();
        } else if (fetchFilterData) {
            handleResult(fetchFilterData(...Object.values(data || {})));
            startLoading();
        } else if (setElem) {
            if (data) {
                setElem({ ...data });
            } else {
                setElem();
            }
        } else {
            endLoading();
        }
    }, [ open ]);


    // Data Updated
    React.useEffect(() => {
        if (!open) {
            return;
        }

        if (!setElem) {
            endLoading();
            return;
        }

        if (getElem && data) {
            setElem(data);
            endLoading();
        } else if (elemID) {
            setElem(elem);
            endLoading();
        } else {
            let fields = {};
            if (position) {
                fields.position = position;
            }
            if (data) {
                fields = { ...fields, ...data };
            }
            setElem({ ...fields });
            endLoading();
        }
    }, [ edition ]);


    // The API
    return {
        loading, error, startLoading, endLoading, elem, canEdit,
    };
}




// The public API
export default useDialog;
