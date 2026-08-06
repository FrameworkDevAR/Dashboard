import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Dashboard
import Header               from "./Header";



// Styles
const Container = Styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--main-gap);
    height: var(--header-height);
    padding: var(--main-padding, 16px) var(--main-padding) 0 var(--main-padding);
`;

const Grow = Styled.div`
    flex-grow: 2;
    min-width: 0;

    & > div {
        margin-bottom: 0;
    }
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

    return <Container className={className}>
        <Grow>{filter}</Grow>
        <Actions>{children}</Actions>
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
