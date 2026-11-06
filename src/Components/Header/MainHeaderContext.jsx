import React                from "react";



/**
 * The Main Header Context, with the actions of the Main Header that its Filter shows
 * @type {React.Context<{actions: any, setHasFilter: Function}>}
 */
const MainHeaderContext = React.createContext({
    actions      : null,
    setHasFilter : () => {},
});

export default MainHeaderContext;
