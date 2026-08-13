import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import DialogAction         from "./DialogAction";
import Button               from "../Form/Button";



// Styles
const Footer = Styled.footer`
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--dialog-footer);
    padding: 0 var(--dialog-padding);
    gap: 8px;

    @media (max-width: 500px) {
        padding: 0 16px;
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



/**
 * The Dialog Footer Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function DialogFooter(props) {
    const {
        isHidden, className, onAction,
        primary, primaryVariant, onSubmit,
        secondary, secondaryVariant, secondaryLoading, onSecondary,
        tertiary, tertiaryVariant, tertiaryLoading, onTertiary,
        cancel, cancelVariant, dontClose, onClose, onCancel,
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


    if (isHidden) {
        return <React.Fragment />;
    }
    return <Footer className={className}>
        <Secondary>
            {!isLoading && <>
                {actions}
                {items}
                <Button
                    isHidden={!secondary}
                    variant={secondaryVariant}
                    message={secondary}
                    isLoading={secondaryLoading}
                    isDisabled={secondaryLoading}
                    onClick={onSecondary}
                />
                <Button
                    isHidden={!tertiary}
                    variant={tertiaryVariant}
                    message={tertiary}
                    isLoading={tertiaryLoading}
                    isDisabled={isDisabled || tertiaryLoading}
                    onClick={onTertiary}
                />
            </>}
        </Secondary>
        <Primary>
            <Button
                isHidden={!primary}
                variant={primaryVariant}
                message={primary}
                isDisabled={isDisabled}
                onClick={handleSubmit}
            />
            <Button
                isHidden={dontClose}
                variant={cancelVariant}
                message={cancel}
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
    onSubmit         : PropTypes.func,
    secondary        : PropTypes.string,
    secondaryVariant : PropTypes.string,
    secondaryLoading : PropTypes.bool,
    onSecondary      : PropTypes.func,
    tertiary         : PropTypes.string,
    tertiaryVariant  : PropTypes.string,
    tertiaryLoading  : PropTypes.bool,
    onTertiary       : PropTypes.func,
    cancel           : PropTypes.string,
    cancelVariant    : PropTypes.string,
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
    cancelVariant    : "outlined",
    dontClose        : false,
    isLoading        : false,
    isDisabled       : false,
};

export default DialogFooter;
