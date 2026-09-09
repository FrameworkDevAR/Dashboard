import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Utils                from "../../Utils/Utils";
import KeyCode              from "../../Utils/KeyCode";
import useDrag              from "../../Hooks/Drag";

// Components
import DetailCard           from "../Details/DetailCard";
import CheckboxInput        from "../InputType/CheckboxInput";
import InputField           from "../Form/InputField";
import IconLink             from "../Link/IconLink";
import Html                 from "./Html";



// Styles
const Container = Styled.div`
    display: flex;
    flex-direction: column;
`;

const Sticky = Styled.div`
    position: sticky;
    top: 0;
    z-index: 2;
    padding-bottom: 12px;
    background-color: var(--content-color);

    &::before {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
        height: 12px;
        background-color: var(--content-color);
    }
`;

const Search = Styled(InputField)`
    --input-border: var(--border-color-light);
    --input-border-radius: var(--border-radius);

    padding: 1px;

    .input-content {
        height: var(--filter-input-height);
        min-height: 0;
        background-color: var(--filter-input-background);
        transition: all 0.2s;
    }
    .input-content:hover {
        --input-border: var(--input-border-hover);
    }
    input {
        background-color: transparent;
    }
    input::placeholder {
        color: var(--font-lighter);
    }
`;

const Results = Styled.span`
    margin-right: 4px;
    color: var(--darkest-gray);
    font-size: 12px;
`;

const List = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Item = Styled(DetailCard).attrs(({ isDimmed, isCurrent }) => ({ isDimmed, isCurrent }))`
    transition:
        opacity 0.25s ease,
        scale 0.3s cubic-bezier(0.34, 1.5, 0.4, 1),
        border-color 0.2s, background-color 0.2s, box-shadow 0.2s;

    u {
        padding: 1px 2px;
        margin: 0 -2px;
        background-color: var(--accent-color);
        border-radius: 4px;
        text-decoration: none;
    }

    ${(props) => props.isDimmed && `
        opacity: 0.4;
        scale: 0.97;
    `}

    ${(props) => props.isCurrent && `
        &, &:hover {
            border-color: var(--primary-border);
        }
        u {
            background-color: var(--accent-darker);
        }
    `}
`;

const Name = Styled(Html)`
    flex-grow: 2;
`;



/**
 * The Sortable List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SortableList(props) {
    const { className, list, withSearch, onSort, onVisibility } = props;


    // The References
    const listRef = React.useRef(null);

    // The Current State
    const [ search,  setSearch  ] = React.useState("");
    const [ current, setCurrent ] = React.useState(0);


    // Handles the Item Grab
    const handleGrab = (e, itemID, index) => {
        const node = e.target.parentElement;
        pick(e, node, node.parentElement, itemID, index);
    };

    // Handles the Drop
    const handleDrop = async () => {
        if (orderChanged()) {
            const newList = [ ...list ];
            swap(newList);
            onSort(newList);
        }
    };

    // The Drag
    const { pick, orderChanged, swap } = useDrag(handleDrop);


    // The Items, with the part of the name that the search found marked, and the index of
    // each result. Nothing is taken away, as the order is what is being edited here and it
    // only reads complete, so the search walks the results instead of shortening the list
    const [ items, results ] = React.useMemo(() => {
        const value    = Utils.convertToSearch(search);
        const newItems = [];
        const indexes  = [];

        for (const [ index, item ] of list.entries()) {
            const isResult = value.length > 1 && Utils.searchValue(item.name, search);
            if (isResult) {
                indexes.push(index);
            }
            newItems.push({
                ...item,
                text : isResult ? Utils.underlineText(item.name, value) : item.name,
            });
        }
        return [ newItems, indexes ];
    }, [ JSON.stringify(list), search ]);


    // Goes back to the first result when the search changes
    React.useEffect(() => {
        setCurrent(0);
    }, [ search ]);

    // Brings the current result into view
    React.useEffect(() => {
        const index = results[current];
        const node  = index !== undefined ? listRef.current?.children[index] : null;
        if (node) {
            node.scrollIntoView({ behavior : "smooth", block : "center" });
        }
    }, [ search, current ]);


    // Goes to the next or the previous result, starting over at each end
    const goToResult = (step) => {
        if (results.length > 0) {
            setCurrent((index) => (index + step + results.length) % results.length);
        }
    };

    // Handles the Key Down, so the results are walked and turned on and off
    // without leaving the search
    const handleKeyDown = (e) => {
        const index = results[current];

        switch (e.keyCode) {
        case KeyCode.DOM_VK_UP:
            goToResult(-1);
            break;
        case KeyCode.DOM_VK_DOWN:
            goToResult(1);
            break;
        case KeyCode.DOM_VK_RETURN:
            if (onVisibility && index !== undefined) {
                onVisibility(index, !list[index].isVisible);
            }
            break;
        default:
            return;
        }
        e.preventDefault();
    };


    // Do the Render
    const withVisibility = !!onVisibility;
    const hasResults     = results.length > 0;
    const currentIndex   = hasResults ? results[current] : -1;
    const resultText     = `${hasResults ? current + 1 : 0}/${results.length}`;

    return <Container className={className}>
        {withSearch && <Sticky>
            <Search
                name="sortableSearch"
                icon="search"
                placeholder="GENERAL_SEARCH"
                value={search}
                onChange={(name, value) => setSearch(value)}
                onKeyDown={handleKeyDown}
                onClear={() => setSearch("")}
                hasClear={search.length > 0}
            >
                <Results>{search.length > 1 ? resultText : ""}</Results>
                <IconLink
                    isHidden={!hasResults}
                    variant="black"
                    icon="up"
                    onClick={() => goToResult(-1)}
                    isSmall
                />
                <IconLink
                    isHidden={!hasResults}
                    variant="black"
                    icon="down"
                    onClick={() => goToResult(1)}
                    isSmall
                />
            </Search>
        </Sticky>}

        <List ref={listRef}>
            {items.map(({ id, text, isVisible }, index) => <Item
                key={id}
                isDimmed={withVisibility && !isVisible}
                isCurrent={index === currentIndex}
                onSort={(e) => handleGrab(e, id, index)}
                actions={withVisibility ? <IconLink
                    variant="black"
                    icon={isVisible ? "view" : "hide"}
                    onClick={() => onVisibility(index, !isVisible)}
                    isSmall
                /> : null}
            >
                {withVisibility ? <CheckboxInput
                    name="visibility"
                    label={text}
                    isChecked={!!isVisible}
                    onChange={(name, isChecked) => onVisibility(index, isChecked)}
                /> : <Name>{text}</Name>}
            </Item>)}
        </List>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SortableList.propTypes = {
    className    : PropTypes.string,
    list         : PropTypes.array.isRequired,
    withSearch   : PropTypes.bool,
    onSort       : PropTypes.func.isRequired,
    onVisibility : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SortableList.defaultProps = {
    className  : "",
    withSearch : false,
};

export default SortableList;
