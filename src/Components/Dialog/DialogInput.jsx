import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import InputField           from "../Form/InputField";



// Styles
const DialogField = Styled(InputField)`
    --input-plain-height: 30px;
    margin-left: 32px;
    width: 200px;

    .input-content {
        background-color: var(--secondary-color);
        color: white;
    }
    .input-select {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAICAYAAAAIloRgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5RDU2MUY2NTVCMTcxMUU0QjkyRkI3OUY0NTFERDQ2NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5RDU2MUY2NjVCMTcxMUU0QjkyRkI3OUY0NTFERDQ2NSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjlENTYxRjYzNUIxNzExRTRCOTJGQjc5RjQ1MURENDY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjlENTYxRjY0NUIxNzExRTRCOTJGQjc5RjQ1MURENDY1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+tDVqfwAAAGRJREFUeNpi/P//PwMRQACIP1AgDwZMDMSBA1ADcVl0gChTQD4jAoPABSAWQBMXgIr/J8YcYi27gMVCATRxqlmGbrADDgdQxTJ0C/+TahGplmHzoQAp+km1DGbhAlItAmGAAAMAvlABz3Bd5v8AAAAASUVORK5CYII=);
    }
    .input-content input:focus {
        color: white;
    }
`;



/**
 * The Dialog Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogInput(props) {
    const { type, value, placeholder, options, onChange } = props;

    // Handles the Input Change
    const handleChange = (name, value) => {
        onChange(value);
    };


    return <DialogField
        type={type}
        name="dialog"
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={handleChange}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DialogInput.propTypes = {
    type        : PropTypes.string,
    value       : PropTypes.any,
    placeholder : PropTypes.string,
    options     : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    onChange    : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DialogInput.defaultProps = {
    value : "",
};

export default DialogInput;
