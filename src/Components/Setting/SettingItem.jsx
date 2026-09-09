import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import DetailCard           from "../Details/DetailCard";
import IconLink             from "../Link/IconLink";



// Styles
const Content = Styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
`;



/**
 * The Setting Item of a Setting List
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SettingItem(props) {
    const {
        isHidden, isDimmed, className, elemID, index,
        onGrab, onEdit, onDelete, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <DetailCard
        className={className}
        isDimmed={isDimmed}
        onSort={(e) => onGrab(e, elemID, index)}
        onClick={onEdit}
        actions={<>
            <IconLink
                variant="black"
                icon="edit"
                onClick={onEdit}
                isSmall
            />
            <IconLink
                variant="error"
                icon="delete"
                onClick={onDelete}
                isSmall
            />
        </>}
    >
        <Content>{children}</Content>
    </DetailCard>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SettingItem.propTypes = {
    isHidden  : PropTypes.bool,
    isDimmed  : PropTypes.bool,
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
