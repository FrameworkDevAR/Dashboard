import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import InputContent         from "../Input/InputContent";
import Icon                 from "../Common/Icon";
import ChipList             from "../Chip/ChipList";
import ChipItem             from "../Chip/ChipItem";



// Styles
const InputChip = Styled(ChipItem)`
    padding: 0 4px 0 8px;
`;

const InputValue = Styled.div`
    flex-grow: 2;
    font-size: var(--input-font);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const InputIcon = Styled(Icon).attrs(({ withLabel }) => ({ withLabel }))`
    ${(props) => props.withLabel ? "margin-top: -4px;" : "margin-block: -4px;"}
    margin-right: -6px;
    transform: rotate(45deg);
`;



/**
 * The Media Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MediaInput(props) {
    const {
        className, icon, postIcon, isFocused, isDisabled, withLabel,
        name, value, placeholder, onlyImages,
        onClick, onChange, onClear,
    } = props;


    // Handles the File Remove
    const handleRemove = (index) => {
        value.splice(index, 1);
        onChange(name, value);
    };


    // Variables
    const multipleFiles = Array.isArray(value) && value.length > 0;
    const singleFile    = !Array.isArray(value) && !!value;
    const isEmpty       = !multipleFiles && !singleFile;
    const message       = placeholder || (onlyImages ? "GENERAL_SELECT_IMAGE" : "GENERAL_SELECT_FILE");


    // Do the Render
    return <InputContent
        className={className}
        icon={icon}
        postIcon={postIcon}
        isFocused={isFocused}
        isDisabled={isDisabled}
        onClick={onClick}
        onClear={onClear}
        withBorder
        withPadding
        withLabel={withLabel}
        withClick
    >
        {multipleFiles && <ChipList>
            {value.map((file, index) => <InputChip
                key={index}
                variant="outlined"
                message={file}
                onClick={(e) => e.stopPropagation()}
                onClose={() => handleRemove(index)}
            />)}
        </ChipList>}

        {singleFile && <InputValue>{value}</InputValue>}
        {isEmpty && <InputValue>{NLS.get(message)}</InputValue>}

        <InputIcon
            icon="attachment"
            size="18"
            withLabel={withLabel}
        />
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MediaInput.propTypes = {
    className   : PropTypes.string,
    icon        : PropTypes.string,
    postIcon    : PropTypes.string,
    isFocused   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    withLabel   : PropTypes.bool,
    name        : PropTypes.string.isRequired,
    value       : PropTypes.any,
    placeholder : PropTypes.string,
    onlyImages  : PropTypes.bool,
    onClick     : PropTypes.func,
    onChange    : PropTypes.func,
    onClear     : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MediaInput.defaultProps = {
    className   : "",
    isFocused   : false,
    isDisabled  : false,
    placeholder : "",
    onlyImages  : false,
};

export default MediaInput;
