import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import InputField           from "../Form/InputField";



// Styles
const SearchField = Styled(InputField)`
    --input-plain-height: 32px;
    margin-left: 32px;
    width: 200px;
`;



/**
 * The Dialog Search Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogSearch(props) {
    const { value, onChange } = props;


    // Handles the Input Change
    const handleChange = (name, value) => {
        onChange(value);
    };


    // Do the Render
    return <SearchField
        name="search"
        icon="search"
        placeholder="GENERAL_SEARCH"
        value={value}
        onChange={handleChange}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DialogSearch.propTypes = {
    value    : PropTypes.string,
    onChange : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DialogSearch.defaultProps = {
    value : "",
};

export default DialogSearch;
