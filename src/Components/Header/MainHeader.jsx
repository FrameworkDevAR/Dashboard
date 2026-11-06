import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Responsive           from "../../Core/Responsive";

// Dashboard
import Header               from "./Header";
import MainHeaderContext    from "./MainHeaderContext";



// Styles
const Container = Styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--main-gap);
    height: var(--header-height);
    padding: var(--main-padding, 16px) var(--main-padding) 0 var(--main-padding);

    @media (max-width: ${Responsive.WIDTH_FOR_MENU}px) {
        padding-top: calc(var(--main-padding) / 2);
    }
`;

const Grow = Styled.div`
    flex-grow: 2;
    min-width: 0;
`;

const Actions = Styled.div`
    flex-shrink: 0;
    display: flex;
    gap: 8px;
`;

const FilterContent = Styled.div`
    padding: 0 var(--main-padding);
`;



/**
 * The Main Header
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MainHeader(props) {
    const { className, withTitle, message, icon, filter, children } = props;

    // The Filter shows the actions next to its input, so it can place them when its chips
    // take a row of their own, and it says when it does
    const [ hasFilter, setHasFilter ] = React.useState(false);
    const context = React.useMemo(() => ({ actions : children, setHasFilter }), [ children ]);


    // Do the Render
    if (withTitle) {
        return <>
            <Header
                className={className}
                message={message}
                icon={icon}
            >
                {children}
            </Header>
            {!!filter && <FilterContent>
                {filter}
            </FilterContent>}
        </>;
    }

    // The Main makes the header taller when it has a Filter, so the Filter keeps its gap
    return <Container className={`${className} ${filter ? "main-header-filter" : ""}`}>
        <MainHeaderContext.Provider value={context}>
            <Grow>{filter}</Grow>
        </MainHeaderContext.Provider>
        {!(filter && hasFilter) && <Actions>{children}</Actions>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MainHeader.propTypes = {
    className : PropTypes.string,
    withTitle : PropTypes.bool,
    message   : PropTypes.string,
    icon      : PropTypes.string,
    filter    : PropTypes.node,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
MainHeader.defaultProps = {
    className : "",
    withTitle : false,
};

export default MainHeader;
