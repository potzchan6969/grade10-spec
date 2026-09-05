# Tasks: Multi-store appointments

Groups 1 to 3 land in `grade10-spec`; the submodule bump in group 13 is the
boundary. Group 4 is the shared interface every later `grade10` group
depends on. Groups 6 to 9 need group 5's migration. Groups 10 to 12 depend on
group 4 alone and run against fixtures, never a live worker.

## 1. Booking blocks in the shared UI package (grade10-spec)

- [ ] 1.1 Make `An application imports the booking surface` pass: add `packages/ui/src/blocks/appointment-booking/` with the nine components and the shared types the export contract names, re-exported from `packages/ui/src/index.ts`.
- [ ] 1.2 Make `The consumer's words are the only words`, `A service pick is reported by id` and `A shop pick is reported by id` pass with stories that assert the reported ids and the absence of built-in wording.
- [ ] 1.3 Make `An unavailable day cannot be picked`, `A picked day lists its times and reports the picked one` and `Months step within their bounds` pass in `BookingSlotPicker`, formatting times in the given zone.
- [ ] 1.4 Make `Missing details are named and nothing is reported`, `Values are reported trimmed and keyed` and `Pending disables submission and the error is shown` pass in `BookingDetailsForm`.
- [ ] 1.5 Make `A cancel is confirmed first`, `A closed record offers nothing`, `Upcoming come first` and `Error is not empty` pass in `BookingManageCard`, `BookingList` and the async regions.
- [ ] 1.6 Verification: run `pnpm run typecheck`, `pnpm run lint` and `pnpm --filter @grade10/ui run test:stories`.

## 2. Appointment catalogs (grade10-spec)

- [ ] 2.1 Add the `appointment` namespace under `messages/shared/` for every language, holding every word the booking flow, the manage page, the own list and the reminder mail say, wired in `src/catalogs.ts`.
- [ ] 2.2 Add `head.book`, `head.bookManage` and `head.bookMine` to every brand's `head.json`, so `The booking surface is served and listed` has a title and description per locale.
- [ ] 2.3 Verification: run `pnpm --filter @grade10/i18n run test` and `pnpm run typecheck`.

## 3. Manual pages (grade10-spec)

- [ ] 3.1 Rewrite `docs/prds/products/grade10-site/appointment/index.md` to the diary's new shape and add `booking.md` naming `grade10-site/appointment/booking`.
- [ ] 3.2 Add `docs/prds/products/grade10-admin/appointment/index.md` and `diary.md`, `docs/prds/products/shared/appointment/index.md` and `scheduling.md`, and `docs/prds/products/shared/ui/appointment-booking.md`, and list the two new domains in `docs/prds/manual.yaml`.
- [ ] 3.3 Verification: run `pnpm check:manual` and `pnpm run tcs:validate`.

## 4. Appointment contracts (grade10)

- [ ] 4.1 Extend `@grade10/appointment-contracts` with the service, resource, block, question, attendee and event codecs, the booking sources, the reshaped booking, the slot with its capacity, and every refusal code the scheduling requirements table names.
- [ ] 4.2 Reshape the binding surface so `A product sees only its own services and bookings` and `A product cannot book a service not bound to it` are expressible: `listServices`, and `serviceId` on `listSlots`, `book` and `reschedule`, with an optional attendee on `book`.
- [ ] 4.3 Extend `ADMIN_PERMISSIONS` with the services, resources, blocks, bookings and operator-booking procedures under `appointment:read` and `appointment:manage`, and add the calendar-file builder every mail attaches.
- [ ] 4.4 Verification: run `pnpm run typecheck`, `pnpm run lint` and the contracts test lane.

## 5. Diary persistence (grade10)

- [ ] 5.1 Add the `services`, `service_resources`, `resources`, `blocks`, `booking_events` and `booking_locks` tables and the new booking columns, seed the vault visit service and backfill every existing booking to it, per the tech design's schema.
- [ ] 5.2 Add the occupation exclusion so `Two requests for the last resource resolve to one booking` cannot be broken by any write path, and retire `slot_claims` and the rule capacity behind a `-- contract:` line.
- [ ] 5.3 Verification: run `pnpm run db:drizzle:generate --only=grade10-appointment`, regenerate the embedded migrations, then `pnpm run check:migrations`, `pnpm run typecheck` and `pnpm run test:backend`.

## 6. Availability engine and booking service (grade10)

- [ ] 6.1 Make `A weekly rule opens that weekday`, `A closed date offers nothing`, `A special date replaces the rules for that date`, `A resource with its own hours is open only inside both`, `A shop block closes every resource` and `A resource block closes that resource alone` pass in the window derivation.
- [ ] 6.2 Make `Starts fall on the increment inside the window`, `Capacity is the count of free assigned resources`, `A slot nobody can take is not listed`, `Nothing sooner than the notice`, `Nothing beyond the horizon`, `A buffer after holds the resource` and `The first visit of the day may start at opening` pass in the slot derivation.
- [ ] 6.3 Make `A wall clock is read in the shop's zone`, `The spring-forward gap drops its starts` and `The fall-back hour is offered once` pass through the contracts' zone fold.
- [ ] 6.4 Make `Two requests for the last resource resolve to one booking`, `The free resource with the lowest sort order is assigned`, `A named resource is that one or nothing`, `A start in the past is refused before anything is written`, `A required question left unanswered refuses the booking` and `A choice outside the options refuses the booking` pass in the booking processor under the shop lock.
- [ ] 6.5 Make `A repeated request replays`, `A second live booking of one service is refused`, `A closed booking no longer blocks a new one`, `Cancelling frees the resource`, `A closed booking refuses a move`, `Repeating an outcome answers the same booking` and `Every transition leaves an event` pass.
- [ ] 6.6 Make `A booking moves within its shop`, `A booking moves to another shop` and `A full target leaves the booking where it was` pass in the reschedule processor with both shop locks in one order.
- [ ] 6.7 Make `An erased person's booking keeps its occupancy` pass for product and direct bookings alike, and register the direct lane with the erasure consumer check.
- [ ] 6.8 Verification: run `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend`.

## 7. Public and product surfaces of the worker (grade10)

- [ ] 7.1 Make `A product sees only its own services and bookings`, `A product cannot book a service not bound to it` and `A case holds one live booking at a time` pass over the vault entrypoint.
- [ ] 7.2 Add the public tier and its procedures so `Collector books a grading visit`, `Only customer-bookable services are listed`, `A time taken meanwhile is refused and the times refresh` and `A second live visit for the same service is told so` can pass: services, shops offering one, slots, book with a guest attendee and a manage secret, and the signed-in own list.
- [ ] 7.3 Make `The link opens the booking`, `The collector moves the visit from the link`, `The collector cancels from the link`, `A link naming nothing answers not found` and `The secret never leaves the browser` pass: secret-keyed read, reschedule and cancel that take the secret in the request body only.
- [ ] 7.4 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` and `pnpm run build`.

## 8. Operator surfaces of the worker (grade10)

- [ ] 8.1 Make `A service is created with its shape`, `A service outside its bounds is refused`, `A product-bound service is never customer bookable`, `A retired service is offered nowhere and its bookings remain` and `Resources are assigned per shop` pass through elevated service procedures.
- [ ] 8.2 Make `A retired shop offers nothing and keeps its bookings`, `A retired resource keeps its bookings and takes no more`, `A second special date on one date is refused` and `A block over a booking leaves the booking in place` pass through elevated shop, resource, rule, special-date and block procedures.
- [ ] 8.3 Make `A walk-in is booked at the counter`, `The operator names the desk`, `A direct booking is moved`, `A direct booking is cancelled after confirmation`, `An operator booking names the operator`, `A visit is marked completed`, `A visit is marked a no-show` and `A product booking is read-only` pass through elevated booking procedures.
- [ ] 8.4 Make `The list narrows and searches` and `The day lays out lanes` pass through the bookings list and the day read, and pin every procedure's grant to `ADMIN_PERMISSIONS` so `The read grant sees and cannot write` and `Every write lands an audit entry` hold at the router.
- [ ] 8.5 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` and `pnpm run build`.

## 9. Mail and reminders (grade10)

- [ ] 9.1 Make `A confirmation carries a calendar file` and `A booking without an address is told nothing` pass through an email port that renders the confirmation, update and cancellation mails with the calendar file and the manage link, behind an optional sending secret.
- [ ] 9.2 Make `One reminder goes out at the lead`, `A booking inside its lead gets no reminder` and `A cancelled booking gets no reminder` pass through the hourly sweep's reminder pass, stamped once per booking.
- [ ] 9.3 Verification: run `pnpm run typecheck`, `pnpm run lint` and `pnpm run test:backend`.

## 10. Vault adaptation (grade10)

- [ ] 10.1 Carry the vault visit service through the vault's booking input, its service binding calls, its repair sweep, its fakes and both its consoles, so every vault booking names the service.
- [ ] 10.2 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend` and the vault test lanes.

## 11. Customer booking frontend and site routes (grade10)

This group depends on group 4 alone and runs against the fixture transport.

- [ ] 11.1 Add `@grade10/appointment-frontend` with its port, procedure transports, fixture transport, slices, hooks and views composing the `@grade10/ui` blocks, with module and hook tests over the real graph.
- [ ] 11.2 Make `Collector books a grading visit`, `Missing details are refused before anything is sent`, `A time taken meanwhile is refused and the times refresh`, `The service's questions are asked in order`, `Only what the diary offers is shown`, `A day with nothing free cannot be picked`, `Days beyond the horizon cannot be picked`, `Only customer-bookable services are listed`, `A service address opens the flow at that service` and `A second live visit for the same service is told so` pass in the booking view.
- [ ] 11.3 Make `The link opens the booking`, `The collector moves the visit from the link`, `The collector cancels from the link`, `A closed booking's link offers nothing`, `A link naming nothing answers not found` and `The secret never leaves the browser` pass in the manage view, reading the secret from the fragment.
- [ ] 11.4 Make `The list holds the visits under the collector's address` and `Signed out, the list invites sign-in` pass in the own-list view.
- [ ] 11.5 Make `The booking surface is served and listed` and `The private addresses are never indexed` pass: the three routes on the grade10 site with their head entries, the nav link, prerender and hydration coverage, and the sitemap and robots directives.
- [ ] 11.6 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` and `pnpm run build`.

## 12. Admin console diary (grade10)

This group depends on group 4 alone and runs against the fixture transport.

- [ ] 12.1 Extend `@grade10/appointment-admin-frontend` with services, resources, blocks, operator-booking and bookings-list slices, hooks and fixtures.
- [ ] 12.2 Make `A new shop offers its first slot`, `A shop with no assigned resource lists nothing`, `Retiring a shop keeps its day readable`, `A service is created with its shape`, `Resources are assigned per shop`, `A service is retired`, `Questions are added in order`, `A weekly rule is set`, `A date is closed`, `A date runs on other hours` and `A resource keeps its own hours` pass in the Shops and Services panels.
- [ ] 12.3 Make `A resource is blocked with a reason`, `The whole shop is blocked`, `A block is removed`, `The day lays out lanes`, `A product booking is read-only` and `The operator steps between days` pass in the Blocks and Day panels.
- [ ] 12.4 Make `A walk-in is booked at the counter`, `The operator names the desk`, `A direct booking is moved`, `A direct booking is cancelled after confirmation`, `A full time is refused by name`, `A visit is marked completed`, `A visit is marked a no-show`, `A closed booking offers no action` and `The list narrows and searches` pass in the booking dialog and the Bookings panel.
- [ ] 12.5 Make `The read grant sees and cannot write` pass through `hasPermission` on every write control, and wire the section's routes, surfaces and erasure products.
- [ ] 12.6 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` and `pnpm run check:admin-bundle`.

## 13. Submodule bump and verification (grade10)

- [ ] 13.1 Point `external/grade10-spec` at the commit carrying groups 1 to 3, add the handbook cards for the new package surfaces, and run `pnpm run check:submodules` and `pnpm run check:handbook`.
- [ ] 13.2 Verification: run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`, `pnpm run build` and `pnpm run check:migrations`.
