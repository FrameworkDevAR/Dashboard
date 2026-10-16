import React                from "react";
import PropTypes            from "prop-types";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Menu                 from "../Menu/Menu";
import MenuItem             from "../Menu/MenuItem";
import MenuTitle            from "../Menu/MenuTitle";



/**
 * The Editor Variables
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditorVariables(props) {
    const { open, targetRef, variables, onSelect, onClose } = props;


    // The Variables are grouped by the title that each one has
    const items = React.useMemo(() => {
        const result = [];
        let   title  = "";
        for (const { key, value : name, extra } of variables) {
            if (extra && extra !== title) {
                title = extra;
                result.push(<MenuTitle key={`title-${extra}`} message={extra} isTitle />);
            }
            result.push(<MenuItem
                key={key}
                title={NLS.get(name)}
                message={key}
                onClick={() => onSelect(key)}
                isSmall
            />);
        }
        return result;
    }, [ JSON.stringify(variables), onSelect ]);


    // Do the Render
    return <Menu
        open={open}
        targetRef={targetRef}
        direction="bottom left"
        width={400}
        maxHeight={300}
        onClose={onClose}
        gap={4}
        withSearch
    >
        {items}
    </Menu>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditorVariables.propTypes = {
    open      : PropTypes.bool.isRequired,
    targetRef : PropTypes.object.isRequired,
    variables : PropTypes.array.isRequired,
    onSelect  : PropTypes.func.isRequired,
    onClose   : PropTypes.func.isRequired,
};

export default EditorVariables;
