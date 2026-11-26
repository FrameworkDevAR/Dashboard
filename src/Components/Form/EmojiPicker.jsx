import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Store                from "../../Core/Store";
import Emojis               from "../../Utils/Emojis";

// Components
import InputField           from "./InputField";
import Icon                 from "../Common/Icon";



// Constants
const SCROLL_TIME = 1000;

// Styles
const Container = Styled.div.attrs(({ width, height }) => ({ width, height }))`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: ${(props) => `${props.width}px`};
    max-width: calc(100vw - 20px);
    height: ${(props) => `${props.height}px`};
    padding: 8px 0 0;
    background-color: var(--menu-background, var(--white-color));
    border-radius: var(--border-radius-medium);
    box-shadow: var(--box-shadow);
    overflow: hidden;
`;

const Search = Styled.div`
    flex-shrink: 0;
    padding: 0 8px;
    --content-color: var(--lighter-gray);
`;

const Tabs = Styled.div`
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    padding: 6px 8px;
    border-bottom: 1px solid var(--light-gray);
`;

const Tab = Styled.button.attrs(({ isActive }) => ({ isActive }))`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    font-size: 20px;
    color: ${(props) => props.isActive ? "var(--primary-color)" : "var(--font-lighter)"};
    background-color: ${(props) => props.isActive ? "var(--hover-overlay, rgba(0, 0, 0, 0.1))" : "transparent"};
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        color: var(--primary-color);
        background-color: var(--hover-overlay, rgba(0, 0, 0, 0.1));
    }
`;

const Content = Styled.div`
    position: relative;
    flex-grow: 1;
    padding: 0 8px 8px;
    overflow-y: auto;
    overscroll-behavior: contain;
`;

const Title = Styled.h4`
    position: sticky;
    top: 0;
    z-index: 1;
    margin: 0;
    padding: 10px 6px 6px;
    font-size: var(--font-size-small);
    font-weight: 600;
    color: var(--font-lighter);
    background-color: var(--menu-background, var(--white-color));
`;

const Grid = Styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
`;

const Emoji = Styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0;
    font-size: 24px;
    line-height: 1;
    background: none;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: var(--lighter-gray);
    }
`;

const Empty = Styled.p`
    margin: 32px 0;
    text-align: center;
    color: var(--font-lighter);
`;



/**
 * The Emoji Picker
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EmojiPicker(props) {
    const { width, height, onClick } = props;

    const language = NLS.getCurrentLang();

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // The References
    const contentRef  = React.useRef(null);
    const sectionRefs = React.useRef({});
    const targetRef   = React.useRef("");

    // The Current State
    const [ categories, setCategories ] = React.useState([]);
    const [ recent                    ] = React.useState(() => Emojis.getRecent());
    const [ text,       setText       ] = React.useState("");
    const [ active,     setActive     ] = React.useState("");


    // Loads the Emojis of the Language
    React.useEffect(() => {
        let isCurrent = true;
        Emojis.load(language).then((result) => {
            if (isCurrent) {
                setCategories(result);
            }
        });
        return () => {
            isCurrent = false;
        };
    }, [ language ]);


    // The used ones go first, and are kept as they were while the picker is open, so the
    // Emojis do not move under the mouse
    const sections = React.useMemo(() => {
        const result = [];
        if (recent.length) {
            const emojis = recent.map((emoji) => ({ emoji }));
            result.push({ key : "recent", icon : "emoji-recent", text : "EMOJI_SUGGESTED", emojis });
        }
        return result.concat(categories);
    }, [ categories, recent ]);

    const results = React.useMemo(() => {
        return text.trim() ? Emojis.search(categories, text) : [];
    }, [ categories, text ]);

    const isSearching = Boolean(text.trim());
    const activeKey   = active || (sections[0] ? sections[0].key : "");


    // Handles the Scroll, which marks the Tab of the Category that is in sight. While it moves
    // to the Category of a Tab, the ones it passes are not marked, until it gets there or a
    // second passes, as the user may scroll in between
    const handleScroll = () => {
        const content = contentRef.current;
        if (!content || isSearching) {
            return;
        }
        if (targetRef.current) {
            const target  = sectionRefs.current[targetRef.current];
            const atEnd   = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
            const reached = !target || Math.abs(content.scrollTop - target.offsetTop) <= 1;
            if (reached || atEnd) {
                targetRef.current = "";
            }
            return;
        }
        let current = sections[0] ? sections[0].key : "";
        for (const { key } of sections) {
            const section = sectionRefs.current[key];
            if (section && section.offsetTop <= content.scrollTop + 1) {
                current = key;
            }
        }
        setActive(current);
    };

    // Handles the Tab, which goes to its Category
    const handleTab = (key) => {
        hideTooltip();
        setText("");
        setActive(key);
        targetRef.current = key;
        window.setTimeout(() => {
            targetRef.current = "";
        }, SCROLL_TIME);
        window.requestAnimationFrame(() => {
            const section = sectionRefs.current[key];
            if (contentRef.current && section) {
                contentRef.current.scrollTo({ top : section.offsetTop, behavior : "smooth" });
            }
        });
    };

    // Handles the Emoji
    const handleClick = (emoji) => {
        Emojis.addRecent(emoji);
        onClick(emoji);
    };


    // Do the Render
    const renderEmojis = (emojis) => <Grid>
        {emojis.map(({ emoji }) => <Emoji
            key={emoji}
            type="button"
            onClick={() => handleClick(emoji)}
        >
            {emoji}
        </Emoji>)}
    </Grid>;

    return <Container width={width} height={height}>
        <Search onMouseDown={(e) => e.stopPropagation()}>
            <InputField
                name="search"
                icon="search"
                placeholder="GENERAL_SEARCH"
                value={text}
                onChange={(name, value) => setText(value)}
                hasClear
                autoFocus
                isSmall
            />
        </Search>

        <Tabs>
            {sections.map((section) => <Tab
                key={section.key}
                type="button"
                isActive={!isSearching && section.key === activeKey}
                onClick={() => handleTab(section.key)}
                onMouseEnter={(e) => showTooltip({ current : e.currentTarget }, "top", section.text)}
                onMouseLeave={hideTooltip}
            >
                <Icon icon={section.icon} />
            </Tab>)}
        </Tabs>

        <Content ref={contentRef} onScroll={handleScroll}>
            {isSearching && Boolean(results.length) && renderEmojis(results)}
            {isSearching && !results.length && <Empty>{NLS.get("GENERAL_NONE_RESULTS")}</Empty>}

            {!isSearching && sections.map((section) => <section
                key={section.key}
                ref={(elem) => {
                    sectionRefs.current[section.key] = elem;
                }}
            >
                <Title>{NLS.get(section.text)}</Title>
                {renderEmojis(section.emojis)}
            </section>)}
        </Content>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EmojiPicker.propTypes = {
    width   : PropTypes.number.isRequired,
    height  : PropTypes.number.isRequired,
    onClick : PropTypes.func.isRequired,
};

export default EmojiPicker;
