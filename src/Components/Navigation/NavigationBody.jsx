import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Utils                from "../../Utils/Utils";

// Components
import CircularLoader       from "../Loader/CircularLoader";
import NavigationList       from "../Navigation/NavigationList";



// Styles
const Container = Styled.nav`
    display: flex;
    flex-grow: 2;
    flex-direction: column;
    justify-content: flex-start;
    --navigation-body-offset: 6px;

    padding: var(--navigation-body-padding, 0px 16px 16px 6px);
    margin-top: calc(var(--navigation-body-offset) * -1);
    padding-top: var(--navigation-body-offset);
    overflow: auto;
`;

const Ul = Styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
`;



/**
 * The Navigation Body Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function NavigationBody(props) {
    const { passedRef, onAction, smallNav, isLoading, children } = props;


    // Parse the Items
    const items   = [];
    let   addList = true;
    for (const [ key, child ] of Utils.getChildren(children).entries()) {
        if (child.type === NavigationList) {
            addList = false;
        }
        if (!child.props.isHidden) {
            const childProps = { key };
            if (onAction) {
                childProps.onAction = onAction;
            }
            if (smallNav && child.type === CircularLoader) {
                childProps.isTiny = true;
            }
            items.push(React.cloneElement(child, childProps));
        }
    }


    // Do the Render
    return <Container
        ref={passedRef}
        className="navigation-body"
    >
        {isLoading && <CircularLoader
            isTiny={smallNav}
            topSpace={20}
        />}
        {!isLoading && items.length > 0 && (addList ? <Ul>{items}</Ul> : items)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
NavigationBody.propTypes = {
    passedRef : PropTypes.any,
    isLoading : PropTypes.bool,
    smallNav  : PropTypes.bool,
    onAction  : PropTypes.func,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
NavigationBody.defaultProps = {
    isLoading : false,
};

export default NavigationBody;
