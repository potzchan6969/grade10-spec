## Feature set

- Failure notices
  - Closed set of kinds: names what a failed call can have ended in, so no surface invents a sixth
  - Classified once: the platform decides the kind, and every surface of either audience reuses that judgement
  - Words from the catalogs: a collector reads the vocabulary's value for the kind, in the page's language
  - Nothing from the backend: what a server sent stays in the technical account, for logs
  - Operator's own English: an admin console answers the same kinds itself, outside the catalogs

## ADDED Requirements

### Requirement: The platform decides what kind a failure is, once

A failed call gets one kind from a closed set, and every surface reads that
kind.

**Closed set of kinds** - A call to a backend that fails SHALL be classified
as exactly one kind, from a closed set:

| Kind | Assigned when |
| --- | --- |
| No connection | the request never reached a backend |
| Backend fault | the backend answered with a server-fault status, `500` and above |
| Request refused | the backend answered refusing the request, `400` through `499` |
| Unreadable answer | the backend answered in a shape the running build cannot read |
| Unclassified | the failure fits none of the above |

**Classified once** - The classification SHALL be made in one place and reused
by every surface that shows a failure, on a collector-facing site and in an
admin console alike. No surface SHALL decide the kind for itself, and a
failure SHALL never be shown without one.

**Operator's own English** - An admin console SHALL supply its own English
words for each kind, and is outside the message catalogs as every other admin
string is.

#### Scenario: shared-localization-SC-33 - Two products meet the same failure
**Serves:** Failure notices - two products meet the same failure

- **GIVEN** the same backend fault reached from the store and from the auction
- **WHEN** each surface shows its notice
- **THEN** both classify it as the same kind
- **AND** both notices say the same thing in the page's language

#### Scenario: shared-localization-SC-34 - An operator sees a failure
**Serves:** Failure notices - an operator sees a failure

- **WHEN** an admin console shows a failed call
- **THEN** its notice is that console's own English for the kind the platform assigned
- **AND** no word of it comes from the message catalogs

### Requirement: A collector reads a failure in the page's language

A collector reads the catalog's words for the kind, never the backend's.

**Words from the catalogs** - A collector-facing surface SHALL render, as a
failure's notice, the message vocabulary's value for that failure's kind in
the active locale.

**Every kind a key** - Every kind SHALL be a key of the shared vocabulary,
answered in every locale of both brands on the same terms as every other key.

**Nothing from the backend** - A surface SHALL NOT render text a backend sent,
nor any words it holds itself, as a failure notice.

**Technical account** - The failing call and whatever the backend said SHALL
be kept as the technical account, reaching logs and never a screen.

#### Scenario: shared-localization-SC-35 - A Korean page loses its connection
**Serves:** Failure notices - a Korean page loses its connection

- **GIVEN** a collector on the ZZZ site whose request never reaches a backend
- **WHEN** the notice renders
- **THEN** its words are Korean

#### Scenario: shared-localization-SC-36 - The backend's own words stay off screen
**Serves:** Failure notices - the backend's own words stay off screen

- **GIVEN** a refused request whose answer carries the backend's text and the name of the call
- **WHEN** a collector-facing surface shows the notice
- **THEN** it reads the vocabulary's value for a refused request, in the active locale
- **AND** neither the backend's text nor the call's name appears on screen

#### Scenario: shared-localization-SC-37 - An outage and a refusal read differently
**Serves:** Failure notices - an outage and a refusal read differently

- **GIVEN** a Traditional Chinese page that meets a backend fault, and one that meets a refused request
- **WHEN** each notice renders
- **THEN** the two say different things
- **AND** both are Traditional Chinese
