import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Icon                 from "../Common/Icon";
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.li`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 6px 6px 12px;
    background-color: var(--lighter-gray);
    border-radius: var(--border-radius);
    transition: background-color 0.2s;
    cursor: pointer;

    &:hover {
        background-color: var(--light-gray);
    }
`;

const Content = Styled.div`
    flex-grow: 2;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
`;

const Action = Styled(IconLink)`
    margin-left: -4px;
`;



/**
 * The Setting Item of a Setting List
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SettingItem(props) {
    const {
        isHidden, className, elemID, index,
        onGrab, onEdit, onDelete, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        <Icon
            icon="drag"
            cursor="grab"
            onMouseDown={(e) => onGrab(e, elemID, index)}
            size={18}
        />
        <Content onClick={onEdit}>
            {children}
        </Content>
        <Action
            variant="black"
            icon="edit"
            onClick={onEdit}
            isSmall
        />
        <Action
            variant="error"
            icon="delete"
            onClick={onDelete}
            isSmall
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SettingItem.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    elemID    : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
    index     : PropTypes.number,
    onGrab    : PropTypes.func,
    onEdit    : PropTypes.func.isRequired,
    onDelete  : PropTypes.func.isRequired,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
SettingItem.defaultProps = {
    isHidden  : false,
    className : "",
    index     : 0,
};

export default SettingItem;
