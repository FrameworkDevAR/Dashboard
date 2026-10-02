// Media Types
const ANY   = "";
const MEDIA = "media";
const IMAGE = "image";
const LOGO  = "logo";
const VIDEO = "video";
const AUDIO = "audio";
const PDF   = "pdf";
const TEXT  = "text";
const FILE  = "file";



/**
 * Returns true if the type is only for Images
 * @param {string} mediaType
 * @returns {boolean}
 */
function onlyImages(mediaType) {
    // A Logo also takes the SVGs, which the browser counts as images too
    return mediaType === IMAGE || mediaType === LOGO;
}

/**
 * Returns true if the type also takes the SVGs
 * @param {string} mediaType
 * @returns {boolean}
 */
function withSVG(mediaType) {
    return mediaType === LOGO;
}

/**
 * Returns true if the type is only for Videos
 * @param {string} mediaType
 * @returns {boolean}
 */
function isVideo(mediaType) {
    return mediaType === VIDEO;
}



// The Public API
export default {
    ANY,
    MEDIA,
    IMAGE,
    LOGO,
    VIDEO,
    AUDIO,
    PDF,
    TEXT,
    FILE,

    onlyImages,
    withSVG,
    isVideo,
};
