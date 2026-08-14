import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import CircularLoader       from "../Loader/CircularLoader";
import Icon                 from "../Common/Icon";



// Styles
const THead = Styled.th.attrs(({ flexGrow, flexShrink, flexWidth, minWidth, maxWidth, align, isSmall, isEditable, isDragging }) => ({ flexGrow, flexShrink, flexWidth, minWidth, maxWidth, align, isSmall, isEditable, isDragging }))`
    && {
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: var(--table-header-height);
        padding: 6px 0 6px 12px;
        color: var(--title-color);
        font-weight: bold;
        font-size: 12px;
        line-height: 1;
        border: none;
        flex-grow: ${(props) => props.flexGrow};
        flex-shrink: ${(props) => props.flexShrink};
        min-width: ${(props) => props.minWidth ? `${props.minWidth}px` : "0"};
        max-width: ${(props) => props.maxWidth ? `${props.maxWidth}px` : "none"};
        text-align: ${(props) => props.align};
        justify-content: ${(props) => props.align};

        ${(props) => props.isEditable && `
            :hover {
                background: var(--table-head-hover);
            }
            :hover .thead-resizer {
                display: block;
            }
        `}

        ${(props) => props.isDragging && `
            background: var(--table-head-hover);
            .thead-resizer {
                display: block;
            }
        `}

        ${(props) => props.isSmall && `
            flex: 0 1 150px;
            width: 150px;
        `}

        ${(props) => props.flexWidth && `
            flex: 0 0 ${props.flexWidth}px;
            width: ${props.flexWidth}px;
            min-width: 0;
            max-width: none;
        `};
    }

    .icon {
        margin-left: 4px;
    }
`;

const Inner = Styled.div.attrs(({ hasSorting }) => ({ hasSorting }))`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    ${(props) => props.hasSorting && `
        cursor: pointer;
    `}
`;

const SortLoader = Styled(CircularLoader)`
    --loader-size: 12px;
    --loader-border-width: 2px;

    margin-left: 4px;
`;

const Resizer = Styled.div`
    display: none;
    width: 4px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background-color: var(--table-head-resizer);
    z-index: 1;
    cursor: col-resize;
`;



/**
 * The Table Header Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TableHeader(props) {
    const {
        isHidden, className, message,
        fetch, handleSort, sortField, hasSorting, sort, field, noSorting,
        colSpan, grow, shrink, width, minWidth, maxWidth,
        align, isSmall, isEditable, handleColWidth, children,
    } = props;


    // The References
    const elementRef  = React.useRef(null);
    const backdropRef = React.useRef(null);
    const startRef    = React.useRef(0);
    const moveRef     = React.useRef(0);

    // The Current State
    const [ isDragging, setDragging   ] = React.useState(false);
    const [ showLoader, setShowLoader ] = React.useState(false);

    // Variables
    const withSorting = hasSorting && !noSorting;
    const isSorting   = withSorting && sortField === field;


    // Show the Sort loader after a delay, so a fast Sort never shows it
    React.useEffect(() => {
        if (!isSorting) {
            setShowLoader(false);
            return undefined;
        }
        const timer = window.setTimeout(() => setShowLoader(true), 300);
        return () => window.clearTimeout(timer);
    }, [ isSorting ]);


    // Handles the Sorting
    const handleClick = () => {
        if (!withSorting) {
            return;
        }

        let params = sort;
        if (sort.orderBy === field) {
            params = { ...sort, orderAsc : sort.orderAsc ? 0 : 1 };
        } else {
            params = { ...sort, orderBy : field, orderAsc : 1 };
        }

        if (handleSort) {
            handleSort(params);
        } else if (fetch) {
            fetch(params);
        }
    };

    // Handles the Grab
    const handleGrab = (e) => {
        setDragging(true);
        Utils.unselectAll();
        startRef.current = e.clientX;

        backdropRef.current = document.createElement("div");
        backdropRef.current.className    = "backdrop";
        backdropRef.current.style.cursor = "col-resize";
        document.body.appendChild(backdropRef.current);

        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup",   handleDrop);
    };

    // Handles the Drag
    const handleDrag = (e) => {
        moveRef.current = startRef.current - e.clientX;
        const newWidth = width - moveRef.current;
        handleColWidth(field, newWidth);

        elementRef.current.style.width     = `${newWidth}px`;
        elementRef.current.style.flexBasis = `${newWidth}px`;
    };

    // Handles the Drop
    const handleDrop = () => {
        setDragging(false);
        handleColWidth(field, width - moveRef.current, true);

        elementRef.current.style.width     = "";
        elementRef.current.style.flexBasis = "";
        backdropRef.current.remove();

        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup",   handleDrop);
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <THead
        ref={elementRef}
        className={className}
        flexGrow={grow}
        flexShrink={shrink}
        flexWidth={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        align={align}
        isSmall={isSmall}
        isEditable={isEditable}
        isDragging={isDragging}
        colSpan={colSpan}
    >
        <Inner onClick={handleClick} hasSorting={withSorting}>
            {message ? NLS.get(message) : children}
        </Inner>
        {isSorting && showLoader && <SortLoader
            isTiny
        />}
        {withSorting && sortField !== field && sort.orderBy === field ? <Icon
            icon={sort.orderAsc ? "up" : "down"}
            size="12"
        /> : null}
        {isEditable && <Resizer
            className="thead-resizer"
            onMouseDown={(e) => handleGrab(e)}
        />}
    </THead>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TableHeader.propTypes = {
    isHidden       : PropTypes.bool,
    message        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    fetch          : PropTypes.func,
    hasSorting     : PropTypes.bool,
    noSorting      : PropTypes.bool,
    sort           : PropTypes.object,
    handleSort     : PropTypes.func,
    sortField      : PropTypes.string,
    field          : PropTypes.string,
    className      : PropTypes.string,
    colSpan        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    grow           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    shrink         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    width          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    minWidth       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxWidth       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    align          : PropTypes.string,
    isSmall        : PropTypes.bool,
    isTitle        : PropTypes.bool,
    isFlex         : PropTypes.bool,
    isMultiline    : PropTypes.bool,
    bigMobile      : PropTypes.bool,
    hideMobile     : PropTypes.bool,
    hideCircle     : PropTypes.bool,
    noSpace        : PropTypes.bool,
    smallSpace     : PropTypes.bool,
    isDefault      : PropTypes.bool,
    isEditable     : PropTypes.bool,
    handleColWidth : PropTypes.func,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TableHeader.defaultProps = {
    isHidden    : false,
    className   : "",
    colSpan     : "1",
    grow        : "1",
    shrink      : "1",
    align       : "left",
    noSorting   : false,
    isSmall     : false,
    isTitle     : false,
    isFlex      : false,
    isMultiline : false,
    bigMobile   : false,
    hideMobile  : false,
    hideCircle  : false,
    noSpace     : false,
    smallSpace  : false,
    isEditable  : false,
};

export default TableHeader;
