import React                from "react";

// Core
import Store                from "../Core/Store";
import Navigate             from "../Core/Navigate";



/**
 * Returns a Hook to use the List Fetch
 * @param {string}   slice
 * @param {string=}  type
 * @param {boolean=} loadOnStart
 * @returns {object}
 */
function useList(slice, type = "", loadOnStart = true) {
    const elemID = Navigate.useOneParam(type);
    const data   = Store.useState(slice);
    const { startLoader, fetchList } = Store.useAction(slice);


    // Load the data
    React.useEffect(() => {
        if (loadOnStart) {
            load();
        }
        return () => startLoader();
    }, []);


    // Fetch the content
    const fetch = (params = data.sort) => {
        if (type && data.filters) {
            return fetchList(type, elemID, data.filters, params);
        }
        if (type) {
            return fetchList(type, elemID, params);
        }
        if (data.filters) {
            return fetchList(data.filters, params);
        }
        return fetchList(params);
    };

    // Loads the Content
    const load = (params = data.sort, withLoader = true) => {
        if (withLoader) {
            startLoader();
        }
        return fetch(params);
    };

    // Filters the content after Tab
    const loadTab = (filter, amount = 50, withLoader = true, extras = {}) => {
        if (withLoader) {
            startLoader();
        }
        return fetch({ ...data.sort, filter, page : 0, amount, ...extras });
    };

    // Filters the content after Filter
    const loadFilter = (filters, withLoader = true) => {
        if (withLoader) {
            startLoader();
        }
        const params = { ...data.sort, page : 0 };
        if (type) {
            return fetchList(type, elemID, filters, params);
        }
        return fetchList(filters, params);
    };


    // The API
    return { fetch, load, loadTab, loadFilter };
}




// The public API
export default useList;
