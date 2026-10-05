import Utils                from "../Utils/Utils";

// Module variables, in MB
let maxSize      = 0;
let maxVideoSize = 0;



/**
 * Initializes the Files with the sizes allowed
 * @param {(number|string)=} newMaxSize
 * @param {(number|string)=} newMaxVideoSize
 * @returns {void}
 */
function init(newMaxSize = 0, newMaxVideoSize = 0) {
    maxSize      = Number(newMaxSize) || 0;
    maxVideoSize = Number(newMaxVideoSize) || 0;
}

/**
 * Returns the max size of a File in MB
 * @returns {number}
 */
function getMaxSize() {
    return maxSize;
}

/**
 * Returns the max size of a Video in MB
 * @returns {number}
 */
function getMaxVideoSize() {
    return maxVideoSize;
}



/**
 * Returns true if the File is not larger than the given size
 * @param {File}    file
 * @param {number=} size
 * @returns {boolean}
 */
function isValidSize(file, size = maxSize) {
    return Utils.isValidFile(file, false, size);
}

/**
 * Splits the Files into the ones that can be uploaded and the ones that are too large
 * @param {FileList|File[]} files
 * @param {number=}         size
 * @returns {{ valid: File[], rejected: File[] }}
 */
function splitBySize(files, size = maxSize) {
    const valid    = [];
    const rejected = [];
    for (const file of files) {
        if (isValidSize(file, size)) {
            valid.push(file);
        } else {
            rejected.push(file);
        }
    }
    return { valid, rejected };
}




// The public API
export default {
    init,
    getMaxSize,
    getMaxVideoSize,
    isValidSize,
    splitBySize,
};
