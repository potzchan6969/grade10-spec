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
| Q8 | Which surface does a sign-in link sign in, and which session does "already signed in as someone else" read? | The surface that asked for it, and that surface's own session. Decided by the round. | Signing in both from one link - the same coupling by another route. |
| Q9 | Does revoking every session of an account, or banning it, end both sessions? | Yes, both. Decided by the round. | Ending only the surface the operator is on - a banned account would keep a live console session. |
| Q10 | Does the session list show which surface each session belongs to? | Yes, so the operator can tell a console session from a site session. Decided by the round. | A single undifferentiated list - the operator revoking one cannot tell what they are ending. |
| Q11 | Do open tabs keep up across surfaces? | A tab follows its own surface's session only; a console sign-out does not change a site tab. Decided by the round. | Site tabs reacting to console changes - there is nothing for them to show. |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
