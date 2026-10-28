import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Title                from "../Header/Title";
import Subtitle             from "../Header/Subtitle";



// Styles
const Container = Styled.header`
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    height: var(--header-height);
    padding: var(--header-padding);
    gap: var(--main-padding);
    overflow: hidden;

    &.header-compact .header-child {
        .btn.btn {
            padding: 4px 8px;
        }
        .btn-preicon {
            margin-right: 0;
        }
        .btn-content {
            display: none;
        }
    }
`;

const Child = Styled.div`
    flex-grow: 2;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;
    gap: 8px;

    .tab-item {
        margin-bottom: 0;
    }
`;



/**
 * The Header Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Header(props) {
    const {
        isHidden, className, icon, iconColor, emoji,
        message, fallback, href, backIcon,
        subTitle, subCircle, hasChanges, tabs, children,
    } = props;


    // The References
    const containerRef = React.useRef(null);
    const compactRef   = React.useRef(0);

    // The Current State
    const [ isCompact, setCompact ] = React.useState(false);


    // When the Title gets cut, the actions only show their icons. The width where that
    // happened is kept, so they show their texts again only once the Header is wider,
    // as with the icons the Title fits, and checking it again would switch them back
    React.useEffect(() => {
        const node = containerRef.current;
        if (!node) {
            return () => {};
        }

        const update = () => {
            const text  = node.querySelector(".title > span:last-child");
            const width = node.clientWidth;
            if (compactRef.current && width > compactRef.current) {
                compactRef.current = 0;
                setCompact(false);
            }
            if (!compactRef.current && text && text.scrollWidth > text.clientWidth + 1) {
                compactRef.current = width;
                setCompact(true);
            }
        };

        // The actions can render after the Header, so the Title can get cut without the
        // Header changing its size, and the parts are observed too. It also runs again each
        // time it changes, as showing the texts can cut the Title once they render
        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        for (const part of node.querySelectorAll(".title, .header-child")) {
            observer.observe(part);
        }
        return () => observer.disconnect();
    }, [ isHidden, message, isCompact ]);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        ref={containerRef}
        className={`${className} ${isCompact ? "header-compact" : ""}`}
    >
        <Title
            icon={icon}
            iconColor={iconColor}
            emoji={emoji}
            message={message}
            fallback={fallback}
            href={href}
            backIcon={backIcon}
        />
        {hasChanges ? <Subtitle
            message="GENERAL_UNSAVED_CHANGES"
            circle="orange"
        /> : <Subtitle
            message={subTitle}
            circle={subCircle}
        />}
        {tabs}
        <Child className="header-child">
            {children}
        </Child>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Header.propTypes = {
    isHidden   : PropTypes.bool,
    className  : PropTypes.string,
    icon       : PropTypes.string,
    iconColor  : PropTypes.string,
    emoji      : PropTypes.string,
    message    : PropTypes.string.isRequired,
    fallback   : PropTypes.string,
    href       : PropTypes.string,
    backIcon   : PropTypes.string,
    subTitle   : PropTypes.string,
    subCircle  : PropTypes.string,
    hasChanges : PropTypes.bool,
    tabs       : PropTypes.node,
    children   : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Header.defaultProps = {
    isHidden  : false,
    className : "",
};

export default Header;
