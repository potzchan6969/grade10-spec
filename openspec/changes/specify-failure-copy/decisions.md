## Goals

- The durable `shared/localization` spec states how a failure notice is classified and worded.
- A card refusal is specified as shipped: the catalog's declined line, never the provider's text.

## Non-Goals

- Any code change; the behaviour ships.
- Specific refusal reasons with catalog keys of their own.
- Translating the admin consoles; they answer the same kinds in their own English.
- A sign-in kind or a redirect to sign in.
- How a failure notice looks: placement, tone and the retry affordance.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How do the shipped failure rules reach the durable spec? | A spec-only change that carries the two requirements and scenarios SC-33 to SC-37 - decided by the round | Leaving them unspecced behind the PRD prose, where a later change could break them unnoticed |
| Q2 | Does the PRD page need a 🚧 line? | No: `page_waived`, because the behaviour already ships and nothing is still being delivered - decided by the round | A 🚧 line on the localization page, which would claim delivery still to come |
| Q3 | What does the card field say when Stripe refuses a confirmation? | The surface's own catalog line for a declined card; the cause goes to the console. This supersedes the dropped change's Q5, which let Stripe's confirmation message pass through - decided by the round | Stripe's own message on screen, which contradicts "nothing from the backend" and is not what ships |
| Q4 | Should a refused-for-sign-in failure render words, or send the collector to sign in? | It renders the words for a refused request, like every other `4xx`; no surface acts on the status, so a redirect is its own change. Taken by an agent on 2026-10-16 and confirmed by the author - decided by the round | A sign-in kind of its own, whose words promise a way to sign in that the page does not offer |
| Q5 | Where does the one classification live? | `failureKindOf` in the shared data layer, returning a key and no words; collector surfaces read it through `useFailureWords`, and the admin consoles fold the same kind into their own English. Carried from the dropped change's Q2 - decided by the round | A second classifier in the console, which could disagree with the collector's |
| Q6 | Must a surface show the kind's words where it already names what failed? | No: a surface's own catalog line for what failed stays; the kind's words stand in wherever it had none or showed the backend's text. Carried from the dropped change's Q3 - decided by the round | Replacing specific lines with generic ones |
| Q7 | What does an `ApiError` carry on `message`? | The technical account, the call and what came back, so a log line reads it; no view reads it. Carried from the dropped change's Q4 - decided by the round | English copy on `message`, the leak the code closed |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
