import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import InputCopy            from "../Input/InputCopy";



// Styles
const Container = Styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 -8px;
    padding: 6px 8px;
    border-radius: var(--border-radius);
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--lightest-gray);
    }
`;

const Label = Styled.div`
    flex: none;
    width: var(--card-label-width, 150px);
    color: var(--font-lighter);
    font-size: var(--font-size-small);
`;

const Copy = Styled.div`
    flex: none;
    align-self: center;
    margin-block: -6px;

    .link {
        margin-top: 0;
    }
`;

const Value = Styled.div`
    flex: 1;
    color: var(--title-color);
    overflow-wrap: anywhere;
`;



/**
 * The Card Item Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function CardItem(props) {
    const { isHidden, className, label, message, hasCopy, copyValue, children } = props;


    // Variables
    const content = message ? NLS.get(String(message)) : children;


    // Do the Render
    if (isHidden || (!message && !children)) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        <Label>{NLS.get(label)}</Label>
        <Value>{content}</Value>
        {hasCopy && <Copy>
            <InputCopy
                copyValue={copyValue}
                inputValue={content}
            />
        </Copy>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
CardItem.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    label     : PropTypes.string,
    message   : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    hasCopy   : PropTypes.bool,
    copyValue : PropTypes.any,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
CardItem.defaultProps = {
    isHidden  : false,
    className : "",
    hasCopy   : false,
};

export default CardItem;
