import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import KeyCode              from "../../Utils/KeyCode";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import InputBase            from "../Input/InputBase";
import InputOptions         from "../Input/InputOptions";
import InputOption          from "../Input/InputOption";
import Html                 from "../Common/Html";
import Icon                 from "../Common/Icon";



// Styles
const Inside = Styled.div.attrs(({ inlineDescription }) => ({ inlineDescription }))`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 4px;

    ${(props) => props.inlineDescription && `
        flex-direction: row;
        align-items: center;
        gap: 8px;
    `}
`;

const Input = Styled(InputBase).attrs(({ isDisabled, isPlaceholder, inlineDescription }) => ({ isDisabled, isPlaceholder, inlineDescription }))`
    ${(props) => !props.isDisabled && "cursor: pointer;"}
    ${(props) => props.isPlaceholder && `
        && {
            color: var(--darkest-gray);
        }
    `}
    ${(props) => props.inlineDescription && `
        field-sizing: content;
        width: auto;
    `}
`;

const InputIcon = Styled(Icon).attrs(({ withLabel }) => ({ withLabel }))`
    margin-top: -4px;
    margin-right: -6px;

    ${(props) => props.withLabel ? `
        margin-top: -4px;
    ` : `
        margin-top: 0;
        margin-bottom: -4px;
    `}
`;

const Description = Styled(Html).attrs(({ isDisabled }) => ({ isDisabled }))`
    color: var(--font-lightest);
    font-size: 13px;
    ${(props) => !props.isDisabled && "cursor: pointer;"}
`;



/**
 * The Select Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SelectInput(props) {
    const {
        inputRef, className, icon, postIcon, prefixText, suffixText,
        isFocused, isDisabled, isSmall, withBorder, withLabel,
        id, name, placeholder, value, allowMultiple,
        defaultText, emptyText, noneText, noneValue,
        withCustom, customFirst, customText, customKey,
        options, extraOptions, descriptions, showDescription, inlineDescription,
        createOption, onCreate, customOption, onCustom, minWidth, minHeight,
        onChange, onClear, onFocus, onBlur, onSubmit,
    } = props;

    const initStyle = { top : 0, bottom : undefined, left : 0, width : 0, maxHeight : 0, opacity : 0 };

    // The References
    const containerRef   = React.useRef(null);
    const optionsRef     = React.useRef(null);
    const selectedIdxRef = React.useRef(-1);
    // It is null when there is nothing selected, as the none option has an
    // empty value and picking it has to change the value like any other
    const selectedValRef = React.useRef(null);

    // The Current State
    const [ initialVal,  setInitialVal  ] = React.useState("");
    const [ showOptions, setShowOptions ] = React.useState(false);
    const [ filter,      setFilter      ] = React.useState("");
    const [ timer,       setTimer       ] = React.useState(null);
    const [ style,       setStyle       ] = React.useState({ ...initStyle });
    const [ update,      setUpdate      ] = React.useState(0);

    // Variables
    const valueKey   = String(value || noneValue);
    const values     = allowMultiple && Array.isArray(value) ? value : [];
    const items      = Array.isArray(options)      ? options      : NLS.select(options);
    const extraItems = Array.isArray(extraOptions) ? extraOptions : NLS.select(extraOptions);
    const descItems  = Array.isArray(descriptions) ? descriptions : NLS.select(descriptions);
    const hasCreate  = Boolean(createOption && onCreate);
    const hasCustom  = Boolean(customOption && onCustom && filter);


    // Get the Options List
    const optionList = React.useMemo(() => {
        const result = [];
        if (noneText) {
            result.push({
                key         : "none",
                value       : noneValue,
                message     : NLS.get(noneText),
                text        : "",
                icon        : "",
                description : "",
                isTitle     : false,
            });
        }
        if (withCustom && customFirst) {
            result.push({
                key         : "custom",
                value       : customKey || -1,
                message     : NLS.get(customText  || "GENERAL_CUSTOM"),
                text        : "",
                icon        : "",
                description : "",
                isTitle     : false,
            });
        }
        for (const item of items) {
            let itemData = item;
            if (typeof item === "string") {
                itemData = { key : item, value : item };
            }
            const { key, value, icon : itemIcon, description, isTitle } = itemData;

            result.push({
                key         : `item-${key}`,
                value       : key,
                message     : NLS.get(value),
                text        : "",
                icon        : itemIcon || "",
                description : description ? NLS.get(description) : Utils.getValue(descItems, "key", key, "value"),
                isTitle     : Boolean(isTitle),
            });
        }
        for (const { key, value, icon : extraIcon, description } of extraItems) {
            result.push({
                key         : `extra-${key}`,
                value       : key,
                message     : NLS.get(value),
                text        : "",
                icon        : extraIcon || "",
                description : description ? NLS.get(description) : Utils.getValue(descItems, "key", key, "value"),
                isTitle     : false,
            });
        }
        if (withCustom && !customFirst) {
            result.push({
                key         : "custom",
                value       : customKey || -1,
                message     : NLS.get(customText || "GENERAL_CUSTOM"),
                text        : "",
                icon        : "",
                description : "",
                isTitle     : false,
            });
        }
        return result;
    }, [ noneText, noneValue, withCustom, customFirst, customText, customKey, JSON.stringify(items), JSON.stringify(extraItems) ]);

    // Get the Filtered Options
    const filteredOptions = React.useMemo(() => {
        let result = [ ...optionList ];
        if (filter) {
            const matches = Utils.parseSearchResult(optionList.filter(({ isTitle }) => !isTitle), filter, "message");
            result = [];
            for (const option of optionList) {
                const match = option.isTitle ? option : matches.find(({ key }) => key === option.key);
                if (match) {
                    result.push(match);
                }
            }
        }

        // Remove the Titles that ended without Options
        result = result.filter((option, index) => {
            return !option.isTitle || (result[index + 1] && !result[index + 1].isTitle);
        });

        if (hasCustom) {
            const text   = NLS.get(customOption);
            result.push({
                key         : "custom",
                value       : "__custom__",
                message     : `${text} "${filter}"`,
                text        : "",
                description : "",
                isTitle     : false,
            });
        }
        if (hasCreate) {
            const text   = NLS.get(createOption);
            result.push({
                key         : "create",
                value       : "__create__",
                message     : filter ? `${text} "${filter}"` : text,
                text        : "",
                description : "",
                isTitle     : false,
            });
        }
        return result;
    }, [ JSON.stringify(optionList), filter, hasCreate, hasCustom ]);

    // Check if there are Filtered Options
    const hasOptions = React.useMemo(() => {
        return Boolean(showOptions && (filteredOptions.length || hasCreate || hasCustom));
    }, [ showOptions, filteredOptions.length, hasCreate, hasCustom ]);

    // Get the Option Value and Description. The empty and default texts are
    // shown as a placeholder, as they mean that nothing was selected, while the
    // none option is a value of its own that can be picked like any other
    const [ optionValue, optionDesc, isPlaceholder ] = React.useMemo(() => {
        if (optionList.length === 0 && emptyText) {
            return [ NLS.get(emptyText), "", true ];
        }

        if (allowMultiple) {
            const valueList = [];
            for (const item of optionList) {
                if (!item.isTitle && values.includes(item.value)) {
                    valueList.push(NLS.get(item.message));
                }
            }
            if (!valueList.length && defaultText) {
                return [ NLS.get(defaultText), "", true ];
            }
            return [ valueList.join(", "), "", false ];
        }

        let value = "";
        let desc  = "";
        for (const item of optionList) {
            if (!item.isTitle && String(item.value) === valueKey) {
                value = item.message;
                desc  = item.description;
                break;
            }
        }
        return [ NLS.get(value), NLS.get(desc), false ];
    }, [ valueKey, JSON.stringify(optionList), allowMultiple, defaultText, emptyText ]);


    // Clear the Timer
    React.useEffect(() => {
        return () => {
            if (timer) {
                window.clearTimeout(timer);
            }
        };
    }, [ timer ]);

    // Sets the Selected Index
    const setSelectedIndex = (value) => {
        if (!allowMultiple) {
            selectedIdxRef.current = filteredOptions.findIndex((option) => String(option.value) === String(value)) ?? -1;
            selectedValRef.current = filteredOptions.find((option) => String(option.value) === String(value))?.value ?? null;
        } else {
            selectedIdxRef.current = -1;
            selectedValRef.current = null;
        }
    };

    // Sets the Values
    const setValues = (value) => {
        const pos = values.indexOf(value);
        if (pos > -1) {
            values.splice(pos, 1);
        } else {
            values.push(value);
        }
        onChange(name, values.length ? values : "");
    };


    // Handles the Click
    const handleClick = () => {
        if (!showOptions) {
            inputRef.current.focus();
            setShowOptions(true);
        }
    };

    // Handles the Focus
    const handleFocus = () => {
        setStyle({ ...initStyle });
        setSelectedIndex(valueKey);
        setInitialVal(selectedValRef.current);
        onFocus();
    };

    // Handle the After Focus
    React.useEffect(() => {
        if (!hasOptions || !containerRef.current || !optionsRef.current) {
            return;
        }

        const node    = containerRef.current.closest(".inputfield-double") || containerRef.current;
        const bounds  = node.getBoundingClientRect();

        const left    = bounds.left;
        const width   = bounds.width;

        let top       = bounds.bottom;
        let bottom    = undefined;
        let maxHeight = window.innerHeight - bounds.bottom - 10;

        if (top + minHeight > window.innerHeight) {
            top       = undefined;
            bottom    = window.innerHeight - bounds.top + 5;
            maxHeight = 300;
        }

        setStyle({ top, bottom, left, width, maxHeight, opacity : 1 });
        scrollToIndex(selectedIdxRef.current, true);
    }, [ hasOptions, optionsRef.current ]);

    // Handles the Blur
    // Writing in the filter clears the selected value, so an empty one is not
    // used, as it would clear the selection when blurring without picking one
    const handleBlur = () => {
        setTimer(window.setTimeout(() => {
            const hasSelected = selectedValRef.current !== null;
            if (!allowMultiple && hasSelected && selectedValRef.current !== initialVal) {
                onChange(name, selectedValRef.current);
            }

            setFilter("");
            setShowOptions(false);
            setTimer(null);
            onBlur();
        }, 200));
    };

    // Handles the Input
    const handleInput = (e) => {
        setFilter(e.target.value);
    };

    // Handles the Select
    const handleSelect = (e, value) => {
        e.stopPropagation();
        if (handleCreate(value)) {
            return;
        }
        if (allowMultiple) {
            setValues(value);
        } else {
            setSelectedIndex(value);
        }
    };

    // Handles the Create
    // The selection is restored, so closing the dialog keeps the current value
    const handleCreate = (value) => {
        if (value === "__custom__") {
            onCustom(filter);
            selectedValRef.current = initialVal;
            return true;
        }
        if (value !== "__create__") {
            return false;
        }

        onCreate(filter);
        selectedValRef.current = initialVal;
        return true;
    };

    // Returns the closest Index that is not a Title
    const getOptionIndex = (index, keyCode) => {
        const goesBack = [ KeyCode.DOM_VK_UP, KeyCode.DOM_VK_PAGE_UP, KeyCode.DOM_VK_END ].includes(keyCode);
        let   result   = index;

        for (let i = 0; i < filteredOptions.length; i++) {
            if (!filteredOptions[result]?.isTitle) {
                break;
            }
            if (goesBack) {
                result = result - 1 < 0 ? filteredOptions.length - 1 : result - 1;
            } else {
                result = (result + 1) % filteredOptions.length;
            }
        }
        return result;
    };

    // Handles the Key Down
    const handleKeyDown = (e) => {
        if (Utils.isSpecialKey(e.keyCode)) {
            return;
        }
        if (e.keyCode === KeyCode.DOM_VK_BACK_SPACE && !filter) {
            e.preventDefault();
        }

        const [ newIndex, handled ] = Utils.handleKeyNavigation(e.keyCode, selectedIdxRef.current, filteredOptions.length);
        selectedIdxRef.current = getOptionIndex(newIndex, e.keyCode);
        if (handled) {
            e.preventDefault();
        } else {
            selectedIdxRef.current = 0;
            selectedValRef.current = null;
            return;
        }

        selectedValRef.current = filteredOptions[selectedIdxRef.current]?.value ?? null;
        setShowOptions(true);
        scrollToIndex(selectedIdxRef.current, false);
        setUpdate(update + 1);
    };

    // Handles the Key Up
    const handleKeyUp = (e) => {
        switch (e.keyCode) {
        case KeyCode.DOM_VK_ESCAPE:
            if (showOptions) {
                setShowOptions(false);
                e.stopPropagation();
            }
            break;

        case KeyCode.DOM_VK_RETURN:
            if (handleCreate(selectedValRef.current)) {
                return;
            }
            if (!showOptions) {
                if (onSubmit) {
                    onSubmit();
                }
                return;
            }

            if (selectedValRef.current === null) {
                selectedValRef.current = filteredOptions.find(({ isTitle }) => !isTitle)?.value ?? null;
            }
            if (allowMultiple && selectedValRef.current) {
                setValues(selectedValRef.current);
            }
            inputRef.current.blur();
            break;

        default:
        }
        e.preventDefault();
    };

    // Scrolls to the Index
    const scrollToIndex = (index, isInitial) => {
        if (optionsRef.current) {
            const elem = optionsRef.current.querySelector(`.input-option-${index}`);
            if (elem) {
                elem.scrollIntoView({
                    behavior : "instant",
                    block    : isInitial ? "center" : "nearest",
                });
            }
        }
    };


    // More Variables
    const showDisabled   = Boolean(isDisabled || (emptyText && optionList.length === 0));
    const hasDescription = Boolean(!showOptions && showDescription && optionDesc);
    const isOnlyOption   = Boolean(filteredOptions.length === 1);
    const hasTitles      = filteredOptions.some(({ isTitle }) => isTitle);


    // Do the Render
    return <InputContent
        passedRef={containerRef}
        className={className}
        icon={icon}
        postIcon={postIcon}
        prefixText={prefixText}
        suffixText={suffixText}
        isFocused={isFocused}
        isDisabled={showDisabled}
        isSmall={isSmall}
        onClick={handleClick}
        onClear={onClear}
        withBorder={withBorder}
        withLabel={withLabel}
        withPadding
        withClick
    >
        <Inside inlineDescription={inlineDescription}>
            <Input
                inputRef={inputRef}
                className="input-select"
                id={id}
                type="text"
                name={name}
                value={showOptions ? filter : optionValue}
                placeholder={placeholder}
                isDisabled={showDisabled}
                isPlaceholder={isPlaceholder && !showOptions}
                onInput={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                inlineDescription={inlineDescription}
            />
            {hasDescription && <Description
                content={optionDesc}
                isDisabled={isDisabled}
            />}
        </Inside>
        <InputIcon
            icon="expand"
            withLabel={withLabel}
            size="18"
        />

        {hasOptions && <InputOptions
            passedRef={optionsRef}
            inputRef={inputRef}
            top={style.top}
            bottom={style.bottom}
            left={style.left}
            width={style.width}
            minWidth={minWidth}
            maxHeight={style.maxHeight}
            opacity={style.opacity}
        >
            {filteredOptions.map(({ key, value, text, message, icon : optionIcon, description, isTitle }, index) => <InputOption
                key={key}
                className={`input-option-${index}`}
                hasCreate={hasCreate}
                forCreate={value === "__create__"}
                isOnlyOption={isOnlyOption}
                isTitle={isTitle}
                leftSpace={hasTitles && !isTitle && !optionIcon}
                icon={optionIcon}
                content={text || message}
                description={description}
                inlineDescription={inlineDescription}
                isChecked={values.includes(value)}
                isSelected={selectedIdxRef.current === index}
                onMouseDown={(e) => handleSelect(e, value)}
                hasChecks={allowMultiple && !isTitle}
            />)}
        </InputOptions>}
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SelectInput.propTypes = {
    inputRef          : PropTypes.any,
    className         : PropTypes.string,
    icon              : PropTypes.string,
    postIcon          : PropTypes.string,
    prefixText        : PropTypes.string,
    suffixText        : PropTypes.string,
    isFocused         : PropTypes.bool,
    isDisabled        : PropTypes.bool,
    isSmall           : PropTypes.bool,
    withBorder        : PropTypes.bool,
    withLabel         : PropTypes.bool,
    id                : PropTypes.string,
    name              : PropTypes.string.isRequired,
    placeholder       : PropTypes.string,
    value             : PropTypes.any,
    allowMultiple     : PropTypes.bool,
    options           : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    extraOptions      : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    descriptions      : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    showDescription   : PropTypes.bool,
    inlineDescription : PropTypes.bool,
    defaultText       : PropTypes.string,
    emptyText         : PropTypes.string,
    noneText          : PropTypes.string,
    noneValue         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withCustom        : PropTypes.bool,
    customFirst       : PropTypes.bool,
    customText        : PropTypes.string,
    customKey         : PropTypes.string,
    createOption      : PropTypes.string,
    customOption      : PropTypes.string,
    onCustom          : PropTypes.func,
    onCreate          : PropTypes.func,
    minWidth          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minHeight         : PropTypes.number,
    onChange          : PropTypes.func.isRequired,
    onClear           : PropTypes.func,
    onFocus           : PropTypes.func,
    onBlur            : PropTypes.func,
    onSubmit          : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SelectInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    isSmall     : false,
    withBorder  : true,
    withLabel   : true,
    placeholder : "",
    emptyText   : "",
    noneText    : "",
    noneValue   : "",
    withCustom  : false,
    customFirst : false,
    customText  : "",
    minHeight   : 100,
};

export default SelectInput;
