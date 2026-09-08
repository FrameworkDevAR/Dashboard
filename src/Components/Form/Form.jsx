import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import Alert                from "../Form/Alert";
import Columns              from "../Form/Columns";



// Styles
const Content = Styled.div.attrs(({ bigGap }) => ({ bigGap }))`
    display: flex;
    flex-direction: column;
    gap: var(--form-gap, var(--main-gap));

    ${(props) => props.bigGap && `
        --form-gap: 24px;
    `}
`;



/**
 * The Form Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Form(props) {
    const { passedRef, className, error, noAutoFocus, bigGap, onSubmit, children } = props;


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
    return <Content ref={passedRef} className={className} bigGap={bigGap}>
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
    bigGap      : PropTypes.bool,
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
    bigGap      : false,
};

export default Form;
