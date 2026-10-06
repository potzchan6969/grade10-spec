## Goals

- A site sign-in never opens the admin console, and a console sign-in never signs the person in on the site.
- A person can hold a site session and a console session at once, each ending on its own.
- The second factor and recent sign-in rules stay as they are and read the console's own session.
- Both brands behave the same.

## Non-Goals

- Separate accounts or identity stores for operators: one user table, one account per email.
- A second auth worker or a separate session store for the console.
- Changing who may enter the console, the roles, the second-factor policy or its timings.
- Changing brand separation: Grade10 and ZZZ stay apart as before.
- Carrying a live site session over into a console session at release.
- Linking the two sessions, such as requiring the same account on both or offering one-tap console sign-in from the site.
- Changing how the site's own tabs keep up with the site session.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Should one sign-in still cover every site of a brand, or only the customer site? | Drop brand-wide sign-in: each surface signs in on its own. Today each brand runs one customer site, so the effect is site against console; a future second customer site would sign in on its own too. (held) | Narrowing to "every customer site of the brand; the console is its own" - the interview's recommendation, kept the shopper's single sign-in across customer sites; the author held the simpler rule. |
| Q2 | Can a person hold a site session and a console session at once, as the same or different accounts? | Yes, independent: each has its own sign-in, sign-out and expiry, and the accounts may differ. | Same account only - refusing a console sign-in as a different email adds a rule and a failure state for no gain in what an operator can do. |
| Q3 | What happens to operators already signed in to the console at release? | They sign in to the console once more, with their second factor as usual. | Carrying the live session over on first console request - keeps operators signed in but leaves the old shared path trusted for a migration window. |
| Q4 | Does ZZZ's console get the same separation? | Yes, both brands, in this change. | Grade10 only - needs a brand switch in a rule that is the same code for both. |
| Q5 | How are the two sessions told apart: cookie scope on the console host, or cookie name? | Cookie name, on the brand's shared domain. Recorded for `tech-design.md`; the requirement is the outcome only. | Scoping the console's cookie to the console host - the console reaches the auth worker and every backend through the `api` host, so a console-host cookie would never arrive. |
| Q6 | Does a site sign-in count as the recent sign-in an operator action asks for? | No; it is measured on the console's own session. Decided by the round. | Counting either - a stolen site session would then satisfy the console's check, which defeats the separation. |
| Q7 | Does signing out on one surface end the other? | No. Decided by the round. | Ending both - this is the coupling the change removes. |
| Q8 | Which surface does a sign-in link sign in, and which session does "already signed in as someone else" read? | The surface that asked for it, and that surface's own session; the one exception is a site link an elevated console action asks for (Q16). Decided by the round. | Signing in both from one link - the same coupling by another route. |
| Q9 | Does revoking every session of an account, or banning it, end both sessions? | Yes, both. Decided by the round. | Ending only the surface the operator is on - a banned account would keep a live console session. |
| Q10 | Does the session list show which surface each session belongs to? | Yes, so the operator can tell a console session from a site session. Decided by the round. | A single undifferentiated list - the operator revoking one cannot tell what they are ending. |
| Q11 | Do open tabs keep up across surfaces? | A tab follows its own surface's session only; a console sign-out does not change a site tab. Decided by the round. | Site tabs reacting to console changes - there is nothing for them to show. |
| Q12 | Do the sixty-second send cap and "a new link replaces earlier unused links" count per address, or per address and surface? | Per address and surface. A console link requested right after a site link for the same address is allowed, and does not invalidate it. Decided by the round: the human answered it 2026-10-06. | Per address - a site link would then block or kill the console's, which is the coupling the change removes. |
| Q13 | When an address signs in on one surface, does a wait on the other surface stop? | Only a wait on the same surface stops; a wait on the other surface keeps running. Decided by the round: the human answered it 2026-10-06. | Stopping every wait on that address - a console tab would stop waiting for a link that is still valid. |
| Q14 | Where does a failed, expired, banned or different-account console-asked link land, given the console has no toasts? | On the console's own sign-in page, with an inline message in the page. The different-account case offers Switch and Stay there. Decided by the round: the human answered it 2026-10-06. | The brand home with a toast - that is the site, and the console has no toast to show it. |
| Q15 | Which surface does Google sign-in on the console sign in, and which does a product's verified-email sign-in sign in? | Google on the console signs in the console only; a product's verified-email sign-in is the site's, the asking surface as Q8. Decided by the round: the human answered it 2026-10-06. | Google signing in both surfaces - the coupling the change removes. |
| Q16 | Which surface does a sign-in link sign in when a console operator sends it for a customer account? The case is the test-winner flow in `complete-auction-post-sale`: the console emails the ordinary link, set to open the site's order, and offers Email sign-in link on each row. | The site. An elevated console action may ask for a site link: the link names the site as its surface and signs in the site like any site link. Only an elevated console session whose role holds `user:create` may ask; with no console sign-in, a role without the grant or a second factor not yet proved, the request is refused and sends nothing. This is the one exception to Q8. Decided by the round: the human answered the surface and confirmed the grant `user:create` 2026-10-06. The planning run had named it from the existing gate of the test-winner action in `complete-auction-post-sale` (`auction:operate` and `user:create`). | The console - the link would sign the test account in to the console and break the test-winners flow. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/auth/sign-in` | Do the sixty-second send cap and "a new link replaces earlier unused links" apply per address, or per address and surface? A console link requested within a minute of a site link for the same address is the case. `tech-design.md` D5 notes either is one key change. | Q12 |
| `shared/auth/sign-in` | When an address signs in on one surface, does a surface still waiting on its own request for that address stop waiting, or only a wait on the same surface? | Q13 |
| `shared/auth/sign-in` | Where does a failed, expired, banned or different-account console-asked link land, and how does the console say so, given its toasts exist on the site only? The console cases `US12-TC5-1` and `US12-TC7-1` assume a Switch and Stay choice there. | Q14 |
| `shared/auth/sign-in` | Which surface does Google sign-in on the console, and a product's verified-email sign-in, sign in? The spec says the console and the site respectively (`shared-auth-sign-in-SC-94`, `shared-auth-sign-in-SC-95`), but no Q row decides it; Q8 covers the emailed link only. | Q15 |
| `shared/auth/sign-in` | Which surface does a link sign in when a console operator sends it for a customer account, as the test-winner flow in `complete-auction-post-sale` does? Q8 reads "the surface that asked", which is the console. | Q16 |
