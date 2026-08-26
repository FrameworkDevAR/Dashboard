import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import Utils                from "../../Utils/Utils";

// Components
import Pill                 from "./Pill";



/**
 * The Pill Yes/No Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PillYesNo(props) {
    const { isHidden, className, value } = props;


    // Do the Render
    return <Pill
        isHidden={isHidden}
        className={className}
        variant={Number(value) ? "success" : "gray"}
        withDot
    >
        {Utils.toYesNo(value)}
    </Pill>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PillYesNo.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    value     : PropTypes.oneOfType([ PropTypes.bool, PropTypes.number, PropTypes.string ]),
};

export default PillYesNo;
