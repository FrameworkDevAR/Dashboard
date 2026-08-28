import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";
import useDrag              from "../../Hooks/Drag";

// Components
import NoneAvailable        from "../Common/NoneAvailable";
import Button               from "../Form/Button";



// Styles
const Container = Styled.div`
    max-width: var(--setting-width);
`;

const Header = Styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 24px 0 8px 0;
`;

const Title = Styled.h3`
    margin: 0;
    color: var(--setting-title-color);
    font-size: var(--setting-title-size);
    font-weight: 500;
`;

const List = Styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
`;



/**
 * The Setting List, a sortable list of Items shown next to the Setting Options
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SettingList(props) {
    const {
        isHidden, className, message, addMessage, noneMessage,
        items, onAdd, onSort, children,
    } = props;


    // Handles the Item Grab
    const handleGrab = (e, itemID, index) => {
        const node = e.target.parentElement;
        pick(e, node, node.parentElement, itemID, index);
    };

    // Handles the Drop
    const handleDrop = async () => {
        const list = items.map(({ id }) => id);
        swap(list);

        // The Items are sorted in place too, as the list is drawn from them and
        // the new order has to stay while the server is saving it
        swap(items);
        await onSort(list);
    };

    // The Drag
    const { pick, swap } = useDrag(handleDrop);


    // Clone the Children
    const list = Utils.cloneChildren(children, (child, index) => {
        return { index, onGrab : handleGrab };
    });


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        <Header>
            <Title>{NLS.get(message)}</Title>
            <Button
                variant="outlined"
                message={addMessage}
                icon="add"
                onClick={onAdd}
                inLowerCase
            />
        </Header>

        <NoneAvailable
            isHidden={list.length > 0}
            message={noneMessage}
        />
        {list.length > 0 && <List>{list}</List>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SettingList.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    message     : PropTypes.string.isRequired,
    addMessage  : PropTypes.string,
    noneMessage : PropTypes.string.isRequired,
    items       : PropTypes.array.isRequired,
    onAdd       : PropTypes.func.isRequired,
    onSort      : PropTypes.func.isRequired,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SettingList.defaultProps = {
    isHidden   : false,
    className  : "",
    addMessage : "GENERAL_ADD",
};

export default SettingList;
