import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import Alert                from "../Form/Alert";
import Columns              from "../Form/Columns";



// Styles
const Content = Styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--main-gap);
`;



/**
 * The Form Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Form(props) {
    const { passedRef, className, error, noAutoFocus, onSubmit, children } = props;


    // Clone the Children
    const items   = [];
    let   isFirst = true;
    for (const [ key, child ] of Utils.getChildren(children).entries()) {
        const autoFocus = !noAutoFocus && child && (child.type === Columns || (!child.props.isHidden && !child.props.isDisabled)) && isFirst;

        items.push(React.cloneElement(child, { key, onSubmit, autoFocus }));
        if (autoFocus) {
            isFirst = false;
        }
    }


    // Do the Render
    return <Content ref={passedRef} className={className}>
        <Alert
            className="form-error"
            variant="error"
            message={error}
        />
        {items}
    </Content>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Form.propTypes = {
    passedRef   : PropTypes.any,
    className   : PropTypes.string,
    error       : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    noAutoFocus : PropTypes.bool,
    onSubmit    : PropTypes.func,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Form.defaultProps = {
    className   : "",
    noAutoFocus : false,
};

export default Form;
