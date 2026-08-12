import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Hooks
import useDrag              from "../../Hooks/Drag";

// Components
import CheckboxInput        from "../InputType/CheckboxInput";
import Icon                 from "./Icon";
import Html                 from "./Html";



// Styles
const Ul = Styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Li = Styled.li.attrs(({ isHidden }) => ({ isHidden }))`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: var(--lighter-gray);
    border-radius: var(--border-radius);
    transition: background-color 0.2s;
    color: var(--black-color);

    &:hover {
        background-color: var(--light-gray);
    }
    ${(props) => props.isHidden && `
        opacity: 0.5;
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
    const { className, list, onSort, onVisibility } = props;


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


    // Do the Render
    const withVisibility = !!onVisibility;

    return <Ul className={className}>
        {list.map(({ id, name, isVisible }, index) => <Li
            key={id}
            isHidden={withVisibility && !isVisible}
        >
            <Icon
                icon="drag"
                cursor="grab"
                onMouseDown={(e) => handleGrab(e, id, index)}
                size="16"
            />
            {withVisibility ? <CheckboxInput
                name="visibility"
                label={name}
                isChecked={!!isVisible}
                onChange={(name, isChecked) => onVisibility(index, isChecked)}
            /> : <Name>{name}</Name>}
            {withVisibility && <Icon
                icon={isVisible ? "view" : "hide"}
                cursor="pointer"
                onClick={() => onVisibility(index, !isVisible)}
                size="16"
            />}
        </Li>)}
    </Ul>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SortableList.propTypes = {
    className    : PropTypes.string,
    list         : PropTypes.array.isRequired,
    onSort       : PropTypes.func.isRequired,
    onVisibility : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SortableList.defaultProps = {
    className : "",
};

export default SortableList;
