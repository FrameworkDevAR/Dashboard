import React                from "react";
import PropTypes            from "prop-types";

// Core & Utils
import InputType            from "../../Core/InputType";

// Components
import ButtonsInput         from "../InputType/ButtonsInput";
import CheckboxInput        from "../InputType/CheckboxInput";
import ChipsInput           from "../InputType/ChipsInput";
import ChooserInput         from "../InputType/ChooserInput";
import ColorInput           from "../InputType/ColorInput";
import DoubleInput          from "../InputType/DoubleInput";
import EmailsInput          from "../InputType/EmailsInput";
import EmojiInput           from "../InputType/EmojiInput";
import FieldInput           from "../InputType/FieldInput";
import FileInput            from "../InputType/FileInput";
import ListInput            from "../InputType/ListInput";
import MediaInput           from "../InputType/MediaInput";
import MultipleInput        from "../InputType/MultipleInput";
import NumberInput          from "../InputType/NumberInput";
import PasswordInput        from "../InputType/PasswordInput";
import RadioInput           from "../InputType/RadioInput";
import RadioboxInput        from "../InputType/RadioboxInput";
import SelectInput          from "../InputType/SelectInput";
import SuggestInput         from "../InputType/SuggestInput";
import TextareaInput        from "../InputType/TextareaInput";
import ToggleInput          from "../InputType/ToggleInput";
import TextInput            from "../InputType/TextInput";



/**
 * The Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Input(props) {
    const { type, value, onMedia } = props;

    switch (type) {
    case InputType.BUTTONS:
        return <ButtonsInput {...props} />;
    case InputType.CHECKBOX:
        return <CheckboxInput {...props} value="1" isChecked={!!value} />;
    case InputType.CHIPS:
        return <ChipsInput {...props} />;
    case InputType.CHOOSER:
        return <ChooserInput {...props} />;
    case InputType.COLOR:
        return <ColorInput {...props} />;
    case InputType.DOUBLE:
        return <DoubleInput {...props} />;
    case InputType.EMAILS:
        return <EmailsInput {...props} />;
    case InputType.EMOJI:
        return <EmojiInput {...props} />;
    case InputType.FIELDS:
        return <FieldInput {...props} />;
    case InputType.FILE:
        return <FileInput {...props} />;
    case InputType.LIST:
        return <ListInput {...props} />;
    case InputType.MEDIA:
        return <MediaInput {...props} onClick={onMedia} />;
    case InputType.MULTIPLE:
        return <MultipleInput {...props} />;
    case InputType.NUMBER:
        return <NumberInput {...props} />;
    case InputType.PASSWORD:
        return <PasswordInput {...props} />;
    case InputType.RADIO:
        return <RadioInput {...props} />;
    case InputType.RADIOBOX:
        return <RadioboxInput {...props} />;
    case InputType.SELECT:
        return <SelectInput {...props} />;
    case InputType.SUGGEST:
        return <SuggestInput {...props} />;
    case InputType.TEXTAREA:
        return <TextareaInput {...props} />;
    case InputType.TOGGLE:
        return <ToggleInput {...props} />;
    default:
        return <TextInput {...props} />;
    }
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Input.propTypes = {
    className    : PropTypes.string,
    id           : PropTypes.string,
    type         : PropTypes.string,
    inputType    : PropTypes.string,
    name         : PropTypes.string,
    label        : PropTypes.string,
    placeholder  : PropTypes.string,
    value        : PropTypes.any,
    minValue     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxValue     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxAmount    : PropTypes.number,
    maxLength    : PropTypes.number,
    autoComplete : PropTypes.string,
    spellCheck   : PropTypes.string,
    isDisabled   : PropTypes.bool,
    withBorder   : PropTypes.bool,
    addButton    : PropTypes.string,
    options      : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    extraOptions : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    fullWidth    : PropTypes.bool,
    hasLabel     : PropTypes.bool,
    emptyText    : PropTypes.string,
    noneText     : PropTypes.string,
    noneValue    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withCustom   : PropTypes.bool,
    customFirst  : PropTypes.bool,
    customText   : PropTypes.string,
    customKey    : PropTypes.string,
    onChange     : PropTypes.func.isRequired,
    onInput      : PropTypes.func,
    onSubmit     : PropTypes.func,
    onKeyDown    : PropTypes.func,
    onKeyUp      : PropTypes.func,
    onMedia      : PropTypes.func,
    onFocus      : PropTypes.func,
    onBlur       : PropTypes.func,
    onClear      : PropTypes.func,
    isSortable   : PropTypes.bool,
    onSort       : PropTypes.func,
    inputRef     : PropTypes.object,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Input.defaultProps = {
    className    : "",
    type         : InputType.TEXT,
    inputType    : InputType.TEXT,
    placeholder  : "",
    autoComplete : "off",
    isDisabled   : false,
    options      : [],
    extraOptions : [],
    fullWidth    : false,
    withCustom   : false,
    customFirst  : false,
    customText   : "",
    customKey    : "",
    isSortable   : false,
};

export default Input;
