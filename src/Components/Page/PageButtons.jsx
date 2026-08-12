import React                from "react";
import PropTypes            from "prop-types";

// Components
import PageFooter           from "./PageFooter";
import Button               from "../Form/Button";



/**
 * The Page Buttons
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageButtons(props) {
    const { canEdit, isEdit, isDisabled, hideCancel, onSubmit, onDelete, onClose } = props;


    // Do the Render
    return <PageFooter>
        <Button
            isHidden={!canEdit}
            variant="primary"
            message="GENERAL_SAVE"
            onClick={() => onSubmit()}
            isDisabled={isDisabled}
        />
        <Button
            isHidden={!canEdit || !isEdit}
            variant="primary"
            message="GENERAL_DELETE"
            onClick={() => onDelete()}
        />
        <Button
            isHidden={hideCancel}
            variant="cancel"
            message="GENERAL_CANCEL"
            onClick={() => onClose()}
        />
    </PageFooter>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PageButtons.propTypes = {
    canEdit    : PropTypes.bool,
    isEdit     : PropTypes.bool,
    isDisabled : PropTypes.bool,
    hideCancel : PropTypes.bool,
    onSubmit   : PropTypes.func.isRequired,
    onDelete   : PropTypes.func,
    onClose    : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PageButtons.defaultProps = {
    canEdit : true,
};

export default PageButtons;
