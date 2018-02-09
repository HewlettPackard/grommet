
// Utility functions for the Calendar.
// Just what's needed to avoid having to include a dependency like momentjs.

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

export const addDays = (date, days) =>
  (new Date(date.getTime() + (DAY_MILLISECONDS * days)));

export const subtractDays = (date, days) => addDays(date, -days);

export const addMonths = (date, months) => {
  const result = new Date(date);
  const years = Math.floor((date.getMonth() + months) / 12);
  result.setFullYear(date.getFullYear() + years);
  result.setMonth((date.getMonth() + months) % 12);
  return result;
};

export const subtractMonths = (date, months) => addMonths(date, -months);

export const sameDay = (date1, date2) => (
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
);

export const sameDayOrAfter = (date1, date2) =>
  (date1.getFullYear() > date2.getFullYear() ||
    (date1.getFullYear() === date2.getFullYear() && (
      date1.getMonth() > date2.getMonth() || (
        date1.getMonth() === date2.getMonth() && (date1.getDate() >= date2.getDate())
      )
    ))
  );

export const sameDayOrBefore = (date1, date2) =>
  (date1.getFullYear() < date2.getFullYear() ||
    (date1.getFullYear() === date2.getFullYear() && (
      date1.getMonth() < date2.getMonth() || (
        date1.getMonth() === date2.getMonth() && (date1.getDate() <= date2.getDate())
      )
    ))
  );

export const daysApart = (date1, date2) =>
  Math.floor((date1.getTime() - date2.getTime()) / DAY_MILLISECONDS);

// betweenDates takes and array of two elements and checks if the
// supplied date lies between them, inclusive.
// returns 2 if exact match to one end, 1 if between, undefined otherwise
export const betweenDates = (date, dates) => {
  let result;
  if (dates) {
    const [from, to] = dates.map(d => new Date(d));
    if (sameDay(date, from) || sameDay(date, to)) {
      result = 2;
    } else if (sameDayOrAfter(date, from) && sameDayOrBefore(date, to)) {
      result = 1;
    }
  } else {
    result = 1;
  }
  return result;
};

// withinDates takes and array of string dates or 2 element arrays and
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
