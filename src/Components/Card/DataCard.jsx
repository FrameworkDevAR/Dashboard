import React                from "react";
import PropTypes            from "prop-types";
import Styled, { css }      from "styled-components";

// Components
import Card                 from "./Card";
import Html                 from "../Common/Html";
import InputCopy            from "../Input/InputCopy";



// Styles
const Container = Styled(Card)`
    position: relative;

    h3 {
        margin-bottom: 12px;
    }
`;

const dataStyles = css`
    margin: 0;
    color: var(--title-color);
    font-size: var(--font-size-small);
    white-space: pre-wrap;
    overflow-wrap: anywhere;

    ${(/** @type {{ maxHeight: number }} */ props) => props.maxHeight > 0 && `
        max-height: ${props.maxHeight}px;
        overflow: auto;
    `}
`;

const Data = Styled(Html).attrs(({ maxHeight }) => ({ maxHeight }))`
    ${dataStyles}
`;

const Text = Styled.pre.attrs(({ maxHeight }) => ({ maxHeight }))`
    ${dataStyles}
`;



/**
 * The Data Card Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DataCard(props) {
    const {
        isHidden, className, message, content, text, isPre, addLinks,
        maxHeight, copyValue, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }

    // The content is html and the text is shown as it is written, which is also what is copied
    // when there is nothing else to copy
    const toCopy = copyValue || text;
    return <Container className={className} message={message}>
        {!!content && <Data
            variant={isPre ? "pre" : "div"}
            content={content}
            maxHeight={maxHeight}
            addLinks={addLinks}
        />}
        {!!text && <Text maxHeight={maxHeight}>{text}</Text>}
        {children}
        {!!toCopy && <InputCopy
            copyValue={toCopy}
            isFloating
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DataCard.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    message   : PropTypes.string,
    content   : PropTypes.string,
    text      : PropTypes.string,
    isPre     : PropTypes.bool,
    addLinks  : PropTypes.bool,
    maxHeight : PropTypes.number,
    copyValue : PropTypes.string,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DataCard.defaultProps = {
    isHidden  : false,
    className : "",
    message   : "",
    content   : "",
    text      : "",
    isPre     : false,
    addLinks  : false,
    maxHeight : 0,
    copyValue : "",
};

export default DataCard;
