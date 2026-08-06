import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core & Utils
import Responsive           from "../../Core/Responsive";
import Utils                from "../../Utils/Utils";

// Components
import ActionItem           from "./ActionItem";



// Styles
const Container = Styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    gap: 8px;

    @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
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



/**
 * The Action List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ActionList(props) {
    const {
        className, data, onAction, createText, useAdd, useAssign,
        hasFilters, withImport, withExport, isExporting, itemsFirst, children,
    } = props;


    // Variables
    const items      = Utils.cloneChildren(children, () => ({ onAction }));
    const canFilter  = Boolean(data.canFilter);
    const canCreate  = Boolean(data.canCreate);
    const canImport  = Boolean(withImport && data.canImport);
    const canExport  = Boolean(withExport && data.canExport && data.total > 0);
    const createName = createText || (useAdd ? "GENERAL_ADD" : (useAssign ? "GENERAL_ASSIGN" : "GENERAL_CREATE"));
    const hasActions = canFilter || canCreate || canImport || canExport || items.length > 0;


    // Do the Render
    if (!hasActions) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        {itemsFirst && items}
        {canCreate && <ActionItem
            action="CREATE"
            message={createName}
            onAction={onAction}
        />}
        {canFilter && <ActionItem
            action="FILTER"
            onAction={onAction}
            withMark={hasFilters || data.hasFilters}
        />}
        {canExport && <ActionItem
            isLoading={isExporting}
            action="EXPORT"
            onAction={onAction}
        />}
        {canImport && <ActionItem
            action="IMPORT"
            onAction={onAction}
        />}
        {!itemsFirst && items}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ActionList.propTypes = {
    data        : PropTypes.object,
    className   : PropTypes.string,
    onAction    : PropTypes.func,
    createText  : PropTypes.string,
    useAdd      : PropTypes.bool,
    useAssign   : PropTypes.bool,
    hasFilters  : PropTypes.bool,
    withImport  : PropTypes.bool,
    withExport  : PropTypes.bool,
    isExporting : PropTypes.bool,
    itemsFirst  : PropTypes.bool,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ActionList.defaultProps = {
    className   : "",
    data        : {},
    createText  : "",
    useAdd      : false,
    useAssign   : false,
    withImport  : true,
    withExport  : true,
    isExporting : false,
    hasFilters  : false,
};

export default ActionList;
