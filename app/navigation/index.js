import document from 'document';
import { gettext } from "i18n";

let pages = {};

// initialize navigation
export function init(router) {
  pages = router;
}

// get current page
export function getPage() {
  const re = /.*\/+(.*)+\..*/;
  return document.location.pathname.replace(re, '$1');
}

// when page unloads (swipe back)
export function onUnload() {
  const page = getPage();
  if (pages[page] && pages[page].destroy) pages[page].destroy();
}

// navigate to another page
export async function switchPage(nextPage, stack) {
  const pagePath = `./resources/pages/${nextPage}.view`;

  // when page is not the same as current page
  if (pagePath !== document.location.pathname) {
    const page = getPage();
    if (stack) {
      await document.location.assign(pagePath);
    } else {
      await document.location.replace(pagePath);
    }

    // set swipe back handler
    document.onbeforeunload = onUnload;

    // destroy previous page
    if (!stack && pages[page] && pages[page].destroy) pages[page].destroy();

    // make sure to destroy new page first so we start off from an empty slate
    if (pages[nextPage] && pages[nextPage].destroy) pages[nextPage].destroy();

    // start up new page
    if (pages[nextPage] && pages[nextPage].init) pages[nextPage].init();
  }
}
