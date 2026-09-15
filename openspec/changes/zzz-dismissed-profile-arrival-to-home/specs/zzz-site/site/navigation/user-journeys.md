## User journeys

### zzz-site-site-navigation-US-02: Collector asks for a session-decided address

**As a** collector,
**I want** home and sign-in to answer with what my session allows, replacing
the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

**Accepted by:**

- `zzz-site-site-navigation-SC-17` — A signed-in collector lands on home
- `zzz-site-site-navigation-SC-18` — A signed-in collector asks for sign-in
- `zzz-site-site-navigation-SC-19` — Back never returns to a corrected address
- `zzz-site-site-navigation-SC-20` — Not-found does not wait

### zzz-site-site-navigation-US-06: Collector opens the profile with no session

**As a** collector without a session,
**I want** the profile's own address to stay put while I sign in, and to be
sent home if I leave without one,
**so that** what I came for is what renders the moment I have a session, and
leaving puts me somewhere I can read instead of on a blank page.

**Accepted by:**

- `zzz-site-site-navigation-SC-21` — A signed-out collector opens the profile address
- `zzz-site-site-navigation-SC-22` — The session arrives and the profile renders
- `zzz-site-site-navigation-SC-23` — Leaving the ask at the profile's address goes home
