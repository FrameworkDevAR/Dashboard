import React                from "react";
import NLS                  from "../Core/NLS";
import KeyCode              from "./KeyCode";
import MD5                  from "./MD5";



/**
 * Returns true if the value is a Boolean
 * @param {*} value
 * @returns {boolean}
 */
function isBoolean(value) {
    return typeof value === "boolean";
}

/**
 * Returns true if the value is a String
 * @param {*} value
 * @returns {boolean}
 */
function isString(value) {
    return typeof value === "string" || value instanceof String;
}

/**
 * Returns true if the value is a Number
 * @param {*} value
 * @returns {boolean}
 */
function isNumeric(value) {
    return !isNaN(value);
}

/**
 * Returns true if the value is an Object
 * @param {*} value
 * @returns {boolean}
 */
function isObject(value) {
    return typeof value === "object" && value !== null;
}

/**
 * Returns true if the Object is empty
 * @param {object} object
 * @returns {boolean}
 */
function isEmpty(object) {
    return !object || Object.keys(object).length === 0;
}

/**
 * Returns the Property as a boolean
 * @param {(number|string)} property
 * @returns {boolean}
 */
function isActive(property) {
    return Boolean(Number(property));
}

/**
 * Returns true if the Object has the given property
 * @param {object} object
 * @param {string} property
 * @returns {boolean}
 */
function hasProp(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

/**
 * Returns the amount of items in the Object
 * @param {object} object
 * @returns {number}
 */
function count(object) {
    return object ? Object.keys(object).length : 0;
}

/**
 * Clones an Object
 * @param {object} object
 * @returns {object}
 */
function clone(object) {
    return JSON.parse(JSON.stringify(object));
}

/**
 * Rounds a Value with the given decimals
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
function round(value, decimals) {
    const padding = Math.pow(10, decimals);
    return Math.round(value * padding) / padding;
}

/**
 * Clamps a Value between the Min and Max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Maps a Value between the Low and High to the target Low and High
 * @param {number} value
 * @param {number} fromLow
 * @param {number} fromHigh
 * @param {number} toLow
 * @param {number} toHigh
 * @returns {number}
 */
function mapValue(value, fromLow, fromHigh, toLow, toHigh) {
    const fromRange = fromHigh - fromLow;
    const toRange   = toHigh - toLow;
    if (fromRange === 0) {
        return toLow;
    }

    const scaleFactor = toRange / fromRange;
    let   tmpValue = value - fromLow;
    tmpValue *= scaleFactor;
    return tmpValue + toLow;
}



/**
 * Returns the Bounds of the given Ref
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {void}
 */
function triggerClick(ref) {
    if (ref && ref.current) {
        ref.current.click();
    }
}

/**
 * Returns the Bounds of the given Ref
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {object}
 */
function getBounds(ref) {
    if (ref && ref.current) {
        return ref.current.getBoundingClientRect();
    }
    return {};
}

/**
 * Returns true if the given Point is in the Bounds
 * @param {number}  x
 * @param {number}  y
 * @param {object}  bounds
 * @param {number=} scrollTop
 * @returns {boolean}
 */
function inBounds(x, y, bounds, scrollTop = 0) {
    return (
        y > bounds.top - scrollTop && y < bounds.bottom &&
        x > bounds.left && x < bounds.right
    );
}

/**
 * Returns true if the given Point is in the Bounds
 * @param {number}                       x
 * @param {number}                       y
 * @param {React.RefObject<HTMLElement>} ref
 * @param {number=}                      scrollTop
 * @returns {boolean}
 */
function inRef(x, y, ref, scrollTop = 0) {
    const bounds = getBounds(ref);
    return (
        y > bounds.top - scrollTop && y < bounds.bottom &&
        x > bounds.left && x < bounds.right
    );
}

/**
 * Scrolls to the Bottom
 * @param {React.RefObject<HTMLElement>} ref
 * @param {boolean}                      instant
 * @param {number=}                      timeout
 * @returns {void}
 */
function scrollToBottom(ref, instant, timeout = 0) {
    const doScroll = () => {
        if (ref.current) {
            ref.current.scrollTo({
                top      : ref.current.scrollHeight - ref.current.offsetHeight,
                behavior : instant ? "instant" : "smooth",
            });
        }
    };

    if (timeout > 0) {
        window.setTimeout(() => doScroll(), timeout);
    } else {
        doScroll();
    }
}

/**
 * Returns the Caret Position
 * @param {HTMLInputElement|HTMLTextAreaElement} inputElement
 * @returns {{top: number, bottom: number, left: number}}
 */
function getCaretPosition(inputElement) {
    const { selectionStart, value } = inputElement;
    const styles = window.getComputedStyle(inputElement);

    // Create a temporary span to measure text width
    const ghost = document.createElement("span");

    // Copy essential styles for accuracy
    ghost.style.font       = styles.font;
    ghost.style.padding    = styles.padding;
    ghost.style.border     = styles.border;
    ghost.style.whiteSpace = "pre";
    ghost.style.visibility = "hidden";
    ghost.style.position   = "absolute";

    // Measure text from start to cursor
    ghost.textContent = value.substring(0, selectionStart);
    document.body.appendChild(ghost);

    const textWidth = ghost.getBoundingClientRect().width;
    document.body.removeChild(ghost);

    // Get input's position relative to the viewport
    const rect = inputElement.getBoundingClientRect();

    return {
        top    : rect.top + window.scrollY,
        bottom : rect.bottom + window.scrollY,
        left   : rect.left + window.scrollX + textWidth,
    };
}

/**
 * Inserts an Text in the given Message
 * @param {React.RefObject<HTMLInputElement>} ref
 * @param {string}                            message
 * @param {string}                            text
 * @param {number=}                           from
 * @param {number=}                           to
 * @returns {string}
 */
function insertText(ref, message, text, from = 0, to = 0) {
    if (!ref.current) {
        return message + text;
    }

    const start  = from || ref.current.selectionStart;
    const end    = to   || ref.current.selectionEnd;
    const result = message.substring(0, start) + text + message.substring(end);

    ref.current.value = result;
    ref.current.setSelectionRange(start + text.length, start + text.length);
    ref.current.focus();

    return result;
}

/**
 * Formats the given Message
 * @param {React.RefObject<HTMLInputElement>} ref
 * @param {string}                            message
 * @param {string}                            character
 * @param {string=}                           endCharacter
 * @returns {string}
 */
function formatText(ref, message, character, endCharacter) {
    if (!ref.current) {
        return message;
    }

    const startChar = character;
    const endChar   = endCharacter || character;
    const startLen  = startChar.length;
    const endLen    = endChar.length;
    const fullLen   = startLen + endLen;

    const start = ref.current.selectionStart;
    const end   = ref.current.selectionEnd;

    const selText = message.substring(start, end);
    const extText = message.substring(start - startLen, end + endLen);

    let result   = message;
    let newStart = start;
    let newEnd   = end;

    if (selText.length >= fullLen && selText.startsWith(startChar) && selText.endsWith(endChar)) {
        result   = message.substring(0, start) + message.substring(start + startLen, end - endLen) + message.substring(end);
        newStart = start;
        newEnd   = end - fullLen;
    } else if (extText.length >= fullLen && extText.startsWith(startChar) && extText.endsWith(endChar)) {
        result   = message.substring(0, start - startLen) + message.substring(start, end) + message.substring(end + endLen);
        newStart = start - startLen;
        newEnd   = end - endLen;
    } else {
        result = (
            message.substring(0, start) +
            startChar +
            message.substring(start, end) +
            endChar +
            message.substring(end)
        );
        newStart = start + startLen;
        newEnd   = end + startLen;
    }

    ref.current.value = result;
    ref.current.setSelectionRange(newStart, newEnd);
    ref.current.focus();

    return result;
}

/**
 * Returns true if something is Selected
 * @returns {boolean}
 */
function hasSelection() {
    return window.getSelection().toString() !== "";
}

/**
 * Unselects all that is Selected
 * @returns {void}
 */
function unselectAll() {
    window.getSelection().removeAllRanges();
}

/**
 * Returns the closest ancestor of the Node that scrolls in the given axis
 * @param {Element} node
 * @param {boolean} isVertical
 * @returns {?Element}
 */
function getScrollParent(node, isVertical) {
    let parent = node.parentElement;
    while (parent) {
        // A Container that does not overflow yet is still the one that owns the Node, so
        // the size is not checked here and scrolling it just does nothing
        const style    = window.getComputedStyle(parent);
        const overflow = isVertical ? style.overflowY : style.overflowX;
        if ([ "auto", "scroll", "overlay" ].includes(overflow)) {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null;
}

/**
 * Returns the scroll of the Container that shows the Node
 * @param {number} scroll
 * @param {number} position
 * @param {number} size
 * @param {number} containerSize
 * @param {string} block
 * @returns {number}
 */
function getScrollTo(scroll, position, size, containerSize, block) {
    if (block === "end") {
        return position - (containerSize - size);
    }

    // The nearest block only moves the Container when the Node is out of the visible area
    if (block === "nearest") {
        if (position < scroll) {
            return position;
        }
        if (position + size > scroll + containerSize) {
            return position + size - containerSize;
        }
        return scroll;
    }

    if (block === "center") {
        return position - (containerSize - size) / 2;
    }
    return position;
}

/**
 * Scrolls the Selector into View
 * @param {string}  selector
 * @param {string=} block
 * @param {string=} inline
 * @param {string=} behavior
 * @returns {boolean}
 */
function scrollIntoView(selector, block = "start", inline = "center", behavior = "smooth") {
    const node = document.querySelector(selector);
    if (!node) {
        return false;
    }

    // The native scrollIntoView moves every scrollable ancestor of the Node, which shifts
    // the whole page, so only the closest container of each axis is moved here
    const nodeBounds = node.getBoundingClientRect();
    const vertical   = getScrollParent(node, true);
    const horizontal = getScrollParent(node, false);

    // The same Container often owns both axes, and a second scrollTo would cancel the
    // smooth scroll that the first one started, so each one is scrolled once
    const options = new Map();

    if (vertical) {
        const bounds = vertical.getBoundingClientRect();
        options.set(vertical, { behavior, top : getScrollTo(
            vertical.scrollTop,
            vertical.scrollTop + nodeBounds.top - bounds.top,
            nodeBounds.height,
            vertical.clientHeight,
            block,
        ) });
    }
    if (horizontal) {
        const bounds = horizontal.getBoundingClientRect();
        options.set(horizontal, { behavior, ...options.get(horizontal), left : getScrollTo(
            horizontal.scrollLeft,
            horizontal.scrollLeft + nodeBounds.left - bounds.left,
            nodeBounds.width,
            horizontal.clientWidth,
            inline,
        ) });
    }

    for (const [ container, option ] of options) {
        container.scrollTo(option);
    }
    return true;
}



/**
 * Returns the Current Time
 * @returns {number}
 */
function getCurrentTime() {
    return Math.floor(new Date().getTime() / 1000);
}

/**
 * A Hook to automatically update the data
 * @param {Function} fetchData
 * @param {boolean}  isHidden
 * @param {object}   data
 * @returns {void}
 */
function useAutoUpdate(fetchData, isHidden, data) {
    const timerRef = React.useRef(0);

    // The Current State
    const [ update, setUpdate ] = React.useState(0);

    // Initial Fetch
    React.useEffect(() => {
        if (!isHidden) {
            fetchData(data);
            setUpdateTimeout(timerRef, setUpdate, update);
        }
        return () => {
            clearTimeout(timerRef);
        };
    }, [ isHidden, update, JSON.stringify(data) ]);
}

/**
 * Returns the Timeout for the auto update
 * @param {React.MutableRefObject<number>} timerRef
 * @param {Function}                       setUpdate
 * @param {number=}                        update
 * @param {number=}                        seconds
 * @returns {void}
 */
function setUpdateTimeout(timerRef, setUpdate, update = 0, seconds = 10) {
    setTimeout(timerRef, () => {
        setUpdate(update + 1);
    }, seconds * 1000);
}

/**
 * Sets a Timeout
 * @param {React.MutableRefObject<number>} timerRef
 * @param {Function}                       callback
 * @param {number}                         milliseconds
 * @returns {void}
 */
function setTimeout(timerRef, callback, milliseconds) {
    clearTimeout(timerRef);
    timerRef.current = window.setTimeout(() => {
        timerRef.current = 0;
        callback();
    }, milliseconds);
}

/**
 * Clears the Timeout for the auto update
 * @param {React.MutableRefObject<number>} timerRef
 * @returns {void}
 */
function clearTimeout(timerRef) {
    if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = 0;
    }
}

/**
 * Sets a Interval
 * @param {React.MutableRefObject<number>} timerRef
 * @param {Function}                       callback
 * @param {number}                         milliseconds
 * @returns {void}
 */
function setInterval(timerRef, callback, milliseconds) {
    clearInterval(timerRef);
    timerRef.current = window.setInterval(callback, milliseconds);
}

/**
 * Clears the Interval for the auto update
 * @param {React.MutableRefObject<number>} timerRef
 * @returns {void}
 */
function clearInterval(timerRef) {
    if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
    }
}



/**
 * Makes a String shorter
 * @param {string} value
 * @param {number} length
 * @returns {string}
 */
function makeShort(value, length) {
    if (!length || value.length <= length) {
        return value;
    }
    return value.substring(0, length - 3) + "...";
}

/**
 * Return an escaped string that can be broken at certain separators
 * @param {string} string
 * @returns {string}
 */
function makeBreakable(string) {
    // Inject zero-width space character (U+200B or &#8203) near (. or _ or - or @) to allow line breaking there
    return string.replace(new RegExp("(?<!\\/)(\\.|_|@|-|\\?|/)", "g"), "$1" + "\u200B");
}

/**
 * Creates a Slug from a string
 * @param {string} value
 * @returns {string}
 */
function createSlug(value) {
    let result = value;
    result = result.replace(/^\s+|\s+$/g, ""); // trim
    result = result.toLowerCase();

    /* spell-checker: disable-next-line */
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    /* spell-checker: disable-next-line */
    const to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";

    // Remove accents, swap ñ for n, etc
    for (let i = 0, l = from.length; i < l; i++) {
        result = result.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    // Remove invalid chars
    result = result.replace(/[^a-z0-9 -]/g, "");
    result = result.trim();
    // Collapse whitespace and replace by -
    result = result.replace(/\s+/g, "-");
    // Collapse dashes
    result = result.replace(/-+/g, "-");

    return result;
}

/**
 * Converts an UPPER_CASE string to camelCase
 * @param {string} value
 * @returns {string}
 */
function upperCaseToCamelCase(value) {
    return value.toLowerCase().replace(/_([a-z])/g, function (match, letter) {
        return letter.toUpperCase();
    });
}

/**
 * Converts an UPPER_CASE string to PascalCase
 * @param {string} value
 * @returns {string}
 */
function upperCaseToPascalCase(value) {
    if (!value) {
        return "";
    }
    const result = upperCaseToCamelCase(value);
    return result[0].toUpperCase() + result.slice(1);
}

/**
 * Formats a number
 * @param {number}   number
 * @param {number=}  decimals
 * @param {number=}  maxForDecimals
 * @param {boolean=} alwaysShowDecimals
 * @returns {string}
 */
function formatNumber(number, decimals = 0, maxForDecimals = 1000, alwaysShowDecimals = true) {
    const amount  = Math.pow(10, decimals);
    const float   = Math.round(number * amount) / amount;
    const integer = Math.floor(float);
    let   result  = String(integer);

    if (!maxForDecimals || float < maxForDecimals) {
        const fraction = Math.round(float * amount - integer * amount);
        if (alwaysShowDecimals || fraction !== 0) {
            let   fractionText = String(fraction);
            const start        = fractionText.length;

            for (let i = start; i < decimals; i++) {
                fractionText = `0${fractionText}`;
            }
            result = String(`${integer}.${fractionText}`);
        }
    }

    const parts = result.split(".");
    parts[0]    = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (!decimals) {
        return parts[0];
    }
    return parts.join(",");
}

/**
 * Calculates and formats a percent
 * @param {number}   number
 * @param {number}   total
 * @param {number=}  decimals
 * @param {boolean=} withPercent
 * @returns {string}
 */
function formatPercent(number, total, decimals = 0, withPercent = true) {
    const percent   = total === 0 ? 0 : (number * 100 / total);
    const formatted = formatNumber(percent, decimals);
    return formatted + (withPercent ? "%" : "");
}

/**
 * Gives an html format to prices
 * @param {number}   price
 * @param {boolean=} skipZeros
 * @param {string=}  zeroStr
 * @param {string=}  symbol
 * @returns {string}
 */
function formatPrice(price, skipZeros = false, zeroStr = "", symbol = "$") {
    if (skipZeros && price === 0) {
        return zeroStr || "";
    }

    const sign       = price < 0 ? "-" : "";
    const positive   = Math.abs(price);
    const noCents    = Math.floor(positive);
    const noCentsStr = noCents.toLocaleString(window.navigator.language);
    const cents      = Math.round(positive * 100 - noCents * 100);
    const centsStr   = cents < 10 ? "0" + cents : String(cents);

    return `${symbol} ${sign}${noCentsStr}<sup>${centsStr}</sup>`;
}

/**
 * Returns the Page Text
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {string}
 */
function getPageText(currentPage, totalPages) {
    return NLS.format("GENERAL_PAGE", String(currentPage), String(totalPages));
}

/**
 * Returns Yes or No depending of the value
 * @param {(number|string)} value
 * @returns {string}
 */
function toYesNo(value) {
    return NLS.get("GENERAL_YES_NO", Number(value) || 0);
}

/**
 * Returns Yes or Blank depending of the value
 * @param {(number|string)} value
 * @returns {string}
 */
function toYesBlank(value) {
    return NLS.get("GENERAL_YES_BLANK", Number(value) || 0);
}

/**
 * Returns a String with the Text Class
 * @param {string} options
 * @param {number} value
 * @returns {string}
 */
function getTextClass(options, value) {
    const color = NLS.get(options, Number(value) || 0);
    return color ? `text-${color}` : "";
}



/**
 * Restores an Item from Local Storage
 * @param {string} key
 * @param {string} defaultValue
 * @returns {string}
 */
function restoreItem(key, defaultValue = "") {
    try {
        const value = window.localStorage.getItem(key);
        return value || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

/**
 * Stores an Item in Local Storage
 * @param {string}          key
 * @param {(string|number)} value
 * @returns {boolean}
 */
function storeItem(key, value) {
    try {
        window.localStorage.setItem(key, String(value));
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Concat the Values
 * @param {string}    glue
 * @param {...string} values
 * @returns {object}
 */
function concat(glue, ...values) {
    const result = [];
    for (const value of values) {
        if (value) {
            result.push(value);
        }
    }
    return result.join(glue);
}

/**
 * Removes the Prefix
 * @param {object}   data
 * @param {string}   prefix
 * @param {boolean=} lower
 * @returns {object}
 */
function removePrefix(data, prefix, lower = false) {
    const result = {};
    for (const [ key, value ] of Object.entries(data)) {
        if (key.startsWith(prefix)) {
            let id = key.replace(prefix, "");
            if (lower) {
                id = id.charAt(0).toLocaleLowerCase() + id.substring(1);
            }
            result[id] = value;
        }
    }
    return result;
}

/**
 * Creates an Array
 * @param {(Array|any)} data
 * @returns {Array}
 */
function toArray(data) {
    return Array.isArray(data) ? data : [ data ];
}

/**
 * Creates an Array
 * @param {(Array|any)} data
 * @returns {string}
 */
function toArrayEncoded(data) {
    return JSON.stringify(toArray(data));
}

/**
 * Creates a Map from an Array
 * @param {object[]} data
 * @param {string}   id
 * @returns {object}
 */
function toMap(data, id) {
    const result = {};
    for (const elem of data) {
        result[elem[id]] = elem;
    }
    return result;
}

/**
 * Converts an Array with an id and name to a Select
 * @param {object[]} data
 * @returns {{key: number, value: string}[]}
 */
function toSelect(data) {
    const result = [];
    for (const elem of data) {
        result.push({
            key   : elem.key   || elem.id,
            value : elem.value || elem.name,
        });
    }
    return result;
}

/**
 * Converts an Array of strings to a Select
 * @param {string[]} data
 * @returns {{key: number, value: string}[]}
 */
function stringsToSelect(data) {
    const result = [];
    for (const [ key, value ] of data.entries()) {
        result.push({ key, value });
    }
    return result;
}

/**
 * Transforms the JSON to HTML
 * @param {object} content
 * @returns {string}
 */
function jsonToHtml(content) {
    if (!content) {
        return "";
    }

    // The content can have html characters, which are escaped before the
    // markup is added, so they are shown and not interpreted as tags
    return JSON.stringify(content, null, 2)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>")
        // Highlight keys and values safely in one pass
        .replace(/"([\w-]+)"(?=:)/g, '<span style="color: #2980b9;">"$1"</span>')
        .replace(/:\s*("(?:\\"|[^"])*"|\d+|true|false)/g, function(match, value) {
            // Green Strings (including dates)
            if (value.startsWith('"')) {
                return `: <span style="color: #27ae60;">${value}</span>`;
            }
            // Purple Booleans
            if (value === "true" || value === "false") {
                return `: <span style="color: #9b59b6; font-weight: bold;">${value}</span>`;
            }
            // Orange Numbers
            return `: <span style="color: #d35400;">${value}</span>`;
        });
}

/**
 * Transforms the SQL to HTML
 * @param {string} sql
 * @returns {string}
 */
function sqlToHtml(sql) {
    const jumps = [ "FROM", "LEFT JOIN", "UNION", "WHERE", "GROUP BY", "ORDER BY", "LIMIT" ];
    const words = [
        "SELECT", "INSERT", "UPDATE", "INTO", "FROM", "UNION", "JOIN", "LEFT", "SET",
        "WHERE", "GROUP BY", "ORDER BY", "LIMIT", "DESC", "ASC", "SIGNED", "CAST",
        "CASE WHEN", "IFNULL", "ISNULL", "COUNT", "SUM", "IF", " AS ", " ON ", " IN ",
        " AND ", " OR ", "THEN", "ELSE", "END",
    ];

    let result = sql;
    jumps.forEach((word) => {
        result = result.replace(new RegExp(`(${word})`, "g"), "<br>$1");
    });
    words.forEach((word) => {
        result = result.replace(new RegExp(`(${word})`, "g"), "<b>$1</b>");
    });
    return result;
}

/**
 * Creates an Array of N numbers
 * @param {number}  amount
 * @param {number=} start
 * @returns {number[]}
 */
function createArrayOf(amount, start = 1) {
    const result = [];
    for (let i = start; i < amount + start; i++) {
        result.push(i);
    }
    return result;
}

/**
 * Returns true if 2 objects are equal
 * @param {object} object1
 * @param {object} object2
 * @returns {boolean}
 */
function areEqual(object1, object2) {
    const string1 = JSON.stringify(object1);
    const string2 = JSON.stringify(object2);
    return string1 === string2;
}

/**
 * Returns true if both given objects are the same at 1 level deep
 * @param {object} a
 * @param {object} b
 * @returns {boolean}
 */
function areObjectsEqual(a, b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
        return false;
    }
    for (let i = 0; i < aProps.length; i += 1) {
        if (String(a[aProps[i]]) !== String(b[aProps[i]])) {
            return false;
        }
    }
    return true;
}

/**
 * Uses the keys from primary and sets the secondary values if are set
 * @param {object}   primary
 * @param {object}   secondary
 * @param {boolean=} noBinary
 * @returns {object}
 */
function extend(primary, secondary, noBinary = false) {
    const result = {};
    for (const [ key, value ] of Object.entries(primary)) {
        const sec = secondary[key];
        if (sec !== undefined) {
            if (noBinary) {
                result[key] = sec;
            } else {
                result[key] = sec === true ? 1 : (sec === false ? 0 : sec);
            }
        } else {
            result[key] = value;
        }
    }
    return result;
}

/**
 * Uses the keys from primary and adds the secondary values if are not set
 * @param {object}   primary
 * @param {object}   secondary
 * @param {boolean=} noBinary
 * @returns {object}
 */
function merge(primary, secondary, noBinary = false) {
    const result = { ...primary };
    for (const [ key, value ] of Object.entries(secondary)) {
        if (primary[key] === undefined) {
            if (noBinary) {
                result[key] = value;
            } else {
                result[key] = value === true ? 1 : (value === false ? 0 : value);
            }
        }
    }
    return result;
}

/**
 * Returns true if the given array has the given value
 * @param {(string|number)[]} values
 * @param {(string|number)}   elem
 * @returns {boolean}
 */
function hasValue(values, elem) {
    for (const value of values) {
        if (String(value) === String(elem)) {
            return true;
        }
    }
    return null;
}

/**
 * Returns the Value at the given id with the given key
 * @param {object[]}        data
 * @param {string}          idKey
 * @param {(number|string)} idValue
 * @returns {?number}
 */
function getIndex(data, idKey, idValue) {
    for (const [ index, elem ] of Object.entries(data)) {
        if (String(elem[idKey]) === String(idValue)) {
            return Number(index);
        }
    }
    return null;
}

/**
 * Returns the Value at the given id with the given key
 * @param {object[]}        data
 * @param {string}          idKey
 * @param {(number|string)} idValue
 * @param {string=}         key
 * @param {*=}              defValue
 * @returns {(object|string)}
 */
function getValue(data, idKey, idValue, key, defValue) {
    if (data) {
        for (const elem of data) {
            if (String(elem[idKey]) === String(idValue)) {
                return key ? elem[key] : elem;
            }
        }
    }
    if (defValue !== undefined) {
        return defValue;
    }
    return key ? "" : {};
}

/**
 * Returns the Value at the given id with the given key
 * @param {object[]}        data
 * @param {string}          idKey
 * @param {(number|string)} idValue
 * @param {string=}         key
 * @returns {(object|string)[]}
 */
function getValues(data, idKey, idValue, key) {
    const result = [];
    if (data) {
        for (const elem of data) {
            if (String(elem[idKey]) === String(idValue)) {
                result.push(key ? elem[key] : elem);
            }
        }
    }
    return result;
}

/**
 * Combines the Values in the given Key into a String
 * @param {object} elem
 * @param {string} key
 * @returns {string}
 */
function combineValues(elem, key) {
    let parts = [ "" ];
    if (elem[key]) {
        try {
            parts = Array.isArray(elem[key]) ? elem[key] : JSON.parse(String(elem[key]));
            if (!Array.isArray(parts)) {
                parts = [ parts ];
            }
        } catch(e) {
            parts = [ "" ];
        }
    }
    return parts.join(" - ");
}



/**
 * Returns the Children
 * @param {(Array|any)} children
 * @returns {React.ReactElement[]}
 */
function getChildren(children) {
    const result = [];
    for (const child of toArray(children)) {
        if (!child) {
            continue;
        }

        if (Array.isArray(child) && child.length) {
            for (const newChild of child) {
                result.push(newChild);
            }
        } else if (child.props) {
            result.push(child);
        }
    }
    return result;
}

/**
 * Returns the Visible Children
 * @param {(Array|any)} children
 * @returns {React.ReactElement[]}
 */
function getVisibleChildren(children) {
    const result = [];
    for (const child of getChildren(children)) {
        const has = hasProp(child.props, "isHidden");
        if ((has && !child.props.isHidden) || !has) {
            result.push(child);
        }
    }
    return result;
}

/**
 * Returns the Visible Children with their index in all the Children, so that
 * hiding or showing a Child does not change the index of the other ones
 * @param {(Array|any)} children
 * @returns {Array<[ number, React.ReactElement ]>}
 */
function getVisibleEntries(children) {
    const result = [];
    for (const [ index, child ] of getChildren(children).entries()) {
        const has = hasProp(child.props, "isHidden");
        if ((has && !child.props.isHidden) || !has) {
            result.push([ index, child ]);
        }
    }
    return result;
}

/**
 * Returns the Visible Children Props
 * @param {(Array|any)} children
 * @returns {object[]}
 */
function getChildrenProps(children) {
    const result = [];
    for (const child of getVisibleChildren(children)) {
        result.push(child.props);
    }
    return result;
}

/**
 * Returns an array of Cloned Visible Children
 * @param {(Array|any)} children
 * @param {Function}    callback
 * @returns {object[]}
 */
function cloneChildren(children, callback) {
    const isVisible = (child) => child && child.props && !child.props.isHidden;
    const list      = getChildren(children);
    const total     = list.filter(isVisible).length;
    const result    = [];
    let   key       = 0;
    let   realKey   = 0;

    for (const child of list) {
        if (isVisible(child)) {
            const values  = callback(child, key, realKey, total);
            const isFirst = key === 0;
            const isLast  = key === total - 1;
            result.push(React.cloneElement(child, {
                key, realKey, isFirst, isLast, ...values,
            }));
            key += 1;
        }
        realKey += 1;
    }
    return result;
}



/**
 * Parses the Given List
 * @param {object[]} list
 * @param {Function} callback
 * @returns {object[]}
 */
function parseList(list, callback) {
    if (!list) {
        return [];
    }
    for (const elem of list) {
        callback(elem);
    }
    return list;
}

/**
 * Returns an ID depending on the type
 * @param {object}    action
 * @param {...string} types
 * @returns {boolean}
 */
function hasError(action, ...types) {
    return types.indexOf(action.type) > -1 && (!action.data || action.data.error);
}

/**
 * Returns true if the there is an error in the Form
 * @param {object} errors
 * @returns {boolean}
 */
function hasFormError(errors) {
    for (const error of Object.values(errors)) {
        if (error) {
            return true;
        }
    }
    return false;
}

/**
 * Returns the Select items
 * @param {number[]} itemIDs
 * @param {object[]} options
 * @param {object}   idsPerItem
 * @returns {object[]}
 */
function getSelectItems(itemIDs, options, idsPerItem) {
    const result = [];
    for (const itemID of itemIDs) {
        if (idsPerItem[itemID]) {
            for (const id of idsPerItem[itemID]) {
                const item = getValue(options, "key", id);
                result.push(item);
            }
        }
    }
    return result;
}

/**
 * Returns the Select list based on a Parent
 * @param {boolean}  loading
 * @param {number[]} itemIDs
 * @param {object[]} options
 * @param {object}   idsPerItem
 * @param {number=}  noneValue
 * @returns {object[]}
 */
function useSelectList(loading, itemIDs, options, idsPerItem, noneValue = 0) {
    return React.useMemo(() => {
        if (!itemIDs || !itemIDs.length || (itemIDs.length === 1 && Number(itemIDs[0]) === noneValue)) {
            return options;
        }
        return getSelectItems(itemIDs, options, idsPerItem);
    }, [ loading, JSON.stringify(itemIDs), JSON.stringify(options) ]);
}

/**
 * Returns the Select list based on a Parent
 * @param {boolean}  loading
 * @param {number[]} itemIDs
 * @param {number[]} subItemIDs
 * @param {object[]} options
 * @param {object}   idsPerItem
 * @param {object}   subIdsPerItem
 * @returns {object[]}
 */
function useSubSelectList(loading, itemIDs, subItemIDs, options, idsPerItem, subIdsPerItem) {
    const itemList    = JSON.stringify(itemIDs);
    const subItemList = JSON.stringify(subItemIDs);

    return React.useMemo(() => {
        if (!itemIDs.length && !subItemIDs.length) {
            return options;
        }
        if (subItemIDs.length) {
            return getSelectItems(subItemIDs, options, subIdsPerItem);
        }
        return getSelectItems(itemIDs, options, idsPerItem);
    }, [ loading, itemList, subItemList ]);
}

/**
 * Returns true if the given key is a special key
 * @param {number} keyCode
 * @returns {boolean}
 */
function isSpecialKey(keyCode) {
    return [
        KeyCode.DOM_VK_ESCAPE, KeyCode.DOM_VK_TAB,
        KeyCode.DOM_VK_SHIFT, KeyCode.DOM_VK_CONTROL,
        KeyCode.DOM_VK_META, KeyCode.DOM_VK_ALT,
        KeyCode.DOM_VK_RETURN, KeyCode.DOM_VK_ENTER,
    ].includes(keyCode);
}

/**
 * Returns true if the Key is handled by the code
 * @param {number} keyCode
 * @returns {boolean}
 */
function isKeyHandled(keyCode) {
    return [
        KeyCode.DOM_VK_UP,      KeyCode.DOM_VK_DOWN,
        KeyCode.DOM_VK_LEFT,    KeyCode.DOM_VK_RIGHT,
        KeyCode.DOM_VK_HOME,    KeyCode.DOM_VK_END,
        KeyCode.DOM_VK_PAGE_UP, KeyCode.DOM_VK_PAGE_DOWN,
        KeyCode.DOM_VK_RETURN,  KeyCode.DOM_VK_ESCAPE,
    ].includes(keyCode);
}

/**
 * Handles Key Navigation
 * @param {number} keyCode
 * @param {number} current
 * @param {number} length
 * @returns {[number, boolean]}
 */
function handleKeyNavigation(keyCode, current, length) {
    let newIndex = 0;
    let handled  = false;

    switch (keyCode) {
    case KeyCode.DOM_VK_UP:
        newIndex = (current - 1) < 0 ? length - 1 : current - 1;
        handled  = true;
        break;

    case KeyCode.DOM_VK_DOWN:
        newIndex = (current + 1) % length;
        handled  = true;
        break;

    case KeyCode.DOM_VK_HOME:
        newIndex = 0;
        handled  = true;
        break;
    case KeyCode.DOM_VK_END:
        newIndex = length - 1;
        handled  = true;
        break;

    case KeyCode.DOM_VK_PAGE_UP:
        if (current === 0) {
            newIndex = length - 1;
        } else if (current - 5 < 0) {
            newIndex = 0;
        } else {
            newIndex = current - 5;
        }
        handled = true;
        break;
    case KeyCode.DOM_VK_PAGE_DOWN:
        if (current === length - 1) {
            newIndex = 0;
        } else if (current + 5 >= length) {
            newIndex = length - 1;
        } else {
            newIndex = current + 5;
        }
        handled = true;
        break;
    default:
    }

    return [ newIndex, handled ];
}



/**
 * Returns the Gravatar Url
 * @param {string} email
 * @param {string} defaultValue
 * @returns {string}
 */
function getGravatarUrl(email, defaultValue) {
    const username = email ? MD5(email.toLowerCase().trim()) : "000000000000000000000000000000000000000000000000000000";
    return `https://gravatar.com/avatar/${username}?default=${defaultValue}`;
}

/**
 * Returns the YouTube Embed Url
 * @param {string} source
 * @returns {string}
 */
function getYouTubeEmbed(source) {
    if (!source) {
        return "";
    }
    let videoID = "";
    if (source.startsWith("https://youtu.be/")) {
        videoID = source.replace("https://youtu.be/", "");
    } else if (source.startsWith("https://www.youtube.com/watch?v=")) {
        videoID = source.replace("https://www.youtube.com/watch?v=", "");
    } else if (source.startsWith("https://www.youtube.com/embed/")) {
        videoID = source.replace("https://www.youtube.com/embed/", "");
    }
    if (videoID.includes("&")) {
        videoID = videoID.split("&")[0];
    }
    if (!videoID) {
        return "";
    }
    return `https://www.youtube-nocookie.com/embed/${videoID}?version=3&modestbranding=1&rel=0&showinfo=0`;
}

/**
 * Returns the Vimeo Embed Url
 * @param {string}   source
 * @param {boolean=} showInfo
 * @returns {string}
 */
function getVimeoEmbed(source, showInfo = false) {
    if (!source) {
        return "";
    }
    let videoID = "";
    if (source.startsWith("https://vimeo.com/")) {
        videoID = source.replace("https://vimeo.com/", "");
    } else if (source.startsWith("https://www.vimeo.com/")) {
        videoID = source.replace("https://www.vimeo.com/", "");
    }
    if (!videoID) {
        return "";
    }
    let result = `https://player.vimeo.com/video/${videoID}`;
    result    += showInfo ? "?title=1&byline=1&portrait=1" : "?title=0&byline=0&portrait=0";
    return result;
}

/**
 * Creates a Google Map Embed Url
 * @param {number}   latitude
 * @param {number}   longitude
 * @param {string=}  query
 * @param {number=}  zoom
 * @param {boolean=} satelite
 * @returns {string}
 */
function getGoogleMapEmbed(latitude, longitude, query = "", zoom = 15, satelite = false) {
    let result = "https://maps.google.com/maps?ie=UTF8&iwd=1&iwloc=B&output=embed";
    if (query) {
        result += `&q=${encodeURIComponent(query)}`;
    } else if (longitude && latitude) {
        result += `&q=${latitude},${longitude}`;
    }
    if (satelite) {
        result += "&t=k";
    }
    result += `&z=${zoom}`;
    return result;
}



/**
 * Returns a random value between from and to
 * @param {number} from
 * @param {number} to
 * @returns {number}
 */
function randomNumber(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

/**
 * Generates a random password with the given length and sets
 * (l = letters, u = uppercase letters, d = digits, s = symbols)
 * @param {number=} length
 * @param {string=} availableSets
 * @returns {string}
 */
function generatePassword(length = 10, availableSets = "lud") {
    const sets     = [];
    let   all      = "";
    let   password = "";

    if (availableSets.indexOf("l") > -1) {
        sets.push("abcdefghjkmnpqrstuvwxyz");
    }
    if (availableSets.indexOf("u") > -1) {
        sets.push("ABCDEFGHJKMNPQRSTUVWXYZ");
    }
    if (availableSets.indexOf("d") > -1) {
        sets.push("23456789");
    }
    if (availableSets.indexOf("s") > -1) {
        sets.push("!@#$%&*?");
    }

    for (const set of sets) {
        password += set[randomNumber(0, set.length - 1)];
        all      += set;
    }

    for (let i = 0; i < length - sets.length; i += 1) {
        password += all.charAt(randomNumber(0, all.length - 1));
    }

    password = shuffleString(password);
    return password;
}

/**
 * Shuffles the given string
 * @param {string} string
 * @returns {string}
 */
function shuffleString(string) {
    const parts = string.split("");
    for (let i = 1; i < parts.length; i += 1) {
        const random = randomNumber(0, i - 1);
        const temp   = parts[i];

        parts[i]      = parts[random];
        parts[random] = temp;
    }
    return parts.join("");
}

/**
 * Converts the text to Search
 * @param {string} text
 * @returns {string}
 */
function convertToSearch(text) {
    let string = String(text).trim().toLowerCase();
    if (string[0] === "(" && string[string.length - 1] === ")") {
        string = string.substring(1, string.length - 1).trim();
    }
    if (string[0] === "+") {
        string = string.substring(1).trim();
    }
    return string
        .replaceAll("á", "a")
        .replaceAll("é", "e")
        .replaceAll("í", "i")
        .replaceAll("ó", "o")
        .replaceAll("ú", "u");
}

/**
 * Searches the Value in the Text
 * @param {string} text
 * @param {string} value
 * @returns {boolean}
 */
function searchValue(text, value) {
    return convertToSearch(text).includes(convertToSearch(value));
}

/**
 * Parses the Search Result
 * @param {object[]} list
 * @param {string}   filter
 * @param {string}   field
 * @param {boolean=} applyFilter
 * @returns {object[]}
 */
function parseSearchResult(list, filter, field, applyFilter = true) {
    const search = convertToSearch(filter);
    const result = [];

    for (const item of list) {
        const text      = String(item[field]);
        const parts     = text.split(/[- ]+/);
        let   fromIndex = 0;

        for (const part of parts) {
            const searchText = text.substring(text.indexOf(part));
            if (!applyFilter || convertToSearch(searchText).startsWith(search)) {
                result.push({ ...item, text : underlineText(text, search, fromIndex) });
                break;
            }
            fromIndex += part.length + 1;
        }
    }
    return result;
}

/**
 * Underlines the Search Result
 * @param {string}  text
 * @param {string}  search
 * @param {number=} fromIndex
 * @returns {string}
 */
function underlineText(text, search, fromIndex = 0) {
    const pos = convertToSearch(text).indexOf(search, fromIndex);
    return `${text.substring(0, pos)}<u>${text.substring(pos, pos + search.length)}</u>${text.substring(pos + search.length)}`;
}

/**
 * Replaces the Source Urls
 * @param {string}  baseUrl
 * @param {string}  text
 * @param {number=} clientID
 * @returns {string}
 */
function replaceSourceUrls(baseUrl, text, clientID = 0) {
    const regex = /<(img|audio|video)([^>]*?)src=["']((?!https?:\/\/|\/\/|data:)[^"']+)["']([^>]*?)>/g;
    return text.replace(regex, (match, tag, beforeSrc, relativePath, afterSrc) => {
        const absolutePath = `${baseUrl}${clientID}/${relativePath}`;
        return `<${tag}${beforeSrc}src="${absolutePath}"${afterSrc}>`;
    });
}

/**
 * Returns true if the given text has only Emojis
 * @param {string} text
 * @returns {boolean}
 */
function isEmojiOnly(text) {
    const stringToTest = text.replace(/ /g, "");
    const emojiRegex = /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
    return emojiRegex.test(stringToTest) && Number.isNaN(Number(stringToTest));
}

/**
 * Returns true if the given color is valid
 * @param {string} value
 * @returns {boolean}
 */
function isValidColor(value) {
    return !!value && value.length === 7 && /^#[0-9A-Fa-f]{6}$/.test(value);
}

/**
 * Returns a Contrast Color for given Color
 * @param {string} value
 * @returns {string}
 */
function getContrastColor(value) {
    let result = "var(--contrast-light, white)";
    let red    = 0;
    let green  = 0;
    let blue   = 0;

    if (value.startsWith("rgb")) {
        const rgba = value.match(/\d+/g);
        red   = Number(rgba[0]);
        green = Number(rgba[1]);
        blue  = Number(rgba[2]);
    } else {
        red   = parseInt(value.substring(1, 3), 16);
        green = parseInt(value.substring(3, 5), 16);
        blue  = parseInt(value.substring(5, 7), 16);
    }

    if ((red * 0.299) + (green * 0.587) + (blue * 0.114) > 147) {
        result = "var(--contrast-dark, black)";
    }
    return result;
}

/**
 * Returns true if the given Email is valid
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);
}

/**
 * Returns true if the File is Valid
 * @param {object}  file
 * @param {boolean} onlyImages
 * @param {number}  maxSize
 * @returns {boolean}
 */
function isValidFile(file, onlyImages, maxSize) {
    if (onlyImages) {
        const imageTypes = [ "image/png", "image/gif", "image/bmp", "image/jpg", "image/jpeg" ];
        if (!imageTypes.includes(file.type.toLowerCase())) {
            return false;
        }
    }
    if (Number(maxSize)) {
        const size = file.size / (1024 * 1024);
        if (size > Number(maxSize)) {
            return false;
        }
    }
    return true;
}


/**
 * Formats the given bytes into a human-readable string
 * @param {number} bytes
 * @returns {string}
 */
function formatSize(bytes) {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const k     = 1024;
    const sizes = [ "Bytes", "KB", "MB", "GB", "TB" ];
    const index = Math.floor(Math.log(bytes) / Math.log(k));
    const size  = bytes / Math.pow(k, index);
    return `${formatNumber(size, 2)} ${sizes[index]}`;
}

/**
 * Downloads the given File
 * The params are sent in the body, as the access token can make the url too long
 * @param {string}       source
 * @param {string}       fileName
 * @param {AbortSignal=} signal
 * @returns {Promise}
 */
function download(source, fileName, signal = null) {
    const sourceUrl = new URL(source);
    const params    = new URLSearchParams(sourceUrl.search);
    const options   = { method : "POST", body : params };

    sourceUrl.search = "";
    if (signal) {
        options.signal = signal;
    }

    return fetch(sourceUrl.href, options)
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([ blob ]));
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || "downloaded-file";
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        });
}

/**
 * Returns true if the User is in macOS, where the modifier key is the Command
 * @returns {boolean}
 */
function isMacOS() {
    const platform = window.navigator.userAgentData?.platform || window.navigator.platform || "";
    return platform.toLowerCase().includes("mac");
}

/**
 * Returns the Keys of a Shortcut, to show each one on its own
 * @param {string} key
 * @returns {string[]}
 */
function getShortcutKeys(key) {
    return [ isMacOS() ? "⌘" : "Ctrl", key ];
}

/**
 * Returns the Text of a Shortcut, to show it in a single line
 * @param {string} key
 * @returns {string}
 */
function getShortcutText(key) {
    return isMacOS() ? `⌘${key}` : `Ctrl+${key}`;
}

/**
 * Prints the given Content
 * @param {string} title
 * @param {string} content
 * @returns {void}
 */
function print(title, content) {
    const printer = window.open("", "PRINT", "height=600,width=1000");
    printer.document.write(`<html><head><title>${title}</title>`);
    printer.document.write("<style>");
    printer.document.write("body {margin:24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;background-color:white;color:rgb(22,25,28);backface-visibility:hidden;overscroll-behavior:none;}");
    printer.document.write("h1 {font-size:2em;}");
    printer.document.write("a {color:hsl(216,98%,44%);} a:hover{text-decoration:none;}");
    printer.document.write("img {max-width:calc(100vw-4*24px-4px);}");
    printer.document.write("table {width:100%;border-spacing:0;font-size:12px;}");
    printer.document.write("tr td {padding:8px 12px;border-bottom:1px solid #ebedf2;border-right:1px solid #ebedf2;}");
    printer.document.write("tr:first-child td {background:#fafbfd;border-top:1px solid #ebedf2;}");
    printer.document.write("tr td:first-child {border-left:1px solid #ebedf2;}");
    printer.document.write("tr:first-child td:first-child {border-top-left-radius:8px;}");
    printer.document.write("tr:first-child td:last-child {border-top-right-radius:8px;}");
    printer.document.write("tr:last-child td:first-child {border-bottom-left-radius:8px;}");
    printer.document.write("tr:last-child td:last-child {border-bottom-right-radius:8px;}");
    printer.document.write("tr td p {margin:0;}");
    printer.document.write("pre {padding:16px;border:1px solid #ebedf2;border-radius:10px;}");
    printer.document.write("</style>");
    printer.document.write("</head><body>");
    printer.document.write(content);
    printer.document.write("</body></html>");
    printer.document.write('<script type="text/javascript">window.onload = function() { window.print(); };</script>');
    printer.document.close();
}




// The public API
export default {
    isBoolean,
    isString,
    isNumeric,
    isObject,
    isEmpty,
    isActive,
    hasProp,
    count,
    clone,
    round,
    clamp,
    mapValue,

    triggerClick,
    getBounds,
    inBounds,
    inRef,
    scrollToBottom,
    getCaretPosition,
    insertText,
    formatText,
    hasSelection,
    unselectAll,
    scrollIntoView,

    getCurrentTime,
    useAutoUpdate,
    setTimeout,
    setUpdateTimeout,
    clearTimeout,
    setInterval,
    clearInterval,

    makeShort,
    makeBreakable,
    createSlug,
    upperCaseToCamelCase,
    upperCaseToPascalCase,
    formatNumber,
    formatPercent,
    formatPrice,
    getPageText,
    toYesNo,
    toYesBlank,
    getTextClass,

    restoreItem,
    storeItem,
    concat,
    removePrefix,
    toArray,
    toArrayEncoded,
    toMap,
    toSelect,
    stringsToSelect,
    jsonToHtml,
    sqlToHtml,
    createArrayOf,
    areEqual,
    areObjectsEqual,
    extend,
    merge,
    hasValue,
    getIndex,
    getValue,
    getValues,
    combineValues,

    getChildren,
    getVisibleChildren,
    getVisibleEntries,
    getChildrenProps,
    cloneChildren,

    parseList,
    hasError,
    hasFormError,
    useSelectList,
    useSubSelectList,
    isSpecialKey,
    isKeyHandled,
    handleKeyNavigation,

    getGravatarUrl,
    getYouTubeEmbed,
    getVimeoEmbed,
    getGoogleMapEmbed,

    randomNumber,
    generatePassword,
    convertToSearch,
    searchValue,
    parseSearchResult,
    underlineText,
    replaceSourceUrls,
    isEmojiOnly,
    isValidColor,
    getContrastColor,
    isValidEmail,
    isValidFile,
    formatSize,
    download,
    isMacOS,
    getShortcutKeys,
    getShortcutText,
    print,
};
