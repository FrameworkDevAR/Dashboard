import React                from "react";

// Core & Utils
import Utils                from "../Utils/Utils";



/**
 * Returns true while something is loading and for a minimum amount of time
 * @param {boolean} isLoading
 * @param {number=} minTime
 * @returns {boolean}
 */
function useMinLoading(isLoading, minTime = 200) {
    // A load that ends right away would blink what it hides or shows, so it lasts a minimum time.
    // It starts as loading, as the fetch is dispatched in an effect after the first render, and
    // that render would show the data of the previous page
    const startRef = React.useRef(Date.now());
    const timerRef = React.useRef(null);

    const [ isWaiting, setWaiting ] = React.useState(true);

    React.useEffect(() => {
        if (isLoading) {
            startRef.current = Date.now();
            Utils.clearTimeout(timerRef);
            setWaiting(true);
            return;
        }

        const elapsed = Date.now() - startRef.current;
        if (elapsed >= minTime) {
            setWaiting(false);
        } else {
            Utils.setTimeout(timerRef, () => setWaiting(false), minTime - elapsed);
        }
    }, [ isLoading ]);

    React.useEffect(() => {
        return () => Utils.clearTimeout(timerRef);
    }, []);

    return isWaiting;
}

export default useMinLoading;
