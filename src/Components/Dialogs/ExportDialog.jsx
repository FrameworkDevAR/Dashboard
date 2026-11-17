import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";

// Components
import Dialog               from "../Dialog/Dialog";
import DialogHeader         from "../Dialog/DialogHeader";
import DialogBody           from "../Dialog/DialogBody";
import DialogFooter         from "../Dialog/DialogFooter";
import Icon                 from "../Common/Icon";
import Banner               from "../Common/Banner";
import LinearLoader         from "../Loader/LinearLoader";



// Constants
const FORMATS = {
    xlsx : { icon : "file-spreadsheet", color : "var(--success-color)", text : "GENERAL_EXPORT_XLSX_TEXT" },
    csv  : { icon : "file-csv",         color : "hsl(30, 95%, 48%)",    text : "GENERAL_EXPORT_CSV_TEXT"  },
};

// Styles
const Summary = Styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0 20px;
`;

const SummaryIcon = Styled(Icon).attrs(({ iconColor }) => ({ iconColor }))`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: ${(props) => props.iconColor || "var(--primary-color)"};
    background-color: color-mix(in srgb, ${(props) => props.iconColor || "var(--primary-color)"} 12%, transparent);
    border-radius: var(--border-radius);
`;

const SummaryText = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

const Total = Styled.h3`
    margin: 0;
    color: var(--black-color);
    font-family: var(--title-font);
    font-size: 18px;
    font-weight: 500;
    line-height: 1.3;
`;

const Description = Styled.p.attrs(({ isError }) => ({ isError }))`
    margin: 0;
    color: ${(props) => props.isError ? "var(--error-color)" : "var(--font-lighter)"};
    font-size: 13px;
    line-height: 1.4;
`;

const Options = Styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
`;

const Option = Styled.div.attrs(({ formatColor, isSelected, isDisabled }) => ({ formatColor, isSelected, isDisabled }))`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 12px;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-medium);
    background-color: var(--content-color);
    outline: none;
    cursor: pointer;
    transition: all 0.2s;

    &:hover, &:focus-visible {
        border-color: ${(props) => props.formatColor};
        background-color: var(--lightest-gray);
    }

    ${(props) => props.isSelected && `
        border-color: ${props.formatColor};
    `}
    ${(props) => props.isDisabled && `
        cursor: not-allowed;
        opacity: 0.5;
    `}
`;

const OptionIcon = Styled(Icon).attrs(({ formatColor }) => ({ formatColor }))`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    font-size: 20px;
    color: ${(props) => props.formatColor};
    background-color: color-mix(in srgb, ${(props) => props.formatColor} 12%, transparent);
    border-radius: var(--border-radius-small);
`;

const Radio = Styled.span.attrs(({ formatColor, isSelected }) => ({ formatColor, isSelected }))`
    position: absolute;
    top: 12px;
    right: 12px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 2px solid ${(props) => props.isSelected ? props.formatColor : "var(--border-color-light)"};
    border-radius: 50%;
    background-color: ${(props) => props.isSelected ? props.formatColor : "transparent"};
    box-shadow: inset 0 0 0 2px var(--content-color);
    transition: all 0.2s;
`;

const Name = Styled.h4`
    margin: 0;
    color: var(--black-color);
    font-size: 14px;
    font-weight: 500;
`;

const Extension = Styled.span`
    margin-left: 6px;
    color: var(--font-lighter);
    font-size: 12px;
    font-weight: 400;
`;

const Text = Styled.p`
    margin: 0;
    color: var(--font-lighter);
    font-size: 12px;
    line-height: 1.4;
`;

const Progress = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ProgressText = Styled.p`
    display: flex;
    justify-content: space-between;
    margin: 0;
    color: var(--font-lighter);
    font-size: 13px;
`;



/**
 * The Export Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ExportDialog(props) {
    const {
        open, icon, iconColor, title, message, total, error, format, isLoading,
        isLong, running, onFormat, onSubmit, onCancel, onClose,
    } = props;

    // A long Export is written in the background as a CSV, as an Excel file can not get
    // more rows once it is written
    const isRunning = Boolean(running);
    const isBlocked = isLoading || isRunning;


    // Handles the Format Select
    const handleSelect = (key) => {
        if (!isBlocked && !(isLong && key !== "csv")) {
            onFormat(key);
        }
    };

    // Handles the Key Down, as the Options are not buttons
    const handleKeyDown = (e, key) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSelect(key);
        }
    };


    // The text under the Total says what happens with the file
    let description = "GENERAL_EXPORT_DOWNLOAD";
    if (error) {
        description = error;
    } else if (isRunning) {
        description = "GENERAL_EXPORT_RUNNING";
    } else if (isLong) {
        description = "GENERAL_EXPORT_EMAIL";
    }


    // Do the Render
    return <Dialog
        open={open}
        onClose={onClose}
        isLoading={isLoading}
        dontClose={isLoading}
        width={460}
    >
        <DialogHeader message={title} icon="export" />
        <DialogBody withSpacing>
            <Summary>
                <SummaryIcon icon={icon} iconColor={iconColor} />
                <SummaryText>
                    <Total>{NLS.pluralize(message, (isRunning ? running.totalRows : total) || 0)}</Total>
                    <Description isError={!!error}>
                        {NLS.get(description)}
                    </Description>
                </SummaryText>
            </Summary>

            {isRunning ? <Progress>
                <LinearLoader percent={running.percent} />
                <ProgressText>
                    <span>{NLS.format("GENERAL_EXPORT_PROGRESS", running.doneRows, running.totalRows)}</span>
                    <b>{running.percent}%</b>
                </ProgressText>
            </Progress> : <>
                <Options role="radiogroup" aria-label={NLS.get("GENERAL_FILE_FORMAT")}>
                    {NLS.select("SELECT_EXPORT_FORMATS").map(({ key, value : name }) => {
                        const isDisabled = isBlocked || (isLong && key !== "csv");
                        return <Option
                            key={key}
                            role="radio"
                            aria-checked={format === key}
                            aria-disabled={isDisabled}
                            tabIndex={isDisabled ? -1 : 0}
                            formatColor={FORMATS[key].color}
                            isSelected={format === key}
                            isDisabled={isDisabled}
                            onClick={() => handleSelect(key)}
                            onKeyDown={(e) => handleKeyDown(e, key)}
                        >
                            <OptionIcon
                                icon={FORMATS[key].icon}
                                formatColor={FORMATS[key].color}
                            />
                            <Name>
                                {name}
                                <Extension>.{key}</Extension>
                            </Name>
                            <Text>{NLS.get(FORMATS[key].text)}</Text>
                            <Radio
                                formatColor={FORMATS[key].color}
                                isSelected={format === key}
                            />
                        </Option>;
                    })}
                </Options>
                <Banner
                    isHidden={!isLong}
                    variant="info"
                    icon="email"
                    message="GENERAL_EXPORT_LONG"
                    topSpace={16}
                />
            </>}
        </DialogBody>
        <DialogFooter
            primary={isRunning ? "GENERAL_EXPORT_CANCEL" : "GENERAL_EXPORT"}
            primaryVariant={isRunning ? "error" : undefined}
            primaryIcon={isRunning ? "close" : undefined}
            onSubmit={isRunning ? onCancel : onSubmit}
            cancel={isRunning ? "GENERAL_CLOSE" : undefined}
            isDisabled={isLoading}
        />
    </Dialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ExportDialog.propTypes = {
    open      : PropTypes.bool.isRequired,
    icon      : PropTypes.string.isRequired,
    iconColor : PropTypes.string,
    title     : PropTypes.string.isRequired,
    message   : PropTypes.string.isRequired,
    total     : PropTypes.number,
    error     : PropTypes.string,
    format    : PropTypes.string.isRequired,
    isLoading : PropTypes.bool,
    isLong    : PropTypes.bool,
    running   : PropTypes.object,
    onFormat  : PropTypes.func.isRequired,
    onSubmit  : PropTypes.func.isRequired,
    onCancel  : PropTypes.func,
    onClose   : PropTypes.func.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
ExportDialog.defaultProps = {
    total     : 0,
    error     : "",
    isLoading : false,
    isLong    : false,
    running   : null,
};

export default ExportDialog;
