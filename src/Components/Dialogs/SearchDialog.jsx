import React                 from "react";
import PropTypes             from "prop-types";
import Styled, { keyframes } from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import Dialog               from "../Dialog/Dialog";
import DialogBody           from "../Dialog/DialogBody";
import InputField           from "../Form/InputField";
import Button               from "../Form/Button";
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";



// Constants
const FADE_SIZE = 32;

// Animations
const loading = keyframes`
    0%   { left: -40%; }
    100% { left: 100%; }
`;

// Styles
const Container = Styled(Dialog)`
    position: relative;
`;

const Field = Styled(InputField)`
    --input-plain-height: var(--dialog-header, 64px);
    --input-border: transparent;
    --input-border-hover: transparent;
    --input-border-focus: transparent;
    --input-border-shadow: none;

    flex-shrink: 0;
    margin: 0;

    .input-content {
        gap: 14px;
        padding: 0 var(--dialog-padding);
        border-radius: var(--dialog-radius) var(--dialog-radius) 0 0;
    }
    .input-content > .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        margin: 0;
        font-size: 24px;
        color: var(--font-lighter);
    }
    input {
        font-size: 18px;
    }
`;

const Corner = Styled.div`
    position: absolute;
    top: calc((var(--dialog-header, 64px) - 24px) / 2);
    right: var(--dialog-padding);
    z-index: calc(var(--z-input) + 1);
    display: flex;
    align-items: center;
    gap: 12px;
    height: 24px;
`;

const Counter = Styled.span`
    color: var(--font-lighter);
    font-size: var(--font-size-small);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
`;

const Loader = Styled.div.attrs(({ isSearching }) => ({ isSearching }))`
    position: relative;
    flex-shrink: 0;
    height: 2px;
    margin: -2px var(--dialog-padding) 0 var(--dialog-padding);
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: -40%;
        width: 40%;
        height: 100%;
        border-radius: 1px;
        background-color: var(--primary-color);
        opacity: ${(props) => props.isSearching ? 1 : 0};
        animation: ${loading} 1s ease-in-out infinite;
        animation-play-state: ${(props) => props.isSearching ? "running" : "paused"};
        transition: opacity 0.2s;
    }
`;

const Content = Styled(DialogBody).attrs(({ fadeTop, fadeBottom, isEmpty }) => ({ fadeTop, fadeBottom, isEmpty }))`
    display: flex;
    flex-direction: column;
    gap: 2px;
    height: 50vh;
    padding: 12px var(--dialog-padding);

    ${(props) => props.isEmpty && `
        justify-content: center;
    `}
    ${(props) => (props.fadeTop || props.fadeBottom) && `
        mask-image: linear-gradient(
            to bottom,
            ${props.fadeTop ? `transparent 0, black ${FADE_SIZE}px` : "black 0"},
            ${props.fadeBottom ? `black calc(100% - ${FADE_SIZE}px), transparent 100%` : "black 100%"}
        );
    `}
`;

const Group = Styled.h3`
    margin: 0 0 4px 12px;
    color: var(--font-lightest);
    font-size: var(--font-size-small);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-weight: 600;

    &:not(:first-child) {
        margin-top: calc(var(--main-gap) * 2);
    }
`;

const Item = Styled.div.attrs(({ isSelected }) => ({ isSelected }))`
    display: flex;
    align-items: center;
    gap: 10px;
    scroll-margin: ${FADE_SIZE}px 0;
    padding: 8px 12px;
    border-radius: var(--border-radius);
    color: var(--title-color);
    cursor: pointer;

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 20px;
        margin: 0;
        font-size: 20px;
        color: var(--font-lighter);
    }

    ${(props) => props.isSelected && `
        background-color: var(--light-gray);
    `}
`;

const Texts = Styled.div`
    flex-grow: 2;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;

    b {
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    span {
        color: var(--font-lightest);
        font-size: var(--font-size-small);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

const Footer = Styled.footer`
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: var(--main-gap);
    padding: 4px var(--dialog-padding) 10px;
    color: var(--font-lighter);
    font-size: var(--font-size-small);

    div {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    b {
        min-width: 12px;
        padding: 2px 7px;
        color: var(--font-light);
        background-color: var(--lighter-gray);
        border: 1px solid var(--dark-gray);
        border-radius: var(--border-radius-small);
        font-weight: 500;
        text-align: center;
    }
`;

const Close = Styled(Button)`
    margin-left: auto;
`;



/**
 * The Search Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SearchDialog(props) {
    const { open, placeholder, items, isLoading, onSearch, onSelect, onClose, children } = props;


    // The References
    const selectedRef = React.useRef(null);
    const contentRef  = React.useRef(null);
    const fromKeyRef  = React.useRef(false);
    const scrollRef   = React.useRef(0);

    // The Current State
    const [ search,      setSearch      ] = React.useState("");
    const [ selectedIdx, setSelectedIdx ] = React.useState(0);
    const [ fadeTop,     setFadeTop     ] = React.useState(false);
    const [ fadeBottom,  setFadeBottom  ] = React.useState(false);


    // Scroll the selected Item into view when the keys moved to it, as it can be outside
    // of the list. The mouse only selects what is under it, so it never has to scroll
    React.useEffect(() => {
        if (fromKeyRef.current) {
            selectedRef.current?.scrollIntoView({ block : "nearest" });
            fromKeyRef.current = false;
        }
    }, [ selectedIdx ]);


    // The Items that match the Search, with their texts translated when they are keys. The
    // Items are not filtered when the search is done outside, as they are already the result
    const filtered = React.useMemo(() => {
        const result = items.map((item) => ({
            ...item,
            title       : NLS.get(item.message),
            description : NLS.get(item.description || ""),
            groupName   : NLS.get(item.group || ""),
        }));
        if (!search || onSearch) {
            return result;
        }
        return result.filter(({ title, description, groupName }) => {
            return Utils.searchValue(title, search)
                || Utils.searchValue(description, search)
                || Utils.searchValue(groupName, search);
        });
    }, [ JSON.stringify(items), search ]);

    // The Items grouped to show them with a Title, when they have one
    const groups = React.useMemo(() => {
        const result = [];
        for (const item of filtered) {
            const last = result[result.length - 1];
            if (last && last.name === item.groupName) {
                last.items.push(item);
            } else {
                result.push({ name : item.groupName, items : [ item ] });
            }
        }
        return result;
    }, [ JSON.stringify(filtered) ]);


    // Restore the scroll when opening, as the list is created again and would start at
    // the top while the search and the selection are kept
    React.useEffect(() => {
        if (open && contentRef.current) {
            contentRef.current.scrollTop = scrollRef.current;
        }
    }, [ open ]);

    // Set the fades when the Items change, as the list can start scrolled
    React.useEffect(() => {
        handleScroll();
    }, [ open, JSON.stringify(filtered) ]);


    // Handles the Scroll, to fade the edges that have more Items
    const handleScroll = () => {
        const node = contentRef.current;
        if (!node) {
            return;
        }
        scrollRef.current = node.scrollTop;
        setFadeTop(node.scrollTop > 0);
        setFadeBottom(node.scrollTop + node.clientHeight < node.scrollHeight - 1);
    };

    // Handles the Select of an Item
    const handleSelect = (item) => {
        onClose();
        onSelect(item);
    };

    // Handles the Hover of an Item, on the mouse move and not on the enter, as the list
    // moving under a still mouse when the keys scroll it would select what lands under it
    const handleHover = (itemIdx) => {
        if (itemIdx !== selectedIdx) {
            setSelectedIdx(itemIdx);
        }
    };

    // Handles the Search Change
    const handleSearch = (value) => {
        setSearch(value);
        setSelectedIdx(0);
        if (onSearch) {
            onSearch(value);
        }
    };

    // Handles the Clear of the Search
    const handleClear = () => {
        handleSearch("");
    };

    // Handles the Key Down, to move through the Items. The Escape clears the search
    // before it closes the Dialog, and it is stopped so the Dialog does not see it
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            fromKeyRef.current = true;
            setSelectedIdx((selectedIdx + 1) % filtered.length);
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            fromKeyRef.current = true;
            setSelectedIdx((selectedIdx - 1 + filtered.length) % filtered.length);
            e.preventDefault();
        } else if (e.key === "Escape" && search) {
            handleClear();
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // Handles the Submit, which selects the Item that is highlighted
    const handleSubmit = () => {
        if (filtered[selectedIdx]) {
            handleSelect(filtered[selectedIdx]);
        }
    };


    // Do the Render
    let index = -1;
    return <Container
        open={open}
        onClose={onClose}
    >
        <Corner>
            <IconLink
                isHidden={!search}
                variant="black"
                icon="backspace"
                tooltip="GENERAL_CLEAR_SEARCH"
                onClick={handleClear}
                isSmall
            />
            {filtered.length > 0 && <Counter>
                {`${selectedIdx + 1} / ${filtered.length}`}
            </Counter>}
        </Corner>

        <Field
            name="search"
            icon="search"
            placeholder={placeholder}
            value={search}
            onChange={(name, value) => handleSearch(value)}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
        />
        <Loader isSearching={isLoading} />

        <Content
            passedRef={contentRef}
            fadeTop={fadeTop}
            fadeBottom={fadeBottom}
            isEmpty={!filtered.length}
            onScroll={handleScroll}
        >
            {!filtered.length && children}

            {groups.map((group, groupIdx) => <div key={`${group.name}-${groupIdx}`}>
                {!!group.name && <Group>{group.name}</Group>}
                {group.items.map((item) => {
                    index += 1;
                    const itemIdx = index;
                    return <Item
                        key={item.key}
                        ref={itemIdx === selectedIdx ? selectedRef : null}
                        isSelected={itemIdx === selectedIdx}
                        onMouseDown={() => handleSelect(item)}
                        onMouseMove={() => handleHover(itemIdx)}
                    >
                        {!!item.icon && <Icon icon={item.icon} />}
                        <Texts>
                            <b>{item.title}</b>
                            {!!item.description && <span>{item.description}</span>}
                        </Texts>
                    </Item>;
                })}
            </div>)}
        </Content>

        <Footer>
            <div><b>↑</b><b>↓</b>{NLS.get("GENERAL_KEY_MOVE")}</div>
            <div><b>Enter</b>{NLS.get("GENERAL_KEY_OPEN")}</div>
            <div><b>Esc</b>{NLS.get(search ? "GENERAL_KEY_CLEAR" : "GENERAL_KEY_CLOSE")}</div>
            <Close
                variant="cancel"
                message="GENERAL_CLOSE"
                onClick={onClose}
                isSmall
            />
        </Footer>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SearchDialog.propTypes = {
    open        : PropTypes.bool.isRequired,
    placeholder : PropTypes.string,
    items       : PropTypes.array.isRequired,
    isLoading   : PropTypes.bool,
    onSearch    : PropTypes.func,
    onSelect    : PropTypes.func.isRequired,
    onClose     : PropTypes.func.isRequired,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SearchDialog.defaultProps = {
    placeholder : "GENERAL_SEARCH",
    isLoading   : false,
};

export default SearchDialog;
