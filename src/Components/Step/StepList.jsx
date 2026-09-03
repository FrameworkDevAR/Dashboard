import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Styles
const Container = Styled.nav`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
    padding: var(--step-padding, 8px 0 0);
`;

const Rule = Styled.span`
    flex-shrink: 0;
    width: 28px;
    height: 1px;
    background-color: var(--border-color-medium);
`;



/**
 * The Step List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function StepList(props) {
    const { className, selected, onChange, children } = props;


    // Do the Render
    const items = React.Children.toArray(children).filter((child) => React.isValidElement(child));

    return <Container className={className}>
        {items.map((child, index) => <React.Fragment key={child.props.value}>
            {index > 0 && <Rule />}
            {React.cloneElement(child, {
                number     : index + 1,
                isSelected : child.props.value === selected,
                onClick    : () => onChange(child.props.value),
            })}
        </React.Fragment>)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
StepList.propTypes = {
    className : PropTypes.string,
    selected  : PropTypes.string.isRequired,
    onChange  : PropTypes.func.isRequired,
    children  : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
StepList.defaultProps = {
    className : "",
};

export default StepList;
