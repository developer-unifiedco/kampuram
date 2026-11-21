import pages from './pages.json';

export const sitePages = pages;

export type SitePage = keyof typeof sitePages;
