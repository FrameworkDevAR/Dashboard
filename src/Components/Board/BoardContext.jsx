import React                from "react";



/**
 * The Board Context, with what the Board gives to its Columns and Cards
 * @type {React.Context<{collapsed: number[], onCollapse: Function, startDrag: Function}>}
 */
const BoardContext = React.createContext({
    collapsed  : [],
    onCollapse : () => {},
    startDrag  : () => {},
});

export default BoardContext;
