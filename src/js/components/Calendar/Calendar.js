import React, {
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { ThemeContext } from 'styled-components';
import { defaultProps } from '../../default-props';
import { AnnounceContext } from '../../contexts/AnnounceContext';
import { MessageContext } from '../../contexts/MessageContext';

import { Box } from '../Box';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Keyboard } from '../Keyboard';

import {
  StyledCalendar,
  StyledDay,
  StyledDayContainer,
  StyledWeek,
  StyledWeeks,
  StyledWeeksContainer,
} from './StyledCalendar';
import {
  addDays,
  addMonths,
  betweenDates,
  daysApart,
  endOfMonth,
  formatToLocalYYYYMMDD,
  getFormattedDate,
  getTimestamp,
  normalizeForTimezone,
  startOfMonth,
  subtractDays,
  subtractMonths,
  withinDates,
} from './utils';
import { CalendarPropTypes } from './propTypes';

const headingPadMap = {
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
};

const activeDates = {
  start: 'start',
  end: 'end',
};

const formatSelectedDatesString = (date, normalize) => `Currently selected
  ${date?.map((item) => {
    let dates;
    if (!Array.isArray(item)) {
      dates = `${formatToLocalYYYYMMDD(item, normalize)} `;
    } else {
      const start =
        item[0] !== undefined
          ? formatToLocalYYYYMMDD(item[0], normalize)
          : 'none';
      const end =
        item[1] !== undefined
          ? formatToLocalYYYYMMDD(item[1], normalize)
          : 'none';
      dates = `${start} through ${end}`;
    }

    return dates;
  })}`;

const getAccessibilityString = (date, dates, normalize) => {
  if (date && !Array.isArray(date)) {
    return `Currently selected ${formatToLocalYYYYMMDD(date, normalize)};`;
  }
  if (date && Array.isArray(date)) {
    return formatSelectedDatesString(date, normalize);
  }
  if (dates?.length) {
    return formatSelectedDatesString(dates, normalize);
  }

  return 'No date selected';
};

// function that runs inside the useEffect for date and dates
const normalizeDate = (dateValue, timestamp, normalize) => {
  if (typeof dateValue === 'string') {
    return normalizeForTimezone(dateValue, timestamp, normalize);
  }
  if (Array.isArray(dateValue)) {
    if (Array.isArray(dateValue[0])) {
      const [from, to] = dateValue[0].map(
        (day) => normalizeForTimezone(day, timestamp, normalize) || undefined,
      );
      return [[from, to]];
    }
    const dateArray = [];
    dateValue.forEach((d) => {
      if (Array.isArray(d)) {
        const [from, to] = d.map((day) =>
          normalizeForTimezone(day, timestamp, normalize),
        );
        dateArray.push([from, to]);
      } else {
        dateArray.push(normalizeForTimezone(d, timestamp, normalize));
      }
    });
    return dateArray;
  }
  return undefined;
};

const normalizeReference = (reference, date, dates, timestamp) => {
  let normalizedReference;
  if (reference) {
    normalizedReference = new Date(normalizeForTimezone(reference, timestamp));
  } else if (date) {
    if (typeof date === 'string') {
      normalizedReference = new Date(date);
    } else if (Array.isArray(date)) {
      if (typeof date[0] === 'string') {
        normalizedReference = new Date(date[0]);
      } else if (Array.isArray(date[0])) {
        normalizedReference = new Date(date[0][0] ? date[0][0] : date[0][1]);
      } else {
        normalizedReference = new Date();
        normalizedReference.setHours(0, 0, 0, 0);
      }
    }
  } else if (dates && dates.length > 0) {
    if (typeof dates[0] === 'string') {
      normalizedReference = new Date(dates[0]);
    } else if (Array.isArray(dates[0])) {
      normalizedReference = new Date(dates[0][0] ? dates[0][0] : dates[0][1]);
    } else {
      normalizedReference = new Date();
      normalizedReference.setHours(0, 0, 0, 0);
    }
  } else {
    normalizedReference = new Date();
    normalizedReference.setHours(0, 0, 0, 0);
  }
  return normalizedReference;
};

const buildDisplayBounds = (reference, firstDayOfWeek) => {
  let start = new Date(reference);
  start.setDate(1); // first of month

  // In case Sunday is the first day of the month, and the user asked for Monday
  // to be the first day of the week, then we need to include Sunday and six
  // days prior.
  start =
    start.getDay() === 0 && firstDayOfWeek === 1
      ? (start = subtractDays(start, 6))
      : // beginning of week
        (start = subtractDays(start, start.getDay() - firstDayOfWeek));

  const end = addDays(start, 7 * 5 + 7); // 5 weeks to end of week
  return [start, end];
};

const millisecondsPerYear = 31557600000;

const CalendarDayButton = (props) => <Button tabIndex={-1} plain {...props} />;

const CalendarDay = ({
  children,
  fill,
  size,
  isInRange,
  isSelected,
  otherMonth,
  buttonProps = {},
}) => (
  <StyledDayContainer role="gridcell" sizeProp={size} fillContainer={fill}>
    <CalendarDayButton fill={fill} {...buttonProps}>
      <StyledDay
        disabledProp={buttonProps.disabled}
        inRange={isInRange}
        otherMonth={otherMonth}
        isSelected={isSelected}
        sizeProp={size}
        fillContainer={fill}
      >
        {children}
      </StyledDay>
    </CalendarDayButton>
  </StyledDayContainer>
);

const CalendarCustomDay = ({ children, fill, size, buttonProps }) => {
  if (!buttonProps) {
    return (
      <StyledDayContainer role="gridcell" sizeProp={size} fillContainer={fill}>
        {children}
      </StyledDayContainer>
    );
  }

  return (
    <StyledDayContainer role="gridcell" sizeProp={size} fillContainer={fill}>
      <CalendarDayButton fill={fill} {...buttonProps}>
        {children}
      </CalendarDayButton>
    </StyledDayContainer>
  );
};

const Calendar = forwardRef(
  (
    {
      activeDate: activeDateProp,
      animate = true,
      bounds: boundsProp,
      children,
      date: dateProp,
      dates: datesProp,
      daysOfWeek,
      disabled,
      initialFocus, // internal only for DateInput
      fill,
      firstDayOfWeek = 0,
      header,
      locale = 'en-US',
      messages,
      normalize: normalizeProp = true,
      onReference,
      onSelect,
      range,
      reference: referenceProp,
      showAdjacentDays = true,
      size = 'medium',
      timestamp: timestampProp,
      ...rest
    },
    ref,
  ) => {
    const theme = useContext(ThemeContext) || defaultProps.theme;
    const announce = useContext(AnnounceContext);
    const { format } = useContext(MessageContext);

    // when mousedown, we don't want to let Calendar set
    // active date to firstInMonth
    const [mouseDown, setMouseDown] = useState(false);
    const onMouseDown = () => setMouseDown(true);
    const onMouseUp = () => setMouseDown(false);
    useEffect(() => {
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      return () => {
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }, []);

    // whether or not we should normalize the date based on the timestamp.
    // will be set to false if the initial timestamp is undefined (meaning
    // a user did not provide a defaultValue or value). in this case, we
    // will just rely on the UTC timestamp and don't need to normalize.
    const [normalize, setNormalize] = useState(normalizeProp);

    // set activeDate when caller changes it, allows us to change
    // it internally too
    const [activeDate, setActiveDate] = useState(
      dateProp && typeof dateProp === 'string' && range
        ? activeDates.end
        : activeDates.start,
    );
    useEffect(() => {
      if (activeDateProp) setActiveDate(activeDateProp);
    }, [activeDateProp]);

    let timestamp = useMemo(() => timestampProp, [timestampProp]);
    if (timestampProp === undefined) {
      if (Array.isArray(dateProp) && dateProp.length) {
        if (Array.isArray(dateProp[0])) {
          timestamp = getTimestamp(dateProp[0][0]);
        } else timestamp = getTimestamp(dateProp[0]);
        // check to see if value is not an empty string
        // empty string should behave like undefined
      } else if (typeof dateProp === 'string' && dateProp.length) {
        timestamp = getTimestamp(dateProp);
      } else if (Array.isArray(datesProp) && datesProp.length) {
        if (Array.isArray(datesProp[0])) {
          timestamp = getTimestamp(datesProp[0][0]);
        } else timestamp = getTimestamp(datesProp[0]);
      } else if (typeof datesProp === 'string') {
        timestamp = getTimestamp(datesProp);
      } else if (typeof referenceProp === 'string') {
        timestamp = getTimestamp(referenceProp);
      }
    }

    const normalizedDate = useMemo(
      () =>
        timestampProp === undefined
          ? normalizeDate(dateProp, timestamp, normalize)
          : dateProp,
      [dateProp, normalize, timestamp, timestampProp],
    );

    const normalizedDates = useMemo(
      () =>
        timestampProp === undefined
          ? normalizeDate(datesProp, timestamp, normalize)
          : datesProp,
      [datesProp, normalize, timestamp, timestampProp],
    );

    // set date when caller changes it, allows us to change it internally too
    const [date, setDate] = useState(normalizedDate);
    useEffect(() => {
      setDate(normalizedDate);
    }, [normalizedDate]);

    // set dates when caller changes it, allows us to change it internally too
    const [dates, setDates] = useState(normalizedDates);
    useEffect(() => {
      setDates(normalizedDates);
    }, [normalizedDates]);

    // set reference based on what the caller passed or date/dates.
    const [reference, setReference] = useState(
      normalizeReference(
        referenceProp,
        normalizedDate,
        normalizedDates,
        timestamp,
      ),
    );
    useEffect(
      () =>
        setReference(
          normalizeReference(
            referenceProp,
            normalizedDate,
            normalizedDates,
            timestamp,
          ),
        ),
      [referenceProp, normalizedDate, normalizedDates, timestamp],
    );

    // normalize bounds
    const [bounds, setBounds] = useState(boundsProp);
    useEffect(() => {
      if (boundsProp) setBounds(boundsProp);
      else setBounds(undefined);
    }, [boundsProp]);

    // calculate the bounds we display based on the reference
    const [displayBounds, setDisplayBounds] = useState(
      buildDisplayBounds(reference, firstDayOfWeek),
    );
    const [targetDisplayBounds, setTargetDisplayBounds] = useState();
    const [slide, setSlide] = useState();
    const [animating, setAnimating] = useState();

    // When the reference changes, we need to update the displayBounds.
    // This is easy when we aren't animating. If we are animating,
    // we temporarily increase the displayBounds to be the union of the old
    // and new ones and set slide to drive the animation. We keep track
    // of where we are heading via targetDisplayBounds. When the animation
    // finishes, we prune displayBounds down to where we are headed and
    // clear the slide and targetDisplayBounds.
    useEffect(() => {
      const nextDisplayBounds = buildDisplayBounds(reference, firstDayOfWeek);

      // Checks if the difference between the current and next DisplayBounds is
      // greater than a year. If that's the case, calendar should update without
      // animation.
      if (
        nextDisplayBounds[0].getTime() !== displayBounds[0].getTime() &&
        nextDisplayBounds[1].getTime() !== displayBounds[1].getTime()
      ) {
        let diffBoundsAboveYear = false;
        if (nextDisplayBounds[0].getTime() < displayBounds[0].getTime()) {
          if (
            displayBounds[0].getTime() - nextDisplayBounds[0].getTime() >
            millisecondsPerYear
          ) {
            diffBoundsAboveYear = true;
          }
        } else if (
          nextDisplayBounds[1].getTime() > displayBounds[1].getTime()
        ) {
          if (
            nextDisplayBounds[1].getTime() - displayBounds[1].getTime() >
            millisecondsPerYear
          ) {
            diffBoundsAboveYear = true;
          }
        }
        if (!animate || diffBoundsAboveYear) {
          setDisplayBounds(nextDisplayBounds);
        } else {
          setTargetDisplayBounds(nextDisplayBounds);
        }
      }
    }, [animate, firstDayOfWeek, reference, displayBounds]);

    useEffect(() => {
      if (targetDisplayBounds) {
        if (targetDisplayBounds[0].getTime() < displayBounds[0].getTime()) {
          // only animate if the duration is within a year
          if (
            displayBounds[0].getTime() - targetDisplayBounds[0].getTime() <
            millisecondsPerYear
          ) {
            setDisplayBounds([targetDisplayBounds[0], displayBounds[1]]);
            setSlide({
              direction: 'down',
              weeks: daysApart(displayBounds[0], targetDisplayBounds[0]) / 7,
            });
            setAnimating(true);
          }
        } else if (
          targetDisplayBounds[1].getTime() > displayBounds[1].getTime()
        ) {
          if (
            targetDisplayBounds[1].getTime() - displayBounds[1].getTime() <
            millisecondsPerYear
          ) {
            setDisplayBounds([displayBounds[0], targetDisplayBounds[1]]);
            setSlide({
              direction: 'up',
              weeks: daysApart(targetDisplayBounds[1], displayBounds[1]) / 7,
            });
            setAnimating(true);
          }
        }
        return undefined;
      }

      setSlide(undefined);
      return undefined;
    }, [animating, displayBounds, targetDisplayBounds]);

    // Last step in updating the displayBounds. Allows for pruning
    // displayBounds and cleaning up states to occur after animation.
    useEffect(() => {
      if (animating && targetDisplayBounds) {
        // Wait for animation to finish before cleaning up.
        const timer = setTimeout(
          () => {
            setDisplayBounds(targetDisplayBounds);
            setTargetDisplayBounds(undefined);
            setSlide(undefined);
            setAnimating(false);
          },
          400, // Empirically determined.
        );
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [animating, targetDisplayBounds]);

    // We have to deal with reference being the end of a month with more
    // days than the month we are changing to. So, we always set reference
    // to the first of the month before changing the month.
    const previousMonth = useMemo(
      () => endOfMonth(subtractMonths(startOfMonth(reference), 1)),
      [reference],
    );
    const nextMonth = useMemo(
      () => startOfMonth(addMonths(startOfMonth(reference), 1)),
      [reference],
    );

    const daysRef = useRef();
    const [focus, setFocus] = useState();
    const [active, setActive] = useState();

    useEffect(() => {
      if (initialFocus === 'days') daysRef.current.focus();
    }, [initialFocus]);

    const changeReference = useCallback(
      (nextReference) => {
        if (betweenDates(nextReference, bounds)) {
          setReference(nextReference);
          if (onReference) onReference(nextReference.toISOString());
        }
      },
      [onReference, bounds],
    );

    const selectDate = useCallback(
      (selectedDate) => {
        let nextDates;
        let nextDate;
        // timestamp will be undefined if no defaultValue or value have
        // been passed in, indicating that we should stay local
        let nextNormalize = normalize;
        if (timestamp === undefined) {
          nextNormalize = false;
          setNormalize(nextNormalize);
        }
        if (!range) {
          nextDate = selectedDate;
        }
        // everything down is a range
        else if (!dates && !Array.isArray(date)) {
          // if user supplies date, convert this into dates
          if (date) {
            const priorDate = new Date(date);
            const selDate = new Date(selectedDate);
            if (activeDate === activeDates.start) {
              if (selDate.getTime() > priorDate.getTime()) {
                nextDates = [[selectedDate, undefined]];
              } else {
                nextDates = [[selectedDate, date]];
              }
              setActiveDate(activeDates.end);
              if (activeDateProp) setActiveDate(activeDateProp);
            } else if (activeDate === activeDates.end) {
              if (selDate.getTime() < priorDate.getTime()) {
                nextDates = [[selectedDate, undefined]];
                setActiveDate(activeDates.end);
              } else {
                nextDates = [[date, selectedDate]];
                setActiveDate(activeDates.start);
              }
              if (activeDateProp) setActiveDate(activeDateProp);
            }
          } else if (activeDate === activeDates.start) {
            nextDates = [[selectedDate, undefined]];
            setActiveDate(activeDates.end);
          } else if (activeDate === activeDates.end) {
            nextDates = [[undefined, selectedDate]];
          }
          if (activeDateProp) setActiveDate(activeDateProp);
        } else if (dates || date) {
          const handleSelection = (dateValue) => {
            const priorDates = dateValue[0].map((d) => new Date(d));
            const selDate = new Date(selectedDate);
            if (selDate.getTime() === priorDates[0].getTime()) {
              nextDates = [[undefined, dateValue[0][1]]];
              setActiveDate(activeDates.start);
            } else if (selDate.getTime() === priorDates[1].getTime()) {
              nextDates = [[dateValue[0][0], undefined]];
              setActiveDate(activeDates.end);
              if (activeDateProp) setActiveDate(activeDateProp);
            } else if (activeDate === activeDates.start) {
              if (selDate.getTime() > priorDates[1].getTime()) {
                nextDates = [[selectedDate, undefined]];
              } else {
                nextDates = [[selectedDate, dateValue[0][1]]];
              }
              setActiveDate(activeDates.end);
              if (activeDateProp) setActiveDate(activeDateProp);
            } else if (activeDate === activeDates.end) {
              if (selDate.getTime() < priorDates[0].getTime()) {
                nextDates = [[selectedDate, undefined]];
                setActiveDate(activeDates.end);
              } else {
                nextDates = [[dateValue[0][0], selectedDate]];
                setActiveDate(activeDates.start);
              }
              if (activeDateProp) setActiveDate(activeDateProp);
            }
            // cleanup
            if (!nextDates[0][0] && !nextDates[0][1]) nextDates = undefined;
          };
          // have dates
          if (dates) {
            handleSelection(dates);
          } else if (date && Array.isArray(date)) {
            handleSelection(date);
          }
        }

        setDates(nextDates);
        if (date && typeof date === 'string') {
          setDate(nextDate);
        } else if (date && Array.isArray(date)) {
          setDate(nextDates);
        }
        setActive(new Date(selectedDate));
        if (onSelect) {
          // format date/dates to match structure provided by caller
          // which could take format of:
          // 1. ISO8601 with a timestamp
          // 2. ISO8601 without a timestamp
          // 3. Caller did not provide value/defaultValue, so return date
          // in ISO8601 with timestamp in UTC relative to user's local timezone
          const formattedDate = getFormattedDate(
            nextDate,
            nextDates,
            nextNormalize,
            range,
            timestamp,
          );
          onSelect(formattedDate);
        }
      },
      [
        activeDate,
        activeDateProp,
        date,
        dates,
        normalize,
        onSelect,
        range,
        timestamp,
      ],
    );

    const renderCalendarHeader = () => {
      const PreviousIcon =
        size === 'small'
          ? theme.calendar.icons.small.previous
          : theme.calendar.icons.previous;

      const NextIcon =
        size === 'small'
          ? theme.calendar.icons.small.next
          : theme.calendar.icons.next;

      return (
        <Box direction="row" justify="between" align="center">
          <Box flex pad={{ horizontal: headingPadMap[size] || 'small' }}>
            <Heading
              level={
                size === 'small'
                  ? (theme.calendar.heading && theme.calendar.heading.level) ||
                    4
                  : ((theme.calendar.heading && theme.calendar.heading.level) ||
                      4) - 1
              }
              size={size}
              margin="none"
            >
              {reference.toLocaleDateString(locale, {
                month: 'long',
                year: 'numeric',
              })}
            </Heading>
          </Box>
          <Box flex={false} direction="row" align="center">
            <Button
              a11yTitle={format({
                id: 'calendar.previous',
                messages,
                values: {
                  date: previousMonth.toLocaleDateString(locale, {
                    month: 'long',
                    year: 'numeric',
                  }),
                },
              })}
              icon={<PreviousIcon size={size !== 'small' ? size : undefined} />}
              disabled={!betweenDates(previousMonth, bounds)}
              onClick={() => {
                changeReference(previousMonth);
                announce(
                  format({
                    id: 'calendar.previousMove',
                    messages,
                    values: {
                      date: previousMonth.toLocaleDateString(locale, {
                        month: 'long',
                        year: 'numeric',
                      }),
                    },
                  }),
                );
              }}
            />
            <Button
              a11yTitle={format({
                id: 'calendar.next',
                messages,
                values: {
                  date: nextMonth.toLocaleDateString(locale, {
                    month: 'long',
                    year: 'numeric',
                  }),
                },
              })}
              icon={<NextIcon size={size !== 'small' ? size : undefined} />}
              disabled={!betweenDates(nextMonth, bounds)}
              onClick={() => {
                changeReference(nextMonth);
                announce(
                  format({
                    id: 'calendar.nextMove',
                    messages,
                    values: {
                      date: nextMonth.toLocaleDateString(locale, {
                        month: 'long',
                        year: 'numeric',
                      }),
                    },
                  }),
                );
              }}
            />
          </Box>
        </Box>
      );
    };

    const renderDaysOfWeek = () => {
      let day = new Date(displayBounds[0]);
      const days = [];
      while (days.length < 7) {
        days.push(
          <StyledDayContainer
            role="gridcell"
            key={days.length}
            sizeProp={size}
            fillContainer={fill}
          >
            <StyledDay otherMonth sizeProp={size} fillContainer={fill}>
              {day.toLocaleDateString(locale, { weekday: 'narrow' })}
            </StyledDay>
          </StyledDayContainer>,
        );
        day = addDays(day, 1);
      }
      return <StyledWeek role="row">{days}</StyledWeek>;
    };

    const weeks = [];
    let day = new Date(displayBounds[0]);
    let days;
    let firstDayInMonth;
    let blankWeek = false;

    while (day.getTime() < displayBounds[1].getTime()) {
      if (day.getDay() === firstDayOfWeek) {
        if (days) {
          weeks.push(
            <StyledWeek role="row" key={day.getTime()} fillContainer={fill}>
              {days}
            </StyledWeek>,
          );
        }
        days = [];
      }

      const otherMonth = day.getMonth() !== reference.getMonth();
      if (!showAdjacentDays && otherMonth) {
        days.push(
          <StyledDayContainer
            key={day.getTime()}
            sizeProp={size}
            fillContainer={fill}
          >
            <StyledDay sizeProp={size} fillContainer={fill} />
          </StyledDayContainer>,
        );

        if (
          weeks.length === 5 &&
          /* If the length days array is less than the current getDate()
          we know that all days in the array are from the next month. */
          days.length < day.getDate()
        ) {
          blankWeek = true;
        }
      } else if (
        /* Do not show adjacent days in 6th row if all days
        fall in the next month */
        showAdjacentDays === 'trim' &&
        otherMonth &&
        weeks.length === 5 &&
        /* If the length days array is less than the current getDate()
        we know that all days in the array are from the next month. */
        days.length < day.getDate()
      ) {
        blankWeek = true;
        days.push(
          <StyledDayContainer
            key={day.getTime()}
            sizeProp={size}
            fillContainer={fill}
          >
            <StyledDay sizeProp={size} fillContainer={fill} />
          </StyledDayContainer>,
        );
      } else {
        const dateString = day.toISOString();
        // this.dayRefs[dateString] = React.createRef();
        let selected = false;
        let inRange = false;

        const selectedState = withinDates(day, date || dates);
        if (selectedState === 2) {
          selected = true;
        } else if (selectedState === 1) {
          inRange = true;
        }
        const dayDisabled =
          withinDates(day, disabled) || (bounds && !betweenDates(day, bounds));
        if (
          !firstDayInMonth &&
          !dayDisabled &&
          day.getMonth() === reference.getMonth()
        ) {
          firstDayInMonth = dateString;
        }

        if (!children) {
          days.push(
            <CalendarDay
              key={day.getTime()}
              buttonProps={{
                a11yTitle: day.toDateString(),
                active: active && active.getTime() === day.getTime(),
                disabled: dayDisabled && !!dayDisabled,
                onClick: () => {
                  selectDate(dateString);
                  announce(
                    `Selected ${formatToLocalYYYYMMDD(dateString, normalize)}`,
                    'assertive',
                  );
                  // Chrome moves the focus indicator to this button. Set
                  // the focus to the grid of days instead.
                  daysRef.current.focus();
                  setActive(new Date(dateString));
                },
                onMouseOver: () => setActive(new Date(dateString)),
                onMouseOut: () => setActive(undefined),
              }}
              isInRange={inRange}
              isSelected={selected}
              otherMonth={day.getMonth() !== reference.getMonth()}
              size={size}
              fill={fill}
            >
              {day.getDate()}
            </CalendarDay>,
          );
        } else {
          days.push(
            <CalendarCustomDay
              key={day.getTime()}
              buttonProps={
                onSelect
                  ? {
                      a11yTitle: day.toDateString(),
                      active: active && active.getTime() === day.getTime(),
                      disabled: dayDisabled && !!dayDisabled,
                      onClick: () => {
                        selectDate(dateString);
                        announce(
                          `Selected
                          ${formatToLocalYYYYMMDD(dateString, normalize)}`,
                          'assertive',
                        );
                        // Chrome moves the focus indicator to this button. Set
                        // the focus to the grid of days instead.
                        daysRef.current.focus();
                        setActive(new Date(dateString));
                      },
                      onMouseOver: () => setActive(new Date(dateString)),
                      onMouseOut: () => setActive(undefined),
                    }
                  : null
              }
              size={size}
              fill={fill}
            >
              {children({
                date: day,
                day: day.getDate(),
                isInRange: inRange,
                isSelected: selected,
              })}
            </CalendarCustomDay>,
          );
        }
      }
      day = addDays(day, 1);
    }
    weeks.push(
      <StyledWeek
        // if a week contains only blank days, for screen reader accessibility
        // we don't want to set role="row"
        role={!blankWeek ? 'row' : undefined}
        key={day.getTime()}
        fillContainer={fill}
      >
        {days}
      </StyledWeek>,
    );

    return (
      <StyledCalendar ref={ref} sizeProp={size} fillContainer={fill} {...rest}>
        <Box fill={fill}>
          {header
            ? header({
                date: reference,
                locale,
                onPreviousMonth: () => {
                  changeReference(previousMonth);
                  announce(
                    format({
                      id: 'calendar.previous',
                      messages,
                      values: {
                        date: previousMonth.toLocaleDateString(locale, {
                          month: 'long',
                          year: 'numeric',
                        }),
                      },
                    }),
                  );
                },
                onNextMonth: () => {
                  changeReference(nextMonth);
                  announce(
                    format({
                      id: 'calendar.next',
                      messages,
                      values: {
                        date: nextMonth.toLocaleDateString(locale, {
                          month: 'long',
                          year: 'numeric',
                        }),
                      },
                    }),
                  );
                },
                previousInBound: betweenDates(previousMonth, bounds),
                nextInBound: betweenDates(nextMonth, bounds),
              })
            : renderCalendarHeader(previousMonth, nextMonth)}
          {daysOfWeek && renderDaysOfWeek()}
          <Keyboard
            onEnter={() =>
              active !== undefined
                ? selectDate(active.toISOString())
                : undefined
            }
            onUp={(event) => {
              event.preventDefault();
              event.stopPropagation(); // so the page doesn't scroll
              setActive(addDays(active, -7));
              if (!betweenDates(addDays(active, -7), displayBounds)) {
                changeReference(addDays(active, -7));
              }
            }}
            onDown={(event) => {
              event.preventDefault();
              event.stopPropagation(); // so the page doesn't scroll
              setActive(addDays(active, 7));
              if (!betweenDates(addDays(active, 7), displayBounds)) {
                changeReference(active);
              }
            }}
            onLeft={() => {
              setActive(addDays(active, -1));
              if (!betweenDates(addDays(active, -1), displayBounds)) {
                changeReference(active);
              }
            }}
            onRight={() => {
              setActive(addDays(active, 1));
              if (!betweenDates(addDays(active, 2), displayBounds)) {
                changeReference(active);
              }
            }}
          >
            <StyledWeeksContainer
              tabIndex={0}
              role="grid"
              aria-label={`
                ${reference.toLocaleDateString(locale, {
                  month: 'long',
                  year: 'numeric',
                })};
                ${getAccessibilityString(date, dates, normalize)}
              `}
              ref={daysRef}
              sizeProp={size}
              fillContainer={fill}
              focus={focus}
              onFocus={() => {
                setFocus(true);
                // caller focused onto Calendar via keyboard
                if (!mouseDown) {
                  setActive(new Date(firstDayInMonth));
                }
              }}
              onBlur={() => {
                setFocus(false);
                setActive(undefined);
              }}
            >
              <StyledWeeks slide={slide} sizeProp={size} fillContainer={fill}>
                {weeks}
              </StyledWeeks>
            </StyledWeeksContainer>
          </Keyboard>
        </Box>
      </StyledCalendar>
    );
  },
);

Calendar.displayName = 'Calendar';
Calendar.propTypes = CalendarPropTypes;

export { Calendar };
