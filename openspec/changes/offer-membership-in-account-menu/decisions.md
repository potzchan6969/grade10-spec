## Goals

- A signed-in collector opens their membership page from the account menu
  wherever the site carries it.
- The account menu's written order is the one the shared header draws.

## Non-Goals

- The ZZZ header - ZZZ carries no membership page and supplies no Membership.
- Submissions in the account menu - the shared header carries a Submissions
  item no contract names; this change neither specifies nor removes it.
- The membership page itself - its sections and states.
- Marking the item for the page being viewed, or a points or tier badge beside
  Membership.
- A new analytics event for account-menu presses.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does Membership sit in the account menu? | Right after Profile and ahead of My Orders, the order the shared header has drawn since 2026-10-27 (recommended) | After My Auctions, the first placement: the designer building the Membership sidebar moved it beside Profile in the shared header, and the record follows the drawn order rather than the header moving back |
| Q2 | When does the menu offer it? | Now, wherever the site carries the membership page, by the build rule Profile follows - decided by the round | Waiting for the loyalty programme's own launch, already rejected on the page: two rules for two gated account pages |
| Q3 | What does the menu open on where the account page is withheld and the membership page is carried? | Membership, the next item in the fixed order - decided by the round | My Orders first whatever is carried, which would make Membership's place depend on Profile's gate |
| Q4 | Is Membership offered when the programme cannot answer? | Yes: it follows whether the build carries the page, not the programme's health, and the page shows its own failure - decided by the round | Hiding it on a failed read, which puts a programme read in the header for a page that already handles its failure |
| Q5 | What does the item read? | "Membership", in each language the brand's chrome catalog already answers - decided by the round | A new label, which adds a key in every language for the same page name |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/site-chrome` | Does the grade10 account menu ever show Submissions? Site-chrome's Feature set says no item beyond Profile, Membership, My Orders, My Auctions and Sign Out joins the menu ("no other item joins, KYC and a second orders item included"), and page-shell's `US3-TC6` reads the grade10 menu as that list "and nothing else"; the change's non-goal says the shared header carries a Submissions item no contract names, and that this change neither specifies nor removes it. Options: **A** - never: the grade10 site supplies no Submissions, and the item leaves `SiteHeader` or is named as handler-gated with no site supplying it; `US3-TC6` keeps "nothing else". **B** - wherever a submissions page is carried, specified by its own change; `US3-TC6` names it as the one exception until then. **C** - left unasserted until a change specifies it; `US3-TC6` drops "nothing else" and lists only what it requires. recommended: A | |
| `grade10-site/site/page-shell` | Where does Membership take a signed-in collector who has never joined the loyalty programme? The input says the item opens the membership page at `/membership`, and that the membership and join pages link to each other on one gate, but not whether `/membership` sends a collector who has not joined anywhere else; the membership page's own states are a non-goal. `US3-TC4` expects `/membership` whoever is signed in. Options: **A** - `/membership` for every collector, the page showing its own state for one who has not joined, with no redirect; the menu's case expects `/membership` alone. **B** - the item opens the join page for a collector who has not joined; `US3-TC4` gains a row for that collector. **C** - the item opens `/membership`, which redirects a collector who has not joined to the join page; `US3-TC4` expects either address by the collector's state. recommended: A | |
