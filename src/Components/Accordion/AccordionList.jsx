import React                from "react";
import PropTypes            from "prop-types";

// Utils
import Utils                from "../../Utils/Utils";



/**
 * The Accordion List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function AccordionList(props) {
    const {
        isHidden, className, initial, selected,
        maxWidth, hideAside, noClose, onChange, children,
    } = props;


    // The Current State
    const [ selection, setSelection ] = React.useState(selected || initial);

    // Handle the Initial change
    React.useEffect(() => {
        if (initial) {
            setSelection(initial);
        }
    }, [ initial ]);

    // Handle the Selected change
    React.useEffect(() => {
        if (selected) {
            setSelection(selected);
        }
    }, [ selected ]);


    // Handle the Click
    const handleClick = (id, isDisabled) => () => {
        if (isDisabled) {
            return;
        }
        let newID = id;
        if (!noClose && id === selection) {
            newID = "";
        }
        if (newID === selection) {
            return;
        }

        setSelection(newID);
        if (onChange) {
            onChange(newID);
        }
    };

    // Generate the Items
    const items = Utils.cloneChildren(children, (child, index) => {
        const id = child.props.value || index;
        return {
            maxWidth, hideAside,
            number     : index + 1,
            isSelected : id === selection,
            onClick    : handleClick(id, child.props.isDisabled),
        };
    });


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <div className={`accordion ${className}`}>
        {items}
    </div>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
AccordionList.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    initial   : PropTypes.string,
    selected  : PropTypes.string,
    maxWidth  : PropTypes.number,
    hideAside : PropTypes.bool,
    noClose   : PropTypes.bool,
    onChange  : PropTypes.func,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
AccordionList.defaultProps = {
    isHidden  : false,
    className : "",
    initial   : "",
    selected  : "",
    noClose   : false,
};

export default AccordionList;
