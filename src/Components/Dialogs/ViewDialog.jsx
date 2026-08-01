import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Dialog               from "../Dialog/Dialog";
import DialogHeader         from "../Dialog/DialogHeader";
import DialogBody           from "../Dialog/DialogBody";
import DialogFooter         from "../Dialog/DialogFooter";



// Styles
const Body = Styled(DialogBody)`
    display: flex;
    flex-direction: column;
`;

const Content = Styled.div`
    flex-grow: 2;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: var(--main-gap);
`;



/**
 * The View Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ViewDialog(props) {
    const {
        contentRef, open, title, icon, className, isLoading,
        width, isWide, isNarrow, minHeight, fullHeight,
        withSpacing, bigSpacing, zIndex,
        hideFooter, secondary, onSecondary, tertiary, onTertiary,
        cancel, onClose, children,
    } = props;


    // Do the Render
    return <Dialog
        open={open}
        onClose={onClose}
        isLoading={isLoading}
        width={width}
        isWide={isWide}
        isNarrow={isNarrow}
        zIndex={zIndex}
    >
        <DialogHeader message={title} icon={icon} />
        <Body
            passedRef={contentRef}
            className={className}
            minHeight={minHeight}
            fullHeight={fullHeight}
            withSpacing={withSpacing}
            bigSpacing={bigSpacing}
            hideFooter={hideFooter}
        >
            <Content>{children}</Content>
        </Body>
        <DialogFooter
            isHidden={hideFooter}
            secondary={secondary}
            onSecondary={onSecondary}
            tertiary={tertiary}
            onTertiary={onTertiary}
            cancel={cancel}
        />
    </Dialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ViewDialog.propTypes = {
    contentRef  : PropTypes.any,
    open        : PropTypes.bool.isRequired,
    title       : PropTypes.string.isRequired,
    icon        : PropTypes.string,
    className   : PropTypes.string,
    isLoading   : PropTypes.bool,
    width       : PropTypes.number,
    isWide      : PropTypes.bool,
    isNarrow    : PropTypes.bool,
    minHeight   : PropTypes.number,
    fullHeight  : PropTypes.bool,
    lightHeader : PropTypes.bool,
    withSpacing : PropTypes.bool,
    bigSpacing  : PropTypes.bool,
    zIndex      : PropTypes.number,
    hideFooter  : PropTypes.bool,
    secondary   : PropTypes.string,
    tertiary    : PropTypes.string,
    onSecondary : PropTypes.func,
    onTertiary  : PropTypes.func,
    cancel      : PropTypes.string,
    onClose     : PropTypes.func.isRequired,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ViewDialog.defaultProps = {
    className   : "",
    cancel      : "GENERAL_CLOSE",
    isLoading   : false,
    isWide      : false,
    isNarrow    : false,
    fullHeight  : false,
    lightHeader : false,
    withSpacing : false,
    bigSpacing  : false,
    hideFooter  : false,
};

export default ViewDialog;
