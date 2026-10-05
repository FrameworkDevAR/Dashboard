import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import InputType            from "../../Core/InputType";



/**
 * The Filter Item Component
 * @returns {React.ReactElement}
 */
function FilterItem() {
    return <React.Fragment />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FilterItem.propTypes = {
    isHidden      : PropTypes.bool,
    type          : PropTypes.string,
    name          : PropTypes.string,
    icon          : PropTypes.string,
    placeholder   : PropTypes.string,
    allowMultiple : PropTypes.bool,
    dontClose     : PropTypes.bool,
    showOptions   : PropTypes.bool,
    step          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minValue      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxValue      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxLength     : PropTypes.number,
    spellCheck    : PropTypes.string,
    isDisabled    : PropTypes.bool,
    options       : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    extraOptions  : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    anyText       : PropTypes.string,
    anyValue      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    noneText      : PropTypes.string,
    noneValue     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    defaultText   : PropTypes.string,
    fieldMinWidth : PropTypes.number,
    minWidth      : PropTypes.number,
    maxWidth      : PropTypes.number,
    fullWidth     : PropTypes.bool,
    withCustom    : PropTypes.bool,
    customFirst   : PropTypes.bool,
    customText    : PropTypes.string,
    customKey     : PropTypes.string,
    suggestID     : PropTypes.string,
    suggestFetch  : PropTypes.func,
    suggestParams : PropTypes.object,
    suggestWidth  : PropTypes.number,
    hasClear      : PropTypes.bool,
    hideClear     : PropTypes.bool,
    shrinkLabel   : PropTypes.bool,
    withHour      : PropTypes.bool,
    prefix        : PropTypes.string,
    suffix        : PropTypes.string,
    onChange      : PropTypes.func,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
FilterItem.defaultProps = {
    isHidden     : false,
    type         : InputType.TEXT,
    placeholder  : "",
    isDisabled   : false,
    options      : [],
    extraOptions : [],
    fullWidth    : false,
    noneText     : "",
    withCustom   : false,
    customFirst  : false,
    customText   : "",
    customKey    : "",
    showOptions  : false,
    hasClear     : false,
    hideClear    : false,
    shrinkLabel  : false,
    withHour     : false,
};

export default FilterItem;
