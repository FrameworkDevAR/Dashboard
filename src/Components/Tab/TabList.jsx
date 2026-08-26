import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import { Brightness }       from "../../Core/Variants";
import Action               from "../../Core/Action";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.section.attrs(({ inDialog, inDetails, inHeader, centered, topSpace, bottomSpace }) => ({ inDialog, inDetails, inHeader, centered, topSpace, bottomSpace }))`
    position: relative;
    box-sizing: border-box;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    width: 100%;
    padding-bottom: 2px;

    &::after {
        content: "";
        position: absolute;
        bottom: 3px;
        left: 0;
        right: 0;
        height: var(--border-width);
        background-color: var(--border-color-light);
    }

    ${(props) => (!props.inDialog && !props.inDetails && !props.inHeader) && `
        margin-bottom: var(--main-gap);
    `}

    ${(props) => props.inDialog && `
        position: sticky;
        top: -4px;
        margin-top: -4px;
        background-color: var(--content-color);
        z-index: 4;
    `};

    ${(props) => props.inDetails && `
        position: sticky;
        top: 0;
        padding-top: var(--details-spacing);
        background-color: var(--content-color);
        z-index: 3;
    `}

    ${(props) => props.inHeader && `
        width: auto;
        padding: 0 16px;
    `}

    ${(props) => props.centered && `
        justify-content: center;
    `}

    ${(props) => props.topSpace && `margin-top: ${props.topSpace}px;`}
    ${(props) => props.bottomSpace && `margin-bottom: ${props.bottomSpace}px;`}
`;

const Content = Styled.div.attrs(({ fullWidth, size, lineWidth, lineLeft }) => ({ fullWidth, size, lineWidth, lineLeft }))`
    position: relative;
    display: flex;
    max-width: 100%;
    overflow: auto;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        width: ${(props) => props.lineWidth}px;
        translate: ${(props) => props.lineLeft}px;
        background-color: var(--tab-selected-line-color, var(--primary-color));
        transition: all 0.2s ease-in-out;
        z-index: 1;
    }

    ${(props) => props.fullWidth && "width: 100%;"}

    ${(props) => props.size > 0 && `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(${props.size || 100}px, 1fr));
    `}
`;

const TabLink = Styled(IconLink)`
    margin-left: 8px;
    .icon {
        font-size: 20px;
    }
`;



/**
 * The Tab List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TabList(props) {
    const {
        isHidden, className, size, selected,
        onClick, onAction, inDialog, inDetails, inHeader,
        fullWidth, centered, topSpace, bottomSpace,
        canAdd, addVariant, children,
    } = props;

    const contentRef = React.useRef(null);

    // The Current State
    const [ lineWidth, setLineWidth ] = React.useState(0);
    const [ lineLeft,  setLineLeft  ] = React.useState(0);


    // Clone the Children
    const messages = [];
    const items    = Utils.cloneChildren(children, (child, index) => {
        messages.push(NLS.get(child.props.message || ""));
        return { index, onClick, onAction, selected, inDialog };
    });


    // Listens for the Selection
    React.useEffect(() => {
        handleSelection(selected);
    }, [ contentRef.current, selected, JSON.stringify(messages) ]);

    // Handles the Selection
    const handleSelection = (selected) => {
        const item = contentRef.current?.querySelector(`.tab-item-${selected}`);
        if (!item) {
            window.setTimeout(() => handleSelection(selected), 500);
        } else {
            setSelection(item);
        }
    };

    // Sets the Selection
    const setSelection = (item) => {
        const itemBounds    = item.getBoundingClientRect();
        const contentBounds = contentRef.current.getBoundingClientRect();

        setLineLeft(itemBounds.left - contentBounds.left);
        setLineWidth(itemBounds.width);
    };


    // Do the Render
    const showAdd = Boolean(canAdd && onAction);

    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={`tabs ${className}`}
        inDialog={inDialog}
        inDetails={inDetails}
        inHeader={inHeader}
        centered={centered}
        topSpace={topSpace}
        bottomSpace={bottomSpace}
    >
        <Content
            ref={contentRef}
            className="tabs-content"
            fullWidth={fullWidth}
            size={size}
            lineWidth={lineWidth}
            lineLeft={lineLeft}
        >
            {items}
        </Content>
        {showAdd && <TabLink
            variant={addVariant}
            icon="add"
            onClick={() => onAction(Action.get("ADD"))}
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TabList.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    selected    : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    onClick     : PropTypes.func,
    onAction    : PropTypes.func,
    inDialog    : PropTypes.bool,
    inDetails   : PropTypes.bool,
    inHeader    : PropTypes.bool,
    fullWidth   : PropTypes.bool,
    centered    : PropTypes.bool,
    topSpace    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    bottomSpace : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    canAdd      : PropTypes.bool,
    addVariant  : PropTypes.string,
    size        : PropTypes.number,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TabList.defaultProps = {
    isHidden   : false,
    className  : "",
    size       : 0,
    inDialog   : false,
    inDetails  : false,
    inHeader   : false,
    fullWidth  : false,
    centered   : false,
    canAdd     : false,
    addVariant : Brightness.LIGHT,
};

export default TabList;
