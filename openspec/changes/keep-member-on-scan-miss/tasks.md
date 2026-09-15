## 1. One owner for the session (grade10) (owner: @ecchochan)

- [x] 1.1 The gateway client sends a lookup with no session and takes nothing from it; the till installs a found member's token and remembers that member, or forgets the last one when the member has no customer
- [x] 1.2 A call made for one member keeps speaking for them, presenting their session as rotated meanwhile, and its rotation or refusal is ignored by the client and the till once another member holds the till

## 2. The member stays (grade10) (owner: @ecchochan)

- [x] 2.1 Over a member, a lookup shows no working screen, and a miss, a used or expired code, paused or throttled entry, or no answer is a sentence on the panel
- [x] 2.2 The till orders lookups and marks the session apart: a resume, a reload, an attach, a miss's sentence and a hand-over's follow-through yield when the session moved while they waited

## 3. Prove it (grade10) (owner: @ecchochan)

- [x] 3.1 Till tests: each miss kept over a member, no answer kept, an expired session kept, membership switched off during a lookup still taking the till down, a hit on another member switching once without ending the new session, a reload never discarding a hit, a hand-over during a lookup, a stale act refusal after a switch, a miss during a resume or a found member's attach, and a modal closed during a hand-over
- [x] 3.2 Gateway client tests: a miss keeps the held token, a call already on its way speaks and fails for its own member, a call held at the host presents the token as rotated meanwhile
- [x] 3.3 The modal keeps the typed points through a miss; the demo lane identifies a member, looks up a stranger, and a spend still lands for the member; the replay demo page reads a refused rescan with the member kept, driven in the demo lane
- [ ] 3.4 The staging tablet: a scan that finds nobody over a member with points typed
