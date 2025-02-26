import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLayoutEffect } from '../../utils/use-isomorphic-layout-effect';
import {
  findScrollParent,
  findScrollParents,
  isNodeAfterScroll,
  isNodeBeforeScroll,
} from '../../utils';
import { Box } from '../Box';
import { InfiniteScrollPropTypes } from './propTypes';

const calculateLastPageBound = (show, step) =>
  show ? Math.floor((show + step) / step) - 1 : 0;

const InfiniteScroll = ({
  children,
  items = [],
  onMore,
  renderMarker,
  replace,
  show,
  step = 50,
}) => {
  // item index to be made visible initially
  const [scrollShow, setScrollShow] = useState();

  // the last page we have items for
  const lastPage = useMemo(
    () => Math.max(0, Math.ceil(items.length / step) - 1),
    [items.length, step],
  );

  // the pages we are rendering
  const [renderPageBounds, setRenderPageBounds] = useState([
    0,
    calculateLastPageBound(show, step),
  ]);

  // the heights of the pages, approximated after we render the first page
  // and then updated for pages that have rendered
  const [pageHeights, setPageHeights] = useState([]);

  // what we're waiting for onMore to give us
  const [pendingLength, setPendingLength] = useState(0);

  const aboveMarkerRef = useRef(); // only when replacing
  const belowMarkerRef = useRef();

  // scroll and resize handling
  useEffect(() => {
    let scrollParents;

    const evaluate = () => {
      if (!scrollParents) return;
      const scrollParent = scrollParents[0];

      // Determine the scroll position of the scroll container
      let top;
      let height;
      if (scrollParent === document) {
        top = document.documentElement.scrollTop || document.body.scrollTop;
        height = window.innerHeight;
      } else {
        top = scrollParent.scrollTop;
        const rect = scrollParent.getBoundingClientRect();
        ({ height } = rect);
      }
      const offset = height / 4; // so we pre-load when the user scrolls slowly

      // Use the pageHeights to determine what pages we should render based
      // on the current scroll window.
      let nextBeginPage = 0;
      let index = 0;
      let pagesHeight = pageHeights[index] || 0;
      while (pageHeights[index + 1] && pagesHeight < top - offset) {
        index += 1;
        nextBeginPage += 1;
        pagesHeight += pageHeights[index];
      }
      let nextEndPage = nextBeginPage;
      while (
        pageHeights[index] !== undefined &&
        pagesHeight < top + height + offset
      ) {
        index += 1;
        nextEndPage += 1;
        // when we haven't rendered the nextEndPage and we aren't replacing,
        // we might not have a height for it yet
        pagesHeight += pageHeights[index] || 0;
      }

      if (!replace) {
        // when not replacing, never shrink bounds
        nextBeginPage = 0;
        nextEndPage = Math.max(renderPageBounds[1], nextEndPage);
      }

      if (show >= 0) {
        // ensure we try to render any show page
        const showPage = calculateLastPageBound(show, step);
        nextBeginPage = Math.min(showPage, nextBeginPage);
        nextEndPage = Math.max(showPage, nextEndPage);
      }

      if (
        nextBeginPage !== renderPageBounds[0] ||
        nextEndPage !== renderPageBounds[1]
      ) {
        setRenderPageBounds([nextBeginPage, nextEndPage]);
      }
    };

    let timer;
    const debounce = () => {
      clearTimeout(timer);
      timer = setTimeout(evaluate, 10);
    };

    // might not be there yet or might have already rendered everything
    if (belowMarkerRef.current) {
      scrollParents = findScrollParents(belowMarkerRef.current);
      scrollParents.forEach((sp) => sp.addEventListener('scroll', debounce));
    }
    window.addEventListener('resize', debounce);
    evaluate();
    return () => {
      if (scrollParents) {
        scrollParents.forEach((sp) =>
          sp.removeEventListener('scroll', debounce),
        );
      }
      window.removeEventListener('resize', debounce);
      clearTimeout(timer);
    };
  }, [pageHeights, renderPageBounds, replace, show, step]);

  // check if we need to ask for more
  useEffect(() => {
    if (
      onMore &&
      renderPageBounds[1] === lastPage &&
      items.length >= pendingLength &&
      items.length > 0
    ) {
      // remember we've asked for more, so we don't keep asking if it takes
      // a while
      setPendingLength(items.length + 1);
      onMore();
    }
  }, [items.length, lastPage, onMore, pendingLength, renderPageBounds, step]);

  useEffect(() => {
    if (items.length === 0 && lastPage === 0 && pendingLength !== 0) {
      setPageHeights([]);
      setPendingLength(0);
      setRenderPageBounds([0, calculateLastPageBound(show, step)]);
    }
  }, [lastPage, pendingLength, show, step, items.length]);

  // scroll to any 'show'
  useLayoutEffect(() => {
    // ride out any animation delays, 100ms empirically measured
    const timer = setTimeout(() => {
      if (show >= 0 && belowMarkerRef.current && show !== scrollShow) {
        // calculate show index based on beginPage
        const showIndex =
          show - renderPageBounds[0] * step + (renderPageBounds[0] ? 1 : 0);
        const showNode =
          belowMarkerRef.current.parentNode.children.item(showIndex);
        if (showNode) {
          const scrollParent = findScrollParent(showNode);
          if (isNodeBeforeScroll(showNode, scrollParent)) {
            showNode.scrollIntoView(true);
          } else if (isNodeAfterScroll(showNode, scrollParent)) {
            showNode.scrollIntoView(false);
          }
          // clean up after having shown
          setScrollShow(show);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
    // Omitting scrollShow as a dependency due to concern that setScrollShow
    // is being called within the timer. If left included, re-renders and other
    // dependency values could change in an unpredictable manner during timer
    // and potentially result in an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderPageBounds, show, step]);

  // calculate and keep track of page heights
  useLayoutEffect(() => {
    // if don't have a belowMarker, we must have rendered everything already
    if (!belowMarkerRef.current) return;

    // calculate page heights for rendered pages
    const {
      current: {
        parentNode: { children: rendered },
      },
    } = belowMarkerRef;
    // ensure we've rendered the state we have
    // above? + items in rendered pages + below === rendered DOM elements length
    if (
      (aboveMarkerRef.current ? 1 : 0) +
        (renderPageBounds[1] - renderPageBounds[0] + 1) * step +
        1 ===
      rendered.length
    ) {
      let nextPageHeights;

      // step through each page
      let i = renderPageBounds[0];
      let lastBottom;
      while (i <= renderPageBounds[1]) {
        const topIndex =
          (aboveMarkerRef.current ? 1 : 0) + (i - renderPageBounds[0]) * step;
        const bottomIndex = Math.min(topIndex + step - 1, rendered.length - 1);
        // we use lastBottom for top to ensure grid layouts work
        const top =
          lastBottom !== undefined
            ? lastBottom
            : rendered.item(topIndex).getBoundingClientRect().top;
        const { bottom } = rendered.item(bottomIndex).getBoundingClientRect();
        const height = bottom - top;
        if (bottom && (!pageHeights || pageHeights[i] !== height)) {
          if (!nextPageHeights) nextPageHeights = [...(pageHeights || [])];
          nextPageHeights[i] = height;
        }
        lastBottom = bottom;
        i += 1;
      }

      // estimate page heights for pages we haven't rendered yet
      while (replace && i <= lastPage) {
        if (!pageHeights[i] && pageHeights[i] !== pageHeights[0]) {
          if (!nextPageHeights) nextPageHeights = [...(pageHeights || [])];
          [nextPageHeights[i]] = nextPageHeights; // set to first page height
        }
        i += 1;
      }

      if (nextPageHeights) setPageHeights(nextPageHeights);
    }
  }, [lastPage, pageHeights, renderPageBounds, replace, step]);

  // calculate the height above the first rendered page using the pageHeights
  const aboveHeight = useMemo(() => {
    if (!replace) return 0;
    let height = 0;
    let i = 0;
    while (i < renderPageBounds[0]) {
      height += pageHeights[i] || 0;
      i += 1;
    }
    return height;
  }, [pageHeights, renderPageBounds, replace]);

  // calculate the height below the last rendered page using the pageHeights
  const belowHeight = useMemo(() => {
    if (!replace) return 0;
    let height = 0;
    let i = renderPageBounds[1] + 1;
    while (i <= lastPage) {
      height += pageHeights[i] || 0;
      i += 1;
    }
    return height;
  }, [lastPage, pageHeights, renderPageBounds, replace]);

  const firstIndex = renderPageBounds[0] * step;
  const lastIndex =
    Math.min((renderPageBounds[1] + 1) * step, items.length) - 1;

  const result = [];

  if (aboveHeight) {
    let marker = (
      <Box
        key="above"
        ref={aboveMarkerRef}
        flex={false}
        height={`${aboveHeight}px`}
      />
    );
    if (renderMarker) {
      // need to give it a key
      marker = React.cloneElement(renderMarker(marker), { key: 'above' });
    }
    result.push(marker);
  }

  items.slice(firstIndex, lastIndex + 1).forEach((item, index) => {
    const itemsIndex = firstIndex + index;
    const child = children(item, itemsIndex);
    result.push(child);
  });

  if (replace || renderPageBounds[1] < lastPage || onMore) {
    let marker = (
      <Box
        key="below"
        ref={(!renderMarker && belowMarkerRef) || undefined}
        flex={false}
        height={`${belowHeight || 0}px`}
      />
    );
    if (renderMarker) {
      // need to give it a key
      const renderedMarker = renderMarker(marker);
      marker = React.cloneElement(renderedMarker, {
        key: 'below',
        // We need to make sure our belowMarkerRef is tied to a component
        // that has the same parent as the items being rendered. This is so
        // we can use belowMarkerRef.current.parentNode.children to
        // get a reference to the items in the DOM for calculating pageHeights.
        //
        // Since the caller might have included a ref in what their
        // renderMarker returns, we have to take care of both refs.
        // https://github.com/facebook/react/issues/8873#issuecomment-489579878
        ref: (node) => {
          // Keep your own reference
          belowMarkerRef.current = node;
          // Call the original ref, if any
          const { ref } = renderedMarker;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref !== null) {
            ref.current = node;
          }
        },
      });
    }
    result.push(marker);
  }

  return result;
};

InfiniteScroll.propTypes = InfiniteScrollPropTypes;

export { InfiniteScroll };
