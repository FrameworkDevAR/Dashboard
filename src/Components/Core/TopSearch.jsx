import React                from "react";
import ReactDOM             from "react-dom";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import NLS                  from "../../Core/NLS";
import Responsive           from "../../Core/Responsive";

// Dashboard
import InputField           from "../Form/InputField";
import Icon                 from "../Common/Icon";



// Constants
const MIN_WIDTH   = 200;
const MAX_WIDTH   = 280;
const RIGHT_SPACE = 56;

// The Shortcut that focuses the Search, which depends on the platform
const IS_APPLE  = /Mac|iPhone|iPad/.test(window.navigator.platform);
const SHORTCUT  = IS_APPLE ? "⌘ F" : "Ctrl F";

// The Shortcut that opens the Commands
const COMMANDS  = IS_APPLE ? "⌘ K" : "Ctrl K";

// Styles
const Container = Styled.header`
    position: relative;
    display: flex;
    align-items: center;
    z-index: var(--z-navigation);

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        display: none;
    }
`;

const Trigger = Styled.button`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    width: var(--topbar-search-width);
    height: 36px;
    padding: 0 12px;
    border: 1px solid var(--light-gray);
    border-radius: var(--border-radius);
    background-color: color-mix(in srgb, var(--lighter-gray), var(--light-gray));
    color: var(--input-placeholder, var(--font-lighter));
    font-family: var(--main-font);
    font-size: var(--font-size);
    text-align: left;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
        border-color: var(--dark-gray);
        background-color: var(--content-color);
    }
    .icon {
        margin: 0;
        font-size: 18px;
    }
`;

const Results = Styled.ul`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    box-sizing: border-box;
    max-height: 320px;
    margin: 0;
    padding: 6px;
    list-style: none;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius);
    background-color: var(--content-color);
    box-shadow: var(--box-shadow);
    overflow: auto;
    z-index: var(--z-menu);
`;

const Result = Styled.li.attrs(({ isSelected }) => ({ isSelected }))`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--border-radius);
    color: var(--title-color);
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;

    ${(props) => props.isSelected && `
        background-color: var(--light-gray);
    `}
    .icon {
        flex-shrink: 0;
        margin: 0;
        font-size: 18px;
        color: var(--font-lighter);
    }
    b {
        flex-grow: 2;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    span {
        flex-shrink: 0;
        color: var(--font-lighter);
        font-size: 12px;
    }
`;

const Shortcut = Styled.span`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    padding: 2px 6px;
    border-radius: var(--border-radius-small);
    background-color: var(--light-gray);
    color: var(--font-lighter);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
`;

const Field = Styled(InputField).attrs(({ hasValue }) => ({ hasValue }))`
    --input-height: 36px;
    --input-horiz-padding: 12px;
    --input-border-radius: var(--border-radius);
    --input-border: var(--light-gray);
    --input-border-hover: var(--dark-gray);
    --input-border-focus: var(--border-color-light);

    width: var(--topbar-search-width);
    margin: 0;

    .input-content {
        min-height: var(--input-height);
        background-color: ${(props) => props.hasValue ? "var(--content-color)" : "color-mix(in srgb, var(--lighter-gray), var(--light-gray))"};
        transition: background-color 0.2s ease;
    }
    .input-content:hover,
    .input-content:focus-within {
        background-color: var(--content-color);
    }
    .input-clear {
        font-size: 16px;
    }
    input {
        background-color: transparent;
    }
`;

const MenuField = Styled(Field).attrs(({ isOpen, inlineWidth }) => ({ isOpen, inlineWidth }))`
    --input-height: 32px;

    width: 34px;
    transition: width 0.2s ease;

    .input-content {
        padding-right: 0;
        cursor: pointer;
    }
    input {
        opacity: 0;
        cursor: pointer;
    }

    ${(props) => props.isOpen && `
        ${props.inlineWidth ? `
            width: ${props.inlineWidth}px;
        ` : `
            position: fixed;
            top: calc((var(--topbar-height, 56px) - var(--input-height)) / 2);
            left: calc(10px + var(--topbar-icon-size, 32px) + 8px + var(--topbar-logo-width, 46px) + 8px);
            right: calc(var(--topbar-icon-size, 32px) + 24px);
            width: auto;
            z-index: 2;
        `}

        .input-content {
            padding-right: var(--input-horiz-padding);
            cursor: text;
        }
        input {
            opacity: 1;
            cursor: text;
        }
    `}
`;



/**
 * The Top Search, shown in the TopBar aligned with the start of the Main
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TopSearch(props) {
    const {
        isHidden, placeholder, value, results, onSelect, onOpen,
        onChange, onInput, onSubmit, onClear,
    } = props;

    const isForMenu = Responsive.useIsForMenu();


    // The References
    const fieldRef = React.useRef(null);

    // The Current State
    const [ isOpen, setIsOpen ] = React.useState(false);


    // Focus the Search with Ctrl+F, replacing the search of the browser
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "f") {
                e.preventDefault();
                if (onOpen) {
                    onOpen();
                } else {
                    setIsOpen(true);
                    fieldRef.current?.focus();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // The Search is shown next to the Top Title, which is rendered outside of this Component
    const [ searchNode, setSearchNode ] = React.useState(null);

    React.useEffect(() => {
        setSearchNode(document.querySelector(".top-title-search"));
    });

    // The Search expands in place when there is space before the Avatar,
    // and over the Title when there is not
    const [ inlineWidth, setInlineWidth ] = React.useState(0);

    React.useEffect(() => {
        if (!searchNode) {
            return undefined;
        }
        const updateWidth = () => {
            const left      = searchNode.getBoundingClientRect().left;
            const available = window.innerWidth - left - RIGHT_SPACE;
            setInlineWidth(available >= MIN_WIDTH ? Math.min(available, MAX_WIDTH) : 0);
        };
        updateWidth();

        // The Title can change its width, which moves the Search
        const observer = new ResizeObserver(updateWidth);
        observer.observe(searchNode.parentElement || searchNode);
        window.addEventListener("resize", updateWidth);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateWidth);
        };
    }, [ searchNode, isForMenu ]);

    // Close the Dialog when going back to the big screens
    React.useEffect(() => {
        if (!isForMenu) {
            setIsOpen(false);
        }
    }, [ isForMenu ]);


    // Handles the Clear, which also closes the Search
    const handleClear = () => {
        if (onClear) {
            onClear();
        }
        setIsOpen(false);
    };


    // The Results are shown as a Menu under the Search
    const [ selectedIdx, setSelectedIdx ] = React.useState(0);
    const [ showResults, setShowResults ] = React.useState(false);

    const hasResults = Boolean(showResults && value && results.length);

    // Reset the selection when the Results change
    React.useEffect(() => {
        setSelectedIdx(0);
    }, [ JSON.stringify(results) ]);

    // Handles the Select of a Result
    const handleSelect = (elem) => {
        setShowResults(false);
        if (onSelect) {
            onSelect(elem);
        }
    };

    // Handles the Key Down, to move through the Results. The Enter is not
    // handled here, as the Text Input does not send it to the Key Down
    const handleKeyDown = (e) => {
        if (!hasResults) {
            return;
        }
        if (e.key === "ArrowDown") {
            setSelectedIdx((selectedIdx + 1) % results.length);
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            setSelectedIdx((selectedIdx - 1 + results.length) % results.length);
            e.preventDefault();
        } else if (e.key === "Escape") {
            setShowResults(false);
        }
    };

    // Handles the Submit, which selects the Result that is highlighted
    const handleSubmit = () => {
        if (hasResults) {
            handleSelect(results[selectedIdx]);
        } else if (onSubmit) {
            onSubmit();
        }
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    if (isForMenu) {
        if (!searchNode) {
            return <React.Fragment />;
        }
        return ReactDOM.createPortal(<MenuField
            passedRef={fieldRef}
            name="search"
            icon="search"
            placeholder={isOpen ? placeholder : ""}
            value={value}
            hasValue={!!value}
            isOpen={isOpen}
            inlineWidth={inlineWidth}
            onChange={onChange}
            onInput={onInput}
            onSubmit={onSubmit}
            onClear={handleClear}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(Boolean(value))}
            hasClear={isOpen}
        />, searchNode);
    }
    // The Search only opens the Commands, so it is a Button and not a Field
    if (onOpen) {
        return <Container className="top-search">
            <Trigger onClick={onOpen}>
                <Icon icon="search" />
                {NLS.get(placeholder)}
            </Trigger>
            <Shortcut>{COMMANDS}</Shortcut>
        </Container>;
    }

    return <Container className="top-search">
        <Field
            passedRef={fieldRef}
            name="search"
            icon="search"
            placeholder={placeholder}
            value={value}
            hasValue={!!value}
            onChange={onChange}
            onInput={onInput}
            onSubmit={handleSubmit}
            onClear={onClear}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowResults(true)}
            onBlur={() => setShowResults(false)}
            hasClear
        />
        {!value && <Shortcut>{SHORTCUT}</Shortcut>}

        {hasResults && <Results>
            {results.map((elem, index) => <Result
                key={elem.key}
                isSelected={index === selectedIdx}
                onMouseDown={() => handleSelect(elem)}
                onMouseEnter={() => setSelectedIdx(index)}
            >
                {!!elem.icon && <Icon icon={elem.icon} />}
                <b>{NLS.get(elem.message)}</b>
                {!!elem.section && <span>{NLS.get(elem.section)}</span>}
            </Result>)}
        </Results>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TopSearch.propTypes = {
    isHidden    : PropTypes.bool,
    placeholder : PropTypes.string,
    value       : PropTypes.string,
    results     : PropTypes.array,
    onSelect    : PropTypes.func,
    onOpen      : PropTypes.func,
    onChange    : PropTypes.func,
    onInput     : PropTypes.func,
    onSubmit    : PropTypes.func,
    onClear     : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TopSearch.defaultProps = {
    isHidden    : false,
    placeholder : "GENERAL_SEARCH",
    value       : "",
    results     : [],
};

export default TopSearch;
