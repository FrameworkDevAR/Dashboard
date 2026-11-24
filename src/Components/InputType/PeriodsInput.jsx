import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import Utils                from "../../Utils/Utils";

// Components
import InputField           from "../Form/InputField";
import Button               from "../Form/Button";
import InputError           from "../Input/InputError";
import IconLink             from "../Link/IconLink";



// The days of the week, as in a Date, starting on Monday
const WEEK_DAYS = [ 1, 2, 3, 4, 5, 6, 0 ];
const WORK_DAYS = [ 1, 2, 3, 4, 5 ];

// Styles
const Container = Styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: calc(var(--main-gap) * 2);
    width: 100%;
`;

const Period = Styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`;

const Title = Styled.h4`
    display: flex;
    align-items: baseline;
    width: 100%;
    gap: var(--main-gap);
    margin: 0 0 4px 0;
    color: var(--title-color);

    span {
        flex-grow: 1;
        font-size: var(--font-size-small);
        font-weight: 400;
        color: var(--font-lighter);
    }
`;

const Days = Styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
`;

const Day = Styled.button.attrs(({ isSelected }) => ({ isSelected }))`
    box-sizing: border-box;
    min-width: 46px;
    height: 32px;
    margin: 0;
    padding: 0 8px;
    font-family: var(--main-font);
    font-size: var(--font-size-small);
    font-weight: 500;
    border: 1px solid var(--input-border-color);
    border-radius: var(--input-border-radius);
    background-color: var(--content-color);
    color: var(--font-light);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: var(--input-border-hover);
    }
    &:focus-visible {
        outline: none;
        border-color: var(--input-border-focus);
        box-shadow: var(--input-border-shadow, 0 0 0 1px var(--input-border-focus));
    }

    ${(props) => props.isSelected && `
        border-color: var(--border-color-medium);
        background-color: var(--lighter-gray);
        color: var(--title-color);
        font-weight: 600;
    `}
`;

const Action = Styled.button`
    box-sizing: border-box;
    height: 32px;
    margin-left: 4px;
    padding: 0 12px;
    font-family: var(--main-font);
    font-size: var(--font-size-small);
    font-weight: 500;
    border: none;
    border-radius: var(--input-border-radius);
    background-color: transparent;
    color: var(--font-light);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: var(--lighter-gray);
        color: var(--title-color);
    }
    &:focus-visible {
        outline: none;
        box-shadow: var(--input-border-shadow, 0 0 0 1px var(--input-border-focus));
    }
`;

const Times = Styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    .inputfield {
        width: 130px;
    }
`;

const Text = Styled.p`
    margin: 0 0 0 4px;
    color: var(--font-lighter);
    font-size: var(--font-size-small);
`;

const Until = Styled(Text)`
    text-transform: lowercase;
`;

const Fields = Styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--main-gap);
    width: 100%;

    .periods-double {
        grid-column: span 2;
    }
`;

const Remove = Styled(IconLink)`
    flex-shrink: 0;
    margin-left: 8px;
`;

const Errors = Styled.div`
    width: 100%;

    .inputfield-error {
        margin-left: 0;
    }
`;



/**
 * Returns the Days to show, with the value that each one saves.
 * The days start at 0 on Sunday, or at 1 on Monday with the Sunday at 7,
 * and the Holidays go after the last day
 * @param {boolean} startMonday
 * @param {boolean} withHolidays
 * @returns {{value: number, short: string, name: string}[]}
 */
function getDays(startMonday, withHolidays) {
    const names  = NLS.get("DATE_DAY_NAMES");
    const shorts = NLS.get("DATE_DAY_MEDIUMS");
    const result = WEEK_DAYS.map((day) => ({
        value : startMonday && day === 0 ? 7 : day,
        short : shorts[day],
        name  : names[day],
    }));

    if (withHolidays) {
        const holidays = NLS.get("DATE_HOLIDAYS");
        result.push({
            value : startMonday ? 8 : 7,
            short : holidays,
            name  : holidays,
        });
    }
    return result;
}

/**
 * Returns the text of the Days of a Period
 * @param {object[]} allDays
 * @param {number[]} days
 * @returns {string}
 */
function getDaysText(allDays, days) {
    const groups = [];
    let   last   = -2;

    allDays.forEach((day, index) => {
        if (!days.includes(day.value)) {
            return;
        }
        if (index === last + 1 && index < WEEK_DAYS.length) {
            groups[groups.length - 1].push(day.name);
        } else {
            groups.push([ day.name ]);
        }
        last = index;
    });

    // Only the groups of 3 or more days are joined, as "Lunes y Martes"
    // reads better than "Lunes a Martes"
    const parts = [];
    for (const group of groups) {
        if (group.length > 2) {
            parts.push(NLS.format("GENERAL_PERIOD_DAYS_RANGE", group[0], group[group.length - 1]));
        } else {
            parts.push(...group);
        }
    }
    return NLS.join(parts);
}

/**
 * Returns the text of a Period
 * @param {object[]} allDays
 * @param {object}   period
 * @returns {string}
 */
function getPeriodText(allDays, period) {
    if (!period.days.length) {
        return "";
    }

    const daysText = getDaysText(allDays, period.days);
    if (period.from && period.to) {
        return NLS.format("GENERAL_PERIOD_DAYS_TIME", daysText, period.from, period.to);
    }
    if (period.from) {
        return NLS.format("GENERAL_PERIOD_DAYS_FROM", daysText, period.from);
    }
    if (period.to) {
        return NLS.format("GENERAL_PERIOD_DAYS_TO", daysText, period.to);
    }
    return daysText;
}



/**
 * The Periods Input Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PeriodsInput(props) {
    const {
        className, name, value, errors, addButton,
        startMonday, withHolidays, outsideLabel, onChange, children,
    } = props;

    // The extra Inputs of each Period
    const extras = Utils.getVisibleChildren(children).map((child) => child.props);


    // Parses the Periods
    const periods = React.useMemo(() => {
        let result = [];
        try {
            result = Array.isArray(value) ? value : JSON.parse(String(value));
        } catch (e) {
            result = [];
        }
        return result.map((elem) => ({
            ...elem,
            days : (elem.days || []).map((day) => Number(day)),
            from : elem.from || "",
            to   : elem.to   || "",
        }));
    }, [ JSON.stringify(value) ]);


    // Sends the new Periods
    const setPeriods = (newPeriods) => {
        onChange(name, JSON.stringify(newPeriods));
    };

    // Handles the Day click
    const handleDay = (index, day) => {
        const newPeriods = [ ...periods ];
        const days       = newPeriods[index].days;
        const position   = days.indexOf(day);

        if (position > -1) {
            days.splice(position, 1);
        } else {
            days.push(day);
            days.sort((a, b) => a - b);
        }
        setPeriods(newPeriods);
    };

    // Handles the Days of the given Period
    const handleDays = (index, days) => {
        const newPeriods = [ ...periods ];
        newPeriods[index].days = days;
        setPeriods(newPeriods);
    };

    // Handles the Time or the Extra change
    const handleField = (index, field, fieldValue) => {
        const newPeriods = [ ...periods ];
        newPeriods[index][field] = fieldValue;
        setPeriods(newPeriods);
    };

    // Handles the Add
    const handleAdd = () => {
        const newPeriod = { days : [], from : "", to : "" };
        for (const extra of extras) {
            newPeriod[extra.name] = "";
        }
        setPeriods([ ...periods, newPeriod ]);
    };

    // Handles the Remove
    const handleRemove = (index) => {
        setPeriods(periods.filter((elem, elemIndex) => elemIndex !== index));
    };


    // Returns the Error of the given Period
    const getError = (index, field) => {
        if (!errors) {
            return "";
        }
        return errors[`${name}-${index}-${field}`] || "";
    };


    // Variables
    const allDays = React.useMemo(() => getDays(startMonday, withHolidays), [ startMonday, withHolidays ]);


    // Do the Render
    return <Container className={className}>
        {!periods.length && <Text>{NLS.get("GENERAL_PERIODS_NONE")}</Text>}

        {periods.map((period, index) => <Period key={index}>
            <Title>
                {NLS.format("GENERAL_PERIOD_TITLE", index + 1)}
                <span>{getPeriodText(allDays, period)}</span>
                {outsideLabel && <IconLink
                    isHidden={periods.length < 2}
                    variant="error"
                    icon="delete"
                    tooltip="GENERAL_DELETE"
                    onClick={() => handleRemove(index)}
                    isSmall
                />}
            </Title>

            <Days>
                {allDays.map((day) => <Day
                    key={day.value}
                    type="button"
                    isSelected={period.days.includes(day.value)}
                    onClick={() => handleDay(index, day.value)}
                >
                    {day.short}
                </Day>)}

                <Action
                    type="button"
                    onClick={() => handleDays(index, period.days.length ? [] : WORK_DAYS)}
                >
                    {NLS.get(period.days.length ? "GENERAL_CLEAR" : "GENERAL_WEEK_DAYS")}
                </Action>
            </Days>

            {outsideLabel ? <Fields>
                <InputField
                    type="time"
                    name={`${name}-from-${index}`}
                    label="GENERAL_FROM"
                    value={period.from}
                    error={getError(index, "from")}
                    onChange={(inputName, time) => handleField(index, "from", time)}
                    isRequired
                    outsideLabel
                />
                <InputField
                    type="time"
                    name={`${name}-to-${index}`}
                    label="GENERAL_TO"
                    value={period.to}
                    error={getError(index, "to")}
                    onChange={(inputName, time) => handleField(index, "to", time)}
                    isRequired
                    outsideLabel
                />
                {extras.map((extra) => <InputField
                    {...extra}
                    key={extra.name}
                    className={Number(extra.columns) > 1 ? "periods-double" : extra.className}
                    name={`${name}-${extra.name}-${index}`}
                    value={period[extra.name] ?? ""}
                    error={getError(index, extra.name)}
                    onChange={(inputName, extraValue) => handleField(index, extra.name, extraValue)}
                    outsideLabel
                />)}
            </Fields> : <>
                <Times>
                    <Text>{NLS.get("GENERAL_FROM")}</Text>
                    <InputField
                        type="time"
                        name={`${name}-from-${index}`}
                        value={period.from}
                        onChange={(inputName, time) => handleField(index, "from", time)}
                    />
                    <Until>{NLS.get("GENERAL_TO")}</Until>
                    <InputField
                        type="time"
                        name={`${name}-to-${index}`}
                        value={period.to}
                        onChange={(inputName, time) => handleField(index, "to", time)}
                    />
                    <Remove
                        isHidden={periods.length < 2}
                        variant="error"
                        icon="delete"
                        tooltip="GENERAL_DELETE"
                        onClick={() => handleRemove(index)}
                        isSmall
                    />
                </Times>

                {extras.length > 0 && <Times>
                    {extras.map((extra) => <React.Fragment key={extra.name}>
                        <Text>{NLS.get(extra.label)}</Text>
                        <InputField
                            {...extra}
                            name={`${name}-${extra.name}-${index}`}
                            label=""
                            value={period[extra.name] ?? ""}
                            onChange={(inputName, extraValue) => handleField(index, extra.name, extraValue)}
                        />
                    </React.Fragment>)}
                </Times>}
            </>}

            <Errors>
                <InputError error={getError(index, "days")} />
                {!outsideLabel && <>
                    <InputError error={getError(index, "from")} />
                    <InputError error={getError(index, "to")} />
                    {extras.map((extra) => <InputError
                        key={extra.name}
                        error={getError(index, extra.name)}
                    />)}
                </>}
            </Errors>
        </Period>)}

        <Button
            variant="outlined"
            icon="add"
            message={addButton}
            onClick={handleAdd}
            isSmall
        />
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PeriodsInput.propTypes = {
    className    : PropTypes.string,
    name         : PropTypes.string.isRequired,
    value        : PropTypes.any,
    errors       : PropTypes.object,
    addButton    : PropTypes.string,
    startMonday  : PropTypes.bool,
    withHolidays : PropTypes.bool,
    outsideLabel : PropTypes.bool,
    onChange     : PropTypes.func.isRequired,
    children     : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PeriodsInput.defaultProps = {
    className    : "",
    addButton    : "GENERAL_ADD_PERIOD",
    startMonday  : false,
    withHolidays : false,
    outsideLabel : false,
};

export default PeriodsInput;
