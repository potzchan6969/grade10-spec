## User journeys

### navigation-US-01: Collector reaches the surface an address names

**As a** collector,
**I want** every address to resolve to one surface — the deepest one naming
it, or the not-found surface,
**so that** a link I open lands me on the surface that owns it, and tells me
which address failed when none does.

**Accepted by:**

- `navigation-SC-01` — A nested address answers as its surface
- `navigation-SC-02` — A nested surface renders for itself
- `navigation-SC-03` — An unknown address resolves to not-found

### navigation-US-02: Collector moves between surfaces without a page load

**As a** collector,
**I want** an in-app link, the chrome's included, to navigate in place while
my own click modifiers and other origins stay the browser's,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

**Accepted by:**

- `navigation-SC-04` — A chrome link navigates in place
- `navigation-SC-05` — A modified click is the browser's
- `navigation-SC-06` — Another origin is the browser's

### navigation-US-03: Collector asks for a session-decided address

**As a** collector,
**I want** the profile and sign-in addresses to answer with what my session
allows, replacing the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

**Accepted by:**

- `navigation-SC-07` — A signed-out collector asks for the profile
- `navigation-SC-08` — Back never returns to a corrected address
- `navigation-SC-09` — A signed-in collector asks for sign-in
- `navigation-SC-10` — A public surface does not wait

### navigation-US-04: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

**Accepted by:**

- `navigation-SC-11` — Back returns to where they were
- `navigation-SC-12` — A new surface starts at the top

### navigation-US-05: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I navigate to
it,
**so that** opening one surface does not make me pay for the ones I did not
open.

**Accepted by:**

- `navigation-SC-13` — The first visit pays for one surface
- `navigation-SC-14` — The destination loads on arrival
