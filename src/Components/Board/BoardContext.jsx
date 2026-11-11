import React                from "react";



/**
 * The Board Context, with what the Board gives to its Columns and Cards
 * @type {React.Context<{collapsed: number[], onCollapse: (columnID: number) => void, startDrag: (e: any, elemID: number, columnID: number) => void}>}
 */
const BoardContext = React.createContext({
    collapsed  : [],
    onCollapse : () => {},
    startDrag  : () => {},
});

export default BoardContext;
