import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Constants
const RADIUS  = "var(--border-radius-small)";
const PADDING = 4;

// Styles
const Container = Styled.div`
    justify-self: start;
    font-size: var(--font-size-small);
    line-height: 1.4;
`;

const Words = Styled(Container)`
    padding: ${PADDING}px 10px;
    font-weight: 600;
`;

const Line = Styled.b`
    display: block;
    width: fit-content;
    padding: 0 10px;
    color: var(--font-light);
    font-weight: 600;
    white-space: nowrap;
    background-color: var(--light-gray);
`;



/**
 * The Tag Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Tag(props) {
    const { className, content } = props;

    const containerRef = React.useRef(null);


    // The Current State
    const [ lines, setLines ] = React.useState([]);


    // Each line of a long text gets its own box, so the words are first drawn alone to
    // know where the width breaks them, and the lines are then drawn as joined boxes
    React.useLayoutEffect(() => {
        setLines([]);
    }, [ content ]);

    React.useLayoutEffect(() => {
        if (lines.length || !containerRef.current) {
            return;
        }

        const result = [];
        let   lastTop = null;
        for (const node of containerRef.current.children) {
            const rect = node.getBoundingClientRect();
            if (lastTop === null || Math.abs(rect.top - lastTop) > 2) {
                result.push({ words : [], left : rect.left, right : rect.right });
                lastTop = rect.top;
            }
            const line = result[result.length - 1];
            line.words.push(node.textContent);
            line.right = rect.right;
        }
        setLines(result.map((line) => ({
            text  : line.words.join(" "),
            width : Math.round(line.right - line.left),
        })));
    }, [ lines ]);


    // Returns the Style of each Line. The edge of a line that sticks out from the one
    // next to it is rounded and gets the padding of a whole box, while the edge that is
    // covered joins without them, and two lines of the same width split the padding
    const getStyle = (index) => {
        const width   = lines[index].width;
        const prev    = index > 0 ? lines[index - 1].width : 0;
        const next    = index < lines.length - 1 ? lines[index + 1].width : 0;
        const showTop = index === 0 || width > prev;
        const showBot = index === lines.length - 1 || width > next;

        let paddingTop    = showTop ? PADDING : 0;
        let paddingBottom = showBot ? PADDING : 0;
        if (index > 0 && width === prev) {
            paddingTop = PADDING / 2;
        }
        if (index < lines.length - 1 && width === next) {
            paddingBottom = PADDING / 2;
        }

        const borderRadius = [
            index === 0 ? RADIUS : 0,
            showTop ? RADIUS : 0,
            showBot ? RADIUS : 0,
            index === lines.length - 1 ? RADIUS : 0,
        ].join(" ");
        return { borderRadius, paddingTop, paddingBottom };
    };


    // Do the Render
    if (!lines.length) {
        const words = String(content).split(" ");
        return <Words ref={containerRef} className={className}>
            {words.map((word, index) => <React.Fragment key={index}>
                <span>{word}</span>
                {index < words.length - 1 ? " " : ""}
            </React.Fragment>)}
        </Words>;
    }
    return <Container className={className}>
        {lines.map((line, index) => <Line key={index} style={getStyle(index)}>
            {line.text}
        </Line>)}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Tag.propTypes = {
    className : PropTypes.string,
    content   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Tag.defaultProps = {
    className : "",
};

export default Tag;
