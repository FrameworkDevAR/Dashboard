import React                from "react";
import NLS                  from "../Core/NLS";
import Utils                from "../Utils/Utils";



// Input Types
const BUTTONS  = "buttons";
const CHECKBOX = "checkbox";
const CHIPS    = "chips";
const CHOOSER  = "chooser";
const COLOR    = "color";
const DOUBLE   = "double";
const EMAILS   = "emails";
const EMOJI    = "emoji";
const FIELDS   = "fields";
const FILE     = "file";
const LIST     = "list";
const MEDIA    = "media";
const MULTIPLE = "multiple";
const NUMBER   = "number";
const PASSWORD = "password";
const RADIO    = "radio";
const RADIOBOX = "radiobox";
const SELECT   = "select";
const SUGGEST  = "suggest";
const TEXTAREA = "textarea";
const TOGGLE   = "toggle";

const TEXT     = "text";
const EMAIL    = "email";
const TEL      = "tel";
const URL      = "url";
const DATE     = "date";
const TIME     = "time";



/**
 * Returns true if the Input should have a Label
 * @param {string} type
 * @returns {boolean}
 */
function hasLabel(type) {
    return ![ CHECKBOX, RADIOBOX, TOGGLE ].includes(type);
}

/**
 * Returns true if the Input should have a Clear
 * @param {string} type
 * @returns {boolean}
 */
function hasClear(type) {
    return [ FILE, MEDIA, SELECT, SUGGEST ].includes(type);
}

/**
 * Returns true if the Input label can shrink
 * @param {string} type
 * @returns {boolean}
 */
function canShrink(type) {
    return ![
        BUTTONS, CHIPS, DOUBLE, MULTIPLE, FILE, MEDIA,
        CHECKBOX, RADIO, RADIOBOX,
        TOGGLE, FIELDS, LIST, COLOR, DATE, TIME,
    ].includes(type);
}

/**
 * Returns true if the Input has an element that can be focused
 * @param {string} type
 * @returns {boolean}
 */
function canFocus(type) {
    return ![
        BUTTONS, CHECKBOX, CHIPS, COLOR, DOUBLE, EMOJI, FIELDS,
        FILE, LIST, MEDIA, MULTIPLE, RADIO, RADIOBOX, TOGGLE,
    ].includes(type);
}

/**
 * Returns true if there is a value
 * @param {string} type
 * @param {*}      value
 * @returns {boolean}
 */
function isValueFilled(type, value) {
    if (Array.isArray(value)) {
        return Boolean(value.length);
    }
    if (type === NUMBER && Utils.isNumeric(value)) {
        return Boolean(String(value));
    }
    return Boolean(value);
}

/**
 * Returns true if there is a value
 * @param {string} type
 * @param {*}      value
 * @returns {boolean}
 */
function hasValue(type, value) {
    if (type === NUMBER && Utils.isNumeric(value)) {
        return Boolean(Number(value));
    }
    return isValueFilled(type, value);
}

/**
 * Gets the Options
 * @param {object} props
 * @returns {Array}
 */
function getOptions(props) {
    const items      = Array.isArray(props.options)      ? props.options      : NLS.select(props.options);
    const extraItems = Array.isArray(props.extraOptions) ? props.extraOptions : NLS.select(props.extraOptions);
    const result     = [];

    if (props.anyText) {
        const anyValue = props.anyValue ?? -1;
        result.push({ key : anyValue, value : NLS.get(props.anyText) });
    }
    if (props.noneText) {
        const noneValue = props.noneValue ?? 0;
        result.push({ key : noneValue, value : NLS.get(props.noneText) });
    }

    for (const item of items) {
        if (typeof item === "string") {
            result.push({ key : item, value : item });
        }
        else {
            result.push(item);
        }
    }

    for (const extraItem of extraItems) {
        result.push(extraItem);
    }
    return result;
}

/**
 * Returns true if the Input shows the Empty text instead of the Options
 * @param {string} type
 * @param {object} props
 * @returns {boolean}
 */
function showsEmpty(type, props) {
    if (!props.emptyText || ![ CHOOSER, SELECT ].includes(type)) {
        return false;
    }
    return getOptions(props).length === 0;
}

/**
 * Memoizes the Options
 * @param {object} props
 * @returns {Array}
 */
function useOptions(props) {
    return React.useMemo(() => {
        return getOptions(props);
    }, [ JSON.stringify(props.options), JSON.stringify(props.extraOptions), props.noneText ]);
}




// The Public API
export default {
    hasLabel,
    hasClear,
    canShrink,
    canFocus,
    isValueFilled,
    hasValue,
    getOptions,
    showsEmpty,
    useOptions,

    BUTTONS,
    CHECKBOX,
    CHIPS,
    CHOOSER,
    COLOR,
    DOUBLE,
    EMAILS,
    EMOJI,
    FIELDS,
    FILE,
    LIST,
    MEDIA,
    MULTIPLE,
    NUMBER,
    RADIO,
    RADIOBOX,
    SELECT,
    SUGGEST,
    TEXTAREA,
    TOGGLE,

    TEXT,
    EMAIL,
    TEL,
    URL,
    PASSWORD,
    DATE,
    TIME,
};
