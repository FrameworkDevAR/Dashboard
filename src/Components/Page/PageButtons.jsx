import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Store                from "../../Core/Store";

// Components
import PageFooter           from "./PageFooter";
import Button               from "../Form/Button";



// Styles
const Save = Styled.span`
    display: inline-flex;
`;



/**
 * The Page Buttons
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PageButtons(props) {
    const { canEdit, isEdit, isDisabled, hasChanges, onSubmit, onDelete } = props;

    const saveRef = React.useRef(null);

    const { showTooltip, hideTooltip } = Store.useAction("core");


    // Handles the Tooltip, on a wrapper as a disabled button gets no mouse events
    const handleTooltip = () => {
        if (hasChanges === false) {
            showTooltip(saveRef, "top", "GENERAL_NOTHING_TO_SAVE");
        }
    };


    // Do the Render
    return <PageFooter>
        <Save
            ref={saveRef}
            onMouseEnter={handleTooltip}
            onMouseLeave={hideTooltip}
        >
            <Button
                isHidden={!canEdit}
                variant="primary"
                icon="save"
                message="GENERAL_SAVE"
                onClick={() => onSubmit()}
                isDisabled={isDisabled || hasChanges === false}
                withMark={hasChanges === true}
                inLowerCase
            />
        </Save>
        <Button
            isHidden={!canEdit || !isEdit}
            variant="outlined-error"
            icon="delete"
            message="GENERAL_DELETE"
            onClick={() => onDelete()}
            inLowerCase
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
    hasChanges : PropTypes.bool,
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
