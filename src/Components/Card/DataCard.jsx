import React                from "react";
import PropTypes            from "prop-types";
import Styled, { css }      from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Card                 from "./Card";
import Html                 from "../Common/Html";
import HyperLink            from "../Link/HyperLink";
import InputCopy            from "../Input/InputCopy";



// Styles
const Container = Styled(Card)`
    position: relative;
    text-align: left;

    h3 {
        margin-bottom: 12px;
    }
`;

const Description = Styled.p`
    margin: -6px 0 12px;
    font-size: var(--font-size-small);
    color: var(--font-lightest);
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

const List = Styled.ul.attrs(({ maxHeight }) => ({ maxHeight }))`
    ${dataStyles}
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 16px;
`;

const Url = Styled.div`
    ${dataStyles}
`;



/**
 * The Data Card Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DataCard(props) {
    const {
        isHidden, className, message, description, content, text, items, url, isPre, isPlain,
        addLinks, maxHeight, copyValue, children,
    } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }

    // The content is html and the text is shown as it is written, which is also what is copied
    // when there is nothing else to copy, like the url
    const toCopy = copyValue || url || text || items.join("\n");
    return <Container className={className} message={message}>
        {!!description && <Description>{NLS.get(description)}</Description>}
        {!!content && <Data
            variant={isPre ? "pre" : "div"}
            content={content}
            maxHeight={maxHeight}
            addLinks={addLinks}
        />}
        {!!text && <Text as={isPlain ? "div" : "pre"} maxHeight={maxHeight}>{text}</Text>}
        {items.length > 0 && <List maxHeight={maxHeight}>
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </List>}
        {!!url && <Url>
            <HyperLink
                variant="primary"
                href={url}
                message={url}
                target="_blank"
            />
        </Url>}
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
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    message     : PropTypes.string,
    description : PropTypes.string,
    content     : PropTypes.string,
    text        : PropTypes.string,
    items       : PropTypes.arrayOf(PropTypes.string),
    url         : PropTypes.string,
    isPre       : PropTypes.bool,
    isPlain     : PropTypes.bool,
    addLinks    : PropTypes.bool,
    maxHeight   : PropTypes.number,
    copyValue   : PropTypes.string,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DataCard.defaultProps = {
    isHidden    : false,
    className   : "",
    message     : "",
    description : "",
    content     : "",
    text        : "",
    items       : [],
    url         : "",
    isPre       : false,
    isPlain     : false,
    addLinks    : false,
    maxHeight   : 0,
    copyValue   : "",
};

export default DataCard;
