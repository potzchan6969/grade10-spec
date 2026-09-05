# UI: Multi-store appointments

## Screens

### Booking flow (`/book`)

**No Figma frame exists for the booking flow.** It is an app-owned assembly
of the `shared/ui/appointment-booking` blocks: a step rail across the top, the
step's body, and the running summary beside it on wide screens and above it
on narrow ones. The [booking capability](specs/grade10-site/appointment/booking/spec.md)
owns its behavior; [tech-design.md](tech-design.md) owns its data layer.

### Manage a booking (`/book/manage`)

**No Figma frame exists.** One `BookingManageCard`, and the same slot picker
as the flow when the collector chooses to move the visit.

### My bookings (`/book/mine`)

**No Figma frame exists.** One `BookingList` under the site's page shell,
or the sign-in invitation the site already renders for a session-shaped
surface.

### Admin: Appointments section

**No Figma frame exists for any admin surface.** The Appointments section
of the grade10 admin console is an app-owned assembly of design-system
primitives and the console blocks `shared/console/blocks` names, in six
panels: Shops (each with its resources, hours and special dates), Services
(each with its questions and its resource assignments), Blocks, Day (one
shop's lanes), Bookings (the list), and the booking dialog reached from Day
and Bookings. The [diary capability](specs/grade10-admin/appointment/diary/spec.md)
owns its behavior.

## Components

### `@grade10/ui` — new, work in this repository

Every export below is new and lands in `packages/ui/src/blocks/appointment-booking/`
with a story per visible state; `packages/ui/src/index.ts` re-exports them
under a `shared/ui/appointment-booking` comment:

- `BookingSteps` — the step rail, composing `Stepper` and `Step`
- `BookingServicePicker`, `BookingLocationPicker` — selectable `Card` lists
  reporting an id
- `BookingSlotPicker` — a month grid of `Button`s per day and a `Button` per
  time, with `IconButton`s to step months; times formatted through
  `formatLocalTime` from `@grade10/ui/lib/format-datetime` in the zone given
- `BookingDetailsForm` — `TextInput` for name, email, phone and each `text`
  question, `RadioList` and `RadioListItem` for a `choice` question, a
  `TextInput` for notes, `Button` to submit, `Text` in the error tone
- `BookingSummary` — a `Card` of `Text` rows
- `BookingConfirmation` — a `Card` with `Text`, a `Link` to the manage page,
  and a `Link` to the calendar file
- `BookingManageCard` — a `Card`, a `Badge` for the state, `Button`s for
  move and cancel, and a `Dialog` with `DialogHeader` for the confirmation
- `BookingList` — a `List` of `Card`s split by an `EmptyState` when empty
- `AsyncState` from `@grade10/ui`'s shared types drives loading (`Skeleton`),
  empty (`EmptyState`) and error (`Alert`) in every picker and the list

### `@grade10/design-system` — existing, no new variant or token

`Alert`, `Badge`, `Button`, `Card`, `Dialog`, `DialogHeader`, `EmptyState`,
`IconButton`, `Link`, `List`, `RadioList`, `RadioListItem`, `Select`,
`Skeleton`, `Step`, `Stepper`, `Tabs`, `Text`, `TextInput`, `HStack`,
`VStack`, `Stack`, `Table` and its rows for the admin lists.

Multiline notes and a comment field are single-line `TextInput`s, as the
profile form already does, because the design system publishes no textarea.

### Admin console

The Appointments section composes the console blocks the application
repository publishes — data table, async status, form dialog, section header,
status badge, figure list — and the design-system primitives above. The Day
panel's lanes are an app-owned layout of `VStack`s and `Card`s on a time
axis; nothing in it needs a new primitive.

## States

### Booking flow

- **Loading, empty and error in each picker** — `Error is not empty` and the
  `AsyncState` contract; a failed slot read never renders as a day with
  nothing free
- **Unavailable days and horizon** — `A day with nothing free cannot be
  picked` and `Days beyond the horizon cannot be picked`
- **Times in the shop's zone** — `Only what the diary offers is shown`
- **Questions** — `The service's questions are asked in order`
- **Missing details** — `Missing details are refused before anything is sent`
- **Time taken meanwhile** — `A time taken meanwhile is refused and the times
  refresh`: the form's error names it, the flow returns to the time step with
  the details kept
- **Already booked** — `A second live visit for the same service is told so`
- **Confirmation** — `Collector books a grading visit`

### Manage a booking

- **Live** — `The link opens the booking`
- **Moving** — `The collector moves the visit from the link`, reusing the
  slot picker states above
- **Cancel confirmation** — `The collector cancels from the link` and `A
  cancel is confirmed first`
- **Closed** — `A closed booking's link offers nothing`
- **Not found** — `A link naming nothing answers not found`, rendered as the
  site's not-found surface

### My bookings

- **Upcoming then past** — `The list holds the visits under the collector's
  address` and `Upcoming come first`
- **Empty** — the list's empty copy
- **Signed out** — `Signed out, the list invites sign-in`

### Admin: Appointments section

- **Read-only grant** — `The read grant sees and cannot write`: every write
  control is absent, not disabled
- **Day lanes** — `The day lays out lanes`, `A product booking is read-only`,
  `The operator steps between days`
- **Refusals by name** — `A full time is refused by name`; every diary
  refusal renders its own message in the form dialog
- **Closed bookings** — `A closed booking offers no action`
- **Loading, empty and error** — the console's existing async status block;
  no capability-specific state is defined
