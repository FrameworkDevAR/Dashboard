import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Html                 from "./Html";

// Variants
const Variant = {
    PRIMARY : "primary",
    WHITE   : "white",
    DIALOG  : "dialog",
};



// Styles
const Container = Styled.h3.attrs(({ variant, centered, isDashed }) => ({ variant, centered, isDashed }))`
    margin: 0;
    padding: 16px;
    font-size: 15px;
    background-color: var(--none-background);
    border-radius: var(--border-radius);

    ${(props) => props.variant === Variant.PRIMARY && `
        color: var(--title-color);
    `}
    ${(props) => props.variant === Variant.WHITE && `
        color: rgba(255, 255, 255, 0.8);
    `}
    ${(props) => props.variant === Variant.DIALOG && `
        margin: 32px;
        text-align: center;
        color: var(--title-color);
    `}

    ${(props) => props.isDashed && `
        box-sizing: border-box;
        min-height: 44px;
        padding: 11px 16px;
        font-size: var(--font-size);
        font-weight: normal;
        line-height: 20px;
        color: var(--font-lighter);
        background-color: var(--lightest-gray);
        border: 1px dashed var(--input-border-color);
        border-radius: var(--input-border-radius);
    `}

    ${(props) => props.centered && "text-align: center;"}
`;



/**
 * The None Available Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function NoneAvailable(props) {
    const { isHidden, className, variant, centered, isDashed, message } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container
        className={className}
        variant={variant}
        centered={centered}
        isDashed={isDashed}
    >
        <Html variant="span" message={message} />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
NoneAvailable.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    centered  : PropTypes.bool,
    isDashed  : PropTypes.bool,
    message   : PropTypes.string.isRequired,
    variant   : PropTypes.string,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
NoneAvailable.defaultProps = {
    isHidden  : false,
    className : "",
    variant   : Variant.PRIMARY,
};

export default NoneAvailable;
