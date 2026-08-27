import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Action               from "../../Core/Action";
import Store                from "../../Core/Store";

// Components
import DetailTitle          from "./DetailTitle";



// Styles
const Container = Styled.div`
    color: var(--font-lighter);
    background-color: var(--content-color);
    border-radius: var(--border-radius);
`;

const Content = Styled.section`
    margin: 0;
    padding: 8px 0;
`;



/**
 * The Detail List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DetailList(props) {
    const {
        isHidden, className, icon, message, isBeta,
        collapsible, noSticky, action, canEdit, editIcon, editTooltip,
        viewAction, canView, viewIcon, viewTooltip, onAction, children,
    } = props;

    const { closeDetails } = Store.useAction("core");


    // The Current State
    const [ isCollapsed, setCollapsed ] = React.useState(false);


    // Handles the Initial Collapsed state
    React.useEffect(() => {
        if (collapsible) {
            const collapsed = localStorage.getItem(`dashboard-collapsed-${collapsible}-${message}`);
            setCollapsed(Boolean(Number(collapsed)));
        }
    }, [ collapsible, message ]);

    // Handles the Collapsed click
    const handleClick = (e) => {
        e.preventDefault();
        if (collapsible) {
            setCollapsed(!isCollapsed);
            localStorage.setItem(`dashboard-collapsed-${collapsible}-${message}`, isCollapsed ? "0" : "1");
        }
    };

    // Handles the Action
    const handleAction = (e, action) => {
        e.stopPropagation();
        if (onAction) {
            onAction(Action.get(action));
        }
        closeDetails();
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={`details-list ${className}`}>
        <DetailTitle
            icon={icon}
            message={message}
            isBeta={isBeta}
            collapsible={collapsible}
            isCollapsed={isCollapsed}
            noSticky={noSticky}
            action={action}
            canEdit={canEdit}
            editIcon={editIcon}
            editTooltip={editTooltip}
            viewAction={viewAction}
            canView={canView}
            viewIcon={viewIcon}
            viewTooltip={viewTooltip}
            onClick={handleClick}
            onAction={handleAction}
        />
        {!isCollapsed && <Content className="details-content">
            {children}
        </Content>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DetailList.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    icon        : PropTypes.string,
    message     : PropTypes.string,
    isBeta      : PropTypes.bool,
    collapsible : PropTypes.string,
    noSticky    : PropTypes.bool,
    action      : PropTypes.string,
    canEdit     : PropTypes.bool,
    editIcon    : PropTypes.string,
    editTooltip : PropTypes.string,
    viewAction  : PropTypes.string,
    canView     : PropTypes.bool,
    viewIcon    : PropTypes.string,
    viewTooltip : PropTypes.string,
    onAction    : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DetailList.defaultProps = {
    isHidden  : false,
    className : "",
    action    : "",
    editIcon  : "edit",
    viewIcon  : "view",
};

export default DetailList;
