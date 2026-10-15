import NLS          from "../Core/NLS";
import Utils        from "../Utils/Utils";



/** The times in seconds */
const MINUTE_SECS = 60;
const HOUR_SECS   = 3600;
const DAY_SECS    = 24 * 3600;
const WEEK_SECS   = 7 * 24 * 3600;

/** The formats used in toString */
const FORMATS = {
    time           : "DATE_TIME",
    timeSeconds    : "DATE_TIME_SECONDS",
    dayTime        : "DATE_DAY_TIME",
    dayMonth       : "DATE_DAY_MONTH",
    dayMonthShort  : "DATE_DAY_MONTH_SHORT",
    dayMonthMedium : "DATE_DAY_MONTH_MEDIUM",
    dayMonthYear   : "DATE_DAY_MONTH_YEAR",
    dayYearShort   : "DATE_DAY_YEAR_SHORT",
    dayYearMedium  : "DATE_DAY_YEAR_MEDIUM",
    monthYear      : "DATE_MONTH_YEAR",
    reduced        : "DATE_REDUCED",
    reducedShort   : "DATE_REDUCED_SHORT",
    complete       : "DATE_COMPLETE",
    completeShort  : "DATE_COMPLETE_SHORT",
    completeMonth  : "DATE_COMPLETE_MONTH",
    dashes         : "DATE_DASHES",
    dashesReverse  : "DATE_DASHES_REVERSE",
    dashesTime     : "DATE_DASHES_TIME",
    dashesHour     : "DATE_DASHES_HOUR",
    dashesSeconds  : "DATE_DASHES_SECONDS",
    slashes        : "DATE_SLASHES",
    slashesDay     : "DATE_SLASHES_DAY",
    sortable       : "DATE_SORTABLE",

    minAgo         : "DATE_MIN_AGO",
    minsAgo        : "DATE_MINS_AGO",
    hourAgo        : "DATE_HOUR_AGO",
    hoursAgo       : "DATE_HOURS_AGO",
    dayAgo         : "DATE_DAY_AGO",
    daysAgo        : "DATE_DAYS_AGO",
    inMin          : "DATE_IN_MIN",
    inMins         : "DATE_IN_MINS",
    inHour         : "DATE_IN_HOUR",
    inHours        : "DATE_IN_HOURS",
    inDay          : "DATE_IN_DAY",
    inDays         : "DATE_IN_DAYS",
    tomorrow       : "DATE_TOMORROW_AT",
    today          : "DATE_TODAY_AT",
    yesterday      : "DATE_YESTERDAY_AT",
    thisWeek       : "DATE_THIS_WEEK_AT",
    thisYear       : "DATE_THIS_YEAR_AT",
    otherYear      : "DATE_OTHER_YEAR_AT",
};



/**
 * The DateTime class, a Date object with lots of added functions
 */
class DateTime {

    /**
     * The DateTime constructor
     * @param {(number|string|Date)=} date
     * @param {boolean=}              inMiliSeconds
     */
    constructor(date, inMiliSeconds) {
        if (date && !(date instanceof Date)) {
            const number = parseInt(String(date), 10);
            this.date = new Date(number * (!inMiliSeconds ? 1000 : 1));
        } else if (date) {
            this.date = new Date(date);
        } else {
            this.date = new Date();
        }
    }

    /**
     * Returns a Copy of DateTime
     * @returns {DateTime}
     */
    copy() {
        return new DateTime(this.date);
    }

    /**
     * Creates a new DateTime with the given data and the current saved date
     * @param {number=} year
     * @param {number=} month
     * @param {number=} day
     * @param {number=} hours
     * @param {number=} mins
     * @param {number=} secs
     * @param {number=} milis
     * @returns {DateTime}
     */
    createDay(year, month, day, hours, mins, secs, milis) {
        return new DateTime(this.toDate(year, month, day, hours, mins, secs, milis));
    }


    /**
     * Returns the full year of the saved date
     * @returns {number}
     */
    get year() {
        return this.date.getFullYear();
    }

    /**
     * Returns the month number of the saved date starting on 1
     * @returns {number}
     */
    get month() {
        return this.date.getMonth() + 1;
    }

    /**
     * Returns the day number of the saved date
     * @returns {number}
     */
    get day() {
        return this.date.getDate();
    }

    /**
     * Returns the week day number of the saved date
     * @returns {number}
     */
    get weekDay() {
        return this.date.getDay();
    }

    /**
     * Returns the hours of the saved date
     * @returns {number}
     */
    get hours() {
        return this.date.getHours();
    }

    /**
     * Returns the hours and minutes number of the saved date as hours
     * @returns {number}
     */
    get asHours() {
        return this.hours + this.minutes / 60;
    }

    /**
     * Returns the minutes of the saved date
     * @returns {number}
     */
    get minutes() {
        return this.date.getMinutes();
    }

    /**
     * Returns the seconds of the saved date
     * @returns {number}
     */
    get seconds() {
        return this.date.getSeconds();
    }

    /**
     * Returns the time in seconds
     * @returns {number}
     */
    get time() {
        return Math.round(this.date.getTime() / 1000);
    }



    /**
     * Returns a new Date using the current saved date
     * @param {number=} year
     * @param {number=} month
     * @param {number=} day
     * @param {number=} hours
     * @param {number=} mins
     * @param {number=} secs
     * @param {number=} milis
     * @returns {Date}
     */
    toDate(year, month, day, hours, mins, secs, milis) {
        return new Date(
            (year  || year  === 0) ? year      : this.year,
            (month || month === 0) ? month - 1 : this.month - 1,
            (day   || day   === 0) ? day       : this.day,
            (hours || hours === 0) ? hours     : this.hours,
            (mins  || mins  === 0) ? mins      : this.minutes,
            (secs  || secs  === 0) ? secs      : this.seconds,
            (milis || milis === 0) ? milis     : this.date.getMilliseconds(),
        );
    }

    /**
     * Returns a new DateTime with the same day, but at 0 hours, 0 minutes, 0 seconds and 0 mili seconds
     * @param {number=} hours
     * @returns {DateTime}
     */
    toDayStart(hours) {
        return this.createDay(undefined, undefined, undefined, hours !== undefined ? hours : 0, 0, 0, 0);
    }

    /**
     * Returns a new DateTime with the same day, but at 23 hours, 59 minutes, 59 seconds and 0 mili seconds
     * @returns {DateTime}
     */
    toDayEnd() {
        return this.createDay(undefined, undefined, undefined, 23, 59, 29, 0);
    }

    /**
     * Returns a new DateTime at the start of the week, depending on the week day given
     * @param {number=} weekDay
     * @returns {DateTime}
     */
    toWeekStart(weekDay = 0) {
        let thisDate = this.moveDay(0);
        let counter  = 0;
        while (thisDate.weekDay !== Number(weekDay) && counter < 7) {
            thisDate = thisDate.moveDay(-1);
            counter += 1;
        }
        return thisDate;
    }

    /**
     * Returns a new DateTime at the end of the week, depending on the week day given
     * @param {number=} weekDay
     * @returns {DateTime}
     */
    toWeekEnd(weekDay) {
        return this.moveDay(7).toWeekStart(weekDay).moveDay(-1);
    }

    /**
     * Returns a new DateTime at the start of the month
     * @returns {DateTime}
     */
    toMonthStart() {
        return this.changeDay(1);
    }

    /**
     * Returns a new DateTime at the end of the month
     * @returns {DateTime}
     */
    toMonthEnd() {
        return this.changeDay(this.getMonthDays());
    }

    /**
     * Returns a new DateTime at the start of the year
     * @returns {DateTime}
     */
    toYearStart() {
        return this.changeMonth(1, 1);
    }

    /**
     * Returns a new DateTime at the end of the year
     * @returns {DateTime}
     */
    toYearEnd() {
        return this.changeMonth(12, getMonthDays(12, this.year));
    }



    /**
     * Returns the date as a string depending on the given format
     * @param {string} type
     * @returns {string}
     */
    toString(type) {
        if (FORMATS[type]) {
            return this.formatString(NLS.get(FORMATS[type]));
        }
        return "";
    }

    /**
     * Formats the String
     * @param {string} format
     * @returns {string}
     */
    formatString(format) {
        return format
            .replace("{d}",  this.day.toString())
            .replace("{d0}", parseTime(this.day))
            .replace("{dn}", this.getDayName())
            .replace("{d3}", this.getDayName(3))
            .replace("{m}",  this.month.toString())
            .replace("{m0}", parseTime(this.month))
            .replace("{mn}", this.getMonthName())
            .replace("{m3}", this.getMonthName(3))
            .replace("{y}",  this.year.toString())
            .replace("{h}",  parseTime(this.hours))
            .replace("{i}",  parseTime(this.minutes))
            .replace("{s}",  parseTime(this.seconds));
    }

    /**
     * Returns the date as a string in the format "YYYY-MM-DD"
     * @returns {string}
     */
    toInputString() {
        return `${this.year}-${parseTime(this.month)}-${parseTime(this.day)}`;
    }

    /**
     * Returns the date as a string choosing the format depending on the date
     * @param {boolean=} withSeconds
     * @returns {string}
     */
    toDateString(withSeconds = false) {
        let type;
        if (this.isToday) {
            type = "today";
        } else if (this.isYesterday) {
            type = "yesterday";
        } else if (this.isTomorrow) {
            type = "tomorrow";
        } else if (this.isThisWeek) {
            type = "thisWeek";
        } else if (this.isThisYear) {
            type = "thisYear";
        } else {
            type = "otherYear";
        }

        let format = NLS.get(FORMATS[type]);
        if (withSeconds) {
            format += ":{s}";
        }
        return this.formatString(format);
    }

    /**
     * Returns the date as a string choosing the format depending on the date
     * @returns {string}
     */
    toTimeString() {
        const today = new DateTime().time;
        const time  = this.time;
        const diff1 = time - today;
        const diff2 = today - time;
        const diff  = diff1 > 0 ? diff1 : diff2;
        const dMin  = Math.round(diff / MINUTE_SECS);
        const dHour = Math.round(diff / HOUR_SECS);
        const dDay  = Math.round(diff / DAY_SECS);
        let   format;

        // In the Future
        if (diff1 > 0) {
            if (diff1 < HOUR_SECS * 2) {
                format = dMin === 1  ? "inMin"  : "inMins";
            } else if (diff1 < DAY_SECS * 2) {
                format = dHour === 1 ? "inHour" : "inHours";
            } else if (diff1 < DAY_SECS * 3) {
                format = dDay === 1  ? "inDay"  : "inDays";
            }
        // In the Past
        } else if (diff2 > 0) {
            if (diff2 < HOUR_SECS * 2) {
                format = dMin === 1  ? "minAgo"  : "minsAgo";
            } else if (diff2 < DAY_SECS * 2) {
                format = dHour === 1 ? "hourAgo" : "hoursAgo";
            } else if (diff2 < DAY_SECS * 3) {
                format = dDay === 1  ? "dayAgo"  : "daysAgo";
            }
        }

        // Show the result in mins or hours since the time
        if (format) {
            return NLS.get(FORMATS[format])
                .replace("{i}", dMin.toString())
                .replace("{h}", dHour.toString())
                .replace("{d}", dDay.toString());
        }

        // Show the result as a date and time
        return this.toDateString();
    }

    /**
     * Returns the date as a string choosing the format depending on the date
     * @returns {string}
     */
    toLiveString() {
        const today = new DateTime().time;
        const time  = this.time;
        const diff  = Math.abs(time - today);
        const dHour = Math.floor(diff / HOUR_SECS);
        const dMin  = Math.floor(diff / MINUTE_SECS);
        const dSec  = diff % 60;
        let   format;

        if (diff < HOUR_SECS) {
            format = "{i}:{s}";
        } else if (diff < DAY_SECS) {
            format = "{h}:{i} h";
        }

        // Show the result in mins or hours since the time
        if (format) {
            return format
                .replace("{s}", parseTime(dSec))
                .replace("{i}", dMin.toString())
                .replace("{h}", dHour.toString());
        }

        // Show the result as a short date and time
        return this.toShortString();
    }

    /**
     * Gives a string format to the Date depending on date
     * @returns {string}
     */
    toLongString() {
        if (this.isToday) {
            return this.toString("today");
        }
        if (this.isThisYear) {
            return this.toString("thisYear");
        }
        return this.toString("otherYear");
    }

    /**
     * Gives a string format to the Date depending on date
     * @returns {string}
     */
    toMediumString() {
        if (this.isThisYear) {
            return this.toString("dayMonthMedium");
        }
        return this.toString("dayYearMedium");
    }

    /**
     * Gives a string format to the Date depending on date
     * @param {boolean=} withToday
     * @returns {string}
     */
    toShortString(withToday = true) {
        if (withToday && this.isToday) {
            return this.toString("time");
        }
        if (this.isThisYear) {
            return this.toString("dayMonthShort");
        }
        return this.toString("dayYearShort");
    }

    /**
     * Returns the name of the day of the saved date or Today/Yesterday/Tomorrow
     * @returns {string}
     */
    toDayString() {
        let result;
        if (this.isYesterday) {
            result = NLS.get("DATE_YESTERDAY");
        } else if (this.isToday) {
            result = NLS.get("DATE_TODAY");
        } else if (this.isTomorrow) {
            result = NLS.get("DATE_TOMORROW");
        } else {
            result = this.toString("reduced");
        }
        return result;
    }

    /**
     * Knowing that the current day is at the start of the week, it returns a string that represents it
     * @returns {string}
     */
    toWeekString() {
        const thisWeek = new DateTime().toWeekStart(this.weekDay);
        const lastWeek = thisWeek.moveDay(-7);
        const nextWeek = thisWeek.moveDay(+7);

        if (this.isEqualDayTo(lastWeek)) {
            return NLS.get("DATE_LAST_WEEK");
        }
        if (this.isEqualDayTo(thisWeek)) {
            return NLS.get("DATE_THIS_WEEK");
        }
        if (this.isEqualDayTo(nextWeek)) {
            return NLS.get("DATE_NEXT_WEEK");
        }
        return NLS.format(
            "DATE_PARSED_WEEK",
            this.toString("slashesDay"),
            this.moveDay(6).toString("slashesDay"),
        );
    }

    /**
     * Parses the duration between the current DateTime and the given one
     * @param {DateTime} otherDate
     * @returns {string}
     */
    parseDuration(otherDate) {
        return NLS.format(
            "DATE_DURATION",
            this.toString("time"),
            otherDate.toString("time"),
        );
    }



    /**
     * Returns a color depending on the amount of expired hours or minutes
     * @param {number} greenMinutes
     * @param {number} yellowMinutes
     * @returns {string}
     */
    getExpiredColor(greenMinutes, yellowMinutes) {
        const minutes = this.getMinutesDiff();
        if (minutes < greenMinutes) {
            return "green";
        }
        if (minutes < yellowMinutes) {
            return "yellow";
        }
        return "red";
    }

    /**
     * Returns a text class depending on the amount of expired hours or minutes
     * @param {number} greenTime
     * @param {number} yellowTime
     * @returns {string}
     */
    getExpiredClass(greenTime, yellowTime) {
        const color = this.getExpiredColor(greenTime, yellowTime);
        return `text-${color}`;
    }



    /**
     * Returns true if the day is Saturday or Sunday
     * @returns {boolean}
     */
    get isWeekend() {
        return this.weekDay === 0 || this.weekDay === 6;
    }

    /**
     * Returns true if the saved date is the same as today date
     * @returns {boolean}
     */
    get isToday() {
        return this.isEqualDayTo(new DateTime());
    }

    /**
     * Returns true if the saved date is the same as yesterday date
     * @returns {boolean}
     */
    get isYesterday() {
        return this.isNextDay(-1);
    }

    /**
     * Returns true if the saved date is the same as tomorrows date
     * @returns {boolean}
     */
    get isTomorrow() {
        return this.isNextDay(1);
    }

    /**
     * Returns true if the Current Day is during this week
     * @returns {boolean}
     */
    get isThisWeek() {
        return this.isEqualWeekTo(new DateTime().toDayStart());
    }

    /**
     * Returns true if the year of the saved date is the same as the current year
     * @returns {boolean}
     */
    get isThisYear() {
        return this.year === new DateTime().year;
    }



    /**
     * Returns true if the time of the saved date is the same as the time of the given day
     * @param {DateTime} otherDate
     * @returns {boolean}
     */
    isEqualTimeTo(otherDate) {
        return this.time === otherDate.time;
    }

    /**
     * Returns true if the year, the month and the date are the same between the saved and the given date
     * @param {DateTime} otherDate
     * @returns {boolean}
     */
    isEqualDayTo(otherDate) {
        return (
            this.year  === otherDate.year  &&
            this.month === otherDate.month &&
            this.day   === otherDate.day
        );
    }

    /**
     * Returns true if the week is the same between the saved and the given date
     * @param {DateTime} otherDate
     * @returns {boolean}
     */
    isEqualWeekTo(otherDate) {
        return this.getWeek() === otherDate.getWeek();
    }

    /**
     * Returns true if the year and the month are the same between the saved and the given date
     * @param {DateTime} otherDate
     * @returns {boolean}
     */
    isEqualMonthTo(otherDate) {
        return this.year === otherDate.year && this.month === otherDate.month;
    }

    /**
     * Returns true if the year is the same between the saved and the given date
     * @param {DateTime} otherDate
     * @returns {boolean}
     */
    isEqualYearTo(otherDate) {
        return this.year === otherDate.year;
    }

    /**
     * Returns true if the given day is greater than the Current Day
     * @param {DateTime} otherDate
     * @returns {boolean}
     */
    isGreaterThan(otherDate) {
        return this.time > otherDate.time;
    }

    /**
     * Returns true if the Current Day is in the Past
     * @param {number=} hours
     * @returns {boolean}
     */
    isPastDay(hours = 0) {
        return this.time < new DateTime().time - (hours * 3600);
    }

    /**
     * Returns true if the Current Day is in the Future
     * @param {number=} hours
     * @returns {boolean}
     */
    isFutureDay(hours = 0) {
        return this.time > new DateTime().time + (hours * 3600);
    }

    /**
     * Returns true if the Current Day is the same as the same date plus the given amount of days
     * @param {number} amount
     * @returns {boolean}
     */
    isNextDay(amount) {
        const otherDate = new DateTime().moveDay(amount);
        return this.isEqualDayTo(otherDate);
    }

    /**
     * Returns max day between the Current and the given one
     * @param {DateTime} otherDate
     * @returns {DateTime}
     */
    max(otherDate) {
        return this.isGreaterThan(otherDate) ? this : otherDate;
    }

    /**
     * Returns min day between the saved and the given one
     * @param {DateTime} otherDate
     * @returns {DateTime}
     */
    min(otherDate) {
        return this.isGreaterThan(otherDate) ? otherDate : this;
    }



    /**
     * Changes the day to the given one
     * @param {DateTime} otherDate
     * @returns {DateTime}
     */
    changeToDay(otherDate) {
        return this.createDay(otherDate.year, otherDate.month, otherDate.day);
    }

    /**
     * Creates a new DateTime as amount of years ahead the saved date
     * @param {number}  amount
     * @param {number=} month
     * @param {number=} day
     * @returns {DateTime}
     */
    moveYear(amount, month, day) {
        return this.createDay(this.year + amount, month, day);
    }

    /**
     * Creates a new DateTime with the given year and the saved date
     * @param {number}  year
     * @param {number=} month
     * @param {number=} day
     * @returns {DateTime}
     */
    changeYear(year, month, day) {
        return this.createDay(year, month, day);
    }

    /**
     * Creates a new DateTime as amount of months ahead of the saved date
     * @param {number}  amount
     * @param {number=} day
     * @returns {DateTime}
     */
    moveMonth(amount, day) {
        return this.createDay(undefined, this.month + amount, day);
    }

    /**
     * Creates a new DateTime with the given month and day and the saved date
     * @param {number}  month
     * @param {number=} day
     * @returns {DateTime}
     */
    changeMonth(month, day) {
        return this.createDay(undefined, month, day);
    }

    /**
     * Creates a new DateTime as amount of days ahead of the saved date
     * @param {number} amount
     * @returns {DateTime}
     */
    moveDay(amount) {
        return this.createDay(undefined, undefined, this.day + amount);
    }

    /**
     * Creates a new DateTime with the given day and the saved date
     * @param {number} day
     * @returns {DateTime}
     */
    changeDay(day) {
        return this.createDay(undefined, undefined, day);
    }

    /**
     * Creates a new DateTime as the given amount of hours ahead of the saved date
     * @param {number}  amount
     * @param {number=} minutes
     * @returns {DateTime}
     */
    moveHours(amount, minutes) {
        return this.createDay(undefined, undefined, undefined, this.hours + amount, minutes);
    }

    /**
     * Creates a new DateTime with the given hours and minutes and the saved date
     * @param {number}  hours
     * @param {number=} minutes
     * @returns {DateTime}
     */
    changeHours(hours, minutes) {
        return this.createDay(undefined, undefined, undefined, hours, minutes);
    }

    /**
     * Creates a new DateTime as the given amount of minutes ahead of the saved date
     * @param {number} minutes
     * @returns {DateTime}
     */
    moveMins(minutes) {
        return this.createDay(undefined, undefined, undefined, undefined, this.minutes + minutes);
    }

    /**
     * Creates a new DateTime with the given minutes and the saved date
     * @param {number} minutes
     * @returns {DateTime}
     */
    changeMins(minutes) {
        return this.createDay(undefined, undefined, undefined, undefined, minutes);
    }

    /**
     * Creates a new DateTime with the given minutes ahead of the saved date
     * @param {number} time
     * @returns {DateTime}
     */
    addTime(time) {
        return new DateTime(this.time + time);
    }



    /**
     * Returns the day number with 2 digits
     * @returns {string}
     */
    getDayNumber() {
        return parseTime(this.day);
    }

    /**
     * Returns the name of the day of the saved date
     * @param {number=} amount
     * @returns {string}
     */
    getDayName(amount) {
        const name = dayToName(this.weekDay);
        return amount ? name.substr(0, amount) : name;
    }

    /**
     * Returns the position of the day in the month as a text
     * @returns {string}
     */
    getDayPosition() {
        return dayToPosition(this.day);
    }

    /**
     * Returns the day difference between the Current Day and the given one
     * @param {DateTime=} otherDate
     * @returns {number}
     */
    getDaysDiff(otherDate) {
        const other = otherDate || new DateTime();
        return Math.floor(Math.abs(this.time - other.time) / DAY_SECS);
    }

    /**
     * Returns the hour difference between the Current Day and the given one
     * @param {DateTime=} otherDate
     * @returns {number}
     */
    getHoursDiff(otherDate) {
        const other = otherDate || new DateTime();
        return Math.floor(Math.abs(this.time - other.time) / HOUR_SECS);
    }

    /**
     * Returns the minute difference between the Current Day and the given one
     * @param {DateTime=} otherDate
     * @returns {number}
     */
    getMinutesDiff(otherDate) {
        const other = otherDate || new DateTime();
        return Math.floor(Math.abs(this.time - other.time) / MINUTE_SECS);
    }



    /**
     * Returns the number of the week for the current day
     * @param {number=} weekDay
     * @returns {number}
     */
    getWeek(weekDay = 0) {
        const actualDay = this.getWeekStart(weekDay);
        const startDay  = actualDay.createDay(undefined, 1, 1);

        return Math.ceil((actualDay.time - startDay.time) / WEEK_SECS);
    }

    /**
     * Returns the date with the first day of the week
     * @param {number=} weekDay
     * @returns {DateTime}
     */
    getWeekStart(weekDay = 0) {
        const day = this.day - this.weekDay + weekDay;
        return this.createDay(undefined, undefined, day);
    }

    /**
     * Returns the amount of weeks in a month
     * @param {number=} weekDay
     * @returns {number}
     */
    getWeeksAmount(weekDay = 0) {
        const startDay  = this.createDay(undefined, undefined, 1);
        const endDay    = this.createDay(undefined, undefined, this.getMonthDays());
        const startWeek = startDay.getWeek(weekDay);
        const endWeek   = endDay.getWeek(weekDay);

        if (startWeek > endWeek) {
            return endWeek + 1;
        }
        return endWeek - startWeek + 1;
    }



    /**
     * Returns the name of the month of the saved date
     * @param {number=} amount
     * @returns {string}
     */
    getMonthName(amount) {
        const name = monthToName(this.month);
        return amount ? name.substr(0, amount) : name;
    }

    /**
     * Returns the month difference between the saved and the given dates
     * @param {DateTime} otherDate
     * @returns {number}
     */
    getMonthDiff(otherDate) {
        return 12 * (this.year - otherDate.year) + this.month - otherDate.month;
    }

    /**
     * Returns the first day of the month of the saved date
     * @returns {number}
     */
    getMonthStart() {
        const date = new Date(this.year, this.month, 1, this.hours, this.minutes);
        return date.getDate();
    }

    /**
     * Returns the amount of Days in the month of the saved date
     * @returns {number}
     */
    getMonthDays() {
        return getMonthDays(this.month, this.year);
    }



    /**
     * Returns the amount of years between the saved date and the given date (or today) AKA the age
     * @param {DateTime=} otherDate
     * @returns {number}
     */
    getAge(otherDate) {
        const date = otherDate || new DateTime();
        return date.year - this.year - (this.changeYear(date.year).isGreaterThan(date) ? 1 : 0);
    }



    /**
     * Returns a data structure with the required information to create a week calendar interface
     * @param {number}  hourStart - Starting hour of the day
     * @param {object=} events    - The events
     * @returns {{title: string, names: string[], hours: object[]}}
     */
    getDayData(hourStart, events) {
        const result = { title : this.toDayString(), names : [], hours : [] };
        const day    = this.copy();

        this.getDaysData(result, day, hourStart, 2, events);
        return result;
    }

    /**
     * Returns a data structure with the required information to create a week calendar interface
     * @param {number}  weekDay   - Starting day of the week
     * @param {number}  hourStart - Starting hour of the day
     * @param {object=} events    - The events
     * @returns {{title: string, names: string[], hours: object[]}}
     */
    getWeekData(weekDay, hourStart, events) {
        const result = { title : this.toWeekString(), names : [], hours : [] };
        const day    = this.toWeekStart(weekDay);

        this.getDaysData(result, day, hourStart, 7, events);
        return result;
    }

    /**
     * Parses the names and hours structure for the days and week calendar interfaces
     * @param {object}   result
     * @param {DateTime} dateTime
     * @param {number}   hourStart
     * @param {number}   dayAmount
     * @param {object=}  events
     * @returns {object}
     */
    getDaysData(result, dateTime, hourStart, dayAmount, events) {
        let currDate = dateTime;

        // First all the day names
        for (let i = 0; i < dayAmount; i += 1) {
            result.names.push({
                number : parseTime(currDate.day),
                name   : currDate.getDayName(3),
            });
            currDate = currDate.moveDay(1);
        }

        // Then all the hours for each day
        for (let j = hourStart; j < 24; j += 1) {
            result.hours.push({ hour : j, days : [] });

            currDate = currDate.moveDay(-dayAmount);
            for (let i = 0; i < dayAmount; i += 1) {
                result.hours[j - hourStart].days.push({
                    isToday   : currDate.isToday,
                    isWeekend : currDate.isWeekend,
                    events    : events ? events[currDate.toDayStart(j).time] || [] : [],
                });
                currDate = currDate.moveDay(1);
            }
        }
        return result;
    }

    /**
     * Returns a data structure with the required information to create a month calendar interface
     * @param {number}    weekDay    - Starting day of the week
     * @param {boolean}   fullWeeks  - True to always show 6 weeks, false to show the amount of weeks of the month
     * @param {number=}   dayLetters - Amount of letters to use for the week days names
     * @param {DateTime=} currentDay - The selected day
     * @param {object=}   events     - The events
     * @returns {{title: string, names: string[], weeks: object[]}}
     */
    getMonthData(weekDay, fullWeeks, dayLetters, currentDay, events) {
        const result   = { title : this.toString("monthYear"), names : [], weeks : [] };
        const lastDay  = fullWeeks ? 6 * 7 : this.getWeeksAmount() * 7;
        let   currDate = this.toMonthStart().toWeekStart(weekDay);
        let   month    = currDate.month;
        let   week     = -1;

        const addToWeek = (data) => {
            if (week < 0 || result.weeks[week].days.length % 7 === 0) {
                week += 1;
                result.weeks[week] = {
                    key  : week,
                    time : data.time,
                    days : [],
                };
            }
            result.weeks[week].days.push(data);
        };

        // First all the day names
        for (let i = 0; i < 7; i += 1) {
            result.names.push(currDate.getDayName(dayLetters));
            currDate = currDate.moveDay(1);
        }

        // Then all the days in the weeks
        currDate = currDate.moveDay(-7);
        for (let i = 0; i < lastDay; i += 1) {
            const isDay = this.isEqualMonthTo(currDate);
            let   name  = currDate.day.toString();

            if (month !== currDate.month || i === 0) {
                name  = currDate.toString("dayMonth");
                month = currDate.month;
            }

            addToWeek({
                key       : i,
                isDay     : isDay,
                day       : currDate,
                name      : name,
                time      : currDate.time,
                isToday   : isDay && currDate.isToday,
                isWeekend : isDay && currDate.isWeekend,
                isCurrent : isDay && currentDay && currentDay.isEqualDayTo(currDate),
                events    : events ? events[currDate.toDayStart().time] || [] : [],
            });
            currDate = currDate.moveDay(1);
        }

        return result;
    }
}




/**
 * Creates a new DateTime
 * @param {(number|Date)=} date
 * @param {boolean=}       inMiliSeconds
 * @returns {DateTime}
 */
function create(date, inMiliSeconds) {
    return new DateTime(date, inMiliSeconds);
}

/**
 * Creates a new DateTime from a slash separated string (YYYY/MM/DD or DD/MM/YYYY or DD/MM)
 * @param {string}   userDate
 * @param {string=}  userTime
 * @param {boolean=} useTimezone
 * @returns {DateTime}
 */
function fromString(userDate, userTime = "", useTimezone = false) {
    let date = userDate;
    let time = userTime;
    if (date.includes(" ")) {
        const parts = date.split(" ");
        date = parts[0];
        time = parts[1];
    }

    const separator = date.includes("/") ? "/" : "-";
    const dateParts = date.split(separator);
    let   day       = new Date();

    if (dateParts.length === 3) {
        const part0 = parseInt(dateParts[0], 10);
        const part1 = parseInt(dateParts[1], 10);
        const part2 = parseInt(dateParts[2], 10);
        if (dateParts[0].length === 4) {
            day = new Date(part0, part1 - 1, part2);
        } else {
            day = new Date(part2, part1 - 1, part0);
        }
    } else if (dateParts.length === 2) {
        const part0 = parseInt(dateParts[0], 10);
        const part1 = parseInt(dateParts[1], 10);
        day = new Date(day.getFullYear(), part1 - 1, part0);
    }

    if (time) {
        const timeParts = time.split(":");
        if (timeParts[0]) {
            const hours = parseInt(timeParts[0], 10);
            day.setHours(hours);
        }
        if (timeParts[1]) {
            const minutes = parseInt(timeParts[1], 10);
            day.setMinutes(minutes);
        }
        if (timeParts[2]) {
            const seconds = parseInt(timeParts[2], 10);
            day.setSeconds(seconds);
        }

        if (useTimezone) {
            const minutes = day.getMinutes() - (day.getTimezoneOffset() - 180);
            day.setMinutes(minutes);
        }
    }

    return new DateTime(day);
}

/**
 * Formats the give date
 * @param {(number|string|Date)} date
 * @param {string}               format
 * @param {boolean=}             useTimezone
 * @returns {string}
 */
function formatDate(date, format, useTimezone = false) {
    if (Utils.isString(date)) {
        return fromString(String(date), "", useTimezone).toString(format);
    }
    return new DateTime(date).toString(format);
}

/**
 * Formats the give date and time
 * @param {string}   date
 * @param {string}   time
 * @param {string}   format
 * @param {boolean=} useTimezone
 * @returns {string}
 */
function formatDateTime(date, time, format, useTimezone = false) {
    return fromString(date, time, useTimezone).toString(format);
}

/**
 * Formats the give date
 * @param {(number|string|Date)} date
 * @param {string}               format
 * @returns {string}
 */
function formatIf(date, format) {
    if (date) {
        return formatDate(date, format);
    }
    return "";
}

/**
 * Formats the give date for an Input
 * @param {(number|string|Date)} date
 * @returns {string}
 */
function formatInput(date) {
    if (!date) {
        return "";
    }
    if (Utils.isString(date)) {
        return fromString(String(date)).toInputString();
    }
    return new DateTime(date).toInputString();
}

/**
 * Formats the give date as a String
 * @param {(number|string|Date)} date
 * @param {boolean=}             withSeconds
 * @returns {string}
 */
function formatString(date, withSeconds = false) {
    if (date) {
        return new DateTime(date).toDateString(withSeconds);
    }
    return "";
}

/**
 * Formats the give date as a Time String
 * @param {(number|string|Date)} date
 * @returns {string}
 */
function formatTime(date) {
    if (date) {
        return new DateTime(date).toTimeString();
    }
    return "";
}

/**
 * Formats the give date as a Live String
 * @param {(number|string|Date)} date
 * @returns {string}
 */
function formatLive(date) {
    if (date) {
        return new DateTime(date).toLiveString();
    }
    return "";
}

/**
 * Formats the give date as a Day
 * @param {(number|string|Date)} date
 * @returns {string}
 */
function formatDay(date) {
    return new DateTime(date).toDayString();
}

/**
 * Formats the given date as a Long String
 * @param {(number|string|Date)} date
 * @returns {string}
 */
function formatLong(date) {
    if (date) {
        return new DateTime(date).toLongString();
    }
    return "";
}

/**
 * Formats the given date as a Medium String
 * @param {(number|string|Date)} date
 * @returns {string}
 */
function formatMedium(date) {
    if (date) {
        return new DateTime(date).toMediumString();
    }
    return "";
}

/**
 * Formats the given date as a Short String
 * @param {(number|string|Date)} date
 * @param {boolean=}             withToday
 * @returns {string}
 */
function formatShort(date, withToday = true) {
    if (date) {
        return new DateTime(date).toShortString(withToday);
    }
    return "";
}

/**
 * Returns a text class depending on the amount of expired hours or minutes
 * @param {(number|string|Date)} date
 * @param {number}               greenMinutes
 * @param {number}               yellowMinutes
 * @returns {string}
 */
function getExpiredColor(date, greenMinutes, yellowMinutes) {
    if (date) {
        return new DateTime(date).getExpiredColor(greenMinutes, yellowMinutes);
    }
    return "red";
}

/**
 * Returns the age of the given date
 * @param {(number|string|Date)} date
 * @returns {number}
 */
function getAge(date) {
    if (!date) {
        return 0;
    }
    if (Utils.isString(date)) {
        return fromString(String(date)).getAge();
    }
    return new DateTime(date).getAge();
}



/**
 * Returns the Week Day as a Name
 * @param {number} day
 * @returns {string}
 */
function dayToName(day) {
    const index = day % 7;
    const days  = NLS.get("DATE_DAY_NAMES");
    return days[index] || "";
}

/**
 * Returns the Week Day as a Name
 * @param {number} day
 * @returns {string}
 */
function dayToShortName(day) {
    const index = day % 7;
    const days  = NLS.get("DATE_DAY_SHORTS");
    return days[index] || "";
}

/**
 * Returns the position of the day in the month
 * @param {number} day
 * @returns {string}
 */
function dayToPosition(day) {
    const index     = Math.ceil(day / 7) - 1;
    const positions = NLS.get("DATE_DAY_POSITIONS");
    return positions[index] || "";
}

/**
 * Returns the month name for a given month
 * @param {number=} month - A possible month number (starting from 1)
 * @returns {string}
 */
function monthToName(month) {
    const months = NLS.get("DATE_MONTH_NAMES");
    return months[month - 1] || "";
}

/**
 * Returns the amount of Days in the month of the saved date
 * @param {number} month
 * @param {number} year
 * @returns {number}
 */
function getMonthDays(month, year) {
    const days   = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    let   result = days[month - 1] || null;

    // If month is February, check Leap Years
    if (month === 2 && (((year % 4) === 0 && (year % 100) !== 0) || (year % 400) === 0)) {
        result = 29;
    }
    return result;
}

/**
 * Creates an Hour Select
 * @param {number=}   fromHour
 * @param {number=}   toHour
 * @param {number[]=} minutes
 * @returns {{key:string, value:string}[]}
 */
function getHourSelect(fromHour = 6, toHour = 20, minutes = [ 0, 30 ]) {
    const result = [];
    for (let hour = fromHour; hour < toHour; hour += 1) {
        for (const minute of minutes) {
            const value = `${parseTime(hour)}:${parseTime(minute)}`;
            result.push({
                key   : value,
                value : value,
            });
        }
    }
    return result;
}

/**
 * Returns number as a String with a 0 in front
 * @param {number} time
 * @returns {string}
 */
function parseTime(time) {
    return time < 10 ? `0${time}` : String(time);
}



// The Public API
export default {
    create,
    fromString,
    formatDate,
    formatDateTime,
    formatIf,
    formatInput,
    formatString,
    formatDay,
    formatTime,
    formatLive,
    formatLong,
    formatMedium,
    formatShort,
    getExpiredColor,
    getAge,

    dayToName,
    dayToShortName,
    dayToPosition,
    monthToName,
    getMonthDays,
    getHourSelect,
    parseTime,
};
