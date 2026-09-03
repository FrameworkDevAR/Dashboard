import React                from "react";
import PropTypes            from "prop-types";



/**
 * The Iframe Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Iframe(props) {
    const { isHidden, className, content, sandbox, spacing } = props;


    // The Reference
    const containerRef = React.useRef(null);

    // The Current State
    const [ height, setHeight ] = React.useState("0px");


    // Updates the Height
    const handleHeight = () => {
        const document = containerRef.current?.contentWindow?.document;
        if (!document) {
            return;
        }

        // The body can have a margin of its own, which only the document height includes
        const height = Math.max(
            document.body?.scrollHeight ?? 0,
            document.body?.offsetHeight ?? 0,
            document.documentElement?.scrollHeight ?? 0,
            document.documentElement?.offsetHeight ?? 0,
        );
        setHeight(`${height + spacing}px`);
    };

    // Handles the Iframe height. What is watched is the document inside, as it keeps growing
    // on its own while the images and the fonts load, and watching the Iframe only tells when
    // it was resized here, which leaves it at the height that the content had at first
    React.useEffect(() => {
        const iframe = containerRef.current;
        if (!iframe) {
            return undefined;
        }

        let observer = null;
        const handleLoad = () => {
            const document = iframe.contentWindow?.document;
            handleHeight();
            observer?.disconnect();
            if (!document?.documentElement) {
                return;
            }

            observer = new ResizeObserver(handleHeight);
            observer.observe(document.documentElement);
            if (document.body) {
                observer.observe(document.body);
            }
        };

        handleLoad();
        iframe.addEventListener("load", handleLoad);
        return () => {
            observer?.disconnect();
            iframe.removeEventListener("load", handleLoad);
        };
    }, [ content ]);


    // Nothing to Render
    if (isHidden || !content) {
        return <React.Fragment />;
    }

    return <iframe
        ref={containerRef}
        className={className}
        srcDoc={`<base target=&quot;_blank&quot;>${content}`}
        height={height}
        // scrolling="no"
        frameBorder="0"
        sandbox={sandbox}
    />;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Iframe.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    content   : PropTypes.string,
    sandbox   : PropTypes.string,
    spacing   : PropTypes.number,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Iframe.defaultProps = {
    isHidden  : false,
    className : "",
    content   : "",
    spacing   : 0,
};

export default Iframe;
