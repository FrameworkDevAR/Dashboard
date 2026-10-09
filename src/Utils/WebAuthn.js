// Constants
const OFFER_KEY  = "passkey-offer";
const OFFER_DAYS = 30;
const QUIET_TIME = 5000;



/**
 * Returns true if the browser can use Passkeys
 * @returns {boolean}
 */
function isSupported() {
    return Boolean(window.PublicKeyCredential && navigator.credentials && window.isSecureContext);
}

/**
 * Returns true if the browser can offer the Passkeys in the autofill of a field
 * @returns {Promise}
 */
async function canAutofill() {
    if (!isSupported() || !window.PublicKeyCredential.isConditionalMediationAvailable) {
        return false;
    }
    return window.PublicKeyCredential.isConditionalMediationAvailable();
}

/**
 * Returns true if the browser can create a Passkey on its own after a login
 * @returns {Promise}
 */
async function canCreateQuietly() {
    if (!isSupported() || !window.PublicKeyCredential.getClientCapabilities) {
        return false;
    }
    const capabilities = await window.PublicKeyCredential.getClientCapabilities();
    return Boolean(capabilities.conditionalCreate);
}

/**
 * Returns the Origin the Passkeys are created for
 * @returns {string}
 */
function getOrigin() {
    return window.location.origin;
}

/**
 * Converts the given Base64 URL into bytes
 * @param {string} value
 * @returns {ArrayBuffer}
 */
function toBuffer(value) {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = window.atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Converts the given bytes into a Base64 URL without padding
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function toBase64(buffer) {
    let binary = "";
    for (const byte of new Uint8Array(buffer)) {
        binary += String.fromCharCode(byte);
    }
    return window.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Returns true if the given error of the browser is a cancel, which shows no error
 * @param {Error} error
 * @returns {boolean}
 */
function isCancel(error) {
    // The browser reports a cancel, a timeout and an origin it does not allow with the same
    // name, so the three are taken as a cancel
    return error.name === "NotAllowedError" || error.name === "AbortError";
}

/**
 * Returns the form error for the given error of the browser
 * @param {Error} error
 * @returns {object}
 */
function getError(error) {
    if (error.name === "InvalidStateError") {
        return { form : "PASSKEY_ERROR_EXISTS" };
    }
    return { form : error.message || String(error) };
}

/**
 * Creates a Passkey with the options of the server, returning null if it was cancelled
 * @param {object}   options
 * @param {boolean=} isQuiet
 * @param {boolean=} onlyDevice
 * @returns {Promise}
 */
async function create(options, isQuiet = false, onlyDevice = false) {
    // The server sends the binary values as Base64 URL, and the browser wants bytes
    const publicKey = {
        ...options,
        challenge          : toBuffer(options.challenge),
        user               : { ...options.user, id : toBuffer(options.user.id) },
        excludeCredentials : options.excludeCredentials.map((elem) => ({ ...elem, id : toBuffer(elem.id) })),
    };

    // A Passkey of this device goes straight to its lock, instead of offering a phone, and
    // a quiet one can not ask the user to verify, as no dialog is shown
    if (onlyDevice) {
        publicKey.authenticatorSelection = { ...options.authenticatorSelection, authenticatorAttachment : "platform" };
        publicKey.hints = [ "client-device" ];
    }
    if (isQuiet) {
        publicKey.authenticatorSelection = { ...publicKey.authenticatorSelection, userVerification : "preferred" };
    }

    try {
        // The browser may never answer a quiet one it chose not to save, so it gets a limit
        const credential = await navigator.credentials.create({
            publicKey,
            mediation : isQuiet ? "conditional" : undefined,
            signal    : isQuiet ? AbortSignal.timeout(QUIET_TIME) : undefined,
        });
        return {
            origin            : getOrigin(),
            clientDataJSON    : toBase64(credential.response.clientDataJSON),
            attestationObject : toBase64(credential.response.attestationObject),
            isConditional     : isQuiet ? 1 : 0,
        };
    } catch (error) {
        if (isCancel(error)) {
            return null;
        }
        throw getError(error);
    }
}

/**
 * Asks the browser for a Passkey to login, returning null if it was cancelled
 * @param {object}       options
 * @param {boolean=}     isAutofill
 * @param {AbortSignal=} signal
 * @returns {Promise}
 */
async function get(options, isAutofill = false, signal = undefined) {
    const publicKey = {
        ...options,
        challenge        : toBuffer(options.challenge),
        allowCredentials : options.allowCredentials.map((elem) => ({ ...elem, id : toBuffer(elem.id) })),
    };

    try {
        const credential = await navigator.credentials.get({
            publicKey,
            signal,
            mediation : isAutofill ? "conditional" : undefined,
        });
        return {
            origin            : getOrigin(),
            credentialKey     : toBase64(credential.rawId),
            clientDataJSON    : toBase64(credential.response.clientDataJSON),
            authenticatorData : toBase64(credential.response.authenticatorData),
            signature         : toBase64(credential.response.signature),
        };
    } catch (error) {
        if (isCancel(error)) {
            return null;
        }
        throw getError(error);
    }
}

/**
 * Tells the device that a Passkey was deleted, so it stops offering it
 * @param {string} credentialKey
 * @returns {void}
 */
function signalUnknown(credentialKey) {
    if (!window.PublicKeyCredential || !window.PublicKeyCredential.signalUnknownCredential) {
        return;
    }
    window.PublicKeyCredential.signalUnknownCredential({
        rpId         : window.location.hostname,
        credentialId : credentialKey,
    }).catch(() => {});
}

/**
 * Tells the device which Passkeys of the User are still valid, so it removes the rest
 * @param {string}   userHandle
 * @param {object[]} passkeys
 * @returns {void}
 */
function signalAccepted(userHandle, passkeys) {
    if (!userHandle || !window.PublicKeyCredential || !window.PublicKeyCredential.signalAllAcceptedCredentials) {
        return;
    }
    window.PublicKeyCredential.signalAllAcceptedCredentials({
        rpId                     : window.location.hostname,
        userId                   : userHandle,
        allAcceptedCredentialIds : passkeys.map(({ credentialKey }) => credentialKey),
    }).catch(() => {});
}

/**
 * Creates a Passkey quietly after a login, returning true if one should be offered instead
 * @param {Function} getOptions
 * @param {Function} save
 * @returns {Promise}
 */
async function createAfterLogin(getOptions, save) {
    if (!isSupported() || !shouldOffer()) {
        return false;
    }

    // The browser only saves it on its own when it has the password that was just used,
    // and otherwise the user is asked once in a dialog
    if (await canCreateQuietly()) {
        try {
            const options = await getOptions({ origin : getOrigin() });
            const data    = await create(options, true, true);
            if (data) {
                await save({ ...data, name : getDeviceName() });
                stopOffer();
                return false;
            }
        } catch {
            // The user is asked instead
        }
    }
    return true;
}

/**
 * Returns true if the device should be offered a Passkey after a login
 * @returns {boolean}
 */
function shouldOffer() {
    const value = window.localStorage.getItem(OFFER_KEY);
    if (value === "never") {
        return false;
    }
    return !value || Number(value) < Date.now();
}

/**
 * Asks again for a Passkey after some days
 * @returns {void}
 */
function delayOffer() {
    window.localStorage.setItem(OFFER_KEY, String(Date.now() + (OFFER_DAYS * 24 * 60 * 60 * 1000)));
}

/**
 * Stops offering a Passkey, as the user said so or the device already has one
 * @returns {void}
 */
function stopOffer() {
    window.localStorage.setItem(OFFER_KEY, "never");
}

/**
 * Returns a name for a Passkey made in this device, like "Chrome - macOS"
 * @returns {string}
 */
function getDeviceName() {
    const agent    = navigator.userAgent;
    const browsers = [[ "Edg/", "Edge" ], [ "OPR/", "Opera" ], [ "Firefox/", "Firefox" ], [ "Chrome/", "Chrome" ], [ "Safari/", "Safari" ]];
    const systems  = [[ "iPhone", "iPhone" ], [ "iPad", "iPad" ], [ "Android", "Android" ], [ "Mac OS X", "macOS" ], [ "Windows", "Windows" ], [ "Linux", "Linux" ]];

    const browser  = browsers.find(([ key ]) => agent.includes(key));
    const system   = systems.find(([ key ]) => agent.includes(key));
    return [ browser ? browser[1] : "", system ? system[1] : "" ].filter(Boolean).join(" - ");
}




// The public API
export default {
    isSupported,
    canAutofill,
    canCreateQuietly,
    getOrigin,
    create,
    get,
    signalUnknown,
    signalAccepted,
    createAfterLogin,
    shouldOffer,
    delayOffer,
    stopOffer,
    getDeviceName,
};
