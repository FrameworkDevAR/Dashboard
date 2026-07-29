import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Action               from "../../Core/Action";
import Store                from "../../Core/Store";
import NLS                  from "../../Core/NLS";

// Components
import Icon                 from "../Common/Icon";
import Amount               from "../Common/Amount";
import Badge                from "../Common/Badge";



// Styles
const Container = Styled.div.attrs(({ withGap, isSelected, isDisabled }) => ({ withGap, isSelected, isDisabled }))`
    box-sizing: border-box;
    position: relative;
    box-sizing: border-box;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--tabs-height, 24px);
    gap: ${(props) => props.withGap ? "6px" : "0"};
    padding: 0 12px;
    margin: 0 0 4px 0;
    font-size: 14px;
    line-height: 1;
    white-space: nowrap;
    border-radius: var(--border-radius);
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
        background-color: var(--lighter-gray);
    }
    &:hover .icon {
        display: block;
    }

    ${(props) => props.isSelected && `
        color: var(--tab-selected-font-color, var(--primary-color));
    `}
    ${(props) => props.isDisabled && `
        && {
            color: var(--tab-disabled-font-color, rgba(255, 255, 255, 0.5));
            cursor: not-allowed;
        }
    `}
`;

const ItemIcon = Styled(Icon)`
    display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: 0.5 all;
    font-size: 14px;

    &:hover {
        opacity: 0.8;
    }
`;

const EditIcon = Styled(ItemIcon)`
    left: 2px;
`;

const DeleteIcon = Styled(ItemIcon)`
    right: 2px;
`;

const TabBadge = Styled(Badge)`
    top: 0;
    right: 0;
`;



/**
 * The Tab Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TabItem(props) {
    const {
        className, icon, message,
        url, value, index, selected,
        amount, badge, isDisabled,
        tooltip, tooltipVariant,
        canEdit, canDelete, onClick, onAction,
    } = props;

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // The References
    const elementRef = React.useRef(null);

    // Variables
    const id         = url ? NLS.url(url) : (value || index);
    const hasAmount  = amount !== undefined;
    const isSelected = Boolean(!isDisabled && selected !== undefined && String(selected) === String(id));
    const canAction  = Boolean(!isDisabled && onAction);
    const showEdit   = Boolean(canEdit && canAction);
    const showDelete = Boolean(canDelete && canAction);
    const withGap    = Boolean(icon && message);


    // Handles the Action
    const handleAction = (action) => {
        if (!isDisabled && onAction) {
            onAction(Action.get(action), id);
        }
    };

    // Handle the Click
    const handleClick = () => {
        if (!isDisabled && onClick) {
            onClick(url || value);
        } else {
            handleAction("TAB");
        }
    };

    // Handle the Edit
    const handleEdit = (e) => {
        handleAction("EDIT");
        e.stopPropagation();
        e.preventDefault();
    };

    // Handle the Delete
    const handleDelete = (e) => {
        handleAction("DELETE");
        e.stopPropagation();
        e.preventDefault();
    };

    // Handles the Tooltip
    const handleTooltip = () => {
        if (tooltip) {
            showTooltip(elementRef, tooltipVariant, tooltip);
        }
    };


    // Do the Render
    return <Container
        ref={elementRef}
        className={`tab-item tab-item-${id} ${isSelected ? "tab-selected" : ""} ${className}`}
        withGap={withGap}
        isSelected={isSelected}
        isDisabled={isDisabled}
        onClick={handleClick}
        onMouseEnter={handleTooltip}
        onMouseLeave={hideTooltip}
    >
        {showEdit && <EditIcon
            icon="edit"
            onClick={handleEdit}
            size="14"
        />}

        {!!icon && <Icon icon={icon} size="16" />}
        {!!message && NLS.get(message)}
        {hasAmount && <Amount className="tab-amount" value={amount} />}
        <TabBadge className="tab-badge" value={badge} />

        {showDelete && <DeleteIcon
            icon="close"
            onClick={handleDelete}
            size="14"
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TabItem.propTypes = {
    isHidden       : PropTypes.bool,
    className      : PropTypes.string,
    url            : PropTypes.string,
    value          : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    index          : PropTypes.number,
    selected       : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    icon           : PropTypes.string,
    message        : PropTypes.string,
    amount         : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    badge          : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    tooltip        : PropTypes.string,
    tooltipVariant : PropTypes.string,
    isDisabled     : PropTypes.bool,
    isSelected     : PropTypes.bool,
    canEdit        : PropTypes.bool,
    canDelete      : PropTypes.bool,
    onClick        : PropTypes.func,
    onAction       : PropTypes.func,
    onSelect       : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TabItem.defaultProps = {
    isHidden       : false,
    className      : "",
    value          : "",
    index          : 0,
    tooltip        : "",
    tooltipVariant : "bottom",
    isDisabled     : false,
    isSelected     : false,
    canEdit        : false,
    canDelete      : false,
};

export default TabItem;
