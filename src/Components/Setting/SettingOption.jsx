import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import NLS                  from "../../Core/NLS";
import Setting              from "../../Hooks/Setting";

// Components
import Html                 from "../Common/Html";
import Icon                 from "../Common/Icon";
import InputField           from "../Form/InputField";
import InputItem            from "../Form/InputItem";
import CircularLoader       from "../Loader/CircularLoader";



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

const Header = Styled.div.attrs(({ noLabel }) => ({ noLabel }))`
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: ${(props) => props.noLabel ? "default" : "pointer"};
`;

const Titles = Styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 18px;
`;

const Saving = Styled(CircularLoader)`
    padding: 0;
`;

const Result = Styled(Icon).attrs(({ isError }) => ({ isError }))`
    font-size: 18px;
    color: ${(props) => props.isError ? "var(--error-color)" : "var(--success-color)"};
`;

const Title = Styled.h4.attrs(({ isRequired }) => ({ isRequired }))`
    margin: 0;
    color: var(--setting-title-color);
    font-size: var(--setting-title-size);
    font-weight: 500;

    ${(props) => props.isRequired && `
        &::after {
            content: "*";
            margin-left: 4px;
            color: var(--error-color);
        }
    `}
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

const Status = Styled.div`
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
`;

const Content = Styled.div.attrs(({ isWide, isNarrow, isHalf }) => ({ isWide, isNarrow, isHalf }))`
    display: flex;
    flex-wrap: wrap;
    gap: var(--main-gap);
    max-width: ${(props) => props.isWide ? "none" : `var(${props.isNarrow ? "--setting-narrow-width" : "--setting-width"})`};

    ${(props) => props.isHalf && `
        max-width: calc((var(--setting-width) - var(--main-gap)) / 2);
    `}

    &:has(> .inputfield > .inputfield-label) {
        margin-top: 6px;
    }

    > * {
        flex: 1 1 180px;
    }
    > .btn {
        flex: 0 0 auto;
    }
    > .inputfield-color {
        flex: 1 1 140px;
        max-width: var(--setting-narrow-width);
    }
`;



/**
 * The Setting Option
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SettingOption(props) {
    const {
        isHidden, className, isWide, isNarrow, isHalf, noLabel, isInline,
        message, description, helperText, toggle, children,
    } = props;


    const saving = React.useContext(Setting.SavingContext);


    // The References
    const containerRef = React.useRef(null);

    // The Current State
    const [ status, setStatus ] = React.useState("");


    // Shows the status when the option has the input that is being saved. The data-name of
    // the field is what is looked for, as the Buttons render no input and the Radio renames
    // its own with the key of each option, so neither has a name attribute to match
    React.useEffect(() => {
        const node = containerRef.current;
        const isMine = Boolean(saving.name && node && node.querySelector(
            `[data-name="${saving.name}"], [name="${saving.name}"]`,
        ));
        setStatus(isMine ? saving.status : "");
    }, [ saving.name, saving.status ]);


    // Returns true if any of the given Children is a required Input. An Input Item is
    // only the definition of a field inside another Input, and the required of those
    // belongs to each field and not to the Input that the Option titles
    const hasRequired = (children) => {
        return React.Children.toArray(children).some((child) => {
            if (!React.isValidElement(child) || child.type === InputItem) {
                return false;
            }
            // @ts-ignore
            return Boolean(child.props.isRequired) || hasRequired(child.props.children);
        });
    };

    // Returns true if the given Child is an Input Field, which can be wrapped in a Styled
    const isInputField = (child) => {
        return child.type === InputField || child.type?.target === InputField;
    };

    // Adds the steps to every Number Input among the Children, going into the fragments and
    // the wrappers to reach them, as a number in an Option is always changed by small amounts.
    // The Items of a Field are the fields of a Double or of a list, so a Number among them
    // gets the steps too. A Field that says what it wants is left alone
    const addSteps = (children) => {
        let changed = false;
        const result  = React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
                return child;
            }
            // @ts-ignore
            if ((isInputField(child) || child.type === InputItem) && child.props.type === "number") {
                // @ts-ignore
                if (child.props.withSteps === undefined) {
                    changed = true;
                    // @ts-ignore
                    return React.cloneElement(child, { withSteps : true });
                }
                return child;
            }
            // @ts-ignore
            const inner = child.props.children;
            if (inner) {
                const newInner = addSteps(inner);
                if (newInner !== inner) {
                    changed = true;
                    // @ts-ignore
                    return React.cloneElement(child, { children : newInner });
                }
            }
            return child;
        });
        return changed ? result : children;
    };

    // Handles the Header click, which works as the label of the option. A click that ends a
    // selection does nothing, so the title and the description can be picked and copied
    const handleClick = () => {
        const node = containerRef.current;
        if (noLabel || !node || !window.getSelection()?.isCollapsed) {
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
    const statusNode = <>
        <Saving
            isHidden={status !== Setting.Status.SAVING}
            variant="primary"
            isTiny
        />
        <Result
            isHidden={status !== Setting.Status.SUCCESS && status !== Setting.Status.ERROR}
            icon={status === Setting.Status.ERROR ? "close" : "check"}
            isError={status === Setting.Status.ERROR}
        />
    </>;

    return <Container className={className} ref={containerRef}>
        <Top className="setting-top">
            <Header noLabel={noLabel} onClick={handleClick}>
                <Titles>
                    <Title isRequired={hasRequired(children)}>
                        {NLS.get(message)}
                    </Title>
                    {!isInline && statusNode}
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
            className="setting-content"
            isWide={isWide}
            isNarrow={isNarrow}
            isHalf={isHalf}
        >
            {addSteps(children)}
        </Content>}

        {isInline && <Status className="setting-status">
            {statusNode}
        </Status>}
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
    isHalf      : PropTypes.bool,
    noLabel     : PropTypes.bool,
    isInline    : PropTypes.bool,
    message     : PropTypes.string.isRequired,
    description : PropTypes.string,
    helperText  : PropTypes.string,
    toggle      : PropTypes.any,
    children    : PropTypes.any,
};

export default SettingOption;
