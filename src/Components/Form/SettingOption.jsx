import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import Html                 from "../Common/Html";
import Icon                 from "../Common/Icon";
import CircularLoader       from "../Loader/CircularLoader";



// Constants
const MIN_SAVING_TIME  = 600;
const SHOW_RESULT_TIME = 5000;

// The Save Status of an Option
const Status = {
    SAVING  : "saving",
    SUCCESS : "success",
    ERROR   : "error",
};

// The Context with the Option that is being saved and its status
const SavingContext = React.createContext({ name : "", status : "" });

// Styles
const Container = Styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: var(--main-padding) 0;

    &:first-child {
        padding-top: 10px;
    }
    &:last-child {
        padding-bottom: 0;
    }
`;

const Top = Styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: var(--setting-width);
    gap: 16px;
`;

const Header = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
`;

const Titles = Styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Saving = Styled(CircularLoader)`
    padding: 0;
`;

const Result = Styled(Icon).attrs(({ isError }) => ({ isError }))`
    font-size: 18px;
    color: ${(props) => props.isError ? "var(--error-color)" : "var(--success-color)"};
`;

const Title = Styled.h4`
    margin: 0;
    color: var(--setting-title-color);
    font-size: var(--setting-title-size);
    font-weight: 500;
`;

const Description = Styled(Html)`
    margin: 0;
    color: var(--setting-description-color);
    font-size: var(--setting-description-size);
    line-height: 1.4;
`;

const Helper = Styled(Description)`
    color: var(--font-lighter);
    font-style: italic;
`;

const Content = Styled.div.attrs(({ isWide, isNarrow }) => ({ isWide, isNarrow }))`
    display: flex;
    flex-wrap: wrap;
    gap: var(--main-gap);
    max-width: ${(props) => props.isWide ? "none" : `var(${props.isNarrow ? "--setting-narrow-width" : "--setting-width"})`};

    > * {
        flex: 1 1 180px;
    }
    > .btn {
        flex: 0 0 auto;
    }

    .inputfield:not(:has(> .inputfield-label)) {
        --input-height: var(--setting-input-height);
    }
`;



/**
 * The Setting Option
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SettingOption(props) {
    const {
        isHidden, className, isWide, isNarrow,
        message, description, helperText, toggle, children,
    } = props;


    const saving = React.useContext(SavingContext);


    // The References
    const containerRef = React.useRef(null);

    // The Current State
    const [ status, setStatus ] = React.useState("");


    // Shows the status when the option has the input that is being saved
    React.useEffect(() => {
        const node = containerRef.current;
        const isMine = Boolean(saving.name && node && node.querySelector(`[name="${saving.name}"]`));
        setStatus(isMine ? saving.status : "");
    }, [ saving.name, saving.status ]);


    // Handles the Header click, which works as the label of the option
    const handleClick = () => {
        const node = containerRef.current;
        if (!node) {
            return;
        }
        const toggleInput = node.querySelector("input[type='checkbox']");
        if (toggleInput) {
            toggleInput.click();
            return;
        }
        const input = node.querySelector("input:not([type='radio']), textarea");
        if (input) {
            input.focus();
        }
    };


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className} ref={containerRef}>
        <Top>
            <Header onClick={handleClick}>
                <Titles>
                    <Title>{NLS.get(message)}</Title>
                    <Saving
                        isHidden={status !== Status.SAVING}
                        variant="primary"
                        isTiny
                    />
                    <Result
                        isHidden={status !== Status.SUCCESS && status !== Status.ERROR}
                        icon={status === Status.ERROR ? "close" : "check"}
                        isError={status === Status.ERROR}
                    />
                </Titles>
                {!!description && <Description
                    variant="p"
                    message={description}
                />}
                {!!helperText && <Helper
                    variant="p"
                    message={helperText}
                />}
            </Header>
            {toggle}
        </Top>

        {!!children && <Content
            isWide={isWide}
            isNarrow={isNarrow}
        >
            {children}
        </Content>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SettingOption.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    isWide      : PropTypes.bool,
    isNarrow    : PropTypes.bool,
    message     : PropTypes.string.isRequired,
    description : PropTypes.string,
    helperText  : PropTypes.string,
    toggle      : PropTypes.any,
    children    : PropTypes.any,
};

/**
 * Returns the value and the handlers used to show the save status of the Options
 * @returns {object}
 */
function useSaving() {
    // The References
    const startRef = React.useRef({});
    const timerRef = React.useRef(null);

    // The Current State
    const [ saving, setSaving ] = React.useState({ name : "", status : "" });


    // Sets the status of the given Option, when it is still the one saving
    const setStatus = (name, status) => {
        setSaving((current) => current.name === name ? { name, status } : current);
    };

    // Starts the Save of the given Option
    const startSaving = (name) => {
        Utils.clearTimeout(timerRef);
        startRef.current[name] = Date.now();
        setSaving({ name, status : Status.SAVING });
    };

    // Ends the Save of the given Option, showing the result for a bit
    const endSaving = (name, isError) => {
        // The request can complete instantly, so the loader is shown for a
        // minimum time before the result replaces it
        const elapsed = Date.now() - (startRef.current[name] ?? 0);
        delete startRef.current[name];

        window.setTimeout(() => {
            setStatus(name, isError ? Status.ERROR : Status.SUCCESS);
            Utils.setTimeout(timerRef, () => setStatus(name, ""), SHOW_RESULT_TIME);
        }, Math.max(MIN_SAVING_TIME - elapsed, 0));
    };


    return { saving, startSaving, endSaving };
}

export { SavingContext, useSaving };
export default SettingOption;
