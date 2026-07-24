import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Ajax                 from "../../Core/Ajax";
import InputType            from "../../Core/InputType";
import NLS                  from "../../Core/NLS";
import DateTime             from "../../Utils/DateTime";
import KeyCode              from "../../Utils/KeyCode";
import Period               from "../../Utils/Period";
import Utils                from "../../Utils/Utils";

// Components
import FilterField          from "./FilterField";
import FilterDate           from "./FilterDate";
import FilterRange          from "./FilterRange";
import ChipList             from "../Chip/ChipList";
import ChipItem             from "../Chip/ChipItem";
import InputOptions         from "../Input/InputOptions";
import InputOption          from "../Input/InputOption";
import MenuItem             from "../Menu/MenuItem";
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.div.attrs(({ isNarrow }) => ({ isNarrow }))`
    display: flex;
    gap: calc(var(--main-gap) / 2);
    box-sizing: border-box;
    height: calc(var(--filter-input-height) + 2px);
    margin: 0 0 var(--main-gap) 0;
    padding: 1px;
    width: 100%;

    ${(props) => props.isNarrow && "overflow: auto;"}
`;

const Content = Styled.div`
    display: flex;
    gap: calc(var(--main-gap) / 2);
`;

const Search = Styled(FilterField)`
    --input-border-radius: var(--filter-border-radius, var(--input-border-radius));

    flex-shrink: 0;
    width: var(--filter-input-width, 300px);
`;

const FilterIcon = Styled(IconLink)`
    --link-size: calc(var(--filter-input-height) - 8px);
    --link-radius: var(--border-radius);
    --link-background: var(--filter-input-hover);

    padding: 4px;
    font-size: 16px;
    background-color: var(--filter-input-background);
`;

const Chips = Styled(ChipList).attrs(({ isNarrow }) => ({ isNarrow }))`
    flex-grow: 2;
    flex-wrap: nowrap;
    margin-left: calc(var(--main-gap) / 2);

    li {
        padding-top: 5px;
        padding-bottom: 5px;
        line-height: 18px;
        white-space: nowrap;
        background-color: var(--lighter-gray);
    }
    li:hover {
        background-color: var(--light-gray);
    }
    ${(props) => !props.isNarrow && "overflow: auto;"}
`;



/**
 * The Filter Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Filter(props) {
    const {
        className, icon, message, values, initialValues,
        showRefresh, onFilter, children,
    } = props;


    // The References
    const containerRef   = React.useRef(null);
    const contentRef     = React.useRef(null);
    const inputRef       = React.useRef(null);
    const optionsRef     = React.useRef(null);
    const selectedRef    = React.useRef(-1);
    const selectedSubRef = React.useRef(-1);

    // The Current State
    const [ isNarrow,     setIsNarrow   ] = React.useState(false);
    const [ search,      setSearch      ] = React.useState("");
    const [ data,        setData        ] = React.useState({});
    const [ showOptions, setShowOptions ] = React.useState(false);
    const [ bounds,      setBounds      ] = React.useState({ top : 0, left : 0, width : 0, maxHeight : 0 });
    const [ showDates,   setShowDates   ] = React.useState(false);
    const [ showRange,   setShowRange   ] = React.useState(false);
    const [ editItem,    setEditItem    ] = React.useState({ name : "", message : "", withHour : false, onlyHour : false, prefix : "", suffix : "" });
    const [ update,      setUpdate      ] = React.useState(0);


    // Detect if the Filter is Narrow
    React.useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (!containerRef.current || !contentRef.current) {
                return;
            }
            const containerBounds = containerRef.current.getBoundingClientRect();
            const contentBounds   = contentRef.current.getBoundingClientRect();
            setIsNarrow(containerBounds.width < contentBounds.width);
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);


    // Parse the Items
    const childProps = Utils.getChildrenProps(children);
    const [ items, itemList ] = React.useMemo(() => {
        const items    = {};
        const itemList = [];
        const fields   = {};

        for (const child of childProps) {
            const options = InputType.getOptions(child);
            if (child.type === "period" && options.length) {
                options.unshift({
                    key   : Period.CUSTOM,
                    value : NLS.get("PERIOD_SELECT"),
                });
            }
            if (child.type === "select" && !options.length) {
                continue;
            }

            const item = {
                key           : child.name,
                type          : child.type,
                name          : child.name,
                icon          : child.icon,
                message       : NLS.get(child.label),
                options       : options,
                anyValue      : child.anyText ? (child.anyValue ?? -1) : 0,
                allowMultiple : Boolean(child.allowMultiple),
                dontClose     : Boolean(child.dontClose),
                withHour      : Boolean(child.withHour),
                onlyHour      : child.type === "time",
                prefix        : child.prefix,
                suffix        : child.suffix,
            };

            itemList.push(item);
            items[child.name]  = item;
            fields[child.name] = "";
            if (child.type === "period" || child.type === "date" || child.type === "time") {
                if (child.name === "period") {
                    fields.fromDate = "";
                    fields.fromHour = "";
                    fields.toDate   = "";
                    fields.toHour   = "";
                } else {
                    fields[`${child.name}FromDate`] = "";
                    fields[`${child.name}FromHour`] = "";
                    fields[`${child.name}ToDate`]   = "";
                    fields[`${child.name}ToHour`]   = "";
                }
            } else if (child.type === "range") {
                fields[`${child.name}From`] = "";
                fields[`${child.name}To`]   = "";
            }
        }
        if (values) {
            for (const [ key, value ] of Object.entries(values)) {
                fields[key] = value;
            }
        }

        setData(fields);
        return [ items, itemList ];
    }, [ JSON.stringify(childProps), JSON.stringify(values) ]);


    // Shows the Dates Dialog
    const showDatesDialog = (name, item) => {
        window.setTimeout(() => {
            setEditItem(item);
            setShowDates(true);
        }, 500);
    };

    // Shows the Range Dialog
    const showRangeDialog = (name, item) => {
        window.setTimeout(() => {
            setEditItem(item);
            setShowRange(true);
        }, 500);
    };

    // Handles the Update
    const handleUpdate = (name, value) => {
        setSearch(value);
        selectedRef.current    = -1;
        selectedSubRef.current = -1;
    };

    // Handles the Select
    const handleSelect = (name, value) => {
        const item = items[name];
        if (!item) {
            return;
        }

        if ((item.type === "period" && (!item.options.length || value === Period.CUSTOM)) || item.type === "date" || item.type === "time") {
            showDatesDialog(name, item);
        } else if (item.type === "range") {
            showRangeDialog(name, item);
        } else {
            let newData  = {};
            let newValue = value;

            if (item.allowMultiple) {
                let currentValues = data[name] || [];
                let newValues     = [];
                if (newValue === item.anyValue) {
                    newValues = [ item.anyValue ];
                } else {
                    if (item.anyValue && currentValues.includes(item.anyValue)) {
                        currentValues = currentValues.filter((currValue) => currValue !== item.anyValue);
                    }
                    if (currentValues.includes(newValue)) {
                        newValues = currentValues.filter((currValue) => currValue !== newValue);
                    } else {
                        newValues = [ ...currentValues, newValue ];
                    }
                }
                newData = { ...data, [name] : newValues };
            } else {
                if (item.type === "number") {
                    newValue = newValue.replace("#", "");
                }
                if (item.type === "toggle") {
                    newValue = Number(data[name]) === 1 ? 0 : 1;
                }
                newData = { ...data, [name] : newValue };
            }
            setData(newData);
            handleFilter(newData);
        }

        setSearch("");
        if (!item.dontClose) {
            inputRef.current.blur();
        }
    };

    // Handles the Remove
    const handleRemove = (name, value) => {
        const item = items[name];
        if (!item) {
            return;
        }

        let newData = {};
        if (item.allowMultiple) {
            const currentValues = data[name] || [];
            const newValues     = currentValues.filter((val) => val !== value);
            newData = { ...data, [name] : newValues };
        } else if (item.type === "period" || item.type === "date") {
            if (name === "period") {
                newData = {
                    ...data,
                    [name]   : "",
                    fromDate : "",
                    fromHour : "",
                    toDate   : "",
                    toHour   : "",
                };
            } else {
                newData = {
                    ...data,
                    [name]              : "",
                    [`${name}FromDate`] : "",
                    [`${name}FromHour`] : "",
                    [`${name}ToDate`]   : "",
                    [`${name}ToHour`]   : "",
                };
            }
        } else if (item.type === "range") {
            newData = {
                ...data,
                [`${name}From`] : "",
                [`${name}To`]   : "",
            };
        } else {
            newData = { ...data, [name] : "" };
        }

        if (initialValues && initialValues[name]) {
            newData[name] = initialValues[name];
        }

        setData(newData);
        handleFilter(newData);
    };

    // Handles the Submit of the Dates Dialog
    const handleDates = (fromDate, fromHour, toDate, toHour) => {
        const item = items[editItem.name];
        let newData = {};
        if (editItem.name === "period") {
            newData = { ...data, fromDate, fromHour, toDate, toHour, period : Period.CUSTOM };
        } else {
            newData = {
                ...data,
                [editItem.name]              : item.type === "period" ? Period.CUSTOM : "",
                [`${editItem.name}FromDate`] : fromDate,
                [`${editItem.name}FromHour`] : fromHour,
                [`${editItem.name}ToDate`]   : toDate,
                [`${editItem.name}ToHour`]   : toHour,
            };
        }

        setShowDates(false);
        setData(newData);
        handleFilter(newData);
    };

    // Handles the Submit of the Range Dialog
    const handleRange = (fromValue, toValue) => {
        const newData = {
            ...data,
            [`${editItem.name}From`] : fromValue,
            [`${editItem.name}To`]   : toValue,
        };
        setShowRange(false);
        setData(newData);
        handleFilter(newData);
    };

    // Handles the Click on a Chip
    const handleChipClick = (name, forDates, forRange) => {
        const item = items[name];
        if (item && forDates) {
            showDatesDialog(name, item);
        } else if (item && forRange) {
            showRangeDialog(name, item);
        }
    };

    // Handles the Refresh
    const handleRefresh = () => {
        handleFilter(data);
    };

    // Handles the Clear
    const handleClear = () => {
        const newFilters = initialValues ? { ...initialValues } : {};
        setData(newFilters);
        handleFilter(newFilters);
    };

    // Handles the Refresh
    const handleFilter = (data) => {
        Ajax.abort();
        onFilter(data);
    };


    // Returns the Icon for the Item
    const getIcon = (name, value, isSubmenu) => {
        const item = items[name];
        if (!item) {
            return "";
        }
        if (item.type !== "toggle" && !isSubmenu) {
            return item.icon;
        }

        let hasValue = data[name] === value;
        if (item.allowMultiple) {
            const currentValues = data[name] || [];
            hasValue = currentValues.includes(value);
        }

        if (item.allowMultiple || item.type === "toggle") {
            return hasValue ? "checkbox-on" : "checkbox-off";
        }
        return hasValue ? "radio-on" : "radio-off";
    };


    // Handles the Focus
    const handleFocus = () => {
        const bounds = Utils.getBounds(inputRef);
        setBounds({
            top       : bounds.bottom + 6,
            left      : bounds.left - 32,
            width     : bounds.width,
            maxHeight : window.innerHeight - bounds.bottom - 10,
        });
        setShowOptions(true);
        selectedRef.current = -1;
    };

    // Handles the Blur
    const handleBlur = () => {
        setShowOptions(false);
        setSearch("");
        selectedRef.current    = -1;
        selectedSubRef.current = -1;
    };

    // Handles the Close
    const handleClose = () => {
        inputRef.current.blur();
    };

    // Handles the Key Down
    const handleKeyDown = (e) => {
        if (e.keyCode === KeyCode.DOM_VK_RETURN) {
            return;
        }

        const item = optionList[selectedRef.current];
        if (item && item.options) {
            let newSubIndex = 0;
            let subHandled  = false;

            switch (e.keyCode) {
            case KeyCode.DOM_VK_RIGHT:
            case KeyCode.DOM_VK_RETURN:
                newSubIndex = 0;
                subHandled  = true;
                break;
            case KeyCode.DOM_VK_LEFT:
                newSubIndex = -1;
                subHandled  = true;
                break;
            default:
                if (selectedSubRef.current >= 0) {
                    [ newSubIndex, subHandled ] = Utils.handleKeyNavigation(e.keyCode, selectedSubRef.current, item.options.length);
                }
            }
            if (subHandled) {
                selectedSubRef.current = newSubIndex;
                setUpdate(update + 1);
                e.preventDefault();
                return;
            }
        }

        const [ newIndex, handled ] = Utils.handleKeyNavigation(e.keyCode, selectedRef.current, optionList.length);
        if (handled) {
            selectedRef.current = newIndex;
            e.preventDefault();
        }

        selectedSubRef.current = -1;
        scrollToIndex(selectedRef.current);
        setShowOptions(true);
        setUpdate(update + 1);
    };

    // Scrolls to the Index
    const scrollToIndex = (index) => {
        if (optionsRef.current && selectedSubRef.current < 0) {
            const elem = optionsRef.current.querySelector(`.input-option-${index}`);
            if (elem) {
                elem.scrollIntoView({
                    behavior : "instant",
                    block    : "nearest",
                });
            }
        }
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
        case KeyCode.DOM_VK_RETURN: {
            const index  = Math.max(0, selectedRef.current);
            const option = optionList[index];
            if (option) {
                if (selectedSubRef.current >= 0) {
                    const subOption = option.options[selectedSubRef.current];
                    if (subOption) {
                        handleSelect(option.name, subOption.key);
                    }
                } else {
                    handleSelect(option.name, option.value);
                }
            }
            break;
        }
        default:
        }
        e.preventDefault();
    };


    // Generates the Options
    const optionList = React.useMemo(() => {
        const result = [];
        for (const item of itemList) {
            // Only show a text item if searching
            if (!item.type || item.type === "text" || item.type === "textarea" || item.type === "email") {
                if (search) {
                    result.push({
                        ...item,
                        value : search,
                        text  : `${NLS.get(item.message)} "${search}"`,
                    });
                }
                continue;
            }

            // Only show a number item if searching a number
            if (item.type === "number") {
                if (search && Utils.isNumeric(search.replace("#", ""))) {
                    result.push({
                        ...item,
                        value : search,
                        text  : `${NLS.get(item.message)} "${search}"`,
                    });
                }
                continue;
            }

            // If searching show the item options as main items
            if (search && item.options) {
                let added = false;
                for (const option of item.options || []) {
                    if (Utils.searchValue(option.value, search)) {
                        result.push({
                            key           : `${item.name}-${option.key}`,
                            name          : item.name,
                            value         : option.key,
                            icon          : item.icon,
                            message       : item.message,
                            text          : `${NLS.get(item.message)} "${option.value}"`,
                            options       : [],
                            allowMultiple : false,
                            dontClose     : false,
                            withHour      : false,
                        });
                        added = true;
                    }
                }
                if (added) {
                    continue;
                }
            }

            // Show the normal item if match the search
            if (Utils.searchValue(item.message, search)) {
                if (item.type === "toggle") {
                    result.push({ ...item, value : 1 });
                } else {
                    result.push({ ...item, value : "" });
                }
            }
        }
        return result;
    }, [ JSON.stringify(itemList), JSON.stringify(data), search ]);


    // Generates the Chips
    const chipList = React.useMemo(() => {
        const result = [];
        for (const [ name, value ] of Object.entries(data)) {
            const item = items[name];
            if (!item) {
                continue;
            }

            const values = Array.isArray(value) ? value : [ value ];
            for (const val of values) {
                let valueName = val;
                let forDates  = false;
                let forRange  = false;

                if ((item.type === "period" && val === Period.CUSTOM) || item.type === "date") {
                    forDates = true;

                    // @ts-ignore
                    let { fromDate, fromHour, toDate, toHour } = data;
                    let fromText = "";
                    let toText   = "";

                    if (name !== "period") {
                        fromDate = data[`${name}FromDate`];
                        fromHour = data[`${name}FromHour`];
                        toDate   = data[`${name}ToDate`];
                        toHour   = data[`${name}ToHour`];
                    }

                    fromText = fromDate ? DateTime.formatDate(fromDate, "dashes") : "";
                    toText   = toDate   ? DateTime.formatDate(toDate,   "dashes") : "";
                    if (item.withHour) {
                        fromText += fromHour ? `, ${fromHour}` : "";
                        toText   += toHour   ? `, ${toHour}`   : "";
                    }

                    if (fromText && toText) {
                        valueName = NLS.format("GENERAL_RANGE_DATES", fromText, toText);
                    } else if (fromText) {
                        valueName = NLS.format("GENERAL_RANGE_FROM", fromText);
                    } else if (toText) {
                        valueName = NLS.format("GENERAL_RANGE_TO", toText);
                    }
                } else if (item.type === "time") {
                    forDates = true;
                    const fromText = data[`${name}FromHour`] || "";
                    const toText   = data[`${name}ToHour`]   || "";

                    if (fromText && toText) {
                        valueName = NLS.format("GENERAL_RANGE_DATES", fromText, toText);
                    } else if (fromText) {
                        valueName = NLS.format("GENERAL_RANGE_FROM", fromText);
                    } else if (toText) {
                        valueName = NLS.format("GENERAL_RANGE_TO", toText);
                    }
                } else if (item.type === "range") {
                    forRange = true;
                    const fromValue = data[`${name}From`] || "";
                    const toValue   = data[`${name}To`]   || "";
                    const fromText  = [ item.prefix, fromValue, item.suffix ].join("");
                    const toText    = [ item.prefix, toValue,   item.suffix ].join("");

                    if (fromValue && toValue) {
                        valueName = NLS.format("GENERAL_RANGE", fromText, toText);
                    } else if (fromValue) {
                        valueName = NLS.format("GENERAL_RANGE_FROM", fromText);
                    } else if (toValue) {
                        valueName = NLS.format("GENERAL_RANGE_TO", toText);
                    }
                } else if (val && item.options) {
                    valueName = item.options.find((opt) => opt.key === val)?.value || val;
                }
                if (!valueName) {
                    continue;
                }

                let message = `<b>${item.message}</b>: ${valueName}`;
                if (item.type === "toggle") {
                    message = `<b>${item.message}</b>`;
                }

                result.push({
                    key      : `${name}-${val}`,
                    name     : name,
                    value    : val,
                    message  : message,
                    forDates : forDates,
                    forRange : forRange,
                });
            }
        }
        return result;
    }, [ JSON.stringify(data) ]);

    // Checks if it has any Filter
    const hasAnyFilter = React.useMemo(() => {
        for (const value of Object.values(data)) {
            if (value && ((Array.isArray(value) && value.length) || (!Array.isArray(value)))) {
                return true;
            }
        }
        return false;
    }, [ JSON.stringify(data) ]);

    // Checks if it has any Non Default Filter
    const hasClear = React.useMemo(() => {
        for (const [ name, value ] of Object.entries(data)) {
            if (name === "fromDate" || name === "toDate" || name === "fromHour" || name === "toHour") {
                continue;
            }

            if (Array.isArray(value)) {
                if (value.length) {
                    return true;
                }
                continue;
            }

            const initialValue = initialValues ? initialValues[name] : undefined;
            if (value && String(value) !== String(initialValue)) {
                return true;
            }
        }
        return false;
    }, [ JSON.stringify(data), JSON.stringify(initialValues) ]);


    // variables
    const hasRefresh = showRefresh || hasAnyFilter;
    const hasOptions = Boolean(showOptions && optionList.length);


    // Do the Render
    return <>
        <Container
            ref={containerRef}
            className={className}
            isNarrow={isNarrow}
        >
            <Content ref={contentRef}>
                <Search
                    passedRef={inputRef}
                    type="text"
                    name="search"
                    icon={icon}
                    placeholder={message}
                    value={search}
                    onUpdate={handleUpdate}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                />
                <FilterIcon
                    isHidden={!hasRefresh}
                    variant="black"
                    icon="refresh"
                    onClick={handleRefresh}
                />
                <FilterIcon
                    isHidden={!hasClear}
                    variant="black"
                    icon="filter-clear"
                    onClick={handleClear}
                />
            </Content>

            <Chips isNarrow={isNarrow}>
                {chipList.map(({ key, name, value, message, forDates, forRange }) => <ChipItem
                    key={key}
                    message={message}
                    canClick={forDates || forRange}
                    onClick={() => handleChipClick(name, forDates, forRange)}
                    canClose={initialValues ? String(initialValues[name]) !== String(value) : true}
                    onClose={() => handleRemove(name, value)}
                />)}
            </Chips>
        </Container>

        {hasOptions && <InputOptions
            passedRef={optionsRef}
            inputRef={inputRef}
            top={bounds.top}
            left={bounds.left}
            width={bounds.width}
            maxHeight={bounds.maxHeight}
            minWidth={300}
            gap={4}
        >
            {optionList.map(({ key, name, value, text, message, options, dontClose }, index) => <InputOption
                key={key}
                className={`input-option-${index}`}
                icon={getIcon(name, value, false)}
                content={text || message}
                isSelected={selectedRef.current === index}
                onMouseDown={!options.length ? () => handleSelect(name, value) : undefined}
                onClose={handleClose}
            >
                {options.map((option, subIndex) => <MenuItem
                    key={option.key}
                    icon={getIcon(name, option.key, true)}
                    message={option.value}
                    isSelected={selectedSubRef.current === subIndex}
                    onClick={() => handleSelect(name, option.key)}
                    dontClose={dontClose}
                />)}
            </InputOption>)}
        </InputOptions>}

        <FilterDate
            open={showDates}
            currData={data}
            datesName={editItem.name}
            withHour={editItem.withHour}
            onlyHour={editItem.onlyHour}
            onSubmit={handleDates}
            onClose={() => setShowDates(false)}
        />
        <FilterRange
            open={showRange}
            currData={data}
            name={editItem.name}
            label={editItem.message}
            prefix={editItem.prefix}
            suffix={editItem.suffix}
            onSubmit={handleRange}
            onClose={() => setShowRange(false)}
        />
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Filter.propTypes = {
    className     : PropTypes.string,
    icon          : PropTypes.string,
    message       : PropTypes.string,
    values        : PropTypes.object.isRequired,
    initialValues : PropTypes.object,
    onFilter      : PropTypes.func.isRequired,
    showRefresh   : PropTypes.bool,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Filter.defaultProps = {
    className     : "",
    icon          : "search",
    message       : "GENERAL_WRITE_TO_SEARCH_FILTER",
    initialValues : {},
};

export default Filter;
