import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import EmptyContent         from "./EmptyContent";
import Button               from "../Form/Button";



// Styles
const Container = Styled(EmptyContent).attrs(({ hasFilter, hasTabs, statsAmount }) => ({ hasFilter, hasTabs, statsAmount }))`
    height: calc(
        var(--page-height)
        - ${(props) => props.hasFilter ? "var(--filter-height)" : "0px"}
        - ${(props) => props.hasTabs ? "var(--tabs-table)" : "0px"}
        - ${(props) => props.statsAmount > 0 ? `calc((var(--stats-height) + var(--main-gap)) * ${props.statsAmount})` : "0px"}
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
        hasFilter, hasTabs, statsAmount,
    } = props;


    // Do the Render. It takes the height of the Table it replaces, which the Content
    // reduces with the Filter, the Tabs and the Stats above it
    return <Container
        isHidden={isHidden}
        icon="filter-empty"
        message={message}
        description={description}
        hasFilter={hasFilter}
        hasTabs={hasTabs}
        statsAmount={statsAmount}
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
    statsAmount : PropTypes.number,
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
    statsAmount : 0,
};

export default EmptyFilter;
