import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import DialogAction         from "./DialogAction";
import Button               from "../Form/Button";



// Styles
const Footer = Styled.footer.attrs(({ twoRows }) => ({ twoRows }))`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--dialog-footer);
    padding: 0 var(--dialog-padding);
    gap: 8px;

    .btn {
        white-space: nowrap;
    }

    @media (max-width: 500px) {
        padding: 0 16px;

        ${(props) => props.twoRows && `
            flex-wrap: wrap;
            align-content: center;
            padding: 8px 16px;
        `}
    }
`;

const Primary = Styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Secondary = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
`;

const Row = Styled.div.attrs(({ twoRows, atEnd }) => ({ twoRows, atEnd }))`
    @media (max-width: 500px) {
        ${(props) => props.twoRows && `
            width: 100%;
            justify-content: ${props.atEnd ? "flex-end" : "flex-start"};
        `}
    }
`;



/**
 * The Dialog Footer Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogFooter(props) {
    const {
        isHidden, className, onAction,
        primary, primaryVariant, primaryIcon, onSubmit,
        secondary, secondaryVariant, secondaryIcon, secondaryLoading, onSecondary,
        tertiary, tertiaryVariant, tertiaryIcon, tertiaryLoading, onTertiary,
        cancel, cancelVariant, cancelIcon, dontClose, onClose, onCancel,
        isLoading, isDisabled, children,
    } = props;

    // Handles the Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const items   = [];
    const actions = [];
    for (const [ key, child ] of Utils.getVisibleChildren(children).entries()) {
        if (child.type === DialogAction) {
            actions.push(React.cloneElement(child, {
                key, onAction,
            }));
        } else {
            items.push(React.cloneElement(child, { key }));
        }
    }


    // A delete is the only primary that is not a confirmation, so it gets its own icon
    let mainIcon = primaryIcon;
    if (!mainIcon) {
        mainIcon = primaryVariant === "error" ? "delete" : "check";
    }


    if (isHidden) {
        return <React.Fragment />;
    }
    const twoRows = Boolean(secondary || tertiary);
    return <Footer className={className} twoRows={twoRows}>
        <Secondary as={Row} twoRows={twoRows}>
            {!isLoading && <>
                {actions}
                {items}
                <Button
                    isHidden={!secondary}
                    variant={secondaryVariant}
                    icon={secondaryIcon}
                    message={secondary}
                    inLowerCase
                    isLoading={secondaryLoading}
                    isDisabled={secondaryLoading}
                    onClick={onSecondary}
                />
                <Button
                    isHidden={!tertiary}
                    variant={tertiaryVariant}
                    icon={tertiaryIcon}
                    message={tertiary}
                    inLowerCase
                    isLoading={tertiaryLoading}
                    isDisabled={isDisabled || tertiaryLoading}
                    onClick={onTertiary}
                />
            </>}
        </Secondary>
        <Primary as={Row} twoRows={twoRows} atEnd>
            <Button
                isHidden={!primary}
                variant={primaryVariant}
                icon={mainIcon}
                message={primary}
                inLowerCase
                isDisabled={isDisabled}
                onClick={handleSubmit}
            />
            <Button
                isHidden={dontClose}
                variant={cancelVariant}
                icon={cancelIcon}
                message={cancel}
                inLowerCase
                onClick={onCancel || onClose}
            />
        </Primary>
    </Footer>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
DialogFooter.propTypes = {
    isHidden         : PropTypes.bool,
    className        : PropTypes.string,
    onAction         : PropTypes.func,
    primary          : PropTypes.string,
    primaryVariant   : PropTypes.string,
    primaryIcon      : PropTypes.string,
    onSubmit         : PropTypes.func,
    secondary        : PropTypes.string,
    secondaryVariant : PropTypes.string,
    secondaryIcon    : PropTypes.string,
    secondaryLoading : PropTypes.bool,
    onSecondary      : PropTypes.func,
    tertiary         : PropTypes.string,
    tertiaryVariant  : PropTypes.string,
    tertiaryIcon     : PropTypes.string,
    tertiaryLoading  : PropTypes.bool,
    onTertiary       : PropTypes.func,
    cancel           : PropTypes.string,
    cancelVariant    : PropTypes.string,
    cancelIcon       : PropTypes.string,
    dontClose        : PropTypes.bool,
    onClose          : PropTypes.func,
    onCancel         : PropTypes.func,
    isLoading        : PropTypes.bool,
    isDisabled       : PropTypes.bool,
    children         : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
DialogFooter.defaultProps = {
    isHidden         : false,
    className        : "",
    primaryVariant   : "primary",
    secondaryVariant : "outlined",
    secondaryLoading : false,
    tertiaryVariant  : "outlined",
    cancel           : "GENERAL_CANCEL",
    cancelVariant    : "outlined-gray",
    cancelIcon       : "close",
    dontClose        : false,
    isLoading        : false,
    isDisabled       : false,
};

export default DialogFooter;
