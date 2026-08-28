import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import NLS                  from "../../Core/NLS";
import Setting              from "../../Hooks/Setting";

// Components
import Html                 from "../Common/Html";
import Icon                 from "../Common/Icon";
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
        isHidden, className, isWide, isNarrow, noLabel,
        message, description, helperText, toggle, children,
    } = props;


    const saving = React.useContext(Setting.SavingContext);


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


    // Returns true if any of the given Children is a required Input
    const hasRequired = (children) => {
        return React.Children.toArray(children).some((child) => {
            if (!React.isValidElement(child)) {
                return false;
            }
            // @ts-ignore
            return Boolean(child.props.isRequired) || hasRequired(child.props.children);
        });
    };

    // Handles the Header click, which works as the label of the option
    const handleClick = () => {
        const node = containerRef.current;
        if (noLabel || !node) {
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
            <Header noLabel={noLabel} onClick={handleClick}>
                <Titles>
                    <Title isRequired={hasRequired(children)}>
                        {NLS.get(message)}
                    </Title>
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
    noLabel     : PropTypes.bool,
    message     : PropTypes.string.isRequired,
    description : PropTypes.string,
    helperText  : PropTypes.string,
    toggle      : PropTypes.any,
    children    : PropTypes.any,
};

export default SettingOption;
