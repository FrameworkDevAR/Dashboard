import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Dialog               from "../Dialog/Dialog";
import DialogHeader         from "../Dialog/DialogHeader";
import DialogBody           from "../Dialog/DialogBody";
import DialogMessage        from "../Dialog/DialogMessage";
import DialogFooter         from "../Dialog/DialogFooter";
import Form                 from "../Form/Form";



// Styles
const Message = Styled(DialogMessage)`
    margin-top: 0;
`;

const Content = Styled(Form)`
    flex-grow: 1;
    min-height: 0;
`;



/**
 * The Edit Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function EditDialog(props) {
    const {
        open, title, icon, header, message, className, isLoading, loadingMessage,
        width, isNarrow, isWide, minHeight, keepHeight, fullHeight,
        noOverflow, withSpacing, bigSpacing, withFade,
        error, isDisabled, dontClose, noAutoFocus, bigGap,
        hideFooter, hidePrimary, primary, primaryVariant, onSubmit,
        cancel, cancelVariant, onClose, onCancel,
        secondary, secondaryVariant, secondaryLoading, onSecondary,
        tertiary, tertiaryVariant, onTertiary,
        aside, asideWidth, children,
    } = props;


    // Do the Render
    return <Dialog
        open={open}
        onClose={onClose}
        width={width}
        isNarrow={isNarrow}
        isWide={isWide}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        dontClose={dontClose}
        dontBackClose
        aside={aside}
        asideWidth={asideWidth}
    >
        <DialogHeader message={title} icon={icon}>
            {header}
        </DialogHeader>
        <DialogBody
            className={className}
            minHeight={minHeight}
            keepHeight={keepHeight}
            fullHeight={fullHeight}
            noOverflow={noOverflow}
            withSpacing={withSpacing}
            bigSpacing={isLoading || bigSpacing}
            withFade={withFade}
            hideFooter={hideFooter}
        >
            <Message variant="h3" message={message} />
            <Content
                error={error}
                onSubmit={onSubmit}
                noAutoFocus={noAutoFocus}
                bigGap={bigGap}
            >
                {children}
            </Content>
        </DialogBody>
        {!hideFooter && <DialogFooter
            isDisabled={isLoading || isDisabled}
            primary={hidePrimary ? "" : primary}
            primaryVariant={primaryVariant}
            onSubmit={onSubmit}
            cancel={cancel}
            cancelVariant={cancelVariant}
            onCancel={onCancel}
            secondary={secondary}
            secondaryVariant={secondaryVariant}
            secondaryLoading={secondaryLoading}
            onSecondary={onSecondary}
            tertiary={tertiary}
            tertiaryVariant={tertiaryVariant}
            onTertiary={onTertiary}
        />}
    </Dialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
EditDialog.propTypes = {
    open             : PropTypes.bool.isRequired,
    title            : PropTypes.string.isRequired,
    icon             : PropTypes.string,
    header           : PropTypes.any,
    className        : PropTypes.string,
    message          : PropTypes.string,
    error            : PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    dontClose        : PropTypes.bool,
    onClose          : PropTypes.func.isRequired,
    isLoading        : PropTypes.bool,
    loadingMessage   : PropTypes.string,
    isDisabled       : PropTypes.bool,
    hideFooter       : PropTypes.bool,
    noAutoFocus      : PropTypes.bool,
    bigGap           : PropTypes.bool,
    width            : PropTypes.number,
    isNarrow         : PropTypes.bool,
    isWide           : PropTypes.bool,
    minHeight        : PropTypes.number,
    keepHeight       : PropTypes.bool,
    fullHeight       : PropTypes.bool,
    noOverflow       : PropTypes.bool,
    withSpacing      : PropTypes.bool,
    bigSpacing       : PropTypes.bool,
    withFade         : PropTypes.bool,
    hidePrimary      : PropTypes.bool,
    primary          : PropTypes.string,
    primaryVariant   : PropTypes.string,
    onSubmit         : PropTypes.func,
    cancel           : PropTypes.string,
    cancelVariant    : PropTypes.string,
    onCancel         : PropTypes.func,
    secondary        : PropTypes.string,
    secondaryVariant : PropTypes.string,
    secondaryLoading : PropTypes.bool,
    onSecondary      : PropTypes.func,
    tertiary         : PropTypes.string,
    tertiaryVariant  : PropTypes.string,
    onTertiary       : PropTypes.func,
    aside            : PropTypes.any,
    asideWidth       : PropTypes.number,
    children         : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
EditDialog.defaultProps = {
    className   : "",
    primary     : "GENERAL_SAVE",
    cancel      : "GENERAL_CANCEL",
    dontClose   : false,
    isLoading   : false,
    isDisabled  : false,
    noAutoFocus : false,
    bigGap      : false,
    isNarrow    : false,
    isWide      : false,
    keepHeight  : false,
    fullHeight  : false,
    noOverflow  : false,
    withSpacing : true,
    bigSpacing  : false,
    withFade    : false,
    hidePrimary : false,
};

export default EditDialog;
