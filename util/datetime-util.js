import { assign, isBlank, isPresent, isString } from './util';
export function renderDateTime(template, value, locale) {
    if (isBlank(value)) {
        return '';
    }
    var tokens = [];
    var hasText = false;
    FORMAT_KEYS.forEach(function (format, index) {
        if (template.indexOf(format.f) > -1) {
            var token = '{' + index + '}';
            var text = renderTextFormat(format.f, value[format.k], value, locale);
            if (!hasText && text && isPresent(value[format.k])) {
                hasText = true;
            }
            tokens.push(token, text);
            template = template.replace(format.f, token);
        }
    });
    if (!hasText) {
        return '';
    }
    for (var i = 0; i < tokens.length; i += 2) {
        template = template.replace(tokens[i], tokens[i + 1]);
    }
    return template;
}
export function renderTextFormat(format, value, date, locale) {
    if (format === FORMAT_DDDD || format === FORMAT_DDD) {
        try {
            value = (new Date(date.year, date.month - 1, date.day)).getDay();
            if (format === FORMAT_DDDD) {
                return (isPresent(locale.dayNames) ? locale.dayNames : DAY_NAMES)[value];
            }
            return (isPresent(locale.dayShortNames) ? locale.dayShortNames : DAY_SHORT_NAMES)[value];
        }
        catch (e) { }
        return '';
    }
    if (format === FORMAT_A) {
        return date ? date.hour < 12 ? 'AM' : 'PM' : isPresent(value) ? value.toUpperCase() : '';
    }
    if (format === FORMAT_a) {
        return date ? date.hour < 12 ? 'am' : 'pm' : isPresent(value) ? value : '';
    }
    if (isBlank(value)) {
        return '';
    }
    if (format === FORMAT_YY || format === FORMAT_MM ||
        format === FORMAT_DD || format === FORMAT_HH ||
        format === FORMAT_mm || format === FORMAT_ss) {
        return twoDigit(value);
    }
    if (format === FORMAT_YYYY) {
        return fourDigit(value);
    }
    if (format === FORMAT_MMMM) {
        return (isPresent(locale.monthNames) ? locale.monthNames : MONTH_NAMES)[value - 1];
    }
    if (format === FORMAT_MMM) {
        return (isPresent(locale.monthShortNames) ? locale.monthShortNames : MONTH_SHORT_NAMES)[value - 1];
    }
    if (format === FORMAT_hh || format === FORMAT_h) {
        if (value === 0) {
            return '12';
        }
        if (value > 12) {
            value -= 12;
        }
        if (format === FORMAT_hh && value < 10) {
            return ('0' + value);
        }
    }
    return value.toString();
}
export function dateValueRange(format, min, max) {
    var opts = [];
    var i;
    if (format === FORMAT_YYYY || format === FORMAT_YY) {
        i = max.year;
        while (i >= min.year) {
            opts.push(i--);
        }
    }
    else if (format === FORMAT_MMMM || format === FORMAT_MMM ||
        format === FORMAT_MM || format === FORMAT_M ||
        format === FORMAT_hh || format === FORMAT_h) {
        for (i = 1; i < 13; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_DDDD || format === FORMAT_DDD ||
        format === FORMAT_DD || format === FORMAT_D) {
        for (i = 1; i < 32; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_HH || format === FORMAT_H) {
        for (i = 0; i < 24; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_mm || format === FORMAT_m) {
        for (i = 0; i < 60; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_ss || format === FORMAT_s) {
        for (i = 0; i < 60; i++) {
            opts.push(i);
        }
    }
    else if (format === FORMAT_A || format === FORMAT_a) {
        opts.push('am', 'pm');
    }
    return opts;
}
export function dateSortValue(year, month, day) {
    return parseInt("1" + fourDigit(year) + twoDigit(month) + twoDigit(day), 10);
}
export function dateDataSortValue(data) {
    if (data) {
        return dateSortValue(data.year, data.month, data.day);
    }
    return -1;
}
export function daysInMonth(month, year) {
    return (month === 4 || month === 6 || month === 9 || month === 11) ? 30 : (month === 2) ? isLeapYear(year) ? 29 : 28 : 31;
}
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
var ISO_8601_REGEXP = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
var TIME_REGEXP = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
export function parseDate(val) {
    var parse;
    if (isPresent(val) && val !== '') {
        parse = TIME_REGEXP.exec(val);
        if (isPresent(parse)) {
            parse.unshift(undefined, undefined);
            parse[2] = parse[3] = undefined;
        }
        else {
            parse = ISO_8601_REGEXP.exec(val);
        }
    }
    if (isBlank(parse)) {
        return null;
    }
    for (var i = 1; i < 8; i++) {
        parse[i] = (parse[i] !== undefined ? parseInt(parse[i], 10) : null);
    }
    var tzOffset = 0;
    if (isPresent(parse[9]) && isPresent(parse[10])) {
        tzOffset = parseInt(parse[10], 10) * 60;
        if (isPresent(parse[11])) {
            tzOffset += parseInt(parse[11], 10);
        }
        if (parse[9] === '-') {
            tzOffset *= -1;
        }
    }
    return {
        year: parse[1],
        month: parse[2],
        day: parse[3],
        hour: parse[4],
        minute: parse[5],
        second: parse[6],
        millisecond: parse[7],
        tzOffset: tzOffset,
    };
}
export function updateDate(existingData, newData) {
    if (isPresent(newData) && newData !== '') {
        if (isString(newData)) {
            newData = parseDate(newData);
            if (newData) {
                assign(existingData, newData);
                return;
            }
        }
        else if ((isPresent(newData.year) || isPresent(newData.hour) || isPresent(newData.month) || isPresent(newData.day) || isPresent(newData.minute) || isPresent(newData.second))) {
            if (isPresent(newData.ampm) && isPresent(newData.hour)) {
                if (newData.ampm.value === 'pm') {
                    newData.hour.value = (newData.hour.value === 12 ? 12 : newData.hour.value + 12);
                }
                else {
                    newData.hour.value = (newData.hour.value === 12 ? 0 : newData.hour.value);
                }
            }
            for (var k in newData) {
                existingData[k] = newData[k].value;
            }
            return;
        }
        console.warn("Error parsing date: \"" + newData + "\". Please provide a valid ISO 8601 datetime format: https://www.w3.org/TR/NOTE-datetime");
    }
    else {
        for (var k in existingData) {
            delete existingData[k];
        }
    }
}
export function parseTemplate(template) {
    var formats = [];
    template = template.replace(/[^\w\s]/gi, ' ');
    FORMAT_KEYS.forEach(function (format) {
        if (format.f.length > 1 && template.indexOf(format.f) > -1 && template.indexOf(format.f + format.f.charAt(0)) < 0) {
            template = template.replace(format.f, ' ' + format.f + ' ');
        }
    });
    var words = template.split(' ').filter(function (w) { return w.length > 0; });
    words.forEach(function (word, i) {
        FORMAT_KEYS.forEach(function (format) {
            if (word === format.f) {
                if (word === FORMAT_A || word === FORMAT_a) {
                    if ((formats.indexOf(FORMAT_h) < 0 && formats.indexOf(FORMAT_hh) < 0) ||
                        (words[i - 1] !== FORMAT_m && words[i - 1] !== FORMAT_mm)) {
                        return;
                    }
                }
                formats.push(word);
            }
        });
    });
    return formats;
}
export function getValueFromFormat(date, format) {
    if (format === FORMAT_A || format === FORMAT_a) {
        return (date.hour < 12 ? 'am' : 'pm');
    }
    if (format === FORMAT_hh || format === FORMAT_h) {
        return (date.hour > 12 ? date.hour - 12 : date.hour);
    }
    return date[convertFormatToKey(format)];
}
export function convertFormatToKey(format) {
    for (var k in FORMAT_KEYS) {
        if (FORMAT_KEYS[k].f === format) {
            return FORMAT_KEYS[k].k;
        }
    }
    return null;
}
export function convertDataToISO(data) {
    var rtn = '';
    if (isPresent(data)) {
        if (isPresent(data.year)) {
            rtn = fourDigit(data.year);
            if (isPresent(data.month)) {
                rtn += '-' + twoDigit(data.month);
                if (isPresent(data.day)) {
                    rtn += '-' + twoDigit(data.day);
                    if (isPresent(data.hour)) {
                        rtn += "T" + twoDigit(data.hour) + ":" + twoDigit(data.minute) + ":" + twoDigit(data.second);
                        if (data.millisecond > 0) {
                            rtn += '.' + threeDigit(data.millisecond);
                        }
                        if (isBlank(data.tzOffset) || data.tzOffset === 0) {
                            rtn += 'Z';
                        }
                        else {
                            rtn += (data.tzOffset > 0 ? '+' : '-') + twoDigit(Math.floor(data.tzOffset / 60)) + ':' + twoDigit(data.tzOffset % 60);
                        }
                    }
                }
            }
        }
        else if (isPresent(data.hour)) {
            rtn = twoDigit(data.hour) + ':' + twoDigit(data.minute);
            if (isPresent(data.second)) {
                rtn += ':' + twoDigit(data.second);
                if (isPresent(data.millisecond)) {
                    rtn += '.' + threeDigit(data.millisecond);
                }
            }
        }
    }
    return rtn;
}
function twoDigit(val) {
    return ('0' + (isPresent(val) ? Math.abs(val) : '0')).slice(-2);
}
function threeDigit(val) {
    return ('00' + (isPresent(val) ? Math.abs(val) : '0')).slice(-3);
}
function fourDigit(val) {
    return ('000' + (isPresent(val) ? Math.abs(val) : '0')).slice(-4);
}
var FORMAT_YYYY = 'YYYY';
var FORMAT_YY = 'YY';
var FORMAT_MMMM = 'MMMM';
var FORMAT_MMM = 'MMM';
var FORMAT_MM = 'MM';
var FORMAT_M = 'M';
var FORMAT_DDDD = 'DDDD';
var FORMAT_DDD = 'DDD';
var FORMAT_DD = 'DD';
var FORMAT_D = 'D';
var FORMAT_HH = 'HH';
var FORMAT_H = 'H';
var FORMAT_hh = 'hh';
var FORMAT_h = 'h';
var FORMAT_mm = 'mm';
var FORMAT_m = 'm';
var FORMAT_ss = 'ss';
var FORMAT_s = 's';
var FORMAT_A = 'A';
var FORMAT_a = 'a';
var FORMAT_KEYS = [
    { f: FORMAT_YYYY, k: 'year' },
    { f: FORMAT_MMMM, k: 'month' },
    { f: FORMAT_DDDD, k: 'day' },
    { f: FORMAT_MMM, k: 'month' },
    { f: FORMAT_DDD, k: 'day' },
    { f: FORMAT_YY, k: 'year' },
    { f: FORMAT_MM, k: 'month' },
    { f: FORMAT_DD, k: 'day' },
    { f: FORMAT_HH, k: 'hour' },
    { f: FORMAT_hh, k: 'hour' },
    { f: FORMAT_mm, k: 'minute' },
    { f: FORMAT_ss, k: 'second' },
    { f: FORMAT_M, k: 'month' },
    { f: FORMAT_D, k: 'day' },
    { f: FORMAT_H, k: 'hour' },
    { f: FORMAT_h, k: 'hour' },
    { f: FORMAT_m, k: 'minute' },
    { f: FORMAT_s, k: 'second' },
    { f: FORMAT_A, k: 'ampm' },
    { f: FORMAT_a, k: 'ampm' },
];
var DAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
var DAY_SHORT_NAMES = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];
var MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
var MONTH_SHORT_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
//# sourceMappingURL=datetime-util.js.map