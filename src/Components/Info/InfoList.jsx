import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import InfoAction           from "../Info/InfoAction";



// Styles
const Section = Styled.section`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 24px;
    gap: 24px;
    border-bottom: 1px solid var(border-color-light);
    color: var(--black-color);
`;

const Items = Styled.div`
    display: flex;
    gap: 32px;

    @media (max-width: 400px) {
        gap: 16px;
    }
`;

const Actions = Styled.div`
    display: flex;
    gap: 8px;
`;



/**
 * The Info List
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InfoList(props) {
    const { className, variant, inLowerCase, onAction, children } = props;

    const items   = [];
    const actions = [];

    for (const [ key, child ] of Utils.getVisibleChildren(children).entries()) {
        if (child.type === InfoAction) {
            actions.push(React.cloneElement(child, {
                key, inLowerCase, onAction,
                variant : child.props.variant || variant,
            }));
        } else {
            items.push(React.cloneElement(child, { key }));
        }
    }

    return <Section className={className}>
        <Items>
            {items}
        </Items>
        {actions.length > 0 && <Actions className="actions">
            {actions}
        </Actions>}
    </Section>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InfoList.propTypes = {
    className   : PropTypes.string,
    variant     : PropTypes.string,
    inLowerCase : PropTypes.bool,
    onAction    : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InfoList.defaultProps = {
    className : "",
    variant   : "accent",
};

export default InfoList;
