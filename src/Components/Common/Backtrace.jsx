import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";



// Constants. A line of the backtrace, as the frame, the file with its line and the call
const FRAME = /^#(\d+)-\s*(.+?)\s*\((\d+)\)\s*(?:->|:)\s*(.*)$/;

// Styles
const Frames = Styled.ol`
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: monospace;
    font-size: var(--font-size-small);
`;

const Frame = Styled.li`
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 8px 0;
    border-top: 1px solid var(--border-color-light);

    &:first-child {
        padding-top: 0;
        border-top: none;
    }
    &:last-child {
        padding-bottom: 0;
    }
`;

const Index = Styled.span`
    flex-shrink: 0;
    min-width: 26px;
    color: var(--font-lightest);
    text-align: right;
`;

const Content = Styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;
    min-width: 0;
    color: var(--title-color);
    overflow-wrap: anywhere;
`;

const Directory = Styled.span`
    color: var(--font-lighter);
`;

const Line = Styled.span`
    color: var(--backtrace-line-color, #d35400);
`;

const Call = Styled.span`
    color: var(--backtrace-call-color, #9b59b6);
`;



/**
 * The Backtrace Component
 * Shows a backtrace as a list of frames, with the file, the line and the call of each one
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Backtrace(props) {
    const { isHidden, className, text } = props;


    // The Backtrace as a list of frames, keeping the line as it is when it has another shape
    const frames = React.useMemo(() => {
        if (!text) {
            return [];
        }
        return text.split("\n").filter((line) => line.trim()).map((line, index) => {
            const match = line.match(FRAME);
            if (!match) {
                return { key : index, text : line };
            }
            const [ , frame, path, number, call ] = match;
            const slash = path.lastIndexOf("/") + 1;
            return {
                key       : index,
                frame     : `#${frame}`,
                directory : path.slice(0, slash),
                file      : path.slice(slash),
                line      : `:${number}`,
                call      : call,
            };
        });
    }, [ text ]);


    // Do the Render
    if (isHidden || !frames.length) {
        return <React.Fragment />;
    }
    return <Frames className={className}>
        {frames.map((item) => <Frame key={item.key}>
            <Index>{item.frame}</Index>
            <Content>
                {!!item.text && item.text}
                {!item.text && <>
                    <span>
                        <Directory>{item.directory}</Directory>
                        {item.file}
                        <Line>{item.line}</Line>
                    </span>
                    <Call>{item.call}</Call>
                </>}
            </Content>
        </Frame>)}
    </Frames>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Backtrace.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    text      : PropTypes.string,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Backtrace.defaultProps = {
    isHidden  : false,
    className : "",
};

export default Backtrace;
