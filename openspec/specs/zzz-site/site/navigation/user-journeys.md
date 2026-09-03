## User journeys

### navigation-US-01: Collector opens a ZZZ address directly

**As a** collector,
**I want** sign-in and the profile to answer at addresses of their own, and an
address under no surface to answer as not-found,
**so that** a link or a refresh puts me back on the surface I was on rather
than at home.

**Accepted by:**

- `navigation-SC-01` — Each view has an address
- `navigation-SC-02` — A refresh keeps the collector's place
- `navigation-SC-03` — An unknown address resolves to not-found

### navigation-US-02: Collector asks for a session-decided address

**As a** collector,
**I want** home, sign-in, and the profile to answer with what my session
allows, replacing the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

**Accepted by:**

- `navigation-SC-04` — A signed-in collector lands on home
- `navigation-SC-05` — A signed-in collector asks for sign-in
- `navigation-SC-06` — A signed-out collector asks for the profile
- `navigation-SC-07` — Back never returns to a corrected address
- `navigation-SC-08` — Not-found does not wait

### navigation-US-03: Collector moves between surfaces without a page load

**As a** collector,
**I want** movement between the site's surfaces to stay in the page, with
history stepping back through it and my own click modifiers left alone,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

**Accepted by:**

- `navigation-SC-09` — Sign-in opens in place
- `navigation-SC-10` — Back steps back into the site
- `navigation-SC-11` — A modified click is the browser's
- `navigation-SC-12` — Another origin is the browser's

### navigation-US-04: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

**Accepted by:**

- `navigation-SC-13` — Back returns to where they were
- `navigation-SC-14` — A new surface starts at the top

### navigation-US-05: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I move to it,
**so that** opening one surface does not make me pay for the ones I did not
open.

**Accepted by:**

- `navigation-SC-15` — The first visit pays for one surface
- `navigation-SC-16` — The destination loads on arrival
