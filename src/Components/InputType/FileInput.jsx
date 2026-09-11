import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import InputContent         from "../Input/InputContent";
import Icon                 from "../Common/Icon";
import ChipItem             from "../Chip/ChipItem";
import ChipList             from "../Chip/ChipList";



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
    margin-right: -6px;
    transform: rotate(45deg);

    ${(props) => props.withLabel && "margin-top: -4px;"}
`;

const Input = Styled.input`
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    font-size: 20px;
    opacity: 0;
    pointer-events: none;
`;



/**
 * The File Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function FileInput(props) {
    const {
        inputRef, className, icon, postIcon, isFocused, isDisabled,
        name, value, placeholder, onlyImages, accept, maxSize, withBorder, withLabel,
        allowMultiple, onChange, onClear, onError, onFocus, onBlur,
    } = props;


    // Handles the File Change
    const handleChange = (e) => {
        if (!e.target.files.length) {
            return;
        }

        if (allowMultiple) {
            const files    = Array.isArray(value) ? value : [];
            let   newFiles = 0;
            for (const newFile of e.target.files) {
                if (!files.filter((elem) => elem.name === newFile.name).length &&
                    Utils.isValidFile(newFile, false, maxSize)
                ) {
                    newFiles += 1;
                    files.push({
                        file : newFile,
                        name : newFile.name,
                    });
                }
            }

            if (onError && e.target.files.length !== newFiles) {
                onError(name, NLS.get("GENERAL_ERROR_FILE_SIZE"));
            } else if (newFiles > 0) {
                onChange(name, files);
                inputRef.current.value = "";
            }
            return;
        }

        const file = e.target.files[0];
        if (Utils.isValidFile(file, false, maxSize)) {
            onChange(name, file, `${name}Name`, file.name);
            inputRef.current.value = "";
        } else if (onError) {
            onError(name, NLS.get("GENERAL_ERROR_FILE_SIZE"));
        }
    };

    // Handles the File Remove
    const handleRemove = (index) => {
        value.splice(index, 1);
        onChange(name, value);
    };

    // Handles the File Clear
    const handleClear = () => {
        inputRef.current.value = "";
        onClear(allowMultiple ? [] : undefined);
    };


    // Variables
    const multipleFiles = Array.isArray(value) && value.length > 0;
    const singleFile    = !Array.isArray(value) && !!value;
    const isEmpty       = !multipleFiles && !singleFile;
    const message       = placeholder || (onlyImages ? "GENERAL_SELECT_IMAGE" : "GENERAL_SELECT_FILE");


    // Do the Render
    return <InputContent
        inputRef={inputRef}
        className={className}
        icon={icon}
        postIcon={postIcon}
        isFocused={isFocused}
        isDisabled={isDisabled}
        onClear={onClear ? handleClear : undefined}
        onError={onError}
        withBorder={withBorder}
        withLabel={withLabel}
        withPadding
        withClick
    >
        {multipleFiles && <ChipList>
            {value.map((file, index) => <InputChip
                key={index}
                variant="outlined"
                message={file.name}
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
        <Input
            ref={inputRef}
            type="file"
            name={name}
            accept={onlyImages ? "image/*" : accept}
            multiple={allowMultiple}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    </InputContent>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FileInput.propTypes = {
    inputRef      : PropTypes.any,
    className     : PropTypes.string,
    icon          : PropTypes.string,
    postIcon      : PropTypes.string,
    isFocused     : PropTypes.bool,
    isDisabled    : PropTypes.bool,
    withBorder    : PropTypes.bool,
    withLabel     : PropTypes.bool,
    name          : PropTypes.string.isRequired,
    value         : PropTypes.any,
    placeholder   : PropTypes.string,
    onlyImages    : PropTypes.bool,
    allowMultiple : PropTypes.bool,
    accept        : PropTypes.string,
    maxSize       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onChange      : PropTypes.func.isRequired,
    onClear       : PropTypes.func,
    onError       : PropTypes.func,
    onFocus       : PropTypes.func.isRequired,
    onBlur        : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
FileInput.defaultProps = {
    className     : "",
    isFocused     : false,
    isDisabled    : false,
    withBorder    : true,
    withLabel     : true,
    placeholder   : "",
    onlyImages    : false,
    allowMultiple : false,
    accept        : "",
};

export default FileInput;
