import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";



// Variants
const Variant = {
    H2   : "h2",
    H3   : "h3",
    H4   : "h4",
    P    : "p",
    LI   : "li",
    SPAN : "span",
    DIV  : "div",
    PRE  : "pre",
};

// http://, https://, ftp://
const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]/gim;
// www. sans http:// or https://
const pseudoUrlPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim;
// Email addresses
const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
// The Links with their text and any other tag
const tagPattern = /<a\b[^>]*>[\s\S]*?<\/a>|<\/?[a-z!][^>]*>/gi;



// Styles
const Code = Styled.pre`
    white-space: pre-wrap;
`;



/**
 * Replaces the given pattern only in the text that is outside of the Links and the tags
 * @param {string}   html
 * @param {RegExp}   pattern
 * @param {Function} replacer
 * @returns {string}
 */
function replaceOutsideTags(html, pattern, replacer) {
    // A url inside an href or inside the text of a Link is already one, and making it a
    // Link again nests an anchor in the attribute and breaks the html
    let result = "";
    let last   = 0;
    for (const match of html.matchAll(tagPattern)) {
        result += html.slice(last, match.index).replace(pattern, replacer) + match[0];
        last    = match.index + match[0].length;
    }
    return result + html.slice(last).replace(pattern, replacer);
}

/**
 * The Html Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Html(props) {
    const {
        isHidden, className, style, variant,
        addLinks, addBreaks, breakEmail, formatText,
        onClick, onMouseDown,
        message, content, showEmpty, children,
    } = props;

    let __html = String(NLS.get(message) || content || children || "");

    // Nothing to Render
    if (isHidden || (!showEmpty && !__html)) {
        return <React.Fragment />;
    }


    // Parse the Content
    if (addLinks) {
        __html = replaceOutsideTags(__html, urlPattern, (match) => {
            const text = (breakEmail ? Utils.makeBreakable(match) : match).replace(/&/g, "&amp;");
            return `<a href="${match}" target="_blank">${text}</a>`;
        });
        __html = replaceOutsideTags(__html, pseudoUrlPattern, (match, p1, p2) => {
            const text = breakEmail ? Utils.makeBreakable(p2) : p2;
            return `${p1}<a href="http://${p2}" target="_blank">${text}</a>`;
        });
        __html = replaceOutsideTags(__html, emailAddressPattern, (match) => {
            const text = breakEmail ? Utils.makeBreakable(match) : match;
            return `<a href="mailto:${match}" target="_blank">${text}</a>`;
        });
    }

    if (addBreaks) {
        __html = __html.replace(/\n/g, "<br />");
    }
    if (formatText) {
        __html = __html
            .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
            .replace(/__([^_]+)__/g, "<i>$1</i>")
            .replace(/~~([^~]+)~~/g, "<s>$1</s>")
            .replace(/```([^`]+)```/g, "<code>$1</code>");
    }


    // Do the Render
    switch (variant) {
    case Variant.H2:
        return <h2
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    case Variant.H3:
        return <h3
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    case Variant.H4:
        return <h4
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    case Variant.P:
        return <p
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    case Variant.LI:
        return <li
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    case Variant.SPAN:
        return <span
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    case Variant.PRE:
        return <Code
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    default:
        return <div
            className={className}
            style={style}
            onClick={onClick}
            onMouseDown={onMouseDown}
            dangerouslySetInnerHTML={{ __html }}
        />;
    }
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Html.propTypes = {
    isHidden    : PropTypes.bool,
    variant     : PropTypes.string,
    className   : PropTypes.string,
    style       : PropTypes.object,
    onClick     : PropTypes.func,
    onMouseDown : PropTypes.func,
    message     : PropTypes.string,
    content     : PropTypes.string,
    children    : PropTypes.string,
    addLinks    : PropTypes.bool,
    breakEmail  : PropTypes.bool,
    addBreaks   : PropTypes.bool,
    formatText  : PropTypes.bool,
    showEmpty   : PropTypes.bool,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Html.defaultProps = {
    isHidden   : false,
    className  : "",
    variant    : Variant.DIV,
    addLinks   : false,
    breakEmail : true,
    addBreaks  : false,
    formatText : false,
    showEmpty  : false,
};

export default Html;
