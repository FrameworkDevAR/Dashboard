import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import InputType            from "../../Core/InputType";
import KeyCode              from "../../Utils/KeyCode";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import InputOptions         from "../Input/InputOptions";
import InputOption          from "../Input/InputOption";
import ChipList             from "../Chip/ChipList";
import ChipItem             from "../Chip/ChipItem";
import Icon                 from "../Common/Icon";



// Styles
const EditItem = Styled.li`
    flex-grow: 2;
`;

const InputIcon = Styled(Icon)`
    margin-top: -4px;
    margin-right: -6px;
`;



/**
 * The Chooser Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ChooserInput(props) {
    const {
        inputRef, className, isFocused, isDisabled,
        id, name, value, placeholder, createOption, onCreate,
        minHeight, onChange, onClear, onFocus, onBlur,
    } = props;


    // The References
    const containerRef   = React.useRef(null);
    const optionsRef     = React.useRef(null);
    const selectedIdxRef = React.useRef(-1);
    const selectedKeyRef = React.useRef("");

    // The Current State
    const [ filter,   setFilter ] = React.useState("");
    const [ timer,    setTimer  ] = React.useState(null);
    const [ hasFocus, setFocus  ] = React.useState(false);
    const [ bounds,   setBounds ] = React.useState({ top : 0, bottom : undefined, left : 0, width : 0, maxHeight : 0 });
    const [ update,   setUpdate ] = React.useState(0);


    // Clear the Timer
    React.useEffect(() => {
        return () => {
            if (timer) {
                window.clearTimeout(timer);
            }
        };
    }, [ timer ]);


    // Sets the Selected Index
    const setSelectedIndex = () => {
        selectedIdxRef.current = -1;
        selectedKeyRef.current = "";
    };

    // Sets the Values
    const setValues = (key) => {
        const pos = values.indexOf(key);
        if (pos > -1) {
            values.splice(pos, 1);
        } else {
            values.push(key);
        }

        onChange(name, values);
        setFilter("");
        setSelectedIndex();
    };

    // Handles the Click
    const handleClick = () => {
        if (!hasFocus) {
            inputRef.current.focus();
        }
    };

    // Handles the Create
    const handleCreate = (value) => {
        if (value !== "__create__") {
            return false;
        }

        onCreate(filter);
        setSelectedIndex();
        return true;
    };

    // Handles the Add
    const handleAdd = (e, value) => {
        e.stopPropagation();
        if (isDisabled) {
            return;
        }
        if (handleCreate(value)) {
            return;
        }
        setValues(value);
        triggerBlur();
    };

    // Handles the Remove
    const handleRemove = (e, value) => {
        if (isDisabled) {
            return;
        }
        e.stopPropagation();
        setValues(value);
        triggerBlur();
    };

    // Handles the Focus
    const handleFocus = () => {
        const rect    = Utils.getBounds(containerRef);

        let top       = rect.bottom;
        let bottom    = undefined;
        let maxHeight = window.innerHeight - rect.bottom - 10;

        // Show the Options above the Input if there is not enough space below
        if (top + minHeight > window.innerHeight) {
            top       = undefined;
            bottom    = window.innerHeight - rect.top + 5;
            maxHeight = 300;
        }

        setBounds({ top, bottom, left : rect.left, width : rect.width, maxHeight });
        setFocus(true);
        onFocus();
        setSelectedIndex();
    };

    // Handles the Blur
    const handleBlur = () => {
        setTimer(window.setTimeout(() => {
            setFilter("");
            triggerBlur();
            onBlur();
        }, 200));
    };

    // Handles the Blur
    const triggerBlur = () => {
        setFocus(false);
        setTimer(null);
    };

    // Handles the Input
    const handleInput = (e) => {
        setFilter(e.target.value);
    };

    // Handles the Key Down
    const handleKeyDown = (e) => {
        if (Utils.isSpecialKey(e.keyCode)) {
            return;
        }
        if (e.keyCode === KeyCode.DOM_VK_BACK_SPACE && !filter.length && values.length > 0) {
            setValues(values[values.length - 1]);
            e.preventDefault();
        }

        const [ newIndex, handled ] = Utils.handleKeyNavigation(e.keyCode, selectedIdxRef.current, filteredOptions.length);
        if (handled) {
            e.preventDefault();
        }

        selectedIdxRef.current = newIndex;
        selectedKeyRef.current = filteredOptions[newIndex]?.key ?? "";
        scrollToIndex(newIndex);
        setUpdate(update + 1);
    };

    // Handles the Key Up
    const handleKeyUp = (e) => {
        switch (e.keyCode) {
        case KeyCode.DOM_VK_ESCAPE:
            if (showOptions) {
                setFocus(false);
                e.stopPropagation();
            }
            break;
        case KeyCode.DOM_VK_RETURN:
            if (handleCreate(selectedKeyRef.current)) {
                return;
            }
            if (selectedKeyRef.current) {
                setValues(selectedKeyRef.current);
            }
            break;
        default:
        }
        e.preventDefault();
    };

    // Scrolls to the Index
    const scrollToIndex = (index) => {
        if (optionsRef.current) {
            const elem = optionsRef.current.querySelector(`.input-chooser-${index}`);
            if (elem) {
                elem.scrollIntoView({
                    behavior : "instant",
                    block    : "nearest",
                });
            }
        }
    };


    // Variables
    const options   = InputType.useOptions(props);
    const values    = !Array.isArray(value) ? [] : value;
    const hasCreate = Boolean(createOption && onCreate);


    // Get the Filtered Options
    const filteredOptions = React.useMemo(() => {
        let result = options.filter((item) => !Utils.hasValue(values, item.key));
        if (filter) {
            result = Utils.parseSearchResult(result, filter, "value");
        }
        if (hasCreate) {
            const text = NLS.get(createOption);
            result.push({
                key   : "__create__",
                value : "__create__",
                text  : filter ? `${text} "${filter}"` : text,
            });
        }
        return result;
    }, [ JSON.stringify(values), JSON.stringify(options), filter, hasCreate ]);

    // Get the Chips
    const chips = React.useMemo(() => {
        const result = [];
        for (const key of values) {
            result.push({ key, value : Utils.getValue(options, "key", key, "value") });
        }
        return result;
    }, [ JSON.stringify(values), JSON.stringify(options) ]);


    // Variables
    const showOptions  = Boolean(hasFocus && filteredOptions.length);
    const hasOptions   = Boolean(showOptions && filteredOptions.length);
    const isOnlyOption = Boolean(filteredOptions.length === 1);


    // Do the Render
    return <InputContent
        passedRef={containerRef}
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        onClick={handleClick}
        onClear={onClear}
        withBorder
        withPadding
        withLabel
    >
        <ChipList>
            {chips.map(({ key, value }) => <ChipItem
                key={key}
                message={value}
                onClick={(e) => handleRemove(e, key)}
                isDisabled={isDisabled}
            />)}

            {!isDisabled && <EditItem>
                <InputBase
                    inputRef={inputRef}
                    className="input-chooser"
                    id={id}
                    type="text"
                    name={name}
                    value={filter}
                    placeholder={placeholder}
                    onInput={handleInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                />
            </EditItem>}
        </ChipList>
        <InputIcon
            icon="expand"
            size="18"
        />

        {hasOptions && <InputOptions
            passedRef={optionsRef}
            inputRef={inputRef}
            top={bounds.top}
            bottom={bounds.bottom}
            left={bounds.left}
            width={bounds.width}
            maxHeight={bounds.maxHeight}
        >
            {filteredOptions.map(({ key, value, text }, index) => <InputOption
                key={key}
                className={`input-chooser-${index}`}
                forCreate={key === "__create__"}
                isOnlyOption={isOnlyOption}
                content={text || NLS.get(value)}
                isSelected={selectedIdxRef.current === index}
                onMouseDown={(e) => handleAdd(e, key)}
            />)}
        </InputOptions>}
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ChooserInput.propTypes = {
    inputRef     : PropTypes.object,
    className    : PropTypes.string,
    isFocused    : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    id           : PropTypes.string,
    name         : PropTypes.string,
    value        : PropTypes.any,
    placeholder  : PropTypes.string,
    options      : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    extraOptions : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    noneText     : PropTypes.string,
    noneValue    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    createOption : PropTypes.string,
    onCreate     : PropTypes.func,
    minHeight    : PropTypes.number,
    onChange     : PropTypes.func,
    onClear      : PropTypes.func,
    onFocus      : PropTypes.func,
    onBlur       : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ChooserInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    placeholder : "",
    noneText    : "",
    minHeight   : 100,
};

export default ChooserInput;
