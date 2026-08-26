import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import Responsive           from "../../Core/Responsive";



// Styles
const TRow = Styled.tr.attrs(({ hasHover, hasChecks, hasActions, isEditable, isSelected }) => ({ hasHover, hasChecks, hasActions, isEditable, isSelected }))`
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: auto;

    td, th {
        flex: 1 0 0;
        border: none;
    }
    td {
        background-color: var(--content-color);
        border-bottom: var(--table-border);
    }

    .icon-checkbox-on {
        color: var(--darkest-gray);
    }

    ${(props) => props.hasHover && `
        &:hover td {
            background-color: var(--table-hover);
        }
    `}

    ${(props) => props.isSelected && `
        & td {
            background-color: var(--table-selected);
        }
    `}

    ${(props) => props.hasChecks && `
        th:first-child,
        td:first-child {
            display: flex;
            box-sizing: border-box;
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: var(--table-checks-width);
            width: var(--table-checks-width);
            align-items: center;
            justify-content: center;
            padding-left: 8px;

            ${props.isEditable && `
                position: sticky;
                left: 0;
                z-index: 1;
            `}
        }
    `}

    ${(props) => props.hasActions ? `
        th:last-child,
        td:last-child {
            display: flex;
            box-sizing: border-box;
            flex-grow: 0;
            flex-shrink: 0;
            flex-basis: var(--table-actions-width);
            align-items: center;
            justify-content: flex-end;
            padding: 4px 8px;
            text-align: right;
            white-space: nowrap;
            position: relative;
            overflow: visible;

            ${props.isEditable && `
                position: sticky;
                flex-grow: 1;
                right: 0;
                z-index: 1;
            `}
        }
    ` : `
        th:last-child,
        td:last-child {
            padding-right: 12px;
        }
    `}

    ${(props) => !props.isEditable && `
        @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
            display: grid;
            position: relative;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            border-bottom: var(--table-border);
            min-height: 24px;
            padding: 8px 0 8px 4px;

            td, th {
                border-bottom: none;
            }
            &:hover td {
                background-color: transparent;
            }

            ${props.hasActions && `td:last-child {
                position: absolute;
                top: 0;
                right: 0;
                height: 100%;
                padding: 0;
                background-color: var(--content-color);
            }`}

            ${props.isSelected && `
                & td {
                    background-color: transparent;
                }
            `}
        }

        @media (max-width: 650px) {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }

        @media (max-width: 380px) {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        }
    `}
`;



/**
 * The Table Row Container Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function TableRowCnt(props) {
    const {
        className, hasHover, hasChecks, hasActions,
        isEditable, isSelected, onClick, onContextMenu, onMouseDown, children,
    } = props;


    // Do the Render
    return <TRow
        className={className}
        hasHover={hasHover}
        hasChecks={hasChecks}
        hasActions={hasActions}
        isEditable={isEditable}
        isSelected={isSelected}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseDown={onMouseDown}
    >
        {children}
    </TRow>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
TableRowCnt.propTypes = {
    className     : PropTypes.string,
    hasHover      : PropTypes.bool,
    hasChecks     : PropTypes.bool,
    hasActions    : PropTypes.bool,
    isEditable    : PropTypes.bool,
    isSelected    : PropTypes.bool,
    onClick       : PropTypes.func,
    onContextMenu : PropTypes.func,
    onMouseDown   : PropTypes.func,
    children      : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
TableRowCnt.defaultProps = {
    className  : "",
    hasHover   : false,
    hasChecks  : false,
    hasActions : false,
    isEditable : false,
};

export default TableRowCnt;
