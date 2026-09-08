import React                from "react";
import Styled               from "styled-components";

// Core & Utils
import Store                from "../../Core/Store";
import Utils                from "../../Utils/Utils";
import SQL                  from "../../Utils/SQL";

// Components
import ViewDialog           from "../Dialogs/ViewDialog";
import Html                 from "../Common/Html";



// Styles
const Container = Styled.div`
    border: 1px solid var(--input-border-color);
    border-radius: var(--border-radius);
    overflow: auto;
`;

const Content = Styled.div`
    display: flex;
    flex-direction: column;
    padding: var(--main-gap);
    gap: var(--main-gap);
`;

const Subtitle = Styled.h4`
    margin: 0 0 calc(0px - var(--main-gap) / 2) 0;
`;


const RequestHeader = Styled.h3`
    margin: 0;
    padding: var(--main-gap) calc(var(--main-gap) * 1.5);
    display: flex;
    align-items: center;
    gap: var(--main-gap);
    color: white;
    background: #34495e;
`;

const RequestMethod = Styled.span`
    padding: 2px 8px;
    border-radius: var(--border-radius-small);
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: white;
    background: var(--success-color);
`;

const RequestUrl = Styled.p`
    margin: 0 0 var(--main-gap) 0;
    padding: var(--main-gap);
    border-left: 4px solid var(--success-color);
    border-radius: var(--border-radius);
    font-family: monospace;
    background: var(--lightest-gray);

    b {
        margin-right: 6px;
    }
`;


const ErrorHeader = Styled.h3`
    margin: 0;
    padding: var(--main-gap) calc(var(--main-gap) * 1.5);
    color: white;
    background: var(--error-color);
`;

const ErrorTitle = Styled(Html)`
    margin: 0;
    color: var(--error-color);
`;

const ErrorDump = Styled(Html)`
    margin: 0;
    padding: var(--main-gap);
    font-size: var(--font-size);
    line-height: 1.5;
    border-radius: var(--border-radius);
    background: var(--lightest-gray);
    overflow-x: auto;
`;

const ErrorLocation = Styled.p`
    margin: 0;
    padding: var(--main-gap);
    border-left: 4px solid var(--error-color);
    border-radius: var(--border-radius);
    font-family: monospace;
    background: var(--lightest-gray);

    b {
        margin-right: 6px;
    }
`;

const ErrorStackTrace = Styled.div`
    font-family: monospace;
    font-size: 13px;
    color: #666;
    line-height: 1.6;
`;

const ErrorTrace = Styled.div`
    padding: 6px 0;

    &:not(:last-child) {
        border-bottom: 1px solid var(--input-border-color);
    }
    b {
        margin-right: 6px;
    }
    span {
        color: #999;
    }
`;

const ErrorLink = Styled.a`
    color: var(--font-color);
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;



/**
 * The Error Component
 * @returns {React.ReactElement}
 */
function Error() {
    const { error } = Store.useState("core");
    const { hideError } = Store.useAction("core");


    // Parse the Message
    const { title, message, filePath, fileName, line, stackLines, dump, isSQL } = React.useMemo(() => {
        if (!error.message) {
            return { title : "", message : "", filePath : "", fileName : "", line : "", stackLines : [], dump : "", isSQL : false };
        }

        // Parse a Fatal Error
        if (error.message.includes("Fatal error") && !error.message.includes("Uncaught")) {
            const fatalMatch = error.message.match(/Fatal error:\s*(.*?) in (.*?) on line (\d+)/);

            const title    = "PHP: Fatal Error";
            const dump     = fatalMatch[1];
            const filePath = fatalMatch[2];
            const line     = fatalMatch[3];
            const segments = filePath.split("/").filter(Boolean);
            const fileName = segments.slice(3).join("/");

            return { title, message : "", filePath, fileName, line, stackLines : [], dump, isSQL : false };
        }

        // Parse a syntax error
        if (error.message.includes("syntax error")) {
            const syntaxMatch = error.message.match(/syntax error, (.*?) in (.*?) on line (\d+)/);

            const title    = "PHP: Syntax Error";
            const message  = syntaxMatch[1];
            const filePath = syntaxMatch[2];
            const line     = syntaxMatch[3];
            const segments = filePath.split("/").filter(Boolean);
            const fileName = segments.slice(3).join("/");

            return { title, message, filePath, fileName, line, stackLines : [], dump : "", isSQL : false };
        }

        // Parse an SQL error
        if (error.message.includes("MySQL Error")) {
            const title = "PHP: MySQL Error";
            const dump  = SQL.toHtml(error.message.replace("MySQL Error: ", ""));
            return { title, message : "", filePath : "", fileName : "", line : "", stackLines : [], dump, isSQL : true };
        }

        // Parse an Uncaught Error
        if (error.message.includes("Uncaught")) {
            const mainRegex = /Uncaught (.*?): (.*?) in \/(.*?):(\d+)/;
            const match     = error.message.match(mainRegex);
            const [ , errorType, message, filePath, line ] = match;

            // Refine the Title
            const title = `PHP: Uncaught Error (${errorType})`;

            // Extract the File Name
            const segments = filePath.split("/").filter(Boolean);
            const fileName = segments.slice(5).join("/");

            // Extract the Stack Trace lines
            const stackLines = [];
            const stackRegex = /#(\d+)\s+(.*?)\((\d+)\):\s+(.*)/g;
            let stackMatch;
            while ((stackMatch = stackRegex.exec(error.message)) !== null) {
                const segments = stackMatch[2].split("/").filter(Boolean);

                stackLines.push({
                    id       : stackMatch[1],
                    filePath : stackMatch[2],
                    fileName : segments.slice(5).join("/"),
                    line     : stackMatch[3],
                    call     : stackMatch[4],
                });
            }
            return { title, message, filePath, fileName, line, stackLines, dump : "", isSQL : false };
        }

        // Default Parsing (for dumps and other errors)
        const title = "PHP: Dump";
        const dump  = error.message;
        return { title, message : "", filePath : "", fileName : "", line : "", stackLines : [], dump, isSQL : false };
    }, [ error.message ]);


    // Variables
    const hasMessage  = Boolean(message);
    const hasFilePath = Boolean(filePath);
    const hasStack    = stackLines.length > 0;
    const hasDump     = Boolean(dump);
    const dumpVariant = isSQL ? "div" : "pre";


    // Do the Render
    return <ViewDialog
        open={error.open}
        icon="error"
        title="GENERAL_ONE_ERROR"
        onClose={hideError}
        zIndex={9999}
        withSpacing
        isWide
    >
        <Container>
            <RequestHeader>
                <RequestMethod>{error.method}</RequestMethod>
                Request Context
            </RequestHeader>
            <Content>
                <Subtitle>Endpoint URL</Subtitle>
                <RequestUrl>{error.url}</RequestUrl>

                <Subtitle>Payload / Parameters</Subtitle>
                <ErrorDump
                    variant="pre"
                    content={Utils.jsonToHtml(error.payload)}
                />
            </Content>
        </Container>

        <Container>
            <ErrorHeader>{title}</ErrorHeader>
            <Content>
                {hasMessage && <ErrorTitle
                    variant="h3"
                    content={message}
                />}

                {hasDump && <ErrorDump
                    variant={dumpVariant}
                    content={dump}
                />}

                {hasFilePath && <ErrorLocation>
                    <b>IN</b>
                    <ErrorLink href={`vscode://file/${filePath}:${line}`}>
                        /{fileName}:{line}
                    </ErrorLink>
                </ErrorLocation>}

                {hasStack && <>
                    <Subtitle>Stack Trace</Subtitle>
                    <ErrorStackTrace>
                        {stackLines.map((step) => <ErrorTrace key={step.id}>
                            <b>#{step.id}</b>
                            <Html
                                variant="span"
                                content={step.call}
                            /><br/>
                            <ErrorLink href={`vscode://file${step.filePath}:${step.line}`}>
                                /{step.fileName}:{step.line}
                            </ErrorLink>
                        </ErrorTrace>)}
                    </ErrorStackTrace>
                </>}
            </Content>
        </Container>
    </ViewDialog>;
}

export default Error;
