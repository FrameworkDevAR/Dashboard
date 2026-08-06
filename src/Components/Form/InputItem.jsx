import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import InputType            from "../../Core/InputType";



/**
 * The Input Item Component
 * @returns {React.ReactElement}
 */
function InputItem() {
    return <React.Fragment />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputItem.propTypes = {
    passedRef       : PropTypes.any,
    isHidden        : PropTypes.bool,
    subKey          : PropTypes.string,
    className       : PropTypes.string,
    type            : PropTypes.string,
    name            : PropTypes.string,
    label           : PropTypes.string,
    placeholder     : PropTypes.string,
    icon            : PropTypes.string,
    postIcon        : PropTypes.string,
    prefixText      : PropTypes.string,
    suffixText      : PropTypes.string,
    value           : PropTypes.any,
    step            : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minValue        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxValue        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxLength       : PropTypes.number,
    rows            : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    spellCheck      : PropTypes.string,
    isRequired      : PropTypes.bool,
    isDisabled      : PropTypes.bool,
    options         : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    extraOptions    : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    width           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withBorder      : PropTypes.bool,
    fullWidth       : PropTypes.bool,
    emptyText       : PropTypes.string,
    noneText        : PropTypes.string,
    noneValue       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    shrinkLabel     : PropTypes.bool,
    withCustom      : PropTypes.bool,
    customFirst     : PropTypes.bool,
    customText      : PropTypes.string,
    customKey       : PropTypes.string,
    hasClear        : PropTypes.bool,
    hideClear       : PropTypes.bool,
    createOption    : PropTypes.string,
    onCreate        : PropTypes.func,
    customOption    : PropTypes.string,
    onCustom        : PropTypes.func,
    onClear         : PropTypes.func,
    onChange        : PropTypes.func,
    onMedia         : PropTypes.func,
    onPaste         : PropTypes.func,
    onInput         : PropTypes.func,
    onKeyUp         : PropTypes.func,
    onKeyDown       : PropTypes.func,
    onSuggest       : PropTypes.func,
    suggestID       : PropTypes.string,
    suggestFetch    : PropTypes.func,
    suggestParams   : PropTypes.object,
    suggestWidth    : PropTypes.number,
    keepSuggestions : PropTypes.bool,
    columns         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    hide            : PropTypes.func,
    getType         : PropTypes.func,
    getLabel        : PropTypes.func,
    getOptions      : PropTypes.func,
    getValue        : PropTypes.func,
    getColumns      : PropTypes.func,
    getIcon         : PropTypes.func,
    getPostIcon     : PropTypes.func,
    getDisabled     : PropTypes.func,
    component       : PropTypes.any,
    children        : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputItem.defaultProps = {
    isHidden     : false,
    type         : InputType.TEXT,
    placeholder  : "",
    isRequired   : false,
    isDisabled   : false,
    options      : [],
    extraOptions : [],
    fullWidth    : false,
    shrinkLabel  : false,
    withCustom   : false,
    customFirst  : false,
    customText   : "",
    customKey    : "",
};

export default InputItem;
