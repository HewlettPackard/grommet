import React, { forwardRef, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataContext } from '../../contexts/DataContext';
import { Box } from '../Box';
import { Nav } from '../Nav';
import { PageControl } from './PageControl';
import { PaginationStep } from './PaginationStep';
import { PaginationSummary } from './PaginationSummary';
import { PaginationPropTypes } from './propTypes';
import { useThemeValue } from '../../utils/useThemeValue';

const StyledPaginationContainer = styled(Box)`
  ${(props) =>
    props.theme.pagination.container && props.theme.pagination.container.extend}
`;

const getPageIndices = (begin, end) => {
  const indices = [];
  for (let i = begin; i <= end; i += 1) {
    indices.push(i);
  }
  return indices;
};

const Pagination = forwardRef(
  (
    {
      a11yTitle,
      'aria-label': ariaLabel,
      numberItems,
      numberEdgePages = 1, // number of pages at each edge of page indices
      // number of page controls in the middle
      numberMiddlePages: numberMiddlePagesProp = 3,
      onChange,
      messages,
      page: pageProp,
      size,
      step: stepProp,
      stepOptions,
      summary,
      ...rest
    },
    ref,
  ) => {
    const { theme, passThemeFlag } = useThemeValue();
    const { onView, filteredTotal, view } = useContext(DataContext);
    const [step, setStep] = useState(stepProp || view?.step || 10);
    const total = numberItems ?? filteredTotal ?? 0;
    const page = pageProp || view?.page || 1;

    /* Calculate total number pages */
    const totalPages = Math.ceil(total / step);
    const [activePage, setActivePage] = useState(
      Math.min(page, totalPages) || 1,
    );

    useEffect(() => {
      if (stepProp) setStep(stepProp);
    }, [stepProp]);

    useEffect(() => {
      setActivePage(page);
      const pageEvent = new Event('pagechange');
      window.dispatchEvent(pageEvent);
    }, [page]);

    useEffect(() => {
      // if we are getting the step or page from outside the view,
      // update the Data's view in case it needs to filter.
      if (onView && (view?.step !== step || view?.page !== page))
        onView({ ...view, page, step });
    }, [onView, page, step, view]);

    /* Define page indices to display */
    const beginPages = getPageIndices(1, Math.min(numberEdgePages, totalPages));
    const endPages = getPageIndices(
      Math.max(totalPages - numberEdgePages + 1, numberEdgePages + 1),
      totalPages,
    );

    let numberMiddlePages;
    if (numberMiddlePagesProp < 1) {
      numberMiddlePages = 1;
      console.warn(
        // eslint-disable-next-line max-len
        `Property "numberMiddlePages" should not be < 1. One middle page button will be shown. Set "numberMiddlePages" >= 1 to remove this warning.`,
      );
    } else numberMiddlePages = numberMiddlePagesProp;

    let startingMiddlePages;
    // odd
    if (numberMiddlePages % 2)
      startingMiddlePages = Math.min(
        activePage - Math.floor(numberMiddlePages / 2),
        totalPages - numberEdgePages - numberMiddlePages,
      );
    // even, cannot split equally around active page
    // let extra page appear on middlePagesEnd instead
    else
      startingMiddlePages = Math.min(
        activePage - Math.floor(numberMiddlePages / 2) + 1,
        totalPages - numberEdgePages - numberMiddlePages,
      );

    const middlePagesBegin = Math.max(startingMiddlePages, numberEdgePages + 2);
    const middlePagesEnd = Math.min(
      Math.max(
        activePage + Math.floor(numberMiddlePages / 2),
        numberEdgePages + numberMiddlePages + 1,
      ),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
    );

    const middlePages = getPageIndices(middlePagesBegin, middlePagesEnd);

    let beginFlex = [];
    if (middlePagesBegin > numberEdgePages + 2) beginFlex = ['more-prev'];
    else if (numberEdgePages + 1 < totalPages - numberEdgePages)
      beginFlex = [numberEdgePages + 1];

    let endFlex = [];
    if (middlePagesEnd < totalPages - numberEdgePages - 1)
      endFlex = ['more-next'];
    else if (totalPages - numberEdgePages > numberEdgePages)
      endFlex = [totalPages - numberEdgePages];

    const getItemIndices = (nextPage) => {
      const startIndex = step * (nextPage - 1);
      const endIndex = startIndex + step;
      return { startIndex, endIndex };
    };

    const handleClick = (event, nextPage) => {
      setActivePage(nextPage);

      if (onView) onView({ ...view, page: nextPage });

      if (onChange) {
        event.persist();
        const adjustedEvent = event;
        adjustedEvent.page = nextPage;

        // for controlled use cases, provide user with info on
        // what range of indices should be displayed given the active page
        const { startIndex, endIndex } = getItemIndices(nextPage);
        adjustedEvent.startIndex = startIndex;
        adjustedEvent.endIndex = endIndex;
        onChange(adjustedEvent);
      }
    };

    const NextIcon = theme.pagination.icons.next;
    const PreviousIcon = theme.pagination.icons.previous;
    const iconColor = theme.pagination.icons.color;

    const navProps = {
      next: {
        // https://a11y-style-guide.com/style-guide/section-navigation.html#kssref-navigation-pagination
        'aria-disabled': activePage === totalPages ? 'true' : undefined,
        disabled: activePage === totalPages || !total,
        icon: <NextIcon color={iconColor} />,
        onClick: (event) => {
          const nextPage = activePage + 1;
          handleClick(event, nextPage);
        },
        label: undefined,
      },
      previous: {
        'aria-disabled': activePage === 1 ? 'true' : undefined,
        disabled: activePage === 1 || !total,
        icon: <PreviousIcon color={iconColor} />,
        onClick: (event) => {
          const previousPage = activePage - 1;
          handleClick(event, previousPage);
        },
        label: undefined,
      },
    };

    let controls = [
      'previous',
      ...beginPages,
      ...beginFlex, // either "..." or single page to bridge start + middle
      ...middlePages,
      ...endFlex, // either "..." or single page to bridge middle + end
      ...endPages,
      'next',
    ];

    /* Set props for each page index. Each page index should display a
     * clickable index, control, or placeholder (e.g. ellipsis) indicating
     * more pages are available.
     */
    controls = controls.map((control) => ({
      active: control === activePage,
      a11yTitle:
        typeof control === 'number'
          ? `Go to page ${control}`
          : `Go to ${control} page`,
      // https://a11y-style-guide.com/style-guide/section-navigation.html#kssref-navigation-pagination
      // https://www.w3.org/TR/wai-aria-1.1/#aria-current
      'aria-current': control === activePage ? 'page' : undefined,
      control,
      onClick: (event) => {
        handleClick(event, control);
      },
      separator: control === 'more-prev' || control === 'more-next',
      ...navProps[control],
    }));

    const paginationControls = (
      <Nav
        a11yTitle={ariaLabel || a11yTitle || 'Pagination Navigation'}
        ref={ref}
      >
        <Box as="ul" {...theme.pagination.controls} cssGap>
          {controls.map((control, index) => (
            /* Using index as key (as opposed to a unique id) seems to
             * help React prioritize rendering the updated controls as
             * desired. Whereas, using a unique id resulted in rendering
             * the active control with an undesired lag. */
            // eslint-disable-next-line react/no-array-index-key
            <PageControl key={index} size={size} {...control} />
          ))}
        </Box>
      </Nav>
    );

    // for backwards compatibility
    if (!summary && !stepOptions)
      return (
        <StyledPaginationContainer
          flex={false}
          {...theme.pagination.container}
          {...passThemeFlag}
          {...rest}
        >
          {paginationControls}
        </StyledPaginationContainer>
      );

    return (
      <StyledPaginationContainer
        direction="row"
        align="center"
        gap={{ column: 'xsmall', row: 'small' }}
        wrap
        flex={false}
        {...theme.pagination.container}
        {...passThemeFlag}
        {...rest}
      >
        <Box flex="grow">
          {summary && (
            <PaginationSummary
              messages={messages}
              page={activePage}
              step={step}
              numberItems={total}
            />
          )}
        </Box>
        <Box
          align="center"
          direction="row"
          gap={{ column: 'xsmall', row: 'small' }}
          wrap
        >
          {stepOptions && (
            <PaginationStep
              messages={messages}
              options={Array.isArray(stepOptions) ? stepOptions : undefined}
              step={step}
              onChange={({ value }) => {
                setStep(value);
                const newTotal = Math.ceil(total / value);
                if (activePage > newTotal) {
                  setActivePage(newTotal);
                  if (onView) onView({ ...view, page: newTotal });
                }
              }}
            />
          )}
          {paginationControls}
        </Box>
      </StyledPaginationContainer>
    );
  },
);

Pagination.displayName = 'Pagination';
Pagination.propTypes = PaginationPropTypes;

export { Pagination };
