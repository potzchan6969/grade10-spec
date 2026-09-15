## 1. One owner for the session (grade10)

- [ ] 1.1 The gateway client sends a lookup with no session and takes nothing from it; the till installs a found member's token and remembers that member, or forgets the last one when the member has no customer
- [ ] 1.2 Every call's session header is the token it started with, and its rotation or refusal is ignored once another member holds the till

## 2. The member stays (grade10)

- [ ] 2.1 Over a member, a lookup shows no working screen, and a miss, a used or expired code, paused or throttled entry, or no answer is a sentence on the panel
- [ ] 2.2 A hand-over lets go of the session before it ends it, and a reload yields to a lookup

## 3. Prove it (grade10)

- [ ] 3.1 Till tests: each miss kept over a member, no answer kept, an expired session kept, membership switched off during a lookup still taking the till down, a hit on another member switching once without ending the new session, a reload never discarding a hit, a hand-over during a lookup
- [ ] 3.2 Gateway client tests: a miss keeps the held token, a call already on its way keeps its token, a refusal from the old member leaves the new one alone
- [ ] 3.3 The modal keeps the typed points through a miss; the demo lane identifies a member, looks up a stranger, and a spend still lands for the member
- [ ] 3.4 The staging tablet: a scan that finds nobody over a member with points typed
