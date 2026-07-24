import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Utils                from "../../Utils/Utils";

// Components
import PageLoader           from "../Loader/PageLoader";
import FilterList           from "../Filter/FilterList";
import FilterBar            from "../Filter/FilterBar";
import StatList             from "../Stats/StatList";
import TabList              from "../Tab/TabList";



// Styles
const Section = Styled.section.attrs(({ withDetails, wideDetails, hasTabs, centered }) => ({ withDetails, wideDetails, hasTabs, centered }))`
    flex-grow: 1;
    padding: 0 var(--main-padding) var(--main-padding);
    overflow: auto;

    ${(props) => props.withDetails && `
        display: grid;
        grid-template-columns: minmax(0, 1fr) var(--details-width${props.wideDetails ? "-wide" : ""});
        column-gap: 16px;
    `};

    ${(props) => (props.withDetails && props.hasTabs) && `
        grid-template-rows: var(--tabs-table) 1fr;
        .details {
            grid-column: 2 / 2;
            grid-row: 1 / 3;
        }
    `};

    ${(props) => props.centered && `
        display: flex;
        justify-content: center;
        align-items: center;
    `};

    @media (max-width: ${Responsive.WIDTH_FOR_DETAILS}px) {
        display: block;
    }
`;



/**
 * The Content Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Content(props) {
    const {
        className, isLoading, passedRef,
        withTabs, withFilter, withDetails, wideDetails, children,
    } = props;


    // Render the Loading
    if (isLoading) {
        return <Section
            className={className}
            ref={passedRef}
            centered
        >
            <PageLoader />
        </Section>;
    }


    // Calculate the Items
    const items       = [];
    let   hasTabs     = withTabs;
    let   hasFilter   = withFilter;
    let   statsAmount = 0;

    for (const child of Utils.getVisibleChildren(children)) {
        if (child.type === FilterList || child.type === FilterBar) {
            hasFilter = true;
        } else if (child.type === StatList) {
            statsAmount += 1;
        } else if (child.type === TabList) {
            hasTabs = true;
        }
    }
    for (const [ key, child ] of Utils.getVisibleChildren(children).entries()) {
        if (typeof child.type !== "string") {
            items.push(React.cloneElement(child, { key, hasFilter, statsAmount, hasTabs }));
        } else {
            items.push(React.cloneElement(child, { key }));
        }
    }


    // Do the Render
    return <Section
        ref={passedRef}
        className={className}
        withDetails={withDetails}
        wideDetails={wideDetails}
        hasTabs={hasTabs}
    >
        {items}
    </Section>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Content.propTypes = {
    className   : PropTypes.string,
    isLoading   : PropTypes.bool,
    passedRef   : PropTypes.any,
    withTabs    : PropTypes.bool,
    withFilter  : PropTypes.bool,
    withDetails : PropTypes.bool,
    wideDetails : PropTypes.bool,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Content.defaultProps = {
    className   : "",
    isLoading   : false,
    withTabs    : false,
    withFilter  : false,
    withDetails : false,
};

export default Content;
