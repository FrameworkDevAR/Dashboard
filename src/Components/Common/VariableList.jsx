import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Dashboard
import Card                 from "../Card/Card";
import FloatingTip          from "../Common/FloatingTip";



// Constants
const COPIED_TIME = 1200;



// Styles
const List = Styled.dl`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 6px 12px;
    margin: 8px 0 0 0;
`;

const Name = Styled.dt.attrs(({ isCopied }) => ({ isCopied }))`
    position: relative;
    justify-self: start;
    padding: 2px 8px;
    font-family: monospace;
    font-size: 13px;
    background-color: var(--lighter-gray);
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition: all 0.2s;

    :hover {
        background-color: var(--light-gray);
    }

    ${(props) => props.isCopied && `
        color: var(--success-color);
        background-color: color-mix(in srgb, var(--success-color) 12%, transparent);

        :hover {
            background-color: color-mix(in srgb, var(--success-color) 12%, transparent);
        }
    `}
`;

const Description = Styled.dd`
    margin: 0;
    font-size: 13px;
`;



/**
 * The Variable List, with the variables a text can use and what each one holds
 * @param {object} props
 * @returns {React.ReactElement}
 */
function VariableList(props) {
    const { variables } = props;

    // The Current State
    const [ copied, setCopied ] = React.useState("");

    // The Timer that clears the Copied mark
    const timerRef = React.useRef(null);


    // Clear the Timer when it closes
    React.useEffect(() => {
        return () => window.clearTimeout(timerRef.current);
    }, []);


    // Handles the Variable Copy, which marks the Variable for a moment once it is copied
    const handleCopy = async (name) => {
        try {
            await navigator.clipboard.writeText(`{{${name}}}`);
        } catch {
            return;
        }
        setCopied(name);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(""), COPIED_TIME);
    };


    // Do the Render
    if (!variables.length) {
        return <React.Fragment />;
    }
    return <Card message="GENERAL_VARIABLES">
        <List>
            {variables.map(({ name, description }) => <React.Fragment key={name}>
                <Name
                    isCopied={copied === name}
                    onClick={() => handleCopy(name)}
                >
                    {`{{${name}}}`}
                    <FloatingTip
                        isHidden={copied !== name}
                        icon="check"
                        message="GENERAL_COPIED_FEM"
                    />
                </Name>
                <Description>{description}</Description>
            </React.Fragment>)}
        </List>
    </Card>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
VariableList.propTypes = {
    variables : PropTypes.array.isRequired,
};

export default VariableList;
