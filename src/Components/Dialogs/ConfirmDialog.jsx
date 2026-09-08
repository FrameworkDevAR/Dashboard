import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Dialog               from "../Dialog/Dialog";
import DialogHeader         from "../Dialog/DialogHeader";
import DialogBody           from "../Dialog/DialogBody";
import DialogResult         from "../Dialog/DialogResult";
import DialogFooter         from "../Dialog/DialogFooter";
import Html                 from "../Common/Html";



// Styles
const Content = Styled(Html)`
    margin: 0;
    color: var(--black-color);
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
`;

const Children = Styled.div`
    margin-top: var(--main-padding);
`;



/**
 * The Confirm Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ConfirmDialog(props) {
    const {
        open, className, icon, title, message, content, isLoading, isWide,
        bigSpacing, primary, primaryVariant, cancel, result,
        onSubmit, onClose, children,
    } = props;


    // Variables
    const body = content ? NLS.format(message, content) : NLS.get(message);


    // Do the Render
    return <Dialog
        open={open}
        className={className}
        onClose={onClose}
        isLoading={isLoading}
        dontClose={isLoading}
        isNarrow={!isWide}
        width={isWide ? 500 : null}
    >
        <DialogHeader message={title} icon={icon} />
        <DialogBody bigSpacing={bigSpacing} withSpacing={!result}>
            {result ? <DialogResult
                variant={result}
                message={body}
            /> : <Content variant="h3">{body}</Content>}
            {!!children && <Children>{children}</Children>}
        </DialogBody>
        <DialogFooter
            primary={primary}
            primaryVariant={primaryVariant}
            cancel={cancel}
            onSubmit={onSubmit}
            isDisabled={isLoading}
        />
    </Dialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ConfirmDialog.propTypes = {
    open           : PropTypes.bool.isRequired,
    className      : PropTypes.string,
    icon           : PropTypes.string.isRequired,
    title          : PropTypes.string.isRequired,
    message        : PropTypes.string.isRequired,
    content        : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    primary        : PropTypes.string,
    primaryVariant : PropTypes.string,
    cancel         : PropTypes.string,
    result         : PropTypes.string,
    isLoading      : PropTypes.bool,
    bigSpacing     : PropTypes.bool,
    isWide         : PropTypes.bool,
    onSubmit       : PropTypes.func.isRequired,
    onClose        : PropTypes.func.isRequired,
    children       : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ConfirmDialog.defaultProps = {
    primary    : "GENERAL_ACCEPT",
    isLoading  : false,
    bigSpacing : true,
    isWide     : false,
};

export default ConfirmDialog;
