## Goals

- A collector reads every failure notice in the page's language.
- The platform decides a failure's kind once; every surface of either audience reads it.
- What a backend said stays in the technical account, for logs.

## Non-Goals

- Specific refusal reasons with catalog keys of their own.
- Translating the admin consoles.
- How a failure notice looks.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Should a refused-for-sign-in failure render words at all, rather than taking the collector to sign in? | It renders the words for a refused request, like every other `4xx`; no surface acts on the status, so sending the collector to sign in is its own change. Carried by the closed set of kinds in **The platform decides what kind a failure is, once** - decided by agent, 2026-10-16, taking the conservative option | A sign-in kind of its own, whose words promise a way to sign in the page does not offer |
| Q2 | Where does the one classification live? | `failureKindOf` in the shared data layer (`@grade10/utils/api-calls`), returning a key and no words; collector surfaces read it through `useFailureWords` in `@grade10/frontend-intl`, and the admin consoles' `readFailureOf` folds the same kind into its three operator causes - decided by agent, 2026-10-16 | A second classifier in the console, which could disagree with the collector's |
| Q3 | Must a surface show the kind's words where it already names what failed? | No: a surface's own catalog line for what failed, such as *Could not load your profile*, stays; the kind's words stand in wherever the surface had none or showed the backend's text. Carried by **Words from the catalogs** - decided by agent, 2026-10-16 | Replacing specific lines with generic ones |
| Q4 | What does an `ApiError` carry on `message`? | The technical account, the call and what came back, so a log line reads it; no view reads it - decided by agent, 2026-10-16 | English copy on `message`, the leak this change closes |
| Q5 | What does the card field say when Stripe cannot load, or has no key? | The surface's own catalog line for a declined card; the cause goes to the console. Stripe's own messages at confirmation, which Stripe renders in the page's locale, still pass through - decided by agent, 2026-10-16 | An English configuration message on a collector's screen |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/localization | Proposal: should a refused-for-sign-in failure render words, or take the collector to sign in? | Q1 |
