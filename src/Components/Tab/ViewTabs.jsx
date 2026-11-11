import React                from "react";
import PropTypes            from "prop-types";

// Components
import TabList              from "./TabList";
import TabItem              from "./TabItem";



/**
 * The View Tabs
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ViewTabs(props) {
    const { view, onView } = props;


    // Do the Render
    return <TabList selected={view} onClick={onView}>
        <TabItem
            icon="grid"
            value="grid"
            tooltip="GENERAL_VIEW_GRID"
        />
        <TabItem
            icon="list"
            value="list"
            tooltip="GENERAL_VIEW_LIST"
        />
    </TabList>;
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
