import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import HyperLink            from "../Link/HyperLink";
import Icon                 from "../Common/Icon";
import Pill                 from "../Pill/Pill";



// Styles
const Ul = Styled.ul`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--font-size-small);
`;

const Li = Styled.li`
    display: flex;
    align-items: center;
    gap: 2px;
`;

const Separator = Styled(Icon)`
    font-size: 14px;
    color: var(--font-lightest);
`;

const Link = Styled(HyperLink)`
    display: block;
    padding: 2px 6px;
    color: var(--font-lighter);
    border-radius: var(--border-radius-small);
    transition: all 0.2s;

    &:hover {
        color: var(--title-color);
        background: var(--lighter-gray);
    }
`;

const Current = Styled.span`
    padding: 2px 6px;
    color: var(--title-color);
    font-weight: 500;
`;

const Amount = Styled(Pill)`
    margin-left: auto;
`;



/**
 * The Breadcrumb Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Breadcrumb(props) {
    const { className, route, amount, onClick } = props;

    if (!route) {
        return <React.Fragment />;
    }

    // Handles the Click
    const handleClick = (e, href) => {
        if (onClick) {
            onClick(href);
            e.stopPropagation();
            e.preventDefault();
        }
    };

    const parts = route.split("/");
    const items = [{ key : 0, href : "/", message : "GENERAL_START" }];
    const href  = [];

    for (let i = 0; i < parts.length; i++) {
        const message = parts[i];
        href.push(message);
        if (isNaN(message)) {
            items.push({
                key     : i + 1,
                href    : href.join("/"),
                message : message.replace(/-/g, " "),
            });
        }
    }

    return <Ul className={className}>
        {items.map(({ key, href, message }, index) => <Li key={key}>
            {index > 0 && <Separator icon="next" />}
            {index === items.length - 1 ? <Current>
                {NLS.get(message)}
            </Current> : <Link
                variant="none"
                href={onClick ? "#" : href}
                onClick={(e) => handleClick(e, href)}
                message={message}
            />}
        </Li>)}
        {!!amount && <Amount message={amount} />}
    </Ul>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Breadcrumb.propTypes = {
    className : PropTypes.string,
    route     : PropTypes.string,
    amount    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onClick   : PropTypes.func,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Breadcrumb.defaultProps = {
    className : "",
};

export default Breadcrumb;
