import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";



// Styles
const Div = Styled.div.attrs(({ amount, topSpace, doubleWidth, singleWidth }) => ({ amount, topSpace, doubleWidth, singleWidth }))`
    display: grid;
    grid-template-columns: repeat(${(props) => props.amount}, 1fr);
    gap: var(--form-gap, var(--main-gap));
    ${(props) => props.topSpace && `padding-top: ${props.topSpace}px;`}

    > * {
        min-width: 0;
    }

    .columns-double {
        grid-column-end: span 2;
    }
    .columns-triple {
        grid-column-end: span 3;
    }

    .columns-btn {
        grid-column-start: 3;
        display: flex;
        align-items: flex-end;
    }
    .columns-btn .btn + .btn {
        margin-left: 8px;
        margin-top: 0;
    }

    @media (max-width: ${(props) => props.doubleWidth}px) {
        ${(props) => (Number(props.amount) === 3 || Number(props.amount) === 4) && `
            grid-template-columns: repeat(2, 1fr);
        `}

        .columns-double,
        .columns-triple {
            grid-column-end: span 2;
        }
        .columns-btn {
            grid-column-start: 2;
        }
    }

    @media (max-width: ${(props) => props.singleWidth}px) {
        grid-template-columns: 1fr;

        .columns-double,
        .columns-triple {
            grid-column-end: span 1;
        }
        .columns-btn {
            grid-column-start: 1;
        }
    }
`;



/**
 * The Columns Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Columns(props) {
    const {
        isHidden, className, amount,
        topSpace, doubleWidth, singleWidth,
        onSubmit, autoFocus, lastDouble, children,
    } = props;


    // Clone the Children
    const items = Utils.cloneChildren(children, (child, index, realIndex, total) => ({
        onSubmit,
        className : child.props.className || ((lastDouble && total % 2 === 1 && index === total - 1) ? "columns-double" : ""),
        autoFocus : autoFocus && index === 0,
    }));


    // Do the Render
    if (isHidden || !items.length) {
        return <React.Fragment />;
    }
    return <Div
        className={className}
        amount={amount}
        topSpace={topSpace}
        doubleWidth={doubleWidth}
        singleWidth={singleWidth}
    >
        {items}
    </Div>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Columns.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    amount      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    topSpace    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    doubleWidth : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    singleWidth : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onSubmit    : PropTypes.func,
    autoFocus   : PropTypes.bool,
    lastDouble  : PropTypes.bool,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Columns.defaultProps = {
    isHidden    : false,
    className   : "",
    amount      : 2,
    doubleWidth : 750,
    singleWidth : 500,
    autoFocus   : false,
    lastDouble  : false,
};

export default Columns;
