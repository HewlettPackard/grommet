export function filterByFocusable(elements) {
  return Array.prototype.filter.call(elements || [], (element) => {
    const currentTag = element.tagName.toLowerCase();
    const validTags = /(svg|a|area|input|select|textarea|button|iframe|div)$/;
    const isValidTag = currentTag.match(validTags) && element.focus;
    if (currentTag === 'a') {
      return isValidTag && element.childNodes.length > 0 &&
        element.getAttribute('href');
    } else if (currentTag === 'svg' || currentTag === 'div') {
      return (
        isValidTag && element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1'
      );
    }
    return isValidTag;
  });
}

export function findScrollParents(element, horizontal) {
  const result = [];
  if (element) {
    let parent = element.parentNode;
    while (parent && parent.getBoundingClientRect) {
      const rect = parent.getBoundingClientRect();
      // 10px is to account for borders and scrollbars in a lazy way
      if (horizontal) {
        if (rect.width && parent.scrollWidth > (rect.width + 10)) {
          result.push(parent);
        }
      } else if (rect.height && parent.scrollHeight > (rect.height + 10)) {
        result.push(parent);
      }
      parent = parent.parentNode;
    }
    // last scrollable element will be the document
    // if nothing else is scrollable in the page
    if (result.length === 0) {
      result.push(document);
    }
  }
  return result;
}

export function getBodyChildElements() {
  const excludeMatch = /^(script|link)$/i;
  const children = [];
  [].forEach.call(document.body.children, (node) => {
    if (!excludeMatch.test(node.tagName)) {
      children.push(node);
    }
  });
  return children;
}

export function getNewContainer() {
  // setup DOM
  const container = document.createElement('div');
  document.body.insertBefore(container, document.body.firstChild);
  return container;
}

export const setTabIndex = tabIndex => (element) => {
  element.setAttribute('tabindex', tabIndex);
};

export const copyAttribute = source => target => (element) => {
  element.setAttribute(target, element.getAttribute(source));
};

const deleteAttribute = attribute => element => (
  element.removeAttribute(attribute)
);

const unsetTabIndex = setTabIndex(-1);
const saveTabIndex = copyAttribute('tabindex')('data-g-tabindex');
const restoreTabIndex = copyAttribute('data-g-tabindex')('tabindex');
const deleteTabIndex = deleteAttribute('tabindex');
const deleteTabIndexCopy = deleteAttribute('data-g-tabindex');

export const makeNodeFocusable = (node) => {
  // do not touch aria live containers so that announcements work
  if (!node.hasAttribute('aria-live')) {
    node.setAttribute('aria-hidden', false);
    // allow children to receive focus again
    filterByFocusable(
      node.getElementsByTagName('*')
    ).forEach((child) => {
      if (child.hasAttribute('data-g-tabindex')) {
        restoreTabIndex(child);
      } else {
        deleteTabIndex(child);
      }
      deleteTabIndexCopy(child);
    });
  }
};

export const makeNodeUnfocusable = (node) => {
  // do not touch aria live containers so that announcements work
  if (!node.hasAttribute('aria-live')) {
    node.setAttribute('aria-hidden', true);
    // prevent children to receive focus
    filterByFocusable(
      node.getElementsByTagName('*')
    ).forEach((child) => {
      if (child.hasAttribute('tabindex')) {
        saveTabIndex(child);
      }
      unsetTabIndex(child);
    });
  }
};

export default {
  copyAttribute,
  filterByFocusable,
  findScrollParents,
  makeNodeFocusable,
  makeNodeUnfocusable,
  getBodyChildElements,
  getNewContainer,
  setTabIndex,
  unsetTabIndex,
};
