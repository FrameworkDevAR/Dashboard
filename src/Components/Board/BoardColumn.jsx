import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Store                from "../../Core/Store";

// Components
import BoardContext         from "./BoardContext";
import Header               from "../Header/Header";
import Amount               from "../Common/Amount";
import ScrollFade           from "../Common/ScrollFade";
import IconLink             from "../Link/IconLink";
import CircularLoader       from "../Loader/CircularLoader";



// Styles
const Container = Styled.section`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding-top: 8px;
    background-color: var(--content-color);
    border-radius: var(--main-radius);
    transition: background-color 0.2s;

    --column-padding-left: 12px;
    --column-padding-right: 12px;
    --fade-color: var(--content-color);

    &.drop {
        --fade-color: var(--lightest-gray);
        background-color: var(--lightest-gray);
    }
    &.drop-last .board-drop-last {
        opacity: 1;
    }
`;

const Top = Styled.div`
    &:hover .header-child,
    &:focus-within .header-child {
        max-width: 120px;
        margin-left: 8px;
        opacity: 1;
    }
`;

const Title = Styled(Header)`
    gap: 0;
    padding: 4px var(--column-padding-right) 0 var(--column-padding-left);
    height: calc(var(--header-height) - var(--main-padding) - 12px);

    .title {
        min-width: 0;
        font-size: 16px;
    }
    .header-child {
        flex-grow: 0;
        gap: 0;
        max-width: 0;
        margin-left: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-width 0.2s ease-in-out, margin-left 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }
`;

const Subtitle = Styled.div`
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 0 var(--column-padding-right) 0 calc(var(--column-padding-left) + 24px + 8px);
    margin-bottom: 12px;
    font-size: 12px;
    color: var(--font-lightest);
`;

const Wrapper = Styled(ScrollFade)`
    --fade-right: var(--column-padding-right);
`;

const Content = Styled.div`
    flex-grow: 2;
    box-sizing: border-box;
    margin: 0;
    padding: 0 var(--column-padding-right) 12px var(--column-padding-left);
    border-radius: var(--border-radius);
    overflow: auto;
`;

const DropLast = Styled.div`
    height: 2px;
    margin: -5px 0 3px;
    border-radius: 2px;
    background-color: var(--primary-color);
    opacity: 0;
`;

const ListLoader = Styled(CircularLoader)`
    margin-top: -8px;
    padding: 16px;
`;

const Collapsed = Styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 50px;
    gap: 8px;
    padding: 4px 0;
    background-color: var(--content-color);
    border-radius: var(--main-radius);
    cursor: pointer;

    .amount {
        margin: 0;
    }
    .title {
        translate: 0px 0px;
    }
`;

const CollapsedTitle = Styled(Header)`
    height: auto;
    padding: 0;
    transform-origin: 12px 12px;
    translate: 12px 0;
    rotate: 90deg;

    .title {
        font-size: 16px;
    }
`;



/**
 * The Board Column Component, which the Board shows collapsed when it was folded
 * @param {object} props
 * @returns {React.ReactElement}
 */
function BoardColumn(props) {
    const {
        className, columnID, name, color, amount, actions, subtitle,
        isLoading, onScrollEnd, children,
    } = props;

    const { collapsed, onCollapse } = React.useContext(BoardContext);
    const { hideTooltip } = Store.useAction("core");


    // References
    const contentRef = React.useRef(null);


    // Handles the Collapse
    const handleCollapse = (e) => {
        e.preventDefault();
        onCollapse(columnID);
        hideTooltip();
    };

    // Handles the Scroll, which reports when the end of the Column is reached
    const handleScroll = () => {
        const node = contentRef.current;
        if (node && onScrollEnd && Math.abs(node.scrollHeight - node.offsetHeight - node.scrollTop) < 2) {
            onScrollEnd();
        }
    };


    // Do the Render
    if (collapsed.includes(columnID)) {
        return <Collapsed className="board-column board-collapsed" data-id={columnID} onClick={handleCollapse}>
            <CollapsedTitle
                message={name}
                icon="circle"
                iconColor={color}
            >
                <Amount value={amount} />
            </CollapsedTitle>
        </Collapsed>;
    }

    return <Container className={`board-column ${className}`} data-id={columnID}>
        <Top>
            <Title message={name} icon="circle" iconColor={color}>
                <IconLink
                    variant="black"
                    icon="prev"
                    tooltip="GENERAL_COLLAPSE_COLUMN"
                    onClick={handleCollapse}
                    isSmall
                />
                {actions}
            </Title>
            {Boolean(subtitle) && <Subtitle>{subtitle}</Subtitle>}
        </Top>

        <Wrapper passedRef={contentRef}>
            <Content ref={contentRef} onScroll={handleScroll}>
                {children}
                <DropLast className="board-drop-last" />
                <ListLoader
                    isHidden={!isLoading}
                    isSmall
                />
            </Content>
        </Wrapper>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
BoardColumn.propTypes = {
    className   : PropTypes.string,
    columnID    : PropTypes.number.isRequired,
    name        : PropTypes.string.isRequired,
    color       : PropTypes.string,
    amount      : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    actions     : PropTypes.any,
    subtitle    : PropTypes.any,
    isLoading   : PropTypes.bool,
    onScrollEnd : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
BoardColumn.defaultProps = {
    className : "",
    color     : "",
    isLoading : false,
};

export default BoardColumn;
