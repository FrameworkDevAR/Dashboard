import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Action               from "../../Core/Action";
import Utils                from "../../Utils/Utils";

// Components
import NoneAvailable        from "../Common/NoneAvailable";
import CircularLoader       from "../Loader/CircularLoader";
import NavigationList       from "../Navigation/NavigationList";
import Button               from "../Form/Button";



// Styles
const Container = Styled.nav.attrs(({ withSpacing }) => ({ withSpacing }))`
    display: flex;
    flex-grow: 2;
    flex-direction: column;
    justify-content: flex-start;
    padding: ${(props) => props.withSpacing && "var(--navigation-body-padding, 0px 16px 16px 6px)"};
    overflow: auto;
`;

const None = Styled(NoneAvailable)`
    padding: 4px 0 24px 0;
    font-size: 14px;
    text-align: center;
    background-color: transparent;
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
    const {
        className, passedRef, onAction, onClose, smallNav,
        isLoading, none, canAdd, add, withSpacing, children,
    } = props;

    // The References
    const navigationRef = React.useRef(null);
    const elementRef    = passedRef || navigationRef;


    // Handles the Action
    const handleAdd = (e) => {
        if (onAction) {
            onAction(Action.get("ADD"));
        }
        e.stopPropagation();
        e.preventDefault();
    };


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
            if (onClose) {
                childProps.onClose = onClose;
            }
            if (smallNav && child.type === CircularLoader) {
                childProps.isTiny = true;
            }
            items.push(React.cloneElement(child, childProps));
        }
    }


    // Variables
    const showLoader = isLoading;
    const showNone   = Boolean(!isLoading && !items.length && none);
    const showAdd    = Boolean(showNone && canAdd && add);
    const showItems  = Boolean(!isLoading && items.length);


    // Do the Render
    return <Container
        ref={elementRef}
        className={`navigation-body ${className}`}
        withSpacing={withSpacing}
    >
        {showLoader && <CircularLoader
            isTiny={smallNav}
            topSpace={20}
        />}
        {showNone   && <div>
            <None message={none} />
            {showAdd && <Button
                variant="outlined-accent"
                icon="add"
                message={add}
                onClick={(e) => handleAdd(e)}
                fullWidth
            />}
        </div>}
        {showItems  && (addList ? <Ul>{items}</Ul> : items)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
NavigationBody.propTypes = {
    className   : PropTypes.string,
    passedRef   : PropTypes.any,
    variant     : PropTypes.string,
    isLoading   : PropTypes.bool,
    none        : PropTypes.string,
    canAdd      : PropTypes.bool,
    add         : PropTypes.string,
    withSpacing : PropTypes.bool,
    smallNav    : PropTypes.bool,
    onAction    : PropTypes.func,
    onClose     : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
NavigationBody.defaultProps = {
    className   : "",
    none        : "",
    isLoading   : false,
    withSpacing : true,
};

export default NavigationBody;
