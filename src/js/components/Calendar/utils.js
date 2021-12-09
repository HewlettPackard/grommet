// Utility functions for the Calendar.
// Just what's needed to avoid having to include a dependency like momentjs.

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

export const addDays = (date, days) => {
  const result = new Date(date.getTime() + DAY_MILLISECONDS * days);
  // Deal with crossing the daylight savings time boundary,
  // where adding a day's worth when the time is midnight results in
  // being a day off.
  let hourDelta = result.getHours() - date.getHours();
  // At this point, hourDelta is typically 0 (normal day),
  // +23 (November daylight saving), or -23 (March Daylight saving)
  // depending on which side of the switch we are on.
  // Convert so that hourDelta is either +1 or -1.
  if (hourDelta === 23) {
    hourDelta -= 24;
  } else if (hourDelta === -23) {
    hourDelta += 24;
  }
  result.setHours(result.getHours() - hourDelta);
  return result;
};

export const subtractDays = (date, days) => addDays(date, -days);

export const addMonths = (date, months) => {
  const result = new Date(date);
  const years = Math.floor((date.getMonth() + months) / 12);
  result.setFullYear(date.getFullYear() + years);
  const targetMonth = (date.getMonth() + months) % 12;
  result.setMonth(targetMonth < 0 ? 12 + targetMonth : targetMonth);
  return result;
};

export const subtractMonths = (date, months) => addMonths(date, -months);

export const startOfMonth = (date) => {
  const result = new Date(date);
  result.setDate(1);
  return result;
};

export const endOfMonth = (date) => {
  const result = addMonths(date, 1);
  result.setDate(0);
  return result;
};

export const sameDay = (date1, date2) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const sameDayOrAfter = (date1, date2) =>
  date1.getFullYear() > date2.getFullYear() ||
  (date1.getFullYear() === date2.getFullYear() &&
    (date1.getMonth() > date2.getMonth() ||
      (date1.getMonth() === date2.getMonth() &&
        date1.getDate() >= date2.getDate())));

export const sameDayOrBefore = (date1, date2) =>
  date1.getFullYear() < date2.getFullYear() ||
  (date1.getFullYear() === date2.getFullYear() &&
    (date1.getMonth() < date2.getMonth() ||
      (date1.getMonth() === date2.getMonth() &&
        date1.getDate() <= date2.getDate())));

export const daysApart = (date1, date2) =>
  Math.floor((date1.getTime() - date2.getTime()) / DAY_MILLISECONDS);

export const formatToLocalYYYYMMDD = (date) => {
  const adjustedDate = new Date(date);
  return new Date(
    adjustedDate.getTime() - adjustedDate.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split('T')[0];
};
// betweenDates takes an array of two elements and checks if the
// supplied date lies between them, inclusive.
// returns 2 if exact match to one end, 1 if between, undefined otherwise
export const betweenDates = (date, dates) => {
  let result;
  if (dates) {
    const [from, to] = dates.map((d) => (d ? new Date(d) : undefined));
    if ((from && sameDay(date, from)) || (to && sameDay(date, to))) {
      result = 2;
    } else if (
      from &&
      sameDayOrAfter(date, from) &&
      to &&
      sameDayOrBefore(date, to)
    ) {
      result = 1;
    }
  } else {
    result = 1;
  }
  return result;
};

// withinDates takes an array of string dates or 2 element arrays and
// checks whether the supplied date matches any string or is between
// any dates in arrays.
// returns 2 if exact match, 1 if between, undefined otherwise
export const withinDates = (date, dates) => {
  let result;
  if (dates) {
    if (Array.isArray(dates)) {
      dates.some((d) => {
        if (typeof d === 'string') {
          if (sameDay(date, new Date(d))) {
            result = 2;
          }
        } else {
          result = betweenDates(date, d);
        }
        return result;
      });
    } else if (sameDay(date, new Date(dates))) {
      result = 2;
    }
  }
  return result;
};

export const getTimestamp = (date) =>
  new RegExp(/T.*/).test(date)
    ? new Date(date).toISOString().split('T')[1]
    : // for Calendar, explicitly mark that caller has provided
      // value with no timestamp
      false;

// Adjust for differences between timestamp on value and
// local timezone of user. Internal Calendar logic relies
// on Javascript date contructor which translates the provided
// date into the equivalent moment for the user's timezone, which
// can create undesired results. The standardizes the input value
// for internal calculations
// Reference: https://www.ursahealth.com/new-insights/dates-and-timezones-in-javascript
export const normalizeForTimezone = (value, timestamp) => {
  let adjustedDate;
  let hourDelta;
  let valueOffset = 0;
  if (timestamp && typeof timestamp === 'string') {
    hourDelta = parseInt(timestamp?.split(':')[0], 10);
    valueOffset = hourDelta * 60 * 1000; // ms
  }
  const localOffset = new Date().getTimezoneOffset() * 60 * 1000;

  adjustedDate =
    value &&
    (Array.isArray(value) ? value : [value]).map((v) =>
      new Date(new Date(v).getTime() - valueOffset + localOffset).toISOString(),
    );
  if (typeof value === 'string') [adjustedDate] = adjustedDate;

  return adjustedDate;
};

// format the date to align with date format caller passed in
export const formatDateToPropStructure = (date, timestamp) => {
  let adjustedDate;
  if (date) {
    if (timestamp)
      adjustedDate = `${
        formatToLocalYYYYMMDD(date).split('T')[0]
      }T${timestamp}`;
    else if (timestamp === false)
      [adjustedDate] = formatToLocalYYYYMMDD(date).split('T');
    else adjustedDate = date;
  }
  return adjustedDate;
};
