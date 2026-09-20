## Context

Magic-link verify is a redirecting GET on the auth service. A success sets
the session cookie and redirects to a trusted return. A failure today creates
no session and leaves the collector without a surface that explains why.
`shared/auth/sign-in` already refuses used, expired, and superseded links;
this change only adds the home + toast outcomes.

The `@grade10/ui` sign-in block owns the request dialog only. Notifications
stay with the application.

## Goals / Non-Goals

**Goals:**

- Map each verify refusal to one of three client reasons and land the
  collector on the brand home with the matching toast.
- Ship shared catalog strings and Storybook references in this store.

**Non-Goals:**

- Cross-tab session sync, success toasts, or a new shared UI export.
- Changing when verify creates a session.

## Decisions

### What the spec already governs

Expired, used, superseded, invalid, and banned follows create no session and
must toast on the brand home with the three announcements named in
`shared/auth/sign-in` (SC-37–SC-41).

### Failure signal rides the redirect query

On verify failure the auth handler redirects to the brand home with a single
query reason the client understands: `link_expired`, `link_invalid`, or
`link_banned`. The homepage reads it once, fires `toast.error` with the
matching `signIn` catalog string, and clears the reason from the URL.

Rejected alternatives:

- **Stay on `/auth/magic` with an error page** — leaves the collector off the
  product surface the toast is meant to accompany.
- **Cookie or flash store for the reason** — extra storage for a one-shot
  message; a query on the home redirect is enough and clears with history
  replace.
- **Separate toast copy for used vs superseded vs malformed** — the spec
  collapses them to `link_invalid` so the UI cannot leak which failure.

### Catalog and stories live here; firing stays in the app

`@grade10/i18n` adds `linkExpired`, `linkInvalid`, and `linkBanned`. Auth
Sign In Storybook stories mount `<Toast />` and show each string. The app
maps the query reason to those keys; `@grade10/ui` does not import the
catalog or call `toast` for verify.

## Risks / Trade-offs

- [Query reason left in a shared URL] → homepage clears it with a history
  replace as soon as the toast is queued.
- [Auth plugin returns one generic failure] → map every non-banned refusal
  that is not clearly expired onto `link_invalid`; only a known TTL expiry
  becomes `link_expired`.
- [Ban checked after token consume] → prefer refusing before consume when
  the plugin allows; if the token is spent, the banned toast still wins over
  “no longer works”.

## Migration Plan

1. Land catalog keys, stories, and the OpenSpec change in `grade10-spec`.
2. Bump the submodule in `grade10`; wire verify redirect reasons and the
   homepage toast reader.
3. Rollback: drop the homepage reader and stop appending the query; old
   clients ignore an unknown query.
