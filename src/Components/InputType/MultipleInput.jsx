import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import InputType            from "../../Core/InputType";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import CheckboxInput        from "../InputType/CheckboxInput";
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";
import ScrollFade           from "../Common/ScrollFade";



// Constants
const SEARCH_ROWS = 6;

// Styles
const Content = Styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
`;

const Header = Styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
`;

const Search = Styled.label`
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    height: var(--filter-input-height);
    padding: 0 4px 0 10px;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius);
    background-color: var(--filter-input-background);
    color: var(--black-color);
    transition: border-color 0.2s, box-shadow 0.2s;
    cursor: text;

    &:hover {
        border-color: var(--input-border-hover);
    }
    &:focus-within {
        border-color: var(--input-border-focus);
        box-shadow: var(--input-border-shadow);
    }
    input::placeholder {
        color: var(--font-lighter);
    }

    input {
        flex-grow: 1;
        min-width: 0;
        padding: 0;
        border: none;
        outline: none;
        background-color: transparent;
        font-family: inherit;
        font-size: var(--input-font);
        color: var(--font-color);
    }
`;

const Selected = Styled.button.attrs(({ isActive }) => ({ isActive }))`
    flex-shrink: 0;
    display: grid;
    padding: 4px 8px;
    border: none;
    border-radius: var(--border-radius-small, var(--border-radius));
    background-color: transparent;
    font-family: inherit;
    font-size: 12.5px;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;

    ${(props) => props.isActive ? `
        color: var(--primary-color);
        font-weight: 600;
    ` : `
        color: var(--font-lighter);
    `}
    &:hover {
        background-color: var(--lighter-gray);
    }
`;

const SelectedText = Styled.span`
    grid-area: 1 / 1;
    text-align: center;
`;

const SelectedGhost = Styled.span`
    grid-area: 1 / 1;
    visibility: hidden;
    font-weight: 600;
`;

const List = Styled(ScrollFade).attrs(({ noScroll }) => ({ noScroll }))`
    max-height: ${(props) => props.noScroll ? "none" : "260px"};
`;

const Badge = Styled.span`
    flex-shrink: 0;
    margin-left: 8px;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 500;
    line-height: 18px;
    color: var(--error-color);
    background-color: color-mix(in srgb, var(--error-color) 12%, transparent);
`;

const None = Styled.p`
    margin: 12px 0;
    text-align: center;
    font-size: 13px;
    color: var(--font-lighter);
`;

const Container = Styled.div.attrs(({ columns, withLabel, withSearch, noScroll }) => ({ columns, withLabel, withSearch, noScroll }))`
    box-sizing: border-box;
    display: grid;
    grid-template-columns: ${(props) => `repeat(${props.columns}, 1fr)`};
    align-content: start;
    gap: 2px;
    width: calc(100% + 12px);
    margin: -4px -6px;


    > .input-content {
        padding: 4px 6px;
        border-radius: var(--border-radius);
        transition: background-color 0.2s;
    }
    > .input-content:hover {
        background-color: var(--light-gray);
    }

    ${(props) => props.withLabel && `
        margin-top: 4px;
        margin-bottom: 0;
    `}

    @media (max-width: 400px) {
        display: flex;
        flex-direction: column;
    }

    ${(props) => props.withSearch && `
        width: 100%;
        max-height: ${props.noScroll ? "none" : "260px"};
        margin: 0;
        gap: 6px 16px;
        overflow-y: ${props.noScroll ? "visible" : "auto"};

        > .input-content {
            min-width: 0;
            padding: 7px 9px;
        }
        > .input-content label {
            min-width: 0;
        }
        > .input-content .icon + span {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        > .multiple-selected {
            background-color: color-mix(in srgb, var(--primary-color) 7%, transparent);
        }
        > .multiple-selected:hover {
            background-color: color-mix(in srgb, var(--primary-color) 11%, transparent);
        }
    `}
`;



/**
 * The Multiple Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MultipleInput(props) {
    const {
        className, isFocused, isDisabled, withLabel, withBorder,
        name, value, placeholder, columns, withSearch, noScroll, getDisabled, getPrefix,
        onChange, onFocus, onBlur,
    } = props;


    // The References
    const listRef = React.useRef(null);

    // The Current State
    const [ search,       setSearch       ] = React.useState("");
    const [ onlySelected, setOnlySelected ] = React.useState(false);

    // Create the Items
    const items = InputType.useOptions(props);

    // Generate the parts
    const parts = React.useMemo(() => {
        let result = [];
        try {
            result = Array.isArray(value) ? value : JSON.parse(String(value));
        } catch(e) {
            result = [];
        }
        for (const [ index, item ] of result.entries()) {
            result[index] = String(item);
        }
        return result;
    }, [ value ]);


    // Handles the Change
    const handleChange = (isChecked, key) => {
        if (isChecked) {
            parts.push(key);
        } else {
            const pos = parts.indexOf(key);
            if (pos > -1) {
                parts.splice(pos, 1);
            }
        }
        onChange(name, JSON.stringify(parts));
    };

    // Returns the text of a label without its html, as it can have a status next to the name
    const getText = (value) => {
        return String(NLS.get(value)).replace(/<[^>]*>/g, "").trim();
    };

    // The Items that match the search, or only the selected ones when asked. The label is
    // searched without its html, as it can have a status next to the name
    const shownItems = React.useMemo(() => {
        return items.filter(({ key, value }) => {
            if (onlySelected && !parts.includes(String(key))) {
                return false;
            }
            if (!search) {
                return true;
            }
            return Utils.searchValue(getText(value), search);
        });
    }, [ JSON.stringify(items), JSON.stringify(parts), search, onlySelected ]);

    // Returns true if is Disabled
    const getItemDisabled = (key) => {
        if (isDisabled) {
            return true;
        }
        if (getDisabled) {
            return getDisabled(key);
        }
        return false;
    };


    // The Search is only shown when the Items do not fit in the List without a scroll
    const hasSearch = withSearch && items.length > SEARCH_ROWS * Number(columns);


    // Do the Render
    const checkboxes = shownItems.map(({ key, value, badge, ...item }) => <CheckboxInput
        key={key}
        className={parts.includes(String(key)) ? "multiple-selected" : ""}
        name={name}
        value={key}
        label={value}
        prefix={getPrefix ? getPrefix({ key, value, ...item }) : null}
        isChecked={parts.includes(String(key))}
        isDisabled={getItemDisabled(key)}
        onChange={(name, isChecked) => handleChange(isChecked, String(key))}
        onFocus={onFocus}
        onBlur={onBlur}
    >
        {!!badge && <Badge>{NLS.get(badge)}</Badge>}
    </CheckboxInput>);

    return <InputContent
        className={className}
        isFocused={isFocused}
        isDisabled={isDisabled}
        withBorder={withBorder && !withSearch}
        withPadding={withBorder && !withSearch}
        withLabel={withLabel}
    >
        <Content>
            {hasSearch && <Header>
                <Search>
                    <Icon icon="search" size="16" />
                    <input
                        type="text"
                        value={search}
                        placeholder={NLS.get(placeholder || "GENERAL_SEARCH")}
                        disabled={isDisabled}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <IconLink
                        isHidden={!search}
                        variant="black"
                        icon="close"
                        tooltip="GENERAL_CLEAR_SEARCH"
                        onClick={() => setSearch("")}
                        isSmall
                    />
                </Search>
                <Selected
                    type="button"
                    isActive={onlySelected}
                    onClick={() => setOnlySelected(!onlySelected)}
                >
                    <SelectedText>{NLS.pluralize("GENERAL_SELECTED", parts.length)}</SelectedText>
                    <SelectedGhost aria-hidden="true">
                        {NLS.pluralize("GENERAL_SELECTED", items.length)}
                    </SelectedGhost>
                </Selected>
            </Header>}

            {withSearch ? <List passedRef={listRef} noScroll={noScroll}>
                <Container
                    ref={listRef}
                    columns={columns}
                    withLabel={withLabel}
                    withSearch
                    noScroll={noScroll}
                >
                    {checkboxes}
                </Container>
            </List> : <Container
                columns={columns}
                withLabel={withLabel}
            >
                {checkboxes}
            </Container>}
            {(withSearch && !shownItems.length) && <None>
                {NLS.get("GENERAL_NONE_RESULTS")}
            </None>}
        </Content>
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MultipleInput.propTypes = {
    className   : PropTypes.string,
    isFocused   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    withLabel   : PropTypes.bool,
    withBorder  : PropTypes.bool,
    name        : PropTypes.string.isRequired,
    value       : PropTypes.any,
    options     : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    noneText    : PropTypes.string,
    noneValue   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    placeholder : PropTypes.string,
    columns     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    withSearch  : PropTypes.bool,
    noScroll    : PropTypes.bool,
    getDisabled : PropTypes.func,
    getPrefix   : PropTypes.func,
    onChange    : PropTypes.func.isRequired,
    onFocus     : PropTypes.func.isRequired,
    onBlur      : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MultipleInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    withBorder  : true,
    noneText    : "",
    columns     : 2,
    withSearch  : false,
    noScroll    : false,
};

export default MultipleInput;
