import React                from "react";
import PropTypes            from "prop-types";

// Components
import PillTabs             from "./PillTabs";
import PillTab              from "./PillTab";



/**
 * The View Tabs
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ViewTabs(props) {
    const { view, onView } = props;


    // Do the Render
    return <PillTabs selected={view} onClick={onView}>
        <PillTab
            icon="grid"
            value="grid"
            tooltip="GENERAL_VIEW_GRID"
        />
        <PillTab
            icon="list"
            value="list"
            tooltip="GENERAL_VIEW_LIST"
        />
    </PillTabs>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ViewTabs.propTypes = {
    view   : PropTypes.string.isRequired,
    onView : PropTypes.func.isRequired,
};

export default ViewTabs;
