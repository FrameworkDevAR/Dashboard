import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import DateTime             from "../../Utils/DateTime";
import Utils                from "../../Utils/Utils";

// Components
import Dialog               from "../Dialog/Dialog";
import DialogHeader         from "../Dialog/DialogHeader";
import DialogBody           from "../Dialog/DialogBody";
import DialogFooter         from "../Dialog/DialogFooter";
import Card                 from "../Card/Card";
import Icon                 from "../Common/Icon";
import Banner               from "../Common/Banner";
import LinearLoader         from "../Loader/LinearLoader";



// Constants
const FORMATS = {
    xlsx : { icon : "file-spreadsheet", color : "var(--success-color)", text : "GENERAL_EXPORT_XLSX_TEXT", file : "GENERAL_EXPORT_XLSX_FILE" },
    csv  : { icon : "file-csv",         color : "hsl(30, 95%, 48%)",    text : "GENERAL_EXPORT_CSV_TEXT",  file : "GENERAL_EXPORT_CSV_FILE"  },
};

const RUNNING_NOTES = [
    { icon : "close",        message : "GENERAL_EXPORT_RUNNING_CLOSE"  },
    { icon : "impexp",       message : "GENERAL_EXPORT_RUNNING_FOLLOW" },
    { icon : "notification", message : "GENERAL_EXPORT_RUNNING_NOTIFY" },
];

const IMPORT_NOTES = [
    { icon : "close",        message : "GENERAL_IMPORT_RUNNING_CLOSE"  },
    { icon : "impexp",       message : "GENERAL_EXPORT_RUNNING_FOLLOW" },
    { icon : "notification", message : "GENERAL_IMPORT_RUNNING_NOTIFY" },
];

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

    b {
        font-weight: 600;
        color: var(--title-color);
    }
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

    b {
        font-weight: 600;
        color: var(--title-color);
    }
`;

const File = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--border-color-light);
    border-radius: var(--border-radius-medium);
`;

const FileHeader = Styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const FileName = Styled.h4`
    margin: 0;
    color: var(--black-color);
    font-size: 15px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const FileDate = Styled.span`
    margin-left: 8px;
    font-size: 13px;
    font-weight: 600;
`;

const Details = Styled.dl`
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 16px;
    margin: 0;
    padding-top: 12px;
    border-top: 1px solid var(--border-color-light);
    font-size: 13px;

    dt {
        color: var(--font-lighter);
    }
    dd {
        margin: 0;
        color: var(--title-color);
        font-weight: 600;
        text-align: right;
    }
`;

const ModuleLink = Styled.button`
    padding: 0;
    color: var(--primary-color);
    font: inherit;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const Note = Styled.p`
    margin: 12px 0 0;
    color: var(--font-lighter);
    font-size: 12px;
    line-height: 1.4;
`;

const FileText = Styled.div`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

const Progress = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const NotesCard = Styled(Card)`
    margin-top: 16px;
`;

const RunningNotes = Styled.ul`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const RunningNote = Styled.li`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: var(--font-color);
    font-size: 13px;
    line-height: 1.4;

    .icon {
        flex-shrink: 0;
        margin-top: 1px;
        font-size: 16px;
        color: var(--primary-color);
    }
`;

const ProgressText = Styled.p`
    display: flex;
    justify-content: space-between;
    margin: 0;
    color: var(--font-lighter);
    font-size: 13px;
`;



/**
 * Returns the text of the given amount of rows, with the separator of the thousands
 * @param {string} message
 * @param {number} amount
 * @returns {string}
 */
function pluralizeRows(message, amount) {
    const suffix = Number(amount) === 1 ? "_SINGULAR" : "_PLURAL";
    return NLS.format(message + suffix, Utils.formatNumber(amount));
}

/**
 * Returns the estimated time left of a running Export
 * @param {number} seconds
 * @returns {string}
 */
function getTimeLeft(seconds) {
    if (!seconds) {
        return "";
    }
    if (seconds < 60) {
        return NLS.get("GENERAL_EXPORT_LEFT_SECONDS");
    }
    return NLS.pluralize("GENERAL_EXPORT_LEFT_MINUTES", Math.ceil(seconds / 60));
}



/**
 * The Export Dialog
 * @param {object} props
 * @returns {React.ReactElement}
 */
function ExportDialog(props) {
    const {
        open, icon, iconColor, title, message, total, error, format, isLoading, isLong, isImport,
        running, ready, module, onFormat, onSubmit, onCancel, onDownload, onDelete, onModule, onClose,
    } = props;

    // A long Export is written in the background as a CSV, as an Excel file can not get
    // more rows once it is written
    const isRunning = Boolean(running);
    const isReady   = Boolean(ready);
    const isBlocked = isLoading || isRunning || isReady;

    let rows = total;
    if (isRunning) {
        rows = running.totalRows;
    } else if (isReady) {
        rows = ready.totalRows;
    }


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
    let description = NLS.get("GENERAL_EXPORT_DOWNLOAD");
    if (error) {
        description = NLS.get(error);
    } else if (isRunning && isImport) {
        description = NLS.get("GENERAL_IMPORT_RUNNING");
    } else if (isRunning) {
        description = NLS.get("GENERAL_EXPORT_RUNNING");
    } else if (isLong) {
        description = NLS.get("GENERAL_EXPORT_EMAIL");
    }


    // The Header says what the Export is once it started
    let header     = title;
    let headerIcon = isImport ? "import" : "export";
    if (isRunning) {
        header = isImport ? "GENERAL_IMPORT_RUNNING_TITLE" : "GENERAL_EXPORT_RUNNING_TITLE";
    } else if (isReady && isImport) {
        header = "GENERAL_IMPORT_READY_TITLE";
    } else if (isReady) {
        header     = "GENERAL_EXPORT_READY_TITLE";
        headerIcon = "download";
    }

    // An Import has no file to download, only the rows that it could not import
    const hasWarnings = isReady && isImport && ready.warnings > 0;
    const fileFormat  = FORMATS[isReady && ready.fileName.endsWith(".xlsx") ? "xlsx" : "csv"];

    // The Footer starts the Export, cancels a running one or downloads a ready one
    let primary        = "GENERAL_EXPORT";
    let primaryVariant = undefined;
    let primaryIcon    = undefined;
    let onPrimary      = onSubmit;
    let cancel         = undefined;
    let secondary      = undefined;
    if (isRunning) {
        primary        = isImport ? "GENERAL_IMPORT_CANCEL" : "GENERAL_EXPORT_CANCEL";
        primaryVariant = "error";
        primaryIcon    = "close";
        onPrimary      = onCancel;
        cancel         = "GENERAL_CLOSE";
    } else if (isReady) {
        primary        = "GENERAL_DOWNLOAD";
        primaryIcon    = "download";
        onPrimary      = onDownload;
        cancel         = "GENERAL_CLOSE";
        secondary      = onDelete ? "GENERAL_DELETE" : undefined;
        if (isImport) {
            primary = hasWarnings ? "GENERAL_IMPORT_DOWNLOAD_WARNINGS" : undefined;
        }
    }


    // Do the Render
    return <Dialog
        open={open}
        onClose={onClose}
        isLoading={isLoading}
        dontClose={isLoading}
        width={460}
    >
        <DialogHeader message={header} icon={headerIcon} />
        <DialogBody withSpacing>
            {!isReady && <Summary>
                <SummaryIcon icon={icon} iconColor={iconColor} />
                <SummaryText>
                    <Total>{pluralizeRows(message, rows || 0)}</Total>
                    <Description isError={!!error}>
                        {description}
                    </Description>
                </SummaryText>
            </Summary>}

            {isReady && isImport && <>
                <File>
                    <FileHeader>
                        <SummaryIcon icon={fileFormat.icon} iconColor={fileFormat.color} />
                        <FileText>
                            <FileName>
                                {ready.name || ready.fileName}
                                {!!ready.dateText && <FileDate>{ready.dateText}</FileDate>}
                            </FileName>
                            <Text>{NLS.get(fileFormat.file)}</Text>
                        </FileText>
                    </FileHeader>
                    <Details>
                        {!!module && <>
                            <dt>{NLS.get("GENERAL_MODULE")}</dt>
                            <dd>
                                <ModuleLink type="button" onClick={onModule}>
                                    {NLS.get(module)}
                                </ModuleLink>
                            </dd>
                        </>}
                        <dt>{NLS.get("GENERAL_IMPORT_FILE_ROWS")}</dt>
                        <dd>{pluralizeRows(message, rows || 0)}</dd>
                        <dt>{NLS.get("GENERAL_IMPORT_IMPORTED_LABEL")}</dt>
                        <dd>{pluralizeRows(message, ready.importedRows || 0)}</dd>
                        {hasWarnings && <>
                            <dt>{NLS.get("GENERAL_IMPORT_WARNINGS_LABEL")}</dt>
                            <dd>{pluralizeRows(message, ready.warnings)}</dd>
                        </>}
                        <dt>{NLS.get("GENERAL_IMPORT_FINISHED")}</dt>
                        <dd>{DateTime.formatDate(ready.readyTime, "dashesHour")}</dd>
                    </Details>
                </File>
                <Note>
                    {hasWarnings ? NLS.format("GENERAL_IMPORT_DONE_WARNINGS", DateTime.formatDate(ready.expirationTime, "dashesHour")) : NLS.get("GENERAL_IMPORT_DONE")}
                </Note>
            </>}

            {isReady && !isImport && <>
                <File>
                    <FileHeader>
                        <SummaryIcon icon={FORMATS.csv.icon} iconColor={FORMATS.csv.color} />
                        <FileText>
                            <FileName>
                                {ready.name || ready.fileName}
                                {!!ready.dateText && <FileDate>{ready.dateText}</FileDate>}
                            </FileName>
                            <Text>{NLS.get("GENERAL_EXPORT_CSV_FILE")} · {Utils.formatSize(ready.fileSize)}</Text>
                        </FileText>
                    </FileHeader>
                    <Details>
                        {!!module && <>
                            <dt>{NLS.get("GENERAL_MODULE")}</dt>
                            <dd>
                                <ModuleLink type="button" onClick={onModule}>
                                    {NLS.get(module)}
                                </ModuleLink>
                            </dd>
                        </>}
                        <dt>{NLS.get("GENERAL_EXPORT_AMOUNT")}</dt>
                        <dd>{pluralizeRows(message, rows || 0)}</dd>
                        <dt>{NLS.get("GENERAL_EXPORT_FINISHED")}</dt>
                        <dd>{DateTime.formatDate(ready.readyTime, "dashesHour")}</dd>
                        <dt>{NLS.get("GENERAL_EXPORT_AVAILABLE")}</dt>
                        <dd>{DateTime.formatDate(ready.expirationTime, "dashesHour")}</dd>
                    </Details>
                </File>
                <Note>{NLS.get("GENERAL_EXPORT_DONE")}</Note>
            </>}

            {isRunning && <Progress>
                <LinearLoader percent={running.percent} />
                <ProgressText>
                    <span>
                        {NLS.format("GENERAL_EXPORT_PROGRESS", Utils.formatNumber(running.doneRows), Utils.formatNumber(running.totalRows))}
                        {!!running.secondsLeft && ` · ${getTimeLeft(running.secondsLeft)}`}
                    </span>
                    <b>{running.percent}%</b>
                </ProgressText>
                <NotesCard message="GENERAL_EXPORT_MEANTIME" withBackground>
                    <RunningNotes>
                        {(isImport ? IMPORT_NOTES : RUNNING_NOTES).map((note) => <RunningNote key={note.message}>
                            <Icon icon={note.icon} />
                            {NLS.get(note.message)}
                        </RunningNote>)}
                    </RunningNotes>
                </NotesCard>
            </Progress>}

            {!isRunning && !isReady && <>
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
            primary={primary}
            primaryVariant={primaryVariant}
            primaryIcon={primaryIcon}
            onSubmit={onPrimary}
            cancel={cancel}
            secondary={secondary}
            secondaryVariant="outlined-error"
            secondaryIcon="delete"
            onSecondary={onDelete}
            isDisabled={isLoading}
        />
    </Dialog>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
ExportDialog.propTypes = {
    open       : PropTypes.bool.isRequired,
    icon       : PropTypes.string.isRequired,
    iconColor  : PropTypes.string,
    title      : PropTypes.string.isRequired,
    message    : PropTypes.string.isRequired,
    total      : PropTypes.number,
    error      : PropTypes.string,
    format     : PropTypes.string.isRequired,
    isLoading  : PropTypes.bool,
    isLong     : PropTypes.bool,
    isImport   : PropTypes.bool,
    running    : PropTypes.object,
    ready      : PropTypes.object,
    module     : PropTypes.string,
    onFormat   : PropTypes.func.isRequired,
    onSubmit   : PropTypes.func.isRequired,
    onCancel   : PropTypes.func,
    onDownload : PropTypes.func,
    onDelete   : PropTypes.func,
    onModule   : PropTypes.func,
    onClose    : PropTypes.func.isRequired,
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
    isImport  : false,
    running   : null,
    ready     : null,
    module    : "",
};

export default ExportDialog;
