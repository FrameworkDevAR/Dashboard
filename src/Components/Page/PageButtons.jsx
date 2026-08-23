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
    const { canEdit, isEdit, isDisabled, onSubmit, onDelete } = props;


    // Do the Render
    return <PageFooter>
        <Button
            isHidden={!canEdit}
            variant="outlined"
            icon="save"
            message="GENERAL_SAVE"
            onClick={() => onSubmit()}
            isDisabled={isDisabled}
        />
        <Button
            isHidden={!canEdit || !isEdit}
            variant="outlined-error"
            icon="delete"
            message="GENERAL_DELETE"
            onClick={() => onDelete()}
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
    onSubmit   : PropTypes.func.isRequired,
    onDelete   : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PageButtons.defaultProps = {
    canEdit : true,
};

export default PageButtons;
