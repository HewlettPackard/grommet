import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { AnnounceContext } from '../../contexts/AnnounceContext';
import { MessageContext } from '../../contexts/MessageContext';

import { Box } from '../Box';
import { Button } from '../Button';
import { Header } from '../Header';
import { Heading } from '../Heading';
import { Keyboard } from '../Keyboard';
import { Text } from '../Text';

import { CalendarPropTypes } from './propTypes';
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
  handleOffset,
  sameDayOrAfter,
  sameDayOrBefore,
  startOfMonth,
  subtractDays,
  subtractMonths,
  withinDates,
} from './utils';
import { setHoursWithOffset } from '../../utils/dates';
import { useThemeValue } from '../../utils/useThemeValue';
import { useKeyboard } from '../../utils';

const headingPadMap = {
  small: 'xsmall',
  medium: 'small',
  large: 'medium',
};

const getLocaleString = (value, locale) =>
  value?.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const currentlySelectedString = (value, locale) => {
  let selected;
  if (value instanceof Date) {
    selected = `Currently selected ${getLocaleString(value, locale)};`;
  } else if (value?.length) {
    selected = `Currently selected ${value.map((item) => {
      let dates;
      if (!Array.isArray(item)) {
        dates = `${getLocaleString(item, locale)}`;
      } else {
        const start =
          item[0] !== undefined ? getLocaleString(item[0], locale) : 'none';
        const end =
          item[1] !== undefined ? getLocaleString(item[1], locale) : 'none';
        dates = `${start} through ${end}`;
      }
      return dates;
    })}`;
  } else {
    selected = 'No date selected';
  }

  return selected;
};

// calendar value may be a single date, multiple dates, a range of dates
// supplied as ISOstrings.
const normalizeInput = (dateValue) => {
  let result;
  if (dateValue instanceof Date) {
    result = dateValue;
  }
  // date may be an empty string ''
  else if (typeof dateValue === 'string' && dateValue.length) {
    result = setHoursWithOffset(dateValue);
  } else if (Array.isArray(dateValue)) {
    result = dateValue.map((d) => normalizeInput(d));
  }
  return result;
};

const normalizeOutput = (dateValue, outputFormat) => {
  let result;

  const normalize = (value) => {
    let normalizedValue = value.toISOString();
    if (normalizedValue && outputFormat === 'no timezone') {
      [normalizedValue] = handleOffset(normalizedValue)
        .toISOString()
        .split('T');
    }
    return normalizedValue;
  };

  if (dateValue instanceof Date) {
    result = normalize(dateValue);
  } else if (typeof dateValue === 'undefined') {
    result = undefined;
  } else {
    result = dateValue.map((d) => normalizeOutput(d, outputFormat));
  }
  return result;
};

// format value to [[]] for internal functions
const normalizeRange = (value, activeDate) => {
  let range = value;
  if (range instanceof Date)
    range =
      activeDate === 'start' ? [[undefined, range]] : [[range, undefined]];
  else if (Array.isArray(range) && !Array.isArray(range[0])) range = [range];

  return range;
};

const getReference = (reference, value) => {
  let nextReference;
  if (value) {
    if (Array.isArray(value)) {
      if (value[0] instanceof Date) {
        [nextReference] = value;
      } else if (Array.isArray(value[0])) {
        nextReference = value[0][0] ? value[0][0] : value[0][1];
      } else {
        nextReference = new Date();
        nextReference.setHours(0, 0, 0, 0);
      }
    } else nextReference = value;
  } else if (reference) {
    nextReference = reference;
  } else {
    nextReference = new Date();
    nextReference.setHours(0, 0, 0, 0);
  }
  return nextReference;
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

const disabledCalendarPreviousMonthButton = (date, reference, bounds) => {
  if (!bounds) return false;

  const lastBound = new Date(bounds[1]);

  return !sameDayOrBefore(lastBound, reference) && !betweenDates(date, bounds);
};

const disabledCalendarNextMonthButton = (date, reference, bounds) => {
  if (!bounds) return false;

  const firstBound = new Date(bounds[0]);

  return !sameDayOrAfter(firstBound, reference) && !betweenDates(date, bounds);
};

export const getOutputFormat = (dates) => {
  if (typeof dates === 'string' && dates?.indexOf('T') === -1) {
    return 'no timezone';
  }
  if (Array.isArray(dates)) {
    return getOutputFormat(dates[0]);
  }
  return 'date timezone';
};

const millisecondsPerYear = 31557600000;

// when caller opts in to day hover styling, apply all state styles
// on CalendarDay instead of active state on CalendarDayButton
const CalendarDayButton = styled(Button)`
  ${(props) =>
    props.theme.calendar?.day?.hover?.background && 'background: inherit;'}
`;

const CalendarDay = ({
  children,
  fill,
  size,
  isInRange,
  isSelected,
  otherMonth,
  rangePosition,
  buttonProps = {},
}) => {
  const { passThemeFlag } = useThemeValue();
  const usingKeyboard = useKeyboard();

  return (
    <StyledDayContainer
      role="gridcell"
      inRange={isInRange}
      isSelected={isSelected}
      rangePosition={rangePosition}
      sizeProp={size}
      fillContainer={fill}
    >
      <CalendarDayButton fill={fill} tabIndex={-1} plain {...buttonProps}>
        {({ active, hover }) => (
          <StyledDay
            // only apply active styling when using keyboard
            // otherwise apply hover styling
            active={usingKeyboard ? active : undefined}
            disabledProp={buttonProps.disabled}
            hover={hover}
            inRange={isInRange}
            isSelected={isSelected}
            otherMonth={otherMonth}
            sizeProp={size}
            fillContainer={fill}
            {...passThemeFlag}
          >
            {children}
          </StyledDay>
        )}
      </CalendarDayButton>
    </StyledDayContainer>
  );
};

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
      level,
      locale = 'en-US',
      messages,
      onReference,
      onSelect,
      range,
      reference: referenceProp,
      showAdjacentDays = true,
      size = 'medium',
      timestamp: timestampProp,
      simpleSelection = false,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
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

    // set activeDate when caller changes it, allows us to change
    // it internally too
    const [activeDate, setActiveDate] = useState(
      dateProp && typeof dateProp === 'string' && range ? 'end' : 'start',
    );
    useEffect(() => {
      if (activeDateProp) setActiveDate(activeDateProp);
    }, [activeDateProp]);

    const [value, setValue] = useState(normalizeInput(dateProp || datesProp));
    useEffect(() => {
      const val = dateProp || datesProp;
      setValue(normalizeInput(val));
    }, [dateProp, datesProp]);

    const [reference, setReference] = useState(
      getReference(normalizeInput(referenceProp), value),
    );
    useEffect(() => {
      if (value) {
        setReference(getReference(normalizeInput(referenceProp), value));
      }
    }, [referenceProp, value]);

    const [outputFormat, setOutputFormat] = useState(
      getOutputFormat(dateProp || datesProp),
    );
    useEffect(() => {
      setOutputFormat(getOutputFormat(dateProp || datesProp));
    }, [dateProp, datesProp]);

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
      // if the reference timezone has changed (e.g., controlled component),
      // both ends of the displayBounds should inherit that new timestamp
      if (targetDisplayBounds) {
        if (
          targetDisplayBounds[0].getTime() < displayBounds[0].getTime() ||
          targetDisplayBounds[1].getTime() > displayBounds[1].getTime()
        ) {
          setDisplayBounds([targetDisplayBounds[0], targetDisplayBounds[1]]);
        }
        if (targetDisplayBounds[0].getTime() < displayBounds[0].getTime()) {
          // only animate if the duration is within a year
          if (
            displayBounds[0].getTime() - targetDisplayBounds[0].getTime() <
              millisecondsPerYear &&
            daysApart(displayBounds[0], targetDisplayBounds[0])
          ) {
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
              millisecondsPerYear &&
            daysApart(targetDisplayBounds[1], displayBounds[1])
          ) {
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

    const handleReference = useCallback(
      (nextReference) => {
        setReference(nextReference);
        if (onReference) onReference(nextReference.toISOString());
      },
      [onReference],
    );

    const changeReference = useCallback(
      (nextReference) => {
        if (betweenDates(nextReference, bounds)) handleReference(nextReference);
      },
      [handleReference, bounds],
    );

    const changeCalendarMonth = (messageId, newMonth) => {
      handleReference(newMonth);

      announce(
        format({
          id: messageId,
          messages,
          values: {
            date: newMonth.toLocaleDateString(locale, {
              month: 'long',
              year: 'numeric',
            }),
          },
        }),
      );
    };

    const handleRange = useCallback(
      (selectedDate) => {
        console.log(simpleSelection);
        let result;
        const priorRange = normalizeRange(value, activeDate);
        // deselect when date clicked was the start/end of the range
        if (selectedDate.getTime() === priorRange?.[0]?.[0]?.getTime()) {
          result = [[undefined, priorRange[0][1]]];
          setActiveDate('start');
        } else if (selectedDate.getTime() === priorRange?.[0]?.[1]?.getTime()) {
          result = [[priorRange[0][0], undefined]];
          setActiveDate('end');
        }

        // selecting start date
        else if (activeDate === 'start') {
          if (simpleSelection) {
            result = [[selectedDate, undefined]];
          } else if (!priorRange) {
            result = [[selectedDate, undefined]];
          } else if (!priorRange[0][1]) {
            result = [[selectedDate, priorRange[0][1]]];
          } else if (selectedDate.getTime() < priorRange[0][1].getTime()) {
            result = [[selectedDate, priorRange[0][1]]];
          } else if (selectedDate.getTime() > priorRange[0][1].getTime()) {
            result = [[selectedDate, undefined]];
          }
          setActiveDate('end');
        } else {
          // selecting end date
          // swap if start date is after end date
          if (
            simpleSelection &&
            selectedDate.getTime() < priorRange?.[0]?.[0]?.getTime()
          ) {
            result = [[selectedDate, priorRange[0][0]]];
          } else if (simpleSelection) {
            result = [[priorRange[0][0], selectedDate]];
          } else if (!priorRange) {
            result = [[undefined, selectedDate]];
            setActiveDate('start');
          } else if (selectedDate.getTime() < priorRange[0][0].getTime()) {
            result = [[selectedDate, undefined]];
            setActiveDate('end');
          } else if (selectedDate.getTime() > priorRange[0][0].getTime()) {
            result = [[priorRange[0][0], selectedDate]];
          }
          setActiveDate('start');
        }

        // If no dates selected, always return undefined; else format
        // result according to specified range value.
        if (result[0].includes(undefined)) {
          if (range === 'array') {
            result = !result[0][0] && !result[0][1] ? undefined : result;
          } else {
            result = result[0].find((d) => d !== undefined);
          }
        }
        setValue(result);
        return result;
      },
      [activeDate, value, range],
    );

    const selectDate = useCallback(
      (selectedDate) => {
        let nextValue;

        if (range || Array.isArray(value?.[0])) {
          nextValue = handleRange(selectedDate);
        } else {
          nextValue = selectedDate;
        }

        if (onSelect) {
          nextValue = normalizeOutput(nextValue, outputFormat);
          onSelect(nextValue);
        }
      },
      [handleRange, onSelect, outputFormat, range, value],
    );

    const onClick = (selectedDate) => {
      selectDate(selectedDate);
      announce(
        `Selected ${getLocaleString(selectedDate, locale)}`,
        'assertive',
      );
      // Chrome moves the focus indicator to this button. Set
      // the focus to the grid of days instead.
      daysRef.current.focus();
      setActive(selectedDate);
    };

    const renderCalendarHeader = () => {
      const PreviousIcon =
        size === 'small'
          ? theme.calendar.icons.small.previous
          : theme.calendar.icons.previous;

      const NextIcon =
        size === 'small'
          ? theme.calendar.icons.small.next
          : theme.calendar.icons.next;

      const monthAndYear = reference.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric',
      });

      // theme.calendar.heading.level should be removed in v3 of grommet
      // theme.calendar[size].title should be used instead
      let headingLevel;
      if (level !== undefined) {
        headingLevel = level;
      } else if (size === 'small') {
        headingLevel =
          (theme.calendar.heading && theme.calendar.heading.level) || 4;
      } else {
        headingLevel =
          ((theme.calendar.heading && theme.calendar.heading.level) || 4) - 1;
      }

      return (
        <Box direction="row" justify="between" align="center">
          <Header flex pad={{ horizontal: headingPadMap[size] || 'small' }}>
            {theme.calendar[size]?.title ? (
              <Text {...theme.calendar[size].title}>{monthAndYear}</Text>
            ) : (
              <Heading
                level={headingLevel}
                size={size}
                margin="none"
                overflowWrap="normal"
              >
                {monthAndYear}
              </Heading>
            )}
          </Header>
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
              disabled={disabledCalendarPreviousMonthButton(
                previousMonth,
                reference,
                bounds,
              )}
              onClick={() =>
                changeCalendarMonth('calendar.previousMove', previousMonth)
              }
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
              disabled={disabledCalendarNextMonthButton(
                nextMonth,
                reference,
                bounds,
              )}
              onClick={() =>
                changeCalendarMonth('calendar.nextMove', nextMonth)
              }
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
            <StyledDay sizeProp={size} fillContainer={fill}>
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
        const dateObject = day;
        // this.dayRefs[dateObject] = React.createRef();
        let selected = false;
        let inRange = false;
        let rangePosition;

        const [selectedState] = withinDates(
          day,
          range ? normalizeRange(value, activeDate) : value,
        );
        if (selectedState === 2) {
          selected = true;
          [, rangePosition] = withinDates(
            day,
            range ? normalizeRange(value, activeDate) : value,
          );
        } else if (selectedState === 1) {
          inRange = true;
        }
        const dayDisabled =
          withinDates(day, normalizeInput(disabled))[0] ||
          (bounds && !betweenDates(day, normalizeInput(bounds)));
        if (
          !firstDayInMonth &&
          !dayDisabled &&
          day.getMonth() === reference.getMonth()
        ) {
          firstDayInMonth = dateObject;
        }

        if (!children) {
          days.push(
            <CalendarDay
              key={day.getTime()}
              buttonProps={{
                a11yTitle: day.toDateString(),
                active: active && active.getTime() === day.getTime(),
                disabled: dayDisabled && !!dayDisabled,
                onClick: () => onClick(dateObject),
                onMouseOver: () => setActive(dateObject),
                onMouseOut: () => setActive(undefined),
              }}
              isInRange={inRange}
              isSelected={selected}
              otherMonth={day.getMonth() !== reference.getMonth()}
              rangePosition={rangePosition}
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
                      onClick: () => onClick(dateObject),
                      onMouseOver: () => setActive(dateObject),
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
      <StyledCalendar
        ref={ref}
        sizeProp={size}
        fillContainer={fill}
        {...passThemeFlag}
        {...rest}
      >
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
          <Box fill role="grid">
            {daysOfWeek && renderDaysOfWeek()}
            <Keyboard
              onEnter={() =>
                active !== undefined ? onClick(active) : undefined
              }
              onSpace={(event) => {
                event.preventDefault();
                if (active !== undefined) {
                  onClick(active);
                }
              }}
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
                role="rowgroup"
                aria-label={`${reference.toLocaleDateString(locale, {
                  month: 'long',
                  year: 'numeric',
                })}; ${currentlySelectedString(value, locale)}`}
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
                {...passThemeFlag}
              >
                <StyledWeeks
                  slide={slide}
                  sizeProp={size}
                  fillContainer={fill}
                  {...passThemeFlag}
                >
                  {weeks}
                </StyledWeeks>
              </StyledWeeksContainer>
            </Keyboard>
          </Box>
        </Box>
      </StyledCalendar>
    );
  },
);

Calendar.displayName = 'Calendar';
Calendar.propTypes = CalendarPropTypes;

export { Calendar };
