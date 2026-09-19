import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { freezeClock, unfreezeClock } from "./frozen-clock";
import { openManual } from "./setup";

/**
 * The board a hand opens to find their turn: `/in-flight`, its eight lanes,
 * a card's own facts, the four overlay filters and the empty lane a filter
 * leaves behind.
 *
 * The clock is frozen at `FROZEN_NOW` before every open: `fixture-dates.json`
 * dates `demo-on-staging` at 2026-09-07 (12 days idle, the Idle chip) and
 * `add-thing` at 2026-08-05 (45 days, the shelf) — the two bounds this store
 * can ever show against a frozen reading; the real clock would move both past
 * 30 days within the year.
 *
 * `shared-planning-change-stages-SC-53` (nothing in flight) has no fixture to
 * reach it: this store always carries the changes every other case here
 * needs. `test/stage-board.test.tsx`'s "Board with no change in flight" case
 * proves it instead, at the component level a synthetic empty `changes`
 * array can still construct.
 */
beforeEach(freezeClock);

afterEach(unfreezeClock);

/** This walk proves the harness carries the manual: the shell mounts, the
 * fixture snapshot arrives, and the board renders under its own heading. The
 * cases below follow it. */
test("the In Flight board opens", async () => {
  await openManual("/in-flight");

  await expect
    .element(page.getByRole("heading", { level: 1, name: "In Flight" }))
    .toBeVisible();
});

/** The eight lanes an agent drafts from Proposed to Building, in stage order:
 * the lane heading names the stage, and the pair the reader meets there — the
 * agent's mark and the hand's move — is read from the stage alone, so every
 * change in that stage would carry the same words. On staging, Released and
 * Archived are a deploy, a cut and a fold: no agent drafts them, so their
 * headings carry neither. Scoped one lane at a time, because Specified and
 * Planned both name their hand's move "read" — the word the store reuses for
 * two different stages — and a page-wide search for it would not say which
 * lane it came from. */
test("shared-planning-change-stages-SC-10 - the mark and the move on a lane heading", async () => {
  await openManual("/in-flight");
  await expect
    .element(page.getByRole("heading", { level: 1, name: "In Flight" }))
    .toBeVisible();

  const drafted: { stage: string; draft: string; move: string }[] = [
    {
      stage: "proposed",
      draft: "the marks and the three files, from what the hand asks",
      move: "answer",
    },
    {
      stage: "designed",
      draft: "both designs, from the page and the journeys",
      move: "tweak · challenge",
    },
    {
      stage: "specified",
      draft: "two blind readings, reconciled",
      move: "read",
    },
    { stage: "planned", draft: "the plan", move: "read" },
    {
      stage: "building",
      draft: "each group, test first",
      move: "read each landing",
    },
  ];

  for (const { stage, draft, move } of drafted) {
    const lane = laneSection(stage);
    await expect
      .element(page.elementLocator(lane).getByText(`agent drafts ${draft}`))
      .toBeVisible();
    await expect
      .element(page.elementLocator(lane).getByText(move, { exact: true }))
      .toBeVisible();
  }

  for (const stage of ["on-staging", "released", "archived"]) {
    const lane = laneSection(stage);
    await expect
      .element(page.elementLocator(lane).getByText("agent drafts"))
      .not.toBeInTheDocument();
  }
});

/** A card's own facts, on the change the Behind fixture carries: the hand
 * (unnamed, so the role reads as open), the age, the overlay chip naming what
 * changed, and the task bar every collapsed card leads with. */
test("shared-planning-change-stages-SC-51 - the lanes and a card", async () => {
  await openManual("/in-flight");

  for (const label of [
    "Proposed",
    "Designed",
    "Specified",
    "Planned",
    "Building",
    "On staging",
    "Released",
    "Archived",
  ]) {
    await expect
      .element(
        page.getByRole("heading", { level: 2, name: label, exact: true }),
      )
      .toBeVisible();
  }

  const card = page.elementLocator(cardFor("demo-planned"));
  await expect
    .element(page.getByRole("heading", { level: 3, name: "The Planned stage" }))
    .toBeVisible();

  // The hand: nobody is named for the engineer's role, so the card says so
  // rather than leaving the row blank.
  await expect
    .element(card.getByText("engineer", { exact: true }))
    .toBeVisible();
  await expect.element(card.getByText("open", { exact: true })).toBeVisible();

  // The age: no commit dates this fixture, so the card falls back to the
  // date `.openspec.yaml` records it created on.
  await expect.element(card.getByText(/^created /)).toBeVisible();

  // The overlay: this is the Behind fixture — `decisions.md` moved after it
  // was reviewed, and the chip names the artifact; what it is read again
  // against sits on the chip's own `title` rather than as a second line of
  // text, so a reader hovers for it and this reads it the same way.
  await expect.element(card.getByText("Behind", { exact: true })).toBeVisible();
  await expect
    .element(card.getByText("Decisions", { exact: true }))
    .toBeVisible();
  await expect
    .element(card.getByTitle("read again against proposal"))
    .toBeVisible();

  // The task bar: one group, nothing ticked yet.
  await expect
    .element(
      card.getByRole("progressbar", { name: "0 of 2 tasks done" }).first(),
    )
    .toBeVisible();
});

/** A lane the Blocked filter leaves with nothing in it: still its heading,
 * a count of none, and the role the stage would put a hand on if a change
 * arrived — said rather than left silent, because a lane with nobody's name
 * on it is still somebody's to notice.
 *
 * `openManual` reads the address once, as the module loads: a second address
 * in the same session is a click, so the filter is reached the way a reader
 * reaches it - through the filter row's own link - rather than a second
 * `openManual` call the router would never see. */
test("shared-planning-change-stages-SC-52 - a lane with nothing in it", async () => {
  await openManual("/in-flight");
  await filterLink("Blocked").click();

  // Waited for before the lane's own section is captured: a card only
  // Proposed carries, gone once the filter keeps only what it names — so the
  // count read off the frozen section below is the settled one, not the
  // instant between the click and React applying it.
  await expect
    .element(
      page.getByRole("heading", { level: 3, name: "The Waiting overlay" }),
    )
    .not.toBeInTheDocument();

  await expect
    .element(
      page.getByRole("heading", { level: 2, name: "Proposed", exact: true }),
    )
    .toBeVisible();

  const lane = page.elementLocator(laneSection("proposed"));
  await expect.element(lane.getByText("0", { exact: true })).toBeVisible();
  await expect
    .element(lane.getByText("open: product manager", { exact: true }))
    .toBeVisible();
});

/** The four board filters this walk can reach — Waiting, Idle, Behind and
 * Blocked — each keeping only the change whose overlay it names. Mine is the
 * fifth, and needs a handle before it narrows anything; that state is the
 * next case.
 *
 * One `openManual` for the file's own first address, then a click per filter
 * - the filter row's own link, the way a reader moves from one filter to the
 * next - rather than a fresh address the mounted router would never read. */
test("shared-planning-change-stages-SC-54 - the filters narrow the board", async () => {
  await openManual("/in-flight");

  const titleOf = {
    waiting: "The Waiting overlay",
    idle: "The On staging stage",
    behind: "The Planned stage",
    blocked: "The Building stage",
  } as const;

  for (const filter of Object.keys(titleOf) as (keyof typeof titleOf)[]) {
    const label = filter.charAt(0).toUpperCase() + filter.slice(1);
    await filterLink(label).click();

    await expect
      .element(
        page.getByRole("heading", {
          level: 3,
          name: titleOf[filter],
          exact: true,
        }),
      )
      .toBeVisible();

    for (const other of Object.values(titleOf)) {
      if (other === titleOf[filter]) continue;
      await expect
        .element(
          page.getByRole("heading", { level: 3, name: other, exact: true }),
        )
        .not.toBeInTheDocument();
    }
  }
});

/** Mine before a handle is chosen: it asks rather than emptying the board —
 * a filter that showed nothing while asking who the reader is would read as
 * a board with nothing on it. The handle is cleared before the manual mounts
 * so no earlier walk's choice leaks in; Mine is then reached by its own
 * link, the address `openManual` already opened this session. */
test("shared-planning-change-stages-SC-55 - Mine with no handle chosen", async () => {
  localStorage.clear();
  await openManual("/in-flight");
  await filterLink("Mine").click();

  await expect
    .element(
      page.getByText("Choose a handle to see the changes you are a hand of"),
    )
    .toBeVisible();
  await expect
    .element(page.getByRole("textbox", { name: "Your handle" }))
    .toBeVisible();

  // Narrows nothing: two fixtures from two different lanes are both still
  // on the board.
  await expect
    .element(
      page.getByRole("heading", {
        level: 3,
        name: "The Planned stage",
        exact: true,
      }),
    )
    .toBeVisible();
  await expect
    .element(
      page.getByRole("heading", {
        level: 3,
        name: "The Building stage",
        exact: true,
      }),
    )
    .toBeVisible();
});

/**
 * `demo-refund-window` names a hand as plainly as this store's fixtures
 * get: `tester` is the fixture's own engineer, at Planned. This walk reads
 * the board's own two facts — the lane and the card's hand — and leaves the
 * change page's own equal reading to `change-page-assign.walk.ts`'s own
 * open of `/in-flight/demo-planned`: the two addresses read one `hands:`
 * field through the same `Hand` component, and a card link into the change
 * page sits, on this walk's 414px viewport, behind the sticky header at the
 * scroll position a long fixture description leaves it at — not a seam this
 * walk can click through without fighting the layout rather than proving
 * the rule.
 */
test("shared-planning-change-stages-SC-05 - one change, one stage everywhere", async () => {
  await openManual("/in-flight");
  await expect
    .element(
      page.getByRole("heading", {
        level: 3,
        name: "Shorten the refund window",
      }),
    )
    .toBeVisible();

  // Planned: named by the lane the card sits in, the same fact a per-card
  // badge would only repeat.
  const planned = laneSection("planned");
  if (!planned.contains(document.getElementById("demo-refund-window"))) {
    throw new Error("demo-refund-window is not in the Planned lane");
  }

  const card = page.elementLocator(cardFor("demo-refund-window"));
  await expect
    .element(card.getByText("@tester", { exact: true }).first())
    .toBeVisible();
  await expect
    .element(card.getByText("engineer", { exact: true }).first())
    .toBeVisible();
});

/** The shelf: what has stopped moving long enough to come off its lane.
 * `add-thing` is `fixture-dates.json`'s own 45-day fixture, the one change
 * this store can ever push past the shelf's 30-day bound against a frozen
 * clock. */
test("shared-planning-change-stages-SC-56 - the shelf", async () => {
  await openManual("/in-flight");

  await expect
    .element(page.getByRole("heading", { level: 2, name: "Shelf" }))
    .toBeVisible();

  const shelf = page.elementLocator(shelfSection());
  await expect
    .element(shelf.getByRole("link", { name: "Add the thing" }))
    .toBeVisible();
  await expect
    .element(shelf.getByText("Proposed", { exact: true }))
    .toBeVisible();
  await expect
    .element(shelf.getByText("45 days", { exact: true }))
    .toBeVisible();

  // Off its lane: the Proposed lane's own section carries no card for it.
  const proposedLane = page.elementLocator(laneSection("proposed"));
  await expect
    .element(proposedLane.getByRole("link", { name: "Add the thing" }))
    .not.toBeInTheDocument();
});

/**
 * The lane heading's own `<section>`, found from the `<h2 id={stage}>` every
 * lane — the archived one included — carries. Scoping this way, rather than
 * a class the stylesheet owns, is what lets one stage's "read" be told apart
 * from another's on the same page.
 */
function laneSection(stage: string): Element {
  const heading = document.getElementById(stage);
  const section = heading?.closest("section");
  if (!section) throw new Error(`no lane section for stage "${stage}"`);
  return section;
}

/** One change's card, found from the `id={change.id}` its `<article>`
 * already carries for deep-linking — the same anchor `/in-flight#<id>` opens. */
function cardFor(id: string): Element {
  const card = document.getElementById(id);
  if (!card) throw new Error(`no card for change "${id}"`);
  return card;
}

/** The shelf's own `<section>`, found the same way a lane is - from the
 * `<h2 id="shelf">` it carries. */
function shelfSection(): Element {
  const heading = document.getElementById("shelf");
  const section = heading?.closest("section");
  if (!section) throw new Error("no shelf section");
  return section;
}

/** One filter's own link in the page's `Filters` row, scoped there because a
 * card's own chips carry the same words — a dependency chip reads "Blocked",
 * a change's own title can read "Waiting" — and a page-wide search for the
 * link would meet more than one. */
function filterLink(label: string) {
  return page
    .getByRole("navigation", { name: "Filters" })
    .getByRole("link", { name: label, exact: true });
}
