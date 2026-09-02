/**
 * What the dev server calls out when a file under the store changes. It travels
 * over the socket HMR uses because none of what the manual renders is a module:
 * a page, a spec, a change, and the design-sync report are read from disk per
 * request, so there is nothing for Vite to invalidate on its own.
 */
export const STORE_CHANGED = "manual-store:changed";
