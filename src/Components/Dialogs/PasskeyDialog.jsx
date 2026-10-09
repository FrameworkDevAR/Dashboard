import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import WebAuthn             from "../../Utils/WebAuthn";

// Components
import ViewDialog           from "./ViewDialog";



// Styles
const Text = Styled.p`
    margin: 0;
    line-height: 1.5;
`;

const Error = Styled.p`
    margin: 12px 0 0 0;
    color: var(--error-color);
`;



/**
 * The Passkey Dialog, which offers to create a Passkey in this device after a login
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PasskeyDialog(props) {
    const { open, onCreate, onClose } = props;

    // The Current State
    const [ error, setError ] = React.useState("");


    // Creates the Passkey, where a cancel keeps the offer, in case the user changes their mind
    const handleCreate = async () => {
        setError("");
        try {
            const result = await onCreate();
            if (result) {
                onClose();
            }
        } catch (errors) {
            setError(errors.form || "PASSKEY_ERROR_CREATE");
        }
    };

    // Asks again in some days
    const handleLater = () => {
        WebAuthn.delayOffer();
        onClose();
    };

    // Stops asking in this device
    const handleNever = () => {
        WebAuthn.stopOffer();
        onClose();
    };


    // Do the Render
    return <ViewDialog
        open={open}
        icon="passkey"
        title="PASSKEY_OFFER_TITLE"
        primary="PASSKEY_OFFER_CREATE"
        onSubmit={handleCreate}
        secondary="PASSKEY_OFFER_NEVER"
        onSecondary={handleNever}
        cancel="PASSKEY_OFFER_LATER"
        onClose={handleLater}
        width={520}
        withSpacing
    >
        <Text>{NLS.get("PASSKEY_OFFER_TEXT")}</Text>
        {!!error && <Error>{NLS.get(error)}</Error>}
    </ViewDialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PasskeyDialog.propTypes = {
    open     : PropTypes.bool.isRequired,
    onCreate : PropTypes.func.isRequired,
    onClose  : PropTypes.func.isRequired,
};

export default PasskeyDialog;
