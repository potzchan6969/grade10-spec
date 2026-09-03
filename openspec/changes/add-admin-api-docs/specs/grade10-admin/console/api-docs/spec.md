## Purpose

The procedure record every Grade10 backend already carries — each call's
path, kind, caller, grant, input shape and output shape — read from the
routers themselves and rendered in the operator console for the engineers
and reviewers who build against it, so what the page says can never differ
from what the server enforces. It is a development surface: carried by
non-production builds, composed from the console's own vocabulary
(`shared/console/visual-standard`) and blocks (`shared/console/blocks`).

## Feature set

- Derived, never written
  - One source: the document is read from the procedures a router mounts, never authored by hand
  - Drift refused: a build whose committed document disagrees with its router fails a repository check
  - Per service: one document for each backend the Grade10 console reaches, the till's own ladder included
- The docs surface
  - Where it sits: an entry under the Dev heading that production builds do not carry
  - Services and routers: a rail naming each service, the routers under it, and how many procedures each holds
  - Procedure list: a router's procedures with kind, caller, and a summary of input and output
  - Procedure detail: one procedure's wire path, caller, and field tables for input and output
  - Filter: narrow every service at once by procedure path or by grant
- Honesty of the record
  - Caller in four words: public, session, session · fresh, elevated with its grant
  - Undeclared output: a procedure with no output shape says so, and the service counts how many do
  - Forwarded work: a procedure whose worker only fronts the call names the service that does the work
  - Provenance: the page names the commit its document was read from

## ADDED Requirements

### Requirement: The document is read from the routers

A service's API document SHALL be produced from the procedures its router
mounts and from nothing else. For each procedure it SHALL carry the dotted
path, the kind (query or mutation), the caller, every grant the procedure
requires, the input shape where one is declared, and the output shape where
one is declared. A procedure the router mounts SHALL appear; a procedure it
does not mount SHALL NOT. No part of the document is authored by hand.

Producing the document SHALL be deterministic: the same routers give
byte-identical output, so a difference between two documents is always a
difference between two routers.

#### Scenario: api-docs-SC-01 - Every mounted procedure appears, and nothing else

- **GIVEN** a service whose router mounts a known set of procedures
- **WHEN** its document is produced
- **THEN** the document lists exactly that set, by dotted path
- **AND** each entry carries its kind and its caller

#### Scenario: api-docs-SC-02 - A changed router fails the check until regenerated

- **GIVEN** a committed document for a service
- **WHEN** a procedure's input shape, output shape, kind, or grant changes in the router and the document is not regenerated
- **THEN** the repository's check fails, naming the service and the procedure
- **AND** regenerating the document makes the check pass

#### Scenario: api-docs-SC-13 - Reading the same routers twice gives one document

- **WHEN** a service's document is produced twice from unchanged routers
- **THEN** the two documents are identical byte for byte

### Requirement: One document per backend the console reaches

The surface SHALL carry one document for each backend service the Grade10
console reaches. A service that mounts more than one procedure ladder SHALL
have every ladder in its document, named apart.

| Service | Ladders |
| --- | --- |
| Store | The session ladder; the till's own ladder |
| Auction | The elevated ladder |
| Auth | The elevated ladder |
| Loyalty | The session and elevated ladders |
| Vault | The elevated ladder |
| Appointment | The elevated ladder |
| Finance | The elevated ladder |
| Inventory | The elevated ladder |

#### Scenario: api-docs-SC-03 - The rail names every service with its count

- **WHEN** an engineer opens the surface
- **THEN** the rail names each service in the table above
- **AND** each service shows how many procedures its document holds, and each router under it shows its own

### Requirement: The surface is a development surface

The API docs surface SHALL be an entry under the console's Dev heading, at
its own address. A production build SHALL carry neither the address nor the
page behind it. In a build that carries it, the surface SHALL need no grant
beyond what opens the console.

#### Scenario: api-docs-SC-04 - A production build carries no API docs address

- **GIVEN** the Grade10 console built for production
- **WHEN** an operator opens the API docs address
- **THEN** the console answers with its not-found surface
- **AND** the Dev heading offers no API docs entry

#### Scenario: api-docs-SC-05 - A non-production build lists the surface under Dev

- **GIVEN** the Grade10 console built for staging or local development
- **WHEN** an operator who can open the console signs in
- **THEN** the Dev heading offers API docs
- **AND** opening it shows the surface whatever the operator's roles

### Requirement: Reading a procedure

An engineer reads the surface in this order:

1. Pick a service in the rail; its routers unfold beneath it with their counts.
2. Pick a router; its procedures list with kind, caller, and a one-line summary of input fields and of output.
3. Pick a procedure; its detail shows the dotted path, the wire path the call lands on, the caller with any grant, and a field table each for input and output.
4. Type in the filter to narrow every service at once by dotted path or by grant; the rail counts and the list follow the filter.

A field table SHALL show, per field: the name, whether it is required, its
type, and its constraints — bounds, length, pattern, allowed values, and
whether it accepts null. A nested object SHALL show its own fields beneath
it. A shape that is one of several alternatives SHALL show each alternative,
named by the value that tells them apart where there is one.

#### Scenario: api-docs-SC-06 - A router's procedures are listed with kind and caller

- **GIVEN** a service picked in the rail
- **WHEN** the engineer picks one of its routers
- **THEN** every procedure of that router is listed
- **AND** each row shows its kind, its caller, a summary of its input fields, and a summary of its output

#### Scenario: api-docs-SC-07 - A procedure's detail shows its wire path and fields

- **WHEN** the engineer picks a procedure that declares an input of three fields, one of them bounded
- **THEN** the detail shows the dotted path and the wire path the call lands on
- **AND** the input table lists the three fields with required, type, and the bound
- **AND** the output table lists the declared output's fields, each alternative apart where there are several

#### Scenario: api-docs-SC-08 - A filter narrows every service by path or grant

- **WHEN** the engineer types a grant into the filter
- **THEN** every service's list narrows to the procedures requiring that grant
- **AND** the rail's counts follow the narrowed lists
- **AND** typing part of a dotted path narrows the same way

### Requirement: The caller is said in four words

Each procedure SHALL name its caller with exactly one of the words below.
An elevated caller SHALL always carry its grant beside the word.

| Caller | Meaning |
| --- | --- |
| public | Any caller, signed in or not |
| session | A signed-in session |
| session · fresh | A signed-in session that has recently proven itself; a stale one is asked to step up |
| elevated | An operator session holding the named grant, with a second factor where the grant demands one |

A call made by a service principal rather than a person SHALL be named as
such, with the principal's kind, in place of the four words.

#### Scenario: api-docs-SC-09 - An elevated procedure names its grant

- **WHEN** the engineer reads a procedure that requires an operator grant
- **THEN** its caller reads elevated
- **AND** the grant it requires is shown beside it, in the grant's own spelling

#### Scenario: api-docs-SC-10 - A fresh-session call is told apart from a session call

- **GIVEN** two procedures on one router, one accepting any signed-in session and one requiring a recently proven session
- **WHEN** both are listed
- **THEN** the first reads session and the second reads session · fresh

### Requirement: An undeclared output is said, not invented

A procedure that declares no output shape SHALL show that plainly in its
detail and in its list row. Each service SHALL show how many of its
procedures declare no output. The document SHALL NOT infer an output shape
from anything other than the declaration.

#### Scenario: api-docs-SC-11 - An undeclared output is said, not invented

- **WHEN** the engineer picks a procedure that declares no output shape
- **THEN** its output panel says the output is not declared
- **AND** the service's heading shows how many of its procedures are in that state

### Requirement: A forwarded procedure names the service that does its work

A procedure whose worker only fronts the call — resolving the caller and
handing the work to another service over a binding, as the store's
`auction.*` hands bidding to the auction worker — SHALL name that service, as
the router declares it. A router whose every procedure forwards to one
service SHALL say so once above its list; a procedure's detail SHALL say it
beside the caller. A procedure whose worker does its own work SHALL carry no
such note.

#### Scenario: api-docs-SC-14 - A forwarded procedure names the service that does its work

- **GIVEN** the store's `auction` router, every procedure of which forwards to the auction service
- **WHEN** the engineer picks that router
- **THEN** the list says its calls are handed to the auction worker over a service binding
- **AND** picking one of its procedures shows the auction named beside the caller
- **AND** a procedure of the checkout router shows no such note

### Requirement: The page names what it was read from

The surface SHALL name the commit its documents were read from, so a reader
can tell whether the page describes the backend in front of them.

#### Scenario: api-docs-SC-12 - The page names the commit it was read from

- **WHEN** an engineer opens the surface
- **THEN** the page names the commit the documents were produced from
