import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import EmptyContent         from "./EmptyContent";
import Button               from "../Form/Button";



// Styles
const Container = Styled(EmptyContent).attrs(({ hasFilter, hasTabs }) => ({ hasFilter, hasTabs }))`
    height: calc(
        var(--page-height)
        - ${(props) => props.hasFilter ? "calc(var(--filter-height) + var(--filter-chips-height, 0px))" : "0px"}
        - ${(props) => props.hasTabs ? "var(--tabs-table)" : "0px"}
    );
`;



/**
 * The Empty Content of a List that the Filters leave without results
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EmptyFilter(props) {
    const {
        isHidden, message, description, onClear,
        hasFilter, hasTabs,
    } = props;


    // Do the Render. It takes the height of the Table it replaces, which the Content
    // reduces with the Filter and the Tabs above it
    return <Container
        isHidden={isHidden}
        icon="filter-empty"
        message={message}
        description={description}
        hasFilter={hasFilter}
        hasTabs={hasTabs}
        withSpacing
    >
        <Button
            variant="outlined"
            icon="filter-clear"
            message="GENERAL_CLEAR_FILTERS"
            onClick={onClear}
            inLowerCase
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EmptyFilter.propTypes = {
    isHidden    : PropTypes.bool,
    message     : PropTypes.string,
    description : PropTypes.string,
    onClear     : PropTypes.func.isRequired,
    hasFilter   : PropTypes.bool,
    hasTabs     : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EmptyFilter.defaultProps = {
    isHidden    : false,
    message     : "GENERAL_NONE_FILTER_TITLE",
    description : "GENERAL_NONE_FILTER_TEXT",
    hasFilter   : false,
    hasTabs     : false,
};

export default EmptyFilter;
