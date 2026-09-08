// Constants. The words of a query that start a clause, the ones that are highlighted and
// the functions, which are only taken as one when they open a parenthesis
const CLAUSES    = [
    "SELECT", "INSERT", "UPDATE", "DELETE", "FROM", "JOIN", "LEFT", "RIGHT", "INNER",
    "UNION", "WHERE", "GROUP", "ORDER", "HAVING", "LIMIT", "OFFSET", "SET", "VALUES",
    "ALTER", "CREATE", "DROP", "TRUNCATE", "ADD", "MODIFY", "CHANGE", "RENAME",
];
const JOINS      = [ "LEFT", "RIGHT", "INNER", "OUTER" ];
const INDENTS    = [ "JOIN", "LEFT", "RIGHT", "INNER", "ADD", "DROP", "MODIFY", "CHANGE", "RENAME" ];
const LISTS      = [ "SELECT", "SET" ];
const CONDITIONS = [ "WHERE", "HAVING" ];
const WORDS      = [
    "SELECT", "INSERT", "INTO", "UPDATE", "DELETE", "FROM", "WHERE", "SET", "VALUES",
    "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "AS", "AND", "OR", "NOT", "IN", "IS",
    "NULL", "LIKE", "BETWEEN", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END", "GROUP",
    "ORDER", "BY", "HAVING", "LIMIT", "OFFSET", "UNION", "ALL", "DISTINCT", "ASC", "DESC",
    "SIGNED", "UNSIGNED", "INTERVAL", "DUPLICATE", "KEY", "ALTER", "CREATE", "DROP",
    "TRUNCATE", "TABLE", "COLUMN", "INDEX", "ADD", "MODIFY", "CHANGE", "RENAME", "TO",
    "PRIMARY", "FOREIGN", "UNIQUE", "CONSTRAINT", "REFERENCES", "CASCADE", "AFTER",
    "FIRST", "DEFAULT", "AUTO_INCREMENT", "ENGINE", "CHARSET", "COLLATE",
];
const FUNCTIONS  = [
    "COUNT", "SUM", "MIN", "MAX", "AVG", "CAST", "CONVERT", "CONCAT", "COALESCE",
    "IFNULL", "ISNULL", "IF", "DATE", "NOW", "UNIX_TIMESTAMP", "LENGTH", "REPLACE",
    "GROUP_CONCAT", "SUBSTRING", "TRIM", "LOWER", "UPPER", "ROUND",
];



/**
 * Transforms the SQL to HTML
 * @param {string} sql
 * @returns {string}
 */
function toHtml(sql) {
    if (!sql) {
        return "";
    }

    // The query is read token by token, so a word inside a text is never highlighted and
    // everything is escaped, as a comparison like a <> has the characters of a tag. The
    // spaces are dropped and written again, which is what lays the query out in lines
    const pattern = /('(?:\\.|''|[^'\\])*')|(`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(<=|>=|<>|!=|=|<|>)|(\s+)|([^])/g;
    const escape  = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const color   = (text, value) => `<span style="color: ${value};">${escape(text)}</span>`;

    let result     = "";
    let clause     = "";
    let lastWord   = "";
    let depth      = 0;
    let prev       = "";
    let afterName  = false;
    let inLine     = false;
    let match      = null;

    // Adds a token with a space before it, unless it or the one before it takes none. A
    // parenthesis closes up after a name, as in a function or a type, and not after a word
    const append = (token, html) => {
        const noBefore = [ ",", ")", ".", ";" ].includes(token) || (token === "(" && afterName);
        const noAfter  = [ "(", "." ].includes(prev);
        if (inLine && !noBefore && !noAfter) {
            result += " ";
        }
        result += html;
        prev   = token;
        inLine = true;
    };

    // Starts a line with the given indentation, which is what a nested part is written
    // with. The first word of the query does not start one, so it is never indented
    const newLine = (indent) => {
        if (result === "") {
            return;
        }
        result += `<br>${"&nbsp;".repeat(indent)}`;
        prev   = "";
        inLine = false;
    };


    while ((match = pattern.exec(sql)) !== null) {
        const [ text, string, quoted, number, word, operator, space ] = match;
        if (space) {
            continue;
        }
        let isName = false;

        if (string) {
            append(text, color(text, "#27ae60"));
        } else if (quoted) {
            append(text, color(text, "#16a085"));
        } else if (number) {
            append(text, color(text, "#d35400"));
        } else if (operator) {
            append(text, color(text, "#e74c3c"));
        } else if (word) {
            const upper = word.toUpperCase();
            const after      = sql.slice(match.index + text.length);
            const isFunction = FUNCTIONS.includes(upper) && (/^\s*\(/).test(after);

            isName = !WORDS.includes(upper) || isFunction;

            if (isFunction) {
                append(text, color(text, "#9b59b6"));
            } else if (WORDS.includes(upper)) {
                const isJoined    = upper === "JOIN" && JOINS.includes(lastWord);
                const isClause    = depth === 0 && !isJoined && CLAUSES.includes(upper);
                const isJoin      = upper === "JOIN" || JOINS.includes(upper);
                const isCondition = depth === 0 && CONDITIONS.includes(clause) && [ "AND", "OR" ].includes(upper);

                // The joins and the changes of a table are written under it, as they
                // belong to the table of the line above
                if (isClause) {
                    newLine(INDENTS.includes(upper) ? 4 : 0);
                    clause = isJoin ? "JOIN" : upper;
                } else if (isCondition) {
                    newLine(4);
                }
                append(text, `<b style="color: #2980b9;">${escape(text)}</b>`);

                // The values of a list go one per line, so the columns can be read
                if (isClause && LISTS.includes(upper)) {
                    newLine(4);
                }
            } else if (after.startsWith(".")) {
                append(text, color(text, "#16a085"));
            } else {
                append(text, escape(text));
            }
            lastWord = upper;
        } else {
            // The columns of a table that is created go one per line inside its parenthesis
            const inCreate = clause === "CREATE" && depth === 1;

            if (text === "(") {
                depth += 1;
            } else if (text === ")") {
                if (inCreate) {
                    newLine(0);
                }
                depth = Math.max(depth - 1, 0);
            }
            append(text, escape(text));

            if (text === "," && ((depth === 0 && LISTS.includes(clause)) || inCreate)) {
                newLine(4);
            } else if (text === "(" && clause === "CREATE" && depth === 1) {
                newLine(4);
            }
        }
        afterName = isName;
    }
    return result;
}




// The public API
export default {
    toHtml,
};
