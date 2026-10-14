## Goals

- A signed-in collector who opens the site sees the account icon without Sign In first
- A signed-out visitor sees Sign In as soon as the session answers that there is none
- A visitor is still offered Sign In when the session cannot be read

## Non-Goals

- The ZZZ site's header, whose account entry does not depend on the session
- The admin consoles' headers
- The cart count, which already stays hidden until it is known
- Showing the account icon before the session answers, from a session remembered on an earlier visit
- Holding any other chrome control, or the page, for the session

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Whose is the state before the session answers: the shared header block's, or the site's? | The shared `SiteHeader` block's, as a pending session the site passes in (recommended) | A placeholder drawn by the site's own shell: the store owns the block's look, and a state the block lacks is the designer's to add |
| Q2 | What size is the placeholder? | The account icon's footprint, a 40px circle, in the wide and the compact header alike (recommended) | A pill the size of Sign In: a first-time visitor would see no change, but a returning collector, the case this change is for, would see it shrink to the icon |
| Q3 | Does a later re-read of the session bring the placeholder back? | No: it shows only until the session first answers, and a later re-read keeps the entry already shown (recommended) | Showing it on every re-read that has no session yet: a signed-out visitor would see Sign In turn into the placeholder each time they come back to the tab |
| Q4 | What does a session read that fails, or never answers, show? | A failed read shows Sign In, as it does now; the site sets no timer of its own (recommended) | Sign In after a fixed timeout as well: a timer and a number to choose, and a slow but healthy read could show Sign In and then the account icon |
| Q5 | Is the placeholder read aloud to assistive technology? | No: it is silent, and the account entry appears when the session answers (recommended) | Announcing it with a translated label: one more message in every language, heard on every page load |
| Q6 | What does a page written before anybody's session is read show? | The placeholder, as a first paint in the browser does - decided by the round | Sign In, as a written page shows now: a signed-in collector would still see Sign In first |
| Q7 | The language and search controls sit beside the account entry on the wide header and move when it changes width. How does the rule that nothing else moves treat them? | The rule says no other chrome control appears or disappears; only the account entry's own change in width may move the controls to its left (recommended) | Reserving Sign In's width for the account entry so nothing beside it moves: the signed-in header would show the icon in a wider space, a new look for the designer to draw |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
