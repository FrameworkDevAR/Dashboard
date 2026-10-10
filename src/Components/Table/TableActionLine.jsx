import React                from "react";
import PropTypes            from "prop-types";



/**
 * The Table Action Line Component, which separates the groups of the Table Actions
 * @returns {React.ReactElement}
 */
function TableActionLine() {
    return <React.Fragment />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TableActionLine.propTypes = {
    isHidden : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TableActionLine.defaultProps = {
    isHidden : false,
};

export default TableActionLine;
