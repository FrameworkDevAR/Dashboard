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



// Styles
const Input = Styled(InputBase).attrs(({ isDisabled }) => ({ isDisabled }))`
    {(props) => !props.isDisabled && "cursor: pointer;"}
`;



/**
 * The Suggest Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SuggestInput(props) {
    const {
        inputRef, className, icon,
        isFocused, isDisabled, isSmall, withBorder, withLabel,
        id, name, value, placeholder, emptyText, searchText,
        suggestID, suggestFetch, suggestParams, keepSuggestions,
        suggestWidth, createOption, showCreate, onCreate,
        onChange, onClear, onFocus, onBlur,
    } = props;


    // The References
    const containerRef   = React.useRef(null);
    const optionsRef     = React.useRef(null);
    const selectedIdxRef = React.useRef(-1);
    const timerRef       = React.useRef(null);
    const blurRef        = React.useRef(null);

    // The Current State
    const [ showOptions, setShowOptions ] = React.useState(false);
    const [ suggestions, setSuggestions ] = React.useState([]);
    const [ search,      setSearch      ] = React.useState("");
    const [ bounds,      setBounds      ] = React.useState({ top : 0, left : 0, width : 0, maxHeight : 0 });
    const [ searching,   setSearching   ] = React.useState(false);
    const [ update,      setUpdate      ] = React.useState(0);


    // Clear the Blur Timer
    React.useEffect(() => {
        return () => {
            if (blurRef.current) {
                window.clearTimeout(blurRef.current);
            }
        };
    }, []);


    // Returns true if it should search
    const shouldSearch = (search) => {
        return search.length > 1;
    };

    // Sets the Search Value
    const setSearchValue = async (newSearch) => {
        setSearch(newSearch);
        if (search !== newSearch && value !== newSearch) {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                setSearching(false);
            }

            if (shouldSearch(newSearch)) {
                setSearching(true);
                timerRef.current = window.setTimeout(() => {
                    fetchValue(newSearch);
                }, 1000);
            } else {
                setSuggestions([]);
            }
        }
    };

    // Does the Actual Fetch
    const fetchValue = async (value) => {
        const newSuggestions = await suggestFetch({ value, ...suggestParams || {} });
        setSearching(false);

        if (newSuggestions && Array.isArray(newSuggestions)) {
            selectedIdxRef.current = -1;
            const parsedSuggestions = Utils.parseSearchResult(newSuggestions, value, "title", false);
            setSuggestions(parsedSuggestions);
        }
    };

    // Selects the Elem
    const selectElem = (newID, newValue, data) => {
        onChange(name, newValue, suggestID, newID, data);
        if (!keepSuggestions) {
            setSuggestions([]);
        }

        selectedIdxRef.current = -1;
        setSearch("");
        setShowOptions(false);
    };


    // Handles the Click
    const handleClick = () => {
        if (!showOptions) {
            inputRef.current.focus();
            setShowOptions(true);
        }
    };

    // Handles the Focus
    // A pending blur is cancelled, as the field is focused again
    const handleFocus = () => {
        if (blurRef.current) {
            window.clearTimeout(blurRef.current);
            blurRef.current = null;
        }

        const node   = containerRef.current.closest(".inputfield-double") || containerRef.current;
        const bounds = node.getBoundingClientRect();
        setBounds({
            top       : bounds.bottom,
            left      : bounds.left,
            width     : bounds.width,
            maxHeight : window.innerHeight - bounds.bottom - 10,
        });
        onFocus();
        selectedIdxRef.current = -1;
    };

    // Handles the Blur
    const handleBlur = () => {
        blurRef.current = window.setTimeout(() => {
            blurRef.current = null;
            setShowOptions(false);
            setSearch("");
            setSuggestions([]);
            onBlur();
        }, 200);
    };

    // Handles the Select
    const handleSelect = (e, newID, newValue, data) => {
        e.stopPropagation();
        if (handleCreate(newID)) {
            return;
        }
        selectElem(newID, newValue, data);
        setShowOptions(false);
    };

    // Handles the Create Option
    const handleCreate = (value) => {
        if (value !== "__create__") {
            return false;
        }
        onCreate(search);
        return true;
    };

    // Handles the Input
    const handleInput = (e) => {
        setSearchValue(e.target.value);
    };

    // Handles the Key Down
    const handleKeyDown = (e) => {
        if (Utils.isSpecialKey(e.keyCode)) {
            return;
        }

        const [ newIndex, handled ] = Utils.handleKeyNavigation(e.keyCode, selectedIdxRef.current, filteredOptions.length);
        selectedIdxRef.current = newIndex;
        if (handled) {
            e.preventDefault();
        }

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
            if (filteredOptions[selectedIdxRef.current]) {
                const elem = filteredOptions[selectedIdxRef.current];
                if (!handleCreate(elem.id)) {
                    selectElem(elem.id, elem.title, elem);
                }
            }
            break;

        default:
            setSearchValue(e.target.value);
        }
        e.preventDefault();
    };

    // Scrolls to the Index
    const scrollToIndex = (index, isInitial) => {
        if (optionsRef.current) {
            const elem = optionsRef.current.querySelector(`.input-suggestion-${index}`);
            if (elem) {
                elem.scrollIntoView({
                    behavior : "instant",
                    block    : isInitial ? "center" : "nearest",
                });
            }
        }
    };


    // Variables
    const hasCreate = Boolean(createOption && onCreate);

    // Get the Filtered Options
    const filteredOptions = React.useMemo(() => {
        const result = [ ...suggestions ];
        if (hasCreate) {
            result.push({
                id   : "__create__",
                text : NLS.get(createOption),
            });
        }
        return result;
    }, [ JSON.stringify(suggestions), hasCreate ]);


    // Variables
    const hasValue            = Boolean(value);
    const hasSearch           = shouldSearch(search);
    const showSearch          = Boolean(hasSearch && searching && searchText);
    const showEmpty           = Boolean(hasSearch && !searching && !suggestions.length && emptyText);
    const showLine            = Boolean(hasValue && (showSearch || showEmpty || suggestions.length));
    const showFilteredOptions = Boolean(filteredOptions.length && !searching);
    const hasOptions          = Boolean(showOptions && (hasValue || showSearch || showEmpty || filteredOptions.length));
    const isOnlyOption        = Boolean(filteredOptions.length === 1 && !hasValue);


    // Do the Render
    return <InputContent
        passedRef={containerRef}
        className={className}
        icon={icon}
        postIcon="search"
        isFocused={isFocused}
        isDisabled={isDisabled}
        isSmall={isSmall}
        onClick={handleClick}
        onClear={onClear}
        showButton={showCreate}
        buttonMessage="GENERAL_CREATE"
        onButton={() => onCreate(search)}
        withBorder={withBorder}
        withLabel={withLabel}
        withPadding
    >
        <Input
            inputRef={inputRef}
            className="input-search"
            id={id}
            type="text"
            name={name}
            value={showOptions ? search : (value || "")}
            placeholder={showOptions ? placeholder : ""}
            isDisabled={isDisabled}
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
        />

        {hasOptions && <InputOptions
            passedRef={optionsRef}
            inputRef={inputRef}
            top={bounds.top}
            left={bounds.left}
            width={Math.max(suggestWidth ?? 0, bounds.width)}
            maxHeight={bounds.maxHeight}
        >
            <InputOption
                isHidden={!hasValue}
                content={value}
                isOnlyOption={!showLine}
                hasValue={hasValue}
                hasCreate={hasCreate}
                forValue
            />
            <InputOption
                isHidden={!showSearch}
                message={searchText}
            />
            <InputOption
                isHidden={!showEmpty}
                message={emptyText}
            />

            {showFilteredOptions && filteredOptions.map((elem, index) => <InputOption
                key={index}
                className={`input-suggestion-${index}`}
                hasValue={hasValue}
                hasCreate={hasCreate}
                forCreate={elem.id === "__create__"}
                isOnlyOption={isOnlyOption}
                content={elem.text}
                isSelected={selectedIdxRef.current === index}
                onMouseDown={(e) => handleSelect(e, elem.id, elem.title, elem)}
            />)}
        </InputOptions>}
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SuggestInput.propTypes = {
    inputRef        : PropTypes.any,
    className       : PropTypes.string,
    icon            : PropTypes.string,
    postIcon        : PropTypes.string,
    isFocused       : PropTypes.bool,
    isDisabled      : PropTypes.bool,
    isSmall         : PropTypes.bool,
    withBorder      : PropTypes.bool,
    withLabel       : PropTypes.bool,
    id              : PropTypes.string,
    name            : PropTypes.string.isRequired,
    placeholder     : PropTypes.string,
    emptyText       : PropTypes.string,
    searchText      : PropTypes.string,
    value           : PropTypes.any,
    suggestID       : PropTypes.string,
    suggestFetch    : PropTypes.func,
    suggestParams   : PropTypes.object,
    suggestNone     : PropTypes.string,
    suggestWidth    : PropTypes.number,
    keepSuggestions : PropTypes.bool,
    createOption    : PropTypes.string,
    showCreate      : PropTypes.bool,
    onCreate        : PropTypes.func,
    onChange        : PropTypes.func,
    onClear         : PropTypes.func,
    onFocus         : PropTypes.func,
    onBlur          : PropTypes.func,
    onSubmit        : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SuggestInput.defaultProps = {
    className    : "",
    isFocused    : false,
    isDisabled   : false,
    isSmall      : false,
    withBorder   : true,
    withLabel    : true,
    placeholder  : "",
    emptyText    : "GENERAL_NONE_RESULTS",
    searchText   : "GENERAL_SEARCHING_DOTS",
    suggestWidth : 0,
};

export default SuggestInput;
